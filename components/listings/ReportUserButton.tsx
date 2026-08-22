"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

const REASONS = [
  "Scam or fraud",
  "Fake account / impersonation",
  "Harassment or abusive messages",
  "Selling prohibited items",
  "Spam",
  "Other",
];

interface Props {
  sellerId: string;
  sellerName: string;
}

export function ReportUserButton({ sellerId, sellerName }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!reason) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/reports/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, sellerName, reason, details: details.trim() || null }),
      });
      if (res.status === 401) { window.location.href = "/auth/login"; return; }
      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const close = () => {
    setOpen(false);
    setDone(false);
    setReason("");
    setDetails("");
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Flag size={12} strokeWidth={2} />
        Report user
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Flag size={24} className="text-green-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-1">Report submitted</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  Thanks for helping keep TriniSell safe. We'll review this account.
                </p>
                <button onClick={close} className="text-sm text-red-600 hover:underline">Close</button>
              </div>
            ) : (
              <>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-1">
                  Report {sellerName}
                </h3>
                <p className="text-xs text-gray-400 mb-4">Why are you reporting this user?</p>

                <div className="space-y-2 mb-4">
                  {REASONS.map((r) => (
                    <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="user-report-reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                        {r}
                      </span>
                    </label>
                  ))}
                </div>

                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={2}
                  placeholder="Additional details (optional)"
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-3"
                />

                {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={close}
                    className="flex-1 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submit}
                    disabled={!reason || sending}
                    className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending…" : "Submit Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
