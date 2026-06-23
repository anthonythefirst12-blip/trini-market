"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";

const CATEGORIES = ["Electronics","Vehicles","Real Estate","Fashion","Food & Beverage","Services","Home & Garden","Sports & Outdoors"];
const CONDITIONS = ["New", "Like New", "Good", "Fair"];
const LOCATIONS: { region: string; areas: string[] }[] = [
  { region: "Port of Spain & Environs", areas: ["Port of Spain","Belmont","Cascade","Woodbrook","St. Clair","Newtown","St. James","Cocorite","Gonzales","Laventille","Morvant"] },
  { region: "East-West Corridor", areas: ["Barataria","San Juan","Curepe","St. Augustine","Tunapuna","Arouca","Trincity","Piarco","Arima","Sangre Grande"] },
  { region: "West Trinidad", areas: ["Diego Martin","Petit Valley","Maraval","Westmoorings","Glencoe","Carenage","Chaguaramas","Santa Cruz","Paramin"] },
  { region: "Central Trinidad", areas: ["Chaguanas","Cunupia","Charlieville","Couva","Carapichaima","Felicity","Endeavour","Montrose"] },
  { region: "South Trinidad", areas: ["San Fernando","Marabella","Gasparillo","Princes Town","Siparia","Penal","Debe","Barrackpore","Fyzabad","Point Fortin","La Brea","Cedros","Icacos","Moruga","Rio Claro","Mayaro"] },
  { region: "North Trinidad", areas: ["Blanchisseuse","Matelot","Toco","Salybia"] },
  { region: "Tobago", areas: ["Scarborough","Crown Point","Canaan","Signal Hill","Buccoo","Plymouth","Charlotteville","Speyside","Roxborough","Castara","Moriah"] },
];

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", category: "", condition: "", price: "", currency: "TTD",
    location: "", negotiable: false, description: "", tags: "",
  });

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUserId(user.id);

      const { data, error: err } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (err || !data) { router.push("/dashboard"); return; }
      setUserId(user.id);

      setForm({
        title: data.title ?? "",
        category: data.category ?? "",
        condition: data.condition ?? "",
        price: String(data.price ?? ""),
        currency: data.currency ?? "TTD",
        location: data.location ?? "",
        negotiable: data.negotiable ?? false,
        description: data.description ?? "",
        tags: (data.tags ?? []).join(", "),
      });
      setLoading(false);
    };
    load();
  }, [id, router]);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    const supabase = createClient();
    const tagsArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const { error: err } = await supabase
      .from("listings")
      .update({
        title: form.title,
        category: form.category,
        condition: form.condition,
        price: parseFloat(form.price),
        currency: form.currency,
        location: form.location,
        negotiable: form.negotiable,
        description: form.description,
        tags: tagsArray,
      })
      .eq("id", id)
      .eq("user_id", userId ?? "");

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/dashboard?edited=1");
  };

  const inputCls = "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const selectCls = `${inputCls} cursor-pointer`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-gray-900">Edit Listing</h1>
          <p className="text-sm text-gray-500 mt-1">Update your listing details below.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} maxLength={120} className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">{form.title.length}/120</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className={selectCls}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
              <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className={selectCls}>
                <option value="">Select…</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <div className="flex gap-2">
              <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="TTD">TTD</option>
                <option value="USD">USD</option>
              </select>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} min="0" className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={form.negotiable} onChange={(e) => update("negotiable", e.target.checked)} className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-600">Price is negotiable</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <select value={form.location} onChange={(e) => update("location", e.target.value)} className={selectCls}>
              <option value="">Select…</option>
              {LOCATIONS.map((g) => (
                <optgroup key={g.region} label={g.region}>
                  {g.areas.map((a) => <option key={a} value={a}>{a}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={6} maxLength={1000}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(optional, comma separated)</span></label>
            <input type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="e.g. toyota, automatic" className={inputCls} />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-3">
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Cancel
            </button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.category || !form.condition || !form.price || !form.location}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
