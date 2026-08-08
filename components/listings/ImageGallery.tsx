"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui/Lightbox";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <>
      <div className="space-y-3">
        <div
          className="relative aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden group select-none cursor-zoom-in"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[active]}
            alt={title}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />

          {/* Expand hint */}
          <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pointer-events-none">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Expand
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActive(i); }}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-200 ${i === active ? "bg-white w-4" : "bg-white/50 hover:bg-white/80 w-1.5"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={[
                  "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                  active === i ? "border-red-600 scale-105" : "border-gray-200 hover:border-gray-400 hover:scale-105",
                ].join(" ")}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={active}
          title={title}
          onClose={() => setLightboxOpen(false)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}
