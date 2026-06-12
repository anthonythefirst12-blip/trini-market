import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSubscriptionReminder } from "@/lib/email";

// This route is called daily by Vercel Cron.
// It finds subscriptions expiring in 1–3 days and emails the user.
export async function GET(request: Request) {
  // Protect the endpoint
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role key to read auth.users emails
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Find active subscriptions expiring within the next 3 days
  const { data: expiringSubs, error } = await supabase
    .from("subscriptions")
    .select("id, user_id, tier, price_ttd, next_billing_at, listings(title)")
    .eq("status", "active")
    .lte("next_billing_at", in3Days.toISOString())
    .gte("next_billing_at", now.toISOString());

  if (error) {
    console.error("Cron error fetching subscriptions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!expiringSubs || expiringSubs.length === 0) {
    return NextResponse.json({ sent: 0, message: "No expiring subscriptions" });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const sub of expiringSubs) {
    try {
      // Get user email from Supabase Auth
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

  return NextResponse.json({
    sent,
    total: expiringSubs.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
