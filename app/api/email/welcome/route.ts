import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await request.json();

  try {
    await sendWelcomeEmail({ toEmail: user.email!, toName: name });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ ok: false });
  }
}
