"use client";

import { useState, useEffect } from "react";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushSubscribeButton() {
  const [status, setStatus] = useState<"loading" | "unsupported" | "subscribed" | "unsubscribed">("loading");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !VAPID_PUBLIC) {
      setStatus("unsupported");
      return;
    }
    navigator.serviceWorker.register("/sw.js").then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setStatus(sub ? "subscribed" : "unsubscribed");
    }).catch(() => setStatus("unsupported"));
  }, []);

  const subscribe = async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
    });
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    setStatus("subscribed");
  };

  const unsubscribe = async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    }
    setStatus("unsubscribed");
  };

  if (status === "loading" || status === "unsupported") return null;

  if (status === "subscribed") {
    return (
      <button
        onClick={unsubscribe}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        Notifications on
      </button>
    );
  }

  return (
    <button
      onClick={subscribe}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors border border-gray-200 rounded-lg px-3 py-2 hover:border-red-300"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      Enable notifications
    </button>
  );
}
