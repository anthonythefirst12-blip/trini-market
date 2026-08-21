import { NextResponse } from "next/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import { sendSavedSearchAlert } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Protect with CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch all saved searches
  const { data: searches, error: searchesErr } = await admin
    .from("saved_searches")
    .select("*");

  if (searchesErr) {
    console.error("saved-search-alerts: fetch searches:", searchesErr.message);
    return NextResponse.json({ error: searchesErr.message }, { status: 500 });
  }

  const results: { id: string; matched: number; emailed: boolean }[] = [];

  for (const search of searches ?? []) {
    const since = search.last_notified_at ?? search.created_at;

    // Build listings query matching the saved search filters
    let query = admin
      .from("listings")
      .select("id, title, price, category")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .gt("created_at", since);

    if (search.category) query = query.eq("category", search.category);
    if (search.search_term) {
      const term = (search.search_term as string).trim();
      query = query.textSearch("fts", term, { type: "websearch", config: "english" });
    }
    if (search.max_price) query = query.lte("price", search.max_price);

    const { data: matches } = await query.limit(10);

    // Always update last_notified_at so we don't re-check the same window
    await admin
      .from("saved_searches")
      .update({ last_notified_at: new Date().toISOString() })
      .eq("id", search.id);

    if (!matches || matches.length === 0) {
      results.push({ id: search.id, matched: 0, emailed: false });
      continue;
    }

    // Get the user's email via auth admin
    const { data: authUser } = await admin.auth.admin.getUserById(search.user_id);
    const toEmail = authUser?.user?.email;

    if (!toEmail) {
      results.push({ id: search.id, matched: matches.length, emailed: false });
      continue;
    }

    // Build a search URL so the user can click straight to results
    const sp = new URLSearchParams();
    if (search.category) sp.set("category", search.category);
    if (search.search_term) sp.set("q", search.search_term);
    if (search.max_price) sp.set("maxPrice", String(search.max_price));
    const searchUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://trinisell.tt"}/listings?${sp.toString()}`;

    await sendSavedSearchAlert({
      toEmail,
      searchLabel: search.label,
      matchCount: matches.length,
      listings: matches.map((m: { title: string; price: number; id: string }) => ({
        title: m.title,
        price: m.price,
        url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://trinisell.tt"}/listings/${m.id}`,
      })),
      searchUrl,
    });

    results.push({ id: search.id, matched: matches.length, emailed: true });
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
