import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? "mailto:admin@trinimarket.tt";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

export async function POST(request: Request) {
  // Internal route — call only from other API routes (check a shared secret)
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return NextResponse.json({ ok: true, skipped: "VAPID keys not configured" });
  }

  const { userId, title, body, url } = await request.json();

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("subscription, endpoint")
    .eq("user_id", userId);

  if (!subs || subs.length === 0) return NextResponse.json({ ok: true, sent: 0 });

  const payload = JSON.stringify({ title, body, url });
  let sent = 0;

  await Promise.allSettled(
    subs.map(async (row) => {
      try {
        const sub = JSON.parse(row.subscription);
        await webpush.sendNotification(sub, payload);
        sent++;
      } catch (err: unknown) {
        // Remove expired/invalid subscriptions
        if ((err as { statusCode?: number }).statusCode === 410 || (err as { statusCode?: number }).statusCode === 404) {
          await admin.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
        }
      }
    })
  );

  return NextResponse.json({ ok: true, sent });
}
