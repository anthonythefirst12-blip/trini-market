"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={images[active]}
          alt={title}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                active === i ? "border-blue-700" : "border-gray-200 hover:border-gray-400",
              ].join(" ")}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
