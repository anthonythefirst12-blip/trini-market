import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "TriniSell <noreply@trinisell.tt>";
const ADMIN_EMAIL = "ezekiel.larose14@icloud.com";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sellerId, sellerName, reason, details } = await request.json();
  if (!sellerId || !reason) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (user.id === sellerId) return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 });

  // Record in reports table — listing_id is null for seller reports
  await supabase.from("reports").insert({
    reporter_id: user.id,
    listing_id: null,
    reason: `[SELLER REPORT] ${reason}`,
    details: `Reported seller: ${sellerName} (${sellerId})${details ? `\n\n${details}` : ""}`,
    status: "pending",
  }).maybeSingle();

  // Always email the admin as a fallback so nothing is silently dropped
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `[Seller Report] ${reason} — ${sellerName}`,
    html: `
      <p><strong>Reporter:</strong> ${user.id}</p>
      <p><strong>Seller:</strong> ${sellerName} (${sellerId})</p>
      <p><strong>Reason:</strong> ${reason}</p>
      ${details ? `<p><strong>Details:</strong> ${details}</p>` : ""}
      <p><a href="https://trinisell.tt/admin">View in Admin Panel</a></p>
    `,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
