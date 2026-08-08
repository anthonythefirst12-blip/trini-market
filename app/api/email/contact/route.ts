import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

// In-memory rate limit: 3 requests per IP per hour
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

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
