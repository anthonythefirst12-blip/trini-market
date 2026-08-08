"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
  sizes?: string;
}

export function CardImageCarousel({ images, title, sizes = "(max-width: 640px) 100vw, 33vw" }: Props) {
  const [idx, setIdx] = useState(0);
  const [errored, setErrored] = useState(false);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i - 1 + images.length) % images.length);
    setErrored(false);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setIdx((i) => (i + 1) % images.length);
    setErrored(false);
  };

  const src = images[idx] ?? images[0];

  if (!src || errored) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-gray-100 text-4xl text-gray-300 select-none">
        📦
      </div>
    );
  }

  return (
    <div className="relative h-full w-full group/carousel">
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={sizes}
        onError={() => setErrored(true)}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 text-base leading-none"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 text-base leading-none"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setIdx(i); setErrored(false); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white scale-125" : "bg-white/50"}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
