import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// WiPay redirects the user back here after payment
// POST with form body: order_id, total, status, transaction_id, ...
export async function POST(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let body: Record<string, string>;
  try {
    const formData = await request.formData();
    body = Object.fromEntries(formData.entries()) as Record<string, string>;
  } catch {
    return NextResponse.redirect(`${appUrl}/wallet?payment=error`);
  }

  const { order_id, status, total, transaction_id } = body;
  const supabase = await createClient();

  if (status === "success") {
    // Update payment record
    await supabase
      .from("payments")
      .update({ status: "success", reference_id: transaction_id })
      .eq("id", order_id);

    // Look up which user owns this payment
    const { data: payment } = await supabase
      .from("payments")
      .select("user_id, metadata")
      .eq("id", order_id)
      .single();

    if (payment) {
      const amountTTD = parseFloat(total);

      // Credit wallet
      await supabase
        .from("wallet_transactions")
        .insert({
          user_id: payment.user_id,
          type: "topup",
          amount_ttd: amountTTD,
          description: "WiPay top-up",
          reference_id: transaction_id,
        });

      // Update wallet balance
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
    }

    return NextResponse.redirect(`${appUrl}/wallet?payment=success`);
  } else {
    await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("id", order_id);

    return NextResponse.redirect(`${appUrl}/wallet?payment=failed`);
  }
}

// WiPay sometimes sends GET with query params
export async function GET(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  return NextResponse.redirect(
    `${appUrl}/wallet?payment=${status === "success" ? "success" : "failed"}`
  );
}
