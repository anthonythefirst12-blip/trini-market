"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

const inputClass =
  "w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500";

const labelClass =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

const cardClass =
  "bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-100 dark:border-white/10 p-6";

export default function EditProfilePage() {
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");

  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("sellers")
        .select("name, bio, location, phone, avatar, banner")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setName(data.name ?? "");
        setBio(data.bio ?? "");
        setLocation(data.location ?? "");
        setPhone(data.phone ?? "");
        setAvatar(data.avatar ?? "");
        setBanner(data.banner ?? "");
      }
    }

    init();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);

    await supabase
      .from("sellers")
      .update({ name, bio, location, phone, avatar, banner })
      .eq("id", userId);

    setSaving(false);
    setShowToast(true);

    setTimeout(() => setShowToast(false), 3000);
    setTimeout(() => {
      window.location.href = `/profile/${userId}`;
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111] font-display">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          <CheckCircle size={16} />
          Profile updated!
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
          Edit Profile
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Public Info */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
              Public Info
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Display Name</label>
                <input
                  type="text"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  className={inputClass}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Port of Spain, San Fernando"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Bio
                  <span className="ml-1 text-gray-400 font-normal">
                    ({bio.length}/300)
                  </span>
                </label>
                <textarea
                  rows={3}
                  className={inputClass + " resize-none"}
                  value={bio}
                  maxLength={300}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell buyers a bit about yourself…"
                />
              </div>

              <div>
                <label className={labelClass}>Phone / WhatsApp</label>
                <input
                  type="text"
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 868 XXX XXXX"
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
              Appearance
            </h2>

            <div className="space-y-4">
              {/* Avatar URL with live preview */}
              <div>
                <label className={labelClass}>Avatar URL</label>
                <div className="flex items-center gap-3">
                  {/* Preview circle */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-red-600 flex items-center justify-center text-white text-sm font-semibold">
                    {avatar && !avatarError ? (
                      <img
                        src={avatar}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        onError={() => setAvatarError(true)}
                        onLoad={() => setAvatarError(false)}
                      />
                    ) : (
                      <span>{name ? name[0].toUpperCase() : "?"}</span>
                    )}
                  </div>
                  <input
                    type="text"
                    className={inputClass}
                    value={avatar}
                    onChange={(e) => {
                      setAvatar(e.target.value);
                      setAvatarError(false);
                    }}
                    placeholder="https://…"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Banner URL{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            {saving && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
