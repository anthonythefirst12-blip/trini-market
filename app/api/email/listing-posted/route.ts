import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendListingPostedEmail } from "@/lib/email";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingTitle, listingId, tier } = await request.json();
  const name = (user.user_metadata?.name as string) ?? "there";

  try {
    await sendListingPostedEmail({
      toEmail: user.email!,
      toName: name,
      listingTitle,
      listingId,
      tier,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Listing posted email error:", err);
    return NextResponse.json({ ok: false });
  }
}
