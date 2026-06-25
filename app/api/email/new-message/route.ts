import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendNewMessageEmail } from "@/lib/email";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { receiverId, fromName, listingTitle, messagePreview } = await request.json();
  if (!receiverId || !listingTitle || !messagePreview) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Look up the receiver's email from auth (service role needed — fall back gracefully)
  const { data: receiver } = await supabase
    .from("sellers")
    .select("name")
    .eq("id", receiverId)
    .single();

  // Get receiver email via auth admin — requires service role key
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: authUser } = await admin.auth.admin.getUserById(receiverId);
  const toEmail = authUser?.user?.email;

  if (!toEmail) return NextResponse.json({ ok: true }); // receiver has no email, skip silently

  await sendNewMessageEmail({
    toEmail,
    toName: receiver?.name ?? "there",
    fromName: fromName ?? "Someone",
    listingTitle,
    messagePreview: messagePreview.slice(0, 150),
  });

  return NextResponse.json({ ok: true });
}
