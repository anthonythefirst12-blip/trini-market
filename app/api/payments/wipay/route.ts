import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { logPayment } from "@/lib/payments";

// WiPay payment initiation
// Docs: https://wipayfinancial.com/plugins/pages/view/developer
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { amountTTD, purpose } = body as { amountTTD: number; purpose: string };

  if (!amountTTD || amountTTD < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  // Log payment as pending
  const payment = await logPayment({
    userId: user.id,
    provider: "wipay",
    amountTTD,
    status: "pending",
    metadata: { purpose },
  });

  // WiPay form POST parameters
  const params = new URLSearchParams({
    account_number: process.env.WIPAY_ACCOUNT_NUMBER ?? "",
    avs: "0",
    bal_transaction: String(amountTTD.toFixed(2)),
    country_code: "TT",
    currency: "TTD",
    developer_mode: process.env.WIPAY_DEV_MODE ?? "1",
    environment: process.env.WIPAY_ENV === "production" ? "production" : "sandbox",
    fee_structure: "customer_pays",   // merchant absorbs fee: "merchant_pays"
    order_id: payment?.id ?? crypto.randomUUID(),
    origin: appUrl,
    response_url: `${appUrl}/api/payments/wipay/callback`,
    total: String(amountTTD.toFixed(2)),
  });

  const wipayUrl =
    process.env.WIPAY_ENV === "production"
      ? "https://wipayfinancial.com/v1/gateway_live"
      : "https://sandbox.wipayfinancial.com/v1/gateway";

  // WiPay requires a POST form submission — return the fields and URL
  // so the client can build and submit a hidden form
  return NextResponse.json({
    wipayUrl,
    fields: Object.fromEntries(params.entries()),
    paymentId: payment?.id,
  });
}
