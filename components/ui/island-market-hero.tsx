"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bricolage_Grotesque, Sora } from "next/font/google";
import { gsap } from "gsap";
import {
  ArrowUpRight,
  Car,
  Home,
  Cpu,
  UtensilsCrossed,
  Wrench,
  MapPin,
  Search,
} from "lucide-react";
/**
 * IslandMarketHero — a bright, editorial Caribbean-marketplace hero for TriniMarket.
 *
 * Distinct from the existing dark `CinematicHero`: warm cream canvas, a sunset
 * coral → flag-red palette with deep jade accents, oversized display type, an
 * asymmetric grid-breaking layout, floating listing chips, a category marquee
 * and a live "Active Listings" counter.
 */

// Scoped display + body pairing (not the global Space Grotesk / Inter).
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-island-display",
  display: "swap",
});

const body = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-island-body",
  display: "swap",
});

const SCOPED_STYLES = `
  .island-hero {
    --im-cream: #FBF3E7;
    --im-cream-deep: #F4E6D2;
    --im-ink: #1A1410;
    --im-coral: #F0533A;
    --im-coral-deep: #D2321C;
    --im-jade: #0F6E5C;
    --im-jade-deep: #0A4E41;
    --im-gold: #E8A427;
    --im-muted: #6B5E50;
    --font-island-display: var(--font-island-display), "Space Grotesk", system-ui, sans-serif;
    --font-island-body: var(--font-island-body), "Inter", system-ui, sans-serif;
  }

  /* ---- Entrance reveal (CSS-only, GSAP-independent) ---- */
  .im-reveal { opacity: 0; transform: translateY(28px); }
  .island-hero.is-ready .im-reveal {
    animation: imRise 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: var(--im-delay, 0s);
  }
  @keyframes imRise {
    to { opacity: 1; transform: translateY(0); }
  }

  .im-clip { clip-path: inset(0 100% 0 0); }
  .island-hero.is-ready .im-clip {
    animation: imClip 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
    animation-delay: var(--im-delay, 0s);
  }
  @keyframes imClip { to { clip-path: inset(0 0 0 0); } }

  /* ---- Floating chips ---- */
  .im-float { animation: imFloat 7s ease-in-out infinite; }
  .im-float-slow { animation: imFloat 9s ease-in-out infinite; animation-delay: -2s; }
  @keyframes imFloat {
    0%, 100% { transform: translateY(0) rotate(var(--im-rot, 0deg)); }
    50% { transform: translateY(-14px) rotate(var(--im-rot, 0deg)); }
  }

  /* ---- Marquee ---- */
  .im-marquee-track {
    display: flex;
    width: max-content;
    animation: imMarquee 32s linear infinite;
  }
  @keyframes imMarquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .im-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 30;
    opacity: 0.06; mix-blend-mode: multiply;
    background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%25" height="100%25" filter="url(%23n)"/></svg>');
  }

  .im-pulse-dot {
    box-shadow: 0 0 0 0 rgba(15, 110, 92, 0.55);
    animation: imPulse 2.4s ease-out infinite;
  }
  @keyframes imPulse {
    0% { box-shadow: 0 0 0 0 rgba(15, 110, 92, 0.5); }
    70% { box-shadow: 0 0 0 9px rgba(15, 110, 92, 0); }
    100% { box-shadow: 0 0 0 0 rgba(15, 110, 92, 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .island-hero .im-reveal,
    .island-hero.is-ready .im-reveal { opacity: 1 !important; transform: none !important; animation: none !important; }
    .island-hero .im-clip,
    .island-hero.is-ready .im-clip { clip-path: none !important; animation: none !important; }
    .im-float, .im-float-slow, .im-marquee-track, .im-pulse-dot { animation: none !important; }
  }
`;

export interface IslandMarketHeroProps
  extends React.HTMLAttributes<HTMLElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaHref?: string;
}

const CATEGORIES = [
  { label: "Vehicles", icon: Car },
  { label: "Real Estate", icon: Home },
  { label: "Tech", icon: Cpu },
  { label: "Food", icon: UtensilsCrossed },
  { label: "Services", icon: Wrench },
];

