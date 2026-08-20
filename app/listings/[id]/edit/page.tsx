"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import { ImageUploader } from "@/components/listings/ImageUploader";

const CATEGORIES = ["Electronics","Vehicles","Real Estate","Fashion","Food & Beverage","Services","Home & Garden","Sports & Outdoors"];
const CONDITIONS = ["New", "Like New", "Good", "Fair"];

const SUBCATEGORIES: Record<string, { label: string; options: string[] }> = {
  Vehicles: { label: "Brand", options: ["Toyota","Nissan","Honda","Mitsubishi","Hyundai","Mazda","BMW","Mercedes-Benz","Ford","Suzuki","Kia","Isuzu","Jeep","Land Rover","Subaru","Volkswagen","Audi","Chevrolet","Dodge","RAM","Lexus","Infiniti","Porsche","Peugeot","Renault","Fiat","Volvo","Yamaha","Kawasaki","Bajaj","TVS","Other"] },
  "Real Estate": { label: "Type", options: ["Apartment","House","Land","Townhouse","Condo","Villa","Studio","Room for Rent","Commercial Space","Office Space","Warehouse","Agricultural Land","Other"] },
  Electronics: { label: "Device", options: ["Smartphone","Laptop","Tablet","Gaming Console","Smart TV","Camera","Headphones","Desktop PC","Smartwatch","Printer","Speaker","Monitor","Router","Accessories","Other"] },
  Fashion: { label: "Type", options: ["Men's Clothing","Women's Clothing","Shoes","Bags & Accessories","Jewelry","Watches","Kids' Clothing","Sportswear","Underwear & Swimwear","Vintage & Thrift","School Uniforms","Other"] },
  "Food & Beverage": { label: "Type", options: ["Homemade Food","Catering Services","Beverages","Snacks","Groceries","Baked Goods","Spices & Sauces","Restaurant Equipment","Other"] },
  Services: { label: "Service", options: ["Plumbing","Electrical","Carpentry","Painting","Cleaning","Landscaping","Transportation","IT & Tech Support","Tutoring","Beauty & Wellness","Photography","Event Planning","Security","Masonry & Construction","Other"] },
  "Home & Garden": { label: "Type", options: ["Furniture","Appliances","Garden Tools","Home Decor","Lighting","Bedding & Bath","Kitchen Items","Storage","Tools & Equipment","Curtains & Blinds","Other"] },
  "Sports & Outdoors": { label: "Type", options: ["Gym Equipment","Cycling","Water Sports","Football / Soccer","Cricket","Basketball","Outdoor & Camping","Fishing","Martial Arts","Golf","Tennis / Racquet Sports","Other"] },
};
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
  const [images, setImages] = useState<string[]>([]);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "", category: "", subcategory: "", customSubcategory: "",
    condition: "", price: "", currency: "TTD",
    location: "", negotiable: false, description: "", tags: "",
  });

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth/login"; return; }
      setUserId(user.id);

      const { data, error: err } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (err || !data) { window.location.href = "/dashboard"; return; }
      setUserId(user.id);
      setImages(data.images ?? []);
      setOriginalPrice(data.price ?? null);

      const category = data.category ?? "";
      const rawTags: string[] = data.tags ?? [];
      const subDef = SUBCATEGORIES[category];
      const knownOptions = subDef ? subDef.options : [];
      const firstTag = rawTags[0] ?? "";
      const detectedSub = knownOptions.includes(firstTag) ? firstTag : "";
      const remainingTags = detectedSub ? rawTags.slice(1) : rawTags;

      setForm({
        title: data.title ?? "",
        category,
        subcategory: detectedSub,
        customSubcategory: "",
        condition: data.condition ?? "",
        price: String(data.price ?? ""),
        currency: data.currency ?? "TTD",
        location: data.location ?? "",
        negotiable: data.negotiable ?? false,
        description: data.description ?? "",
        tags: remainingTags.join(", "),
      });
      setLoading(false);
    };
    load();
  }, [id, router]);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    const supabase = createClient();

    // Images are already uploaded by ImageUploader; `images` holds the final URL list
    const finalImages = images;
    const subcategoryValue = form.subcategory === "Other" ? form.customSubcategory.trim() : form.subcategory;
    const tagsArray = [
      ...(subcategoryValue ? [subcategoryValue] : []),
      ...form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    ];
    const newPrice = parseFloat(form.price);
    const updatePayload: Record<string, unknown> = {
      title: form.title,
      category: form.category,
      condition: form.condition,
      price: newPrice,
      currency: form.currency,
      location: form.location,
      negotiable: form.negotiable,
      description: form.description,
      tags: tagsArray,
      images: finalImages,
    };
    if (originalPrice !== null && newPrice < originalPrice) {
      updatePayload.previous_price = originalPrice;
    }
    const { error: err } = await supabase
      .from("listings")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", userId ?? "");

    setSaving(false);
    if (err) { setError(err.message); return; }
    window.location.href = "/dashboard?edited=1";
  };

  const inputCls = "w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white";
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
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value, subcategory: "", customSubcategory: "" }))} className={selectCls}>
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

          {form.category && SUBCATEGORIES[form.category] && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {SUBCATEGORIES[form.category].label}
                <span className="ml-1.5 text-xs font-normal text-gray-400">optional</span>
              </label>
              <select value={form.subcategory} onChange={(e) => setForm((p) => ({ ...p, subcategory: e.target.value, customSubcategory: "" }))} className={selectCls}>
                <option value="">— Select {SUBCATEGORIES[form.category].label.toLowerCase()} —</option>
                {SUBCATEGORIES[form.category].options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {form.subcategory === "Other" && (
                <input
                  type="text"
                  value={form.customSubcategory}
                  onChange={(e) => update("customSubcategory", e.target.value)}
                  placeholder={`Specify ${SUBCATEGORIES[form.category].label.toLowerCase()}…`}
                  maxLength={60}
                  className={`mt-2 ${inputCls}`}
                />
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <div className="flex gap-2">
              <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                <option value="TTD">TTD</option>
                <option value="USD">USD</option>
              </select>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} min="0" className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={form.negotiable} onChange={(e) => update("negotiable", e.target.checked)} className="rounded border-gray-300 text-red-600" />
              <span className="text-sm text-gray-600">Price is negotiable <span className="text-gray-400">(enables Make an Offer button for buyers)</span></span>
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
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000</p>
          </div>

          {/* Image management */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
            <ImageUploader
              value={images}
              onChange={setImages}
              maxImages={8}
              userId={userId ?? undefined}
            />
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
