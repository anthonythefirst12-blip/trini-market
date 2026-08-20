import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://trinisell.tt";
const FROM = "TriniSell <noreply@trinisell.tt>";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipientId, listingTitle, amount, status } = await request.json();
  if (!recipientId || !listingTitle || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Look up the recipient name
  const { data: seller } = await supabase
    .from("sellers")
    .select("name")
    .eq("id", recipientId)
    .single();

  // Get recipient email via auth admin (requires service role)
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { data: authUser } = await admin.auth.admin.getUserById(recipientId);
  const toEmail = authUser?.user?.email;

  if (!toEmail) return NextResponse.json({ ok: true });

  const toName = seller?.name ?? "there";
  const isAccepted = status === "accepted";
  const formattedAmount = amount
    ? new Intl.NumberFormat("en-TT", {
        style: "currency",
        currency: "TTD",
        minimumFractionDigits: 0,
      }).format(amount)
    : null;

  const statusLabel = isAccepted ? "Accepted" : "Declined";
  const statusColor = isAccepted ? "#16a34a" : "#dc2626";
  const statusBg = isAccepted ? "#f0fdf4" : "#fef2f2";
  const statusBorder = isAccepted ? "#bbf7d0" : "#fecaca";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#dc2626;padding:28px 32px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#ef4444;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                <span style="color:#ffffff;font-weight:700;font-size:14px;">TM</span>
              </td>
              <td style="padding-left:10px;"><span style="color:#ffffff;font-size:20px;font-weight:700;">TriniSell</span></td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">
              Offer ${statusLabel}
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">
              Hi ${toName}, here's an update on your offer.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;border-radius:12px;padding:20px;margin-bottom:24px;">
              <tr><td>
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Listing</p>
                <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827;">${listingTitle}</p>
                ${formattedAmount ? `
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Your Offer</p>
                <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827;">${formattedAmount}</p>
                ` : ""}
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:${statusBg};border:1px solid ${statusBorder};border-radius:6px;padding:4px 12px;">
                      <span style="font-size:13px;font-weight:600;color:${statusColor};">${isAccepted ? "✅" : "❌"} ${statusLabel}</span>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            ${isAccepted ? `
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
              Your offer was accepted! Head to your messages to coordinate pickup with the seller.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#dc2626;border-radius:10px;">
                  <a href="${APP_URL}/messages" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                    Go to Messages →
                  </a>
                </td>
              </tr>
            </table>
            ` : `
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
              Your offer wasn't accepted this time. Browse more listings or make another offer.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#dc2626;border-radius:10px;">
                  <a href="${APP_URL}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                    Browse Listings →
                  </a>
                </td>
              </tr>
            </table>
            `}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              © ${new Date().getFullYear()} TriniSell · Trinidad &amp; Tobago's Marketplace
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `Your offer on "${listingTitle}" was ${status}`,
    html,
  });

  return NextResponse.json({ ok: true });
}