export function IslandMarketHero({
  brandName = "TriniMarket",
  tagline1 = "Buy & sell locally,",
  tagline2 = "right here.",
  cardHeading = "The Trinidad & Tobago marketplace.",
  cardDescription = (
    <>
      <span className="font-semibold text-[var(--im-ink)]">TriniMarket</span>{" "}
      connects buyers and sellers across Trinidad &amp; Tobago — vehicles, real
      estate, tech, food, services and more.
    </>
  ),
  metricValue = 2847,
  metricLabel = "Active Listings",
  ctaHeading = "Start selling today.",
  ctaDescription = "Post your listing in minutes. Reach thousands of buyers across T&T.",
  ctaHref = "/listings/new",
  className,
  ...props
}: IslandMarketHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // Lazy init avoids a synchronous setState in the reduced-motion branch:
  // when motion is reduced the metric simply starts at its final value.
  const [count, setCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? metricValue
      : 0;
  });

  // Mark ready on mount so CSS reveal animations fire.
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Animated metric counter — skipped entirely when motion is reduced.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: metricValue,
      duration: 2,
      delay: 0.6,
      ease: "power3.out",
      onUpdate: () => setCount(Math.round(obj.v)),
    });
    return () => {
      tween.kill();
    };
  }, [metricValue]);

  // Subtle parallax tilt of the showcase stage on pointer move.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(stage, {
          rotationY: x * 5,
          rotationX: -y * 5,
          ease: "power3.out",
          duration: 1,
        });
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="island-hero-heading"
      className={[
        "island-hero relative isolate w-full overflow-hidden",
        display.variable,
        body.variable,
        ready ? "is-ready" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: "var(--im-cream)",
        color: "var(--im-ink)",
        fontFamily: "var(--font-island-body)",
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: SCOPED_STYLES }} />

      {/* Atmospheric background layers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Warm sunset bloom, anchored top-right */}
        <div
          className="absolute -right-[10%] -top-[20%] h-[70vh] w-[70vh] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(240,83,58,0.42), rgba(232,164,39,0.28) 45%, transparent 70%)",
          }}
        />
        {/* Jade pool, bottom-left */}
        <div
          className="absolute -bottom-[25%] -left-[10%] h-[60vh] w-[60vh] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(15,110,92,0.30), transparent 70%)",
          }}
        />
        {/* Dot-grid texture, masked */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(26,20,16,0.16) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse 90% 80% at 30% 35%, black 10%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 30% 35%, black 10%, transparent 75%)",
          }}
        />
      </div>
      <div className="im-grain" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-5 pb-10 pt-28 sm:px-8 lg:px-10 lg:pt-32">
        {/* Eyebrow */}
        <div
          className="im-reveal mb-8 flex flex-wrap items-center gap-3"
          style={{ ["--im-delay" as string]: "0.05s" }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
            style={{
              backgroundColor: "rgba(15,110,92,0.10)",
              color: "var(--im-jade-deep)",
            }}
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Trinidad &amp; Tobago
          </span>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
            style={{ color: "var(--im-muted)" }}
          >
            <span
              className="im-pulse-dot h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--im-jade)" }}
              aria-hidden="true"
            />
            Live across the islands · priced in TTD
          </span>
        </div>

        {/* Main grid: headline + showcase */}
        <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left: headline column */}
          <div className="lg:col-span-6">
            <h1
              id="island-hero-heading"
              className="font-[family-name:var(--font-island-display)] text-[clamp(2.8rem,9vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.03em]"
            >
              <span
                className="im-reveal block"
                style={{ ["--im-delay" as string]: "0.15s" }}
              >
                {tagline1}
              </span>
              <span
                className="im-clip mt-1 block"
                style={{
                  ["--im-delay" as string]: "0.45s",
                  color: "var(--im-coral)",
                }}
              >
                {tagline2}
              </span>
            </h1>

            <p
              className="im-reveal mt-7 max-w-md text-base leading-relaxed sm:text-lg"
              style={{
                color: "var(--im-muted)",
                ["--im-delay" as string]: "0.6s",
              }}
            >
              {cardDescription}
            </p>

            {/* Search */}
            <form
              action="/listings"
              method="GET"
              role="search"
              aria-label="Search listings"
              className="im-reveal mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row"
              style={{ ["--im-delay" as string]: "0.7s" }}
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--im-muted)" }}
                  aria-hidden="true"
                />
                <label htmlFor="island-hero-search" className="sr-only">
                  Search listings
                </label>
                <input
                  id="island-hero-search"
                  type="text"
                  name="q"
                  placeholder="Search vehicles, homes, tech…"
                  className="w-full rounded-full border bg-white/80 py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--im-ink)] shadow-sm outline-none transition focus:border-[var(--im-jade)] focus:ring-2 focus:ring-[var(--im-jade)]/30"
                  style={{ borderColor: "rgba(26,20,16,0.14)" }}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--im-coral)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--im-cream)]"
                style={{ backgroundColor: "var(--im-ink)" }}
              >
                Search
              </button>
            </form>

            {/* CTA + metric */}
            <div
              className="im-reveal mt-9 flex flex-wrap items-center gap-x-6 gap-y-5"
              style={{ ["--im-delay" as string]: "0.8s" }}
            >
              <a
                href={ctaHref}
                aria-label={`${ctaHeading} ${ctaDescription}`}
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--im-coral-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--im-cream)]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--im-coral) 0%, var(--im-coral-deep) 100%)",
                }}
              >
                {ctaHeading}
                <ArrowUpRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <div className="flex items-center gap-3">
                <div
                  className="font-[family-name:var(--font-island-display)] text-4xl font-extrabold tracking-tight"
                  style={{ color: "var(--im-jade-deep)" }}
                >
                  {count.toLocaleString("en-US")}
                  <span style={{ color: "var(--im-gold)" }}>+</span>
                </div>
                <div
                  className="text-xs font-semibold uppercase leading-tight tracking-[0.12em]"
                  style={{ color: "var(--im-muted)" }}
                >
                  {metricLabel}
                  <br />
                  <span className="font-normal normal-case tracking-normal">
                    updated daily
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: showcase stage with floating listing chips */}
          <div className="relative lg:col-span-6">
            <div
              ref={stageRef}
              className="im-reveal relative mx-auto aspect-[5/6] w-full max-w-md [transform-style:preserve-3d]"
              style={{ ["--im-delay" as string]: "0.4s", perspective: "1200px" }}
            >
              {/* Hero feature card */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[2rem] p-7 shadow-2xl"
                style={{
                  background:
                    "linear-gradient(160deg, var(--im-jade) 0%, var(--im-jade-deep) 100%)",
                  boxShadow:
                    "0 40px 80px -28px rgba(10,78,65,0.6), inset 0 1px 1px rgba(255,255,255,0.18)",
                }}
              >
                <div
                  className="absolute -right-10 -top-10 h-44 w-44 rounded-full blur-2xl"
                  style={{ background: "rgba(232,164,39,0.35)" }}
                  aria-hidden="true"
                />
                <div className="relative flex h-full flex-col justify-between text-white">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
                      Featured
                    </span>
                    <h2 className="mt-5 font-[family-name:var(--font-island-display)] text-2xl font-bold leading-tight sm:text-3xl">
                      {cardHeading}
                    </h2>
                  </div>

                  {/* Brand wordmark */}
                  <div className="font-[family-name:var(--font-island-display)] text-[clamp(2.2rem,7vw,3.4rem)] font-extrabold uppercase leading-none tracking-tight text-white/90">
                    {brandName}
                  </div>

                  {/* Category pills inside the card */}
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(({ label, icon: Icon }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur"
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating chip — new listing */}
              <div
                className="im-float absolute -left-4 top-10 w-52 rounded-2xl bg-white/90 p-3.5 shadow-xl backdrop-blur sm:-left-8"
                style={{
                  ["--im-rot" as string]: "-4deg",
                  boxShadow: "0 24px 50px -18px rgba(26,20,16,0.35)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: "var(--im-coral)" }}
                    aria-hidden="true"
                  >
                    <Car className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--im-ink)]">
                      Toyota Hilux 2019
                    </p>
                    <p className="text-xs font-medium" style={{ color: "var(--im-jade-deep)" }}>
                      TTD&nbsp;185,000
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating chip — second listing */}
              <div
                className="im-float-slow absolute -right-3 bottom-12 w-48 rounded-2xl bg-white/90 p-3.5 shadow-xl backdrop-blur sm:-right-7"
                style={{
                  ["--im-rot" as string]: "5deg",
                  boxShadow: "0 24px 50px -18px rgba(26,20,16,0.35)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: "var(--im-gold)" }}
                    aria-hidden="true"
                  >
                    <Home className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--im-ink)]">
                      Apartment · Diego Martin
                    </p>
                    <p className="text-xs font-medium" style={{ color: "var(--im-jade-deep)" }}>
                      TTD&nbsp;4,500/mo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category marquee */}
        <div
          className="im-reveal relative mt-12 overflow-hidden"
          style={{
            ["--im-delay" as string]: "0.9s",
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
          aria-hidden="true"
        >
          <div className="im-marquee-track items-center gap-8 py-2">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex items-center gap-8">
                {[
                  "Vehicles",
                  "Real Estate",
                  "Tech & Gadgets",
                  "Local Food",
                  "Services",
                  "Fashion",
                  "Home & Garden",
                ].map((c) => (
                  <span
                    key={`${dup}-${c}`}
                    className="flex items-center gap-8 whitespace-nowrap font-[family-name:var(--font-island-display)] text-lg font-semibold uppercase tracking-wide"
                    style={{ color: "var(--im-muted)" }}
                  >
                    {c}
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--im-coral)" }}
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
