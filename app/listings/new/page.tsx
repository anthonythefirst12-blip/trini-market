"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import { compressImage } from "@/lib/compress-image";
import { Confetti } from "@/components/ui/Confetti";
import { ImageUploader } from "@/components/listings/ImageUploader";

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

const SUBCATEGORIES: Record<string, { label: string; options: string[] }> = {
  Vehicles: {
    label: "Brand",
    options: [
      "Toyota", "Nissan", "Honda", "Mitsubishi", "Hyundai",
      "Mazda", "BMW", "Mercedes-Benz", "Ford", "Suzuki",
      "Kia", "Isuzu", "Jeep", "Land Rover", "Subaru",
      "Volkswagen", "Audi", "Chevrolet", "Dodge", "RAM",
      "Lexus", "Infiniti", "Porsche", "Peugeot", "Renault",
      "Fiat", "Volvo", "Yamaha", "Kawasaki", "Bajaj", "TVS",
      "Other",
    ],
  },
  "Real Estate": {
    label: "Type",
    options: [
      "Apartment", "House", "Land", "Townhouse", "Condo",
      "Villa", "Studio", "Room for Rent", "Commercial Space",
      "Office Space", "Warehouse", "Agricultural Land", "Other",
    ],
  },
  Electronics: {
    label: "Device",
    options: [
      "Smartphone", "Laptop", "Tablet", "Gaming Console", "Smart TV",
      "Camera", "Headphones", "Desktop PC", "Smartwatch", "Printer",
      "Speaker", "Monitor", "Router", "Accessories", "Other",
    ],
  },
  Fashion: {
    label: "Type",
    options: [
      "Men's Clothing", "Women's Clothing", "Shoes", "Bags & Accessories",
      "Jewelry", "Watches", "Kids' Clothing", "Sportswear",
      "Underwear & Swimwear", "Vintage & Thrift", "School Uniforms", "Other",
    ],
  },
  "Food & Beverage": {
    label: "Type",
    options: [
      "Homemade Food", "Catering Services", "Beverages", "Snacks",
      "Groceries", "Baked Goods", "Spices & Sauces", "Restaurant Equipment", "Other",
    ],
  },
  Services: {
    label: "Service",
    options: [
      "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning",
      "Landscaping", "Transportation", "IT & Tech Support", "Tutoring",
      "Beauty & Wellness", "Photography", "Event Planning",
      "Security", "Masonry & Construction", "Other",
    ],
  },
  "Home & Garden": {
    label: "Type",
    options: [
      "Furniture", "Appliances", "Garden Tools", "Home Decor", "Lighting",
      "Bedding & Bath", "Kitchen Items", "Storage", "Tools & Equipment",
      "Curtains & Blinds", "Other",
    ],
  },
  "Sports & Outdoors": {
    label: "Type",
    options: [
      "Gym Equipment", "Cycling", "Water Sports", "Football / Soccer",
      "Cricket", "Basketball", "Outdoor & Camping", "Fishing",
      "Martial Arts", "Golf", "Tennis / Racquet Sports", "Other",
    ],
  },
};

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
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [confetti, setConfetti] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subcategory: "",
    customSubcategory: "",
    condition: "",
    price: "",
    currency: "TTD",
    location: "",
    negotiable: false,
    description: "",
    tags: "",
    tier: "free" as "free",
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
        window.location.href = "/auth/login";
      }
    });
  }, [router]);

  const handleSubmit = async () => {
    if (!userId || !sellerId) return;
    setSubmitting(true);
    setSubmitError("");

    const supabase = createClient();

    // Images are already uploaded by ImageUploader; fall back to placeholder if none
    const imageUrls = uploadedImageUrls.length > 0
      ? uploadedImageUrls
      : [`https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop`];

    const listingId = `l${Date.now()}`;
    const subcategoryValue =
      form.subcategory === "Other"
        ? form.customSubcategory.trim()
        : form.subcategory;

    const tagsArray = [
      ...(subcategoryValue ? [subcategoryValue] : []),
      ...form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    ];

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
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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

    setConfetti(true);
    setTimeout(() => { window.location.href = `/dashboard?posted=1`; }, 1800);
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
      <Confetti active={confetti} />
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-gray-900">Post a Listing</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to list your item on TriniSell.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={[
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                step === s ? "bg-red-700 text-white" : step > s ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-500",
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
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-400 mt-1">{form.title.length}/120</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value, subcategory: "", customSubcategory: "" }))}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
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
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="">Select condition</option>
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Subcategory — optional, appears when a category with subcategories is selected */}
              {form.category && SUBCATEGORIES[form.category] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {SUBCATEGORIES[form.category].label}
                    <span className="ml-1.5 text-xs font-normal text-gray-400">optional</span>
                  </label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => setForm((prev) => ({ ...prev, subcategory: e.target.value, customSubcategory: "" }))}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
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
                      className="mt-2 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <div className="flex gap-2">
                  <select
                    value={form.currency}
                    onChange={(e) => update("currency", e.target.value)}
                    className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
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
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.negotiable}
                    onChange={(e) => update("negotiable", e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-600">Price is negotiable <span className="text-gray-400">(enables Make an Offer button for buyers)</span></span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <select
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
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

              {/* Boost hint */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-start gap-3">
                <span className="text-lg mt-0.5">⚡</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Listing is free — boost it later</p>
                  <p className="text-xs text-gray-400 mt-0.5">After posting, you can boost this listing from your Dashboard for TT$15–$40 to push it to the top of search and the homepage.</p>
                </div>
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
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
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
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-400 mt-1">Tags help buyers find your listing faster.</p>
              </div>

              {form.tags && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1">#{tag}</span>
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
                <ImageUploader
                  value={uploadedImageUrls}
                  onChange={setUploadedImageUrls}
                  maxImages={5}
                  userId={userId ?? undefined}
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
                <p className="font-semibold text-gray-700 mb-3">Review your listing</p>
                {[
                  ["Title", form.title],
                  ["Category", form.category],
                  ["Condition", form.condition],
                  ["Price", form.price ? `${form.currency} ${parseFloat(form.price).toLocaleString()}${form.negotiable ? " (negotiable)" : ""}` : "—"],
                  ["Location", form.location],
                  ["Tier", "Free"],
                  ["Photos", uploadedImageUrls.length > 0 ? `${uploadedImageUrls.length} photo${uploadedImageUrls.length > 1 ? "s" : ""}` : "None (a placeholder will be used)"],
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
                {submitting ? "Posting…" : "🚀 Post Listing"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
