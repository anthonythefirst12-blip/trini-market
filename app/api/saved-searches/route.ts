import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { label, category, search_term, max_price } = body;

  if (!label) return NextResponse.json({ error: "label is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("saved_searches")
    .upsert(
      {
        user_id: user.id,
        label,
        category: category ?? null,
        search_term: search_term ?? null,
        max_price: max_price ?? null,
        last_notified_at: new Date().toISOString(),
      },
      // Upsert on (user_id, label) so re-saving the same filter set updates rather than duplicates
      { onConflict: "user_id,label", ignoreDuplicates: false }
    )
    .select()
    .single();

  if (error) {
    console.error("saved_searches upsert:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ searches: data });
}
