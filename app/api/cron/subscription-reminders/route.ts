import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSubscriptionReminder, sendListingExpiryWarning } from "@/lib/email";

// Called daily by Vercel Cron.
// 1. Renew subscriptions due today by deducting from wallet
// 2. Cancel subscriptions where wallet has insufficient balance
// 3. Send reminder emails for subscriptions expiring in 1–3 days
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // ── 1. Process renewals due today ────────────────────────────────────────
  const { data: dueSubs } = await supabase
    .from("subscriptions")
    .select("id, user_id, tier, price_ttd, next_billing_at, listing_id, listings(title)")
    .eq("status", "active")
    .lte("next_billing_at", now.toISOString());

  let renewed = 0;
  let cancelled = 0;

  for (const sub of dueSubs ?? []) {
    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance_ttd")
      .eq("user_id", sub.user_id)
      .single();

    const balance = wallet?.balance_ttd ?? 0;

    if (balance >= sub.price_ttd) {
      // Deduct from wallet
      await supabase
        .from("wallets")
        .update({ balance_ttd: balance - sub.price_ttd, updated_at: now.toISOString() })
        .eq("user_id", sub.user_id);

      // Log deduction
      await supabase.from("wallet_transactions").insert({
        user_id: sub.user_id,
        type: "deduction",
        amount_ttd: sub.price_ttd,
        description: `${sub.tier.charAt(0).toUpperCase() + sub.tier.slice(1)} subscription renewal`,
        reference_id: sub.id,
      });

      // Advance next_billing_at by 1 month
      const nextBilling = new Date(sub.next_billing_at);
      nextBilling.setMonth(nextBilling.getMonth() + 1);
      await supabase
        .from("subscriptions")
        .update({ next_billing_at: nextBilling.toISOString() })
        .eq("id", sub.id);

      renewed++;
    } else {
      // Insufficient balance — cancel subscription and downgrade listing
      await supabase
        .from("subscriptions")
        .update({ status: "cancelled", cancelled_at: now.toISOString() })
        .eq("id", sub.id);

      await supabase
        .from("listings")
        .update({ tier: "free", featured: false })
        .eq("id", sub.listing_id)
        .eq("user_id", sub.user_id);

      cancelled++;
    }
  }

  // ── 2. Send reminder emails for subscriptions expiring in 1–3 days ──────
  const { data: expiringSubs, error } = await supabase
    .from("subscriptions")
    .select("id, user_id, tier, price_ttd, next_billing_at, listings(title)")
    .eq("status", "active")
    .lte("next_billing_at", in3Days.toISOString())
    .gte("next_billing_at", now.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const sub of expiringSubs ?? []) {
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
      const user = userData?.user;
      if (!user?.email) continue;

      const name = (user.user_metadata?.name as string) ?? "there";
      const listingsRaw = sub.listings;
      const listing = Array.isArray(listingsRaw)
        ? (listingsRaw[0] as { title: string } | undefined) ?? null
        : listingsRaw as { title: string } | null;

      await sendSubscriptionReminder({
        toEmail: user.email,
        toName: name,
        tier: sub.tier as "featured" | "premium",
        listingTitle: listing?.title ?? "Your listing",
        expiresAt: sub.next_billing_at,
        amountTTD: sub.price_ttd,
      });

      sent++;
    } catch (err) {
      errors.push(`Sub ${sub.id}: ${err}`);
    }
  }

  // ── 3. Send expiry warnings for listings expiring in 1–3 days ───────────
  const { data: expiringListings } = await supabase
    .from("listings")
    .select("id, user_id, title, expires_at")
    .eq("sold", false)
    .lte("expires_at", in3Days.toISOString())
    .gte("expires_at", now.toISOString());

  let expirySent = 0;
  const expiryErrors: string[] = [];

  for (const listing of expiringListings ?? []) {
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(listing.user_id);
      const userEmail = userData?.user?.email;
      if (!userEmail) continue;

      const msLeft = new Date(listing.expires_at).getTime() - now.getTime();
      const daysLeft = Math.max(1, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));

      await sendListingExpiryWarning({
        toEmail: userEmail,
        listingTitle: listing.title,
        daysLeft,
      });

      expirySent++;
    } catch (err) {
      expiryErrors.push(`Listing ${listing.id}: ${err}`);
    }
  }

  return NextResponse.json({
    renewed,
    cancelled,
    remindersSent: sent,
    expiryWarningsSent: expirySent,
    errors: [
      ...(errors.length > 0 ? errors : []),
      ...(expiryErrors.length > 0 ? expiryErrors : []),
    ].length > 0
      ? [...errors, ...expiryErrors]
      : undefined,
  });
}
