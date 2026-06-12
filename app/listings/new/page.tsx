"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";

type Step = 1 | 2 | 3;

const CATEGORIES = [
  "Electronics",
  "Vehicles",
  "Real Estate",
  "Fashion",
  "Food & Beverage",
  "Services",
  "Home & Garden",
  "Sports & Outdoors",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair"];

const LOCATIONS: { region: string; areas: string[] }[] = [
  {
    region: "Port of Spain & Environs",
    areas: [
      "Port of Spain",
      "Belmont",
      "Cascade",
      "Woodbrook",
      "St. Clair",
      "Newtown",
      "St. James",
      "Cocorite",
      "Gonzales",
      "Laventille",
      "Morvant",
    ],
  },
  {
    region: "East-West Corridor",
    areas: [
      "Barataria",
      "San Juan",
      "Curepe",
      "St. Augustine",
      "Tunapuna",
      "Arouca",
      "Trincity",
      "Piarco",
      "Arima",
      "Sangre Grande",
    ],
  },
  {
    region: "West Trinidad",
    areas: [
      "Diego Martin",
      "Petit Valley",
      "Maraval",
      "Westmoorings",
      "Glencoe",
      "Carenage",
      "Chaguaramas",
      "Santa Cruz",
      "Paramin",
    ],
  },
  {
    region: "Central Trinidad",
    areas: [
      "Chaguanas",
      "Cunupia",
      "Charlieville",
      "Couva",
      "Carapichaima",
      "Felicity",
      "Endeavour",
      "Montrose",
    ],
  },
  {
    region: "South Trinidad",
    areas: [
      "San Fernando",
      "Marabella",
      "Gasparillo",
      "Princes Town",
      "Siparia",
      "Penal",
      "Debe",
      "Barrackpore",
      "Fyzabad",
      "Point Fortin",
      "La Brea",
      "Cedros",
      "Icacos",
      "Moruga",
      "Rio Claro",
      "Mayaro",
    ],
  },
  {
    region: "North Trinidad",
    areas: [
      "Blanchisseuse",
      "Matelot",
      "Toco",
      "Salybia",
    ],
  },
  {
    region: "Tobago",
    areas: [
      "Scarborough",
      "Crown Point",
      "Canaan",
      "Signal Hill",
      "Buccoo",
      "Plymouth",
      "Charlotteville",
      "Speyside",
      "Roxborough",
      "Castara",
      "Moriah",
    ],
  },
];

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    condition: "",
    price: "",
    currency: "TTD",
    location: "",
    negotiable: false,
    description: "",
    tags: "",
    tier: "free" as "free" | "featured" | "premium",
  });

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Get logged-in user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setSellerId(data.user.id); // seller id = user id
      } else {
        router.push("/auth/login");
      }
    });
  }, [router]);

  const addImages = (files: File[]) => {
    const newFiles = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!userId || !sellerId) return;
    setSubmitting(true);
    setSubmitError("");

    const supabase = createClient();
    let imageUrls: string[] = [];

    // Upload images to Supabase Storage
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop();
        const path = `listings/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, file, { upsert: false });

        if (uploadError) {
          // If storage bucket doesn't exist yet, use placeholder
          console.warn("Image upload failed:", uploadError.message);
          imageUrls.push(`https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop`);
        } else {
          const { data: urlData } = supabase.storage
            .from("listing-images")
            .getPublicUrl(uploadData.path);
          imageUrls.push(urlData.publicUrl);
        }
      }
    }

    // Fallback image if none uploaded
    if (imageUrls.length === 0) {
      imageUrls = [`https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop`];
    }

    const listingId = `l${Date.now()}`;
    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase.from("listings").insert({
      id: listingId,
      user_id: userId,
      seller_id: sellerId,
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      currency: form.currency,
      category: form.category,
      condition: form.condition,
      location: form.location,
      images: imageUrls,
      tags: tagsArray,
      negotiable: form.negotiable,
      tier: form.tier,
      featured: form.tier !== "free",
      created_at: new Date().toISOString(),
    });

    if (error) {
      setSubmitError(error.message);
      setSubmitting(false);
      return;
    }

    // Send listing posted confirmation email (fire and forget)
    fetch("/api/email/listing-posted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingTitle: form.title, listingId, tier: form.tier }),
    }).catch(() => {});

    // If paid tier, redirect to WiPay for subscription payment
    if (form.tier !== "free") {
      const res = await fetch("/api/payments/wipay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountTTD: form.tier === "featured" ? 150 : 350,
          purpose: `subscription_${form.tier}_${listingId}`,
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
    }

    router.push(`/dashboard?posted=1`);
  };

  const canProceedStep1 =
    form.title.trim() &&
    form.category &&
    form.condition &&
    form.price &&
    parseFloat(form.price) >= 0 &&
    form.location;

  const canProceedStep2 = form.description.trim().length >= 10;

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-gray-900">Post a Listing</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to list your item on TriniMarket.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={[
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                step === s ? "bg-blue-700 text-white" : step > s ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500",
              ].join(" ")}>
                {step > s ? "✓" : s}
              </div>
              <span className={[
                "text-sm hidden sm:block",
                step === s ? "text-gray-900 font-medium" : "text-gray-400",
              ].join(" ")}>
                {s === 1 ? "Basic Details" : s === 2 ? "Description" : "Photos & Post"}
              </span>
              {s < 3 && <div className="w-12 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          {/* ── Step 1: Basic Details ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. 2019 Toyota Corolla – Low Mileage"
                  maxLength={120}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">{form.title.length}/120</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                  <select
                    value={form.condition}
                    onChange={(e) => update("condition", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select condition</option>
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <div className="flex gap-2">
                  <select
                    value={form.currency}
                    onChange={(e) => update("currency", e.target.value)}
                    className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="TTD">TTD</option>
                    <option value="USD">USD</option>
                  </select>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.negotiable}
                    onChange={(e) => update("negotiable", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Price is negotiable</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <select
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select location</option>
                  {LOCATIONS.map((group) => (
                    <optgroup key={group.region} label={group.region}>
                      {group.areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Listing Tier
                  <Link href="/pricing" target="_blank" className="ml-2 text-xs text-blue-600 hover:underline font-normal">Compare tiers →</Link>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: "free", label: "Free", price: "TT$0", desc: "Standard placement" },
                    { value: "featured", label: "◆ Featured", price: "TT$150/mo", desc: "Cancel anytime" },
                    { value: "premium", label: "★ Premium", price: "TT$350/mo", desc: "Cancel anytime" },
                  ] as const).map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update("tier", t.value)}
                      className={[
                        "rounded-xl border-2 p-3 text-left transition-all",
                        form.tier === t.value
                          ? t.value === "premium" ? "border-blue-700 bg-blue-700 text-white" : "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300",
                      ].join(" ")}
                    >
                      <p className={`text-xs font-bold mb-0.5 ${form.tier === t.value && t.value === "premium" ? "text-white" : "text-gray-900"}`}>{t.label}</p>
                      <p className={`text-sm font-bold ${form.tier === t.value && t.value === "premium" ? "text-blue-200" : "text-blue-700"}`}>{t.price}</p>
                      <p className={`text-xs mt-0.5 ${form.tier === t.value && t.value === "premium" ? "text-blue-200" : "text-gray-400"}`}>{t.desc}</p>
                    </button>
                  ))}
                </div>
                {form.tier !== "free" && (
                  <p className="text-xs text-gray-400 mt-2">
                    You&apos;ll be redirected to WiPay to complete payment after posting. Billed monthly · Cancel anytime.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: Description ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={7}
                  maxLength={1000}
                  placeholder="Describe your item — condition details, features, reason for selling, availability for viewing, contact preferences, etc."
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags <span className="text-gray-400 font-normal">(optional, comma separated)</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="e.g. toyota, automatic, sedan"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Tags help buyers find your listing faster.</p>
              </div>

              {form.tags && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Photos & Post ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Photos <span className="text-gray-400 font-normal">(up to 5 images)</span>
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addImages(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")));
                  }}
                  className={[
                    "border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer",
                    dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400",
                  ].join(" ")}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addImages(Array.from(e.target.files || []))}
                  />
                  <div className="text-3xl mb-3">📷</div>
                  <p className="font-semibold text-gray-700 text-sm">Drag photos here or click to upload</p>
                  <p className="text-gray-400 text-xs mt-1">Up to 5 images · JPG, PNG, WEBP supported</p>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {imagePreviews.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                      <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="200px" unoptimized />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-700 text-white text-xs px-1.5 py-0.5 rounded">Main</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
                <p className="font-semibold text-gray-700 mb-3">Review your listing</p>
                {[
                  ["Title", form.title],
                  ["Category", form.category],
                  ["Condition", form.condition],
                  ["Price", form.price ? `${form.currency} ${parseFloat(form.price).toLocaleString()}${form.negotiable ? " (negotiable)" : ""}` : "—"],
                  ["Location", form.location],
                  ["Tier", form.tier === "free" ? "Free" : form.tier === "featured" ? "◆ Featured — TT$150/mo" : "★ Premium — TT$350/mo"],
                  ["Photos", imagePreviews.length > 0 ? `${imagePreviews.length} photo${imagePreviews.length > 1 ? "s" : ""}` : "None (a placeholder will be used)"],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">{label}:</span>
                    <span className="text-gray-700">{value || "—"}</span>
                  </div>
                ))}
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep((s) => (s - 1) as Step)}>← Back</Button>
            ) : (
              <div />
            )}
            {step === 1 && (
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                Continue →
              </Button>
            )}
            {step === 2 && (
              <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
                Continue →
              </Button>
            )}
            {step === 3 && (
              <Button onClick={handleSubmit} size="lg" disabled={submitting}>
                {submitting ? "Posting…" : form.tier === "free" ? "🚀 Post Listing" : `🚀 Post & Pay TT$${form.tier === "featured" ? "150" : "350"}/mo`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
