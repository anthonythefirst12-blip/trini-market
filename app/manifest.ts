import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TriniSell",
    short_name: "TriniSell",
    description: "Trinidad & Tobago's local marketplace — buy and sell locally, safely, for free.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    screenshots: [
      { src: "/opengraph-image", sizes: "1200x630", type: "image/png" },
    ],
    categories: ["shopping", "marketplace"],
  };
}
