"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, ImagePlus, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  userId?: string;
}

interface UploadItem {
  id: string;
  preview: string;
  url?: string;
  progress: number; // 0–100, 100 = done
  error?: string;
}

export function ImageUploader({ value, onChange, maxImages = 5, userId }: Props) {
  const [items, setItems] = useState<UploadItem[]>(() =>
    value.map((url) => ({ id: url, preview: url, url, progress: 100 }))
  );
  const [dragOver, setDragOver] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");
  const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const notifyParent = (updated: UploadItem[]) => {
    const urls = updated.filter((i) => i.url).map((i) => i.url!);
    onChange(urls);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`"${file.name}" exceeds ${MAX_MB}MB and was skipped.`);
      return null;
    }
    if (!file.type.startsWith("image/")) {
      alert(`"${file.name}" is not an image and was skipped.`);
      return null;
    }

    const id = `${userId ?? "anon"}/${Date.now()}-${file.name}`;
    const preview = URL.createObjectURL(file);
    const tempItem: UploadItem = { id, preview, progress: 10 };

    setItems((prev) => {
      if (prev.length >= maxImages) return prev;
      return [...prev, tempItem];
    });

    // Simulate progress ticks while uploading
    const tick = setInterval(() => {
      setItems((prev) =>
        prev.map((i) => i.id === id && i.progress < 80 ? { ...i, progress: i.progress + 15 } : i)
      );
    }, 300);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(id, file, { upsert: false });

    clearInterval(tick);

    if (uploadError) {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, progress: 100, error: uploadError.message } : i));
      return null;
    }

    const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(uploadData.path);
    const publicUrl = urlData.publicUrl;

    setItems((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, progress: 100, url: publicUrl } : i);
      notifyParent(updated);
      return updated;
    });

    return publicUrl;
  };

  const addFiles = (files: File[]) => {
    const remaining = maxImages - items.length;
    if (remaining <= 0) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }
    files.slice(0, remaining).forEach(uploadFile);
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      notifyParent(updated);
      return updated;
    });
  };

  const handlePasteUrl = () => {
    const url = pasteUrl.trim();
    if (!url || items.length >= maxImages) return;
    try { new URL(url); } catch { alert("Please enter a valid URL."); return; }
    const item: UploadItem = { id: url, preview: url, url, progress: 100 };
    setItems((prev) => {
      const updated = [...prev, item];
      notifyParent(updated);
      return updated;
    });
    setPasteUrl("");
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      notifyParent(next);
      return next;
    });
  };

  const canAdd = items.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {canAdd && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")));
          }}
          onClick={() => inputRef.current?.click()}
          className={[
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors select-none",
            dragOver
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:border-red-400 dark:hover:border-red-500",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
          />
          <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
            <ImagePlus className="w-8 h-8" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drag photos here or <span className="text-red-600">click to upload</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Up to {maxImages} images · JPG, PNG, WEBP · Max 5 MB each
            </p>
          </div>
        </div>
      )}

      {/* Thumbnails */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragSrcIdx(idx)}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); if (dragSrcIdx !== null) reorder(dragSrcIdx, idx); setDragSrcIdx(null); }}
              onDragEnd={() => setDragSrcIdx(null)}
              className={[
                "relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10 group border transition-all",
                dragSrcIdx === idx ? "opacity-40 scale-95" : "border-gray-200 dark:border-white/10",
              ].join(" ")}
            >
              <Image
                src={item.preview}
                alt={`Photo ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
                unoptimized
              />

              {/* Progress overlay */}
              {item.progress < 100 && !item.error && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                  <div className="w-3/4 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-white text-xs">{item.progress}%</span>
                </div>
              )}

              {/* Error overlay */}
              {item.error && (
                <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center p-1">
                  <span className="text-white text-xs text-center leading-tight">Upload failed</span>
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute top-1 left-1 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical className="w-3.5 h-3.5 drop-shadow" strokeWidth={2} />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" strokeWidth={2} />
              </button>

              {/* Main badge */}
              {idx === 0 && item.progress === 100 && !item.error && (
                <span className="absolute bottom-1 left-1 bg-red-700 text-white text-[10px] px-1.5 py-0.5 rounded font-medium leading-none">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* URL fallback */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <input
            type="url"
            value={pasteUrl}
            onChange={(e) => setPasteUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasteUrl()}
            placeholder="Or paste an image URL…"
            disabled={!canAdd}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={handlePasteUrl}
          disabled={!pasteUrl.trim() || !canAdd}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
          Add
        </button>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {items.length}/{maxImages} photo{items.length !== 1 ? "s" : ""} added
      </p>
    </div>
  );
}
