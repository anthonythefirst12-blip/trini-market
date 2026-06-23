import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// WiPay redirects the user back here after payment
// POST with form body: order_id, total, status, transaction_id, hash, ...
export async function POST(request: Request) {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  let body: Record<string, string>;
  try {
    const formData = await request.formData();
    body = Object.fromEntries(formData.entries()) as Record<string, string>;
  } catch {
    return NextResponse.redirect(`${appUrl}/wallet?payment=error`);
  }

  const { order_id, status, transaction_id } = body;
  const supabase = await createClient();

  if (status === "success") {
    // Atomically mark payment as success only if it's still pending (idempotency guard)
    const { data: payment, error: updateErr } = await supabase
      .from("payments")
      .update({ status: "success", reference_id: transaction_id })
      .eq("id", order_id)
      .eq("status", "pending")   // only process once
      .select("user_id, amount_ttd")
      .single();

    // If no row matched (already processed or invalid order_id), redirect safely
    if (updateErr || !payment) {
      return NextResponse.redirect(`${appUrl}/wallet?payment=success`);
    }

    // Use the server-stored amount — never trust the amount from the callback body
    const amountTTD = payment.amount_ttd;

    // Credit wallet transaction log
    await supabase.from("wallet_transactions").insert({
      user_id: payment.user_id,
      type: "topup",
      amount_ttd: amountTTD,
      description: "WiPay top-up",
      reference_id: transaction_id,
    });

    // Upsert wallet balance
    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance_ttd")
      .eq("user_id", payment.user_id)
      .single();

    if (wallet) {
      await supabase
        .from("wallets")
        .update({ balance_ttd: wallet.balance_ttd + amountTTD, updated_at: new Date().toISOString() })
        .eq("user_id", payment.user_id);
    } else {
      await supabase
        .from("wallets")
        .insert({ user_id: payment.user_id, balance_ttd: amountTTD });
    }

    return NextResponse.redirect(`${appUrl}/wallet?payment=success`);
  } else {
    await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("id", order_id)
      .eq("status", "pending");

    return NextResponse.redirect(`${appUrl}/wallet?payment=failed`);
  }
}

// WiPay sometimes sends GET with query params
export async function GET(request: Request) {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  return NextResponse.redirect(
    `${appUrl}/wallet?payment=${status === "success" ? "success" : "failed"}`
  );
}
