"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type Step = 1 | 2 | 3;

const CATEGORIES = [
  "Electronics", "Vehicles", "Real Estate", "Fashion",
  "Food & Beverage", "Services", "Home & Garden", "Sports & Outdoors",
];

const LOCATIONS = [
  "Port of Spain", "San Fernando", "Chaguanas", "Arima", "Tunapuna",
  "Couva", "Fyzabad", "Debe", "Diego Martin", "Maraval",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair"];

export default function NewListingPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Listing Posted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your listing is now live on TriniMarket.</p>
          <div className="flex flex-col gap-3">
            <Link href="/listings"><Button fullWidth>Browse Listings</Button></Link>
            <Link href="/dashboard"><Button fullWidth variant="secondary">Go to Dashboard</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-gray-900">Post a Listing</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to list your item.</p>
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
                {s === 1 ? "Basic Details" : s === 2 ? "Description & Tags" : "Photos"}
              </span>
              {s < 3 && <div className="w-12 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. 2019 Toyota Corolla – Low Mileage"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                <div className="flex items-center gap-2 mt-2">
                  <input
                    id="negotiable"
                    type="checkbox"
                    checked={form.negotiable}
                    onChange={(e) => update("negotiable", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="negotiable" className="text-sm text-gray-600">Price is negotiable</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <select
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select location</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Tier selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Listing Tier
                  <a href="/pricing" target="_blank" className="ml-2 text-xs text-blue-600 hover:underline font-normal">Compare tiers →</a>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: "free", label: "Free", price: "TT$0", desc: "Standard placement" },
                    { value: "featured", label: "◆ Featured", price: "TT$15/wk", desc: "Homepage + badge" },
                    { value: "premium", label: "★ Premium", price: "TT$40/wk", desc: "Top placement" },
                  ] as const).map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update("tier", t.value)}
                      className={[
                        "rounded-xl border-2 p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
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
                    Credits will be deducted from your wallet. <a href="/wallet" className="text-blue-600 hover:underline">Top up →</a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={6}
                  placeholder="Describe your item — condition, features, reason for selling, availability for viewing, etc."
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
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

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Photos</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const files = Array.from(e.dataTransfer.files);
                    const urls = files.map((f) => URL.createObjectURL(f));
                    setUploadedImages((prev) => [...prev, ...urls].slice(0, 5));
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
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const urls = files.map((f) => URL.createObjectURL(f));
                      setUploadedImages((prev) => [...prev, ...urls].slice(0, 5));
                    }}
                  />
                  <div className="text-3xl mb-3">📷</div>
                  <p className="font-semibold text-gray-700 text-sm">Drag photos here or click to upload</p>
                  <p className="text-gray-400 text-xs mt-1">Up to 5 images. JPG, PNG supported.</p>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setUploadedImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-sm text-gray-600">
                <p className="font-semibold text-gray-700">Review your listing</p>
                <p><span className="text-gray-400">Title:</span> {form.title || "—"}</p>
                <p><span className="text-gray-400">Category:</span> {form.category || "—"}</p>
                <p><span className="text-gray-400">Price:</span> {form.price ? `${form.currency} ${form.price}` : "—"}</p>
                <p><span className="text-gray-400">Location:</span> {form.location || "—"}</p>
                <p><span className="text-gray-400">Tier:</span> <span className="capitalize">{form.tier}</span> {form.tier === "featured" ? "— TT$15/wk" : form.tier === "premium" ? "— TT$40/wk" : "— Free"}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep((s) => (s - 1) as Step)}>← Back</Button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <Button onClick={() => setStep((s) => (s + 1) as Step)}>
                Continue →
              </Button>
            ) : (
              <Button onClick={() => setSubmitted(true)} size="lg">
                🚀 Post Listing
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
