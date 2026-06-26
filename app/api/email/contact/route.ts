import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { fromName, fromEmail, subject, message } = await req.json();
  if (!fromName || !fromEmail || !subject || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    await sendContactEmail({ fromName, fromEmail, subject, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
