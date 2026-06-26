"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", location: "" });
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data: seller } = await supabase
        .from("sellers")
        .select("name, phone, location, avatar")
        .eq("id", user.id)
        .single();

      if (seller) {
        setForm({
          name: seller.name ?? "",
          phone: seller.phone ?? "",
          location: seller.location ?? "",
        });
        setAvatar(seller.avatar ?? null);
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setAvatarUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `avatars/${userId}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("listing-images").upload(path, file, { upsert: true });
    if (uploadErr) { showToast("error", "Failed to upload photo."); setAvatarUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(path);
    await supabase.from("sellers").update({ avatar: publicUrl }).eq("id", userId);
    setAvatar(publicUrl);
    setAvatarUploading(false);
    showToast("success", "Profile photo updated.");
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("sellers")
      .update({ name: form.name, phone: form.phone, location: form.location })
      .eq("id", userId);
    setSaving(false);
    if (error) showToast("error", "Failed to save. Please try again.");
    else showToast("success", "Profile updated successfully.");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) return;
    if (!confirm("Final confirmation: all your listings, messages, and data will be deleted.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and preferences.</p>
        </div>

        {toast && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {toast.type === "success" ? "✅" : "⚠️"} {toast.msg}
          </div>
        )}

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-display font-semibold text-base text-gray-900">Profile</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {form.name.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                {avatarUploading ? "Uploading…" : "Change Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
              </label>
              <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                value={email}
                disabled
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 868 xxx-xxxx"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Port of Spain"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-2">Password</h2>
          <p className="text-sm text-gray-500 mb-4">Change your password via the secure reset flow.</p>
          <Link href="/auth/forgot-password">
            <Button variant="secondary" size="sm">Change Password →</Button>
          </Link>
        </div>

        {/* Pro Account */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-2">Pro Account</h2>
          <p className="text-sm text-gray-500 mb-4">
            Get a branded storefront, Verified Business badge, unlimited listings, and analytics for <strong className="text-gray-700">TT$150/month</strong>.
          </p>
          <Link href="/pricing">
            <Button size="sm">View Plans →</Button>
          </Link>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-3">
            {[
              { label: "New message received", defaultOn: true },
              { label: "Listing inquiry", defaultOn: true },
              { label: "Promotions and tips", defaultOn: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">{n.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={n.defaultOn}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <h2 className="font-display font-semibold text-base text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all your listings. This cannot be undone.</p>
          <Button variant="danger" size="sm" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
