"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }

const ToastContext = createContext<(msg: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const styles = {
    success: "bg-gray-900 text-white border-gray-700",
    error: "bg-red-600 text-white border-red-700",
    info: "bg-gray-800 text-white border-gray-600",
  };

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium max-w-xs pointer-events-auto animate-[slideIn_0.2s_ease-out] ${styles[t.type]}`}
          >
            <span className="shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{icons[t.type]}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
