"use client";

import { useEffect } from "react";

interface Props {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  category: string;
}

const MAX_RECENT = 8;
const KEY = "trini_recently_viewed";

export function ViewTracker({ id, title, price, currency, image, category }: Props) {
  useEffect(() => {
    try {
      const existing: Props[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      const filtered = existing.filter((l) => l.id !== id);
      const updated = [{ id, title, price, currency, image, category }, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  }, [id, title, price, currency, image, category]);

  return null;
}
