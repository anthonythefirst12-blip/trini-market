"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { gsap } from "gsap";
import { ArrowUpRight, Car, Home, Cpu, UtensilsCrossed, Wrench, MapPin, Search } from "lucide-react";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-island-display",
  display: "swap",
});

const SCOPED_STYLES = `
  /* ── Light mode tokens ── */
  .island-hero {
    --ih-bg:          #ffffff;
    --ih-bg-subtle:   #f9fafb;
    --ih-ink:         #111827;
    --ih-muted:       #6b7280;
    --ih-border:      rgba(17,24,39,0.10);
    --ih-red:         #dc2626;
    --ih-red-deep:    #b91c1c;
    --ih-red-glow:    rgba(220,38,38,0.18);
    --ih-chip-bg:     rgba(255,255,255,0.92);
    --ih-chip-shadow: 0 20px 48px -16px rgba(17,24,39,0.22);
    --ih-card-from:   #111827;
    --ih-card-to:     #1f2937;
    --ih-card-shine:  rgba(220,38,38,0.25);
    --ih-pill-bg:     rgba(220,38,38,0.08);
    --ih-pill-color:  #b91c1c;
    --ih-dot-color:   #dc2626;
    --ih-gold:        #d97706;
  }

  /* ── Dark mode overrides ── */
  [data-theme="dark"] .island-hero {
    --ih-bg:          #111111;
    --ih-bg-subtle:   #161616;
    --ih-ink:         #f0f0f0;
    --ih-muted:       #9ca3af;
    --ih-border:      rgba(255,255,255,0.08);
    --ih-red-glow:    rgba(220,38,38,0.25);
    --ih-chip-bg:     rgba(28,28,28,0.95);
    --ih-chip-shadow: 0 20px 48px -16px rgba(0,0,0,0.6);
    --ih-card-from:   #1c1c1c;
    --ih-card-to:     #242424;
    --ih-card-shine:  rgba(220,38,38,0.30);
    --ih-pill-bg:     rgba(220,38,38,0.12);
    --ih-pill-color:  #fca5a5;
    --ih-dot-color:   #ef4444;
    --ih-gold:        #f59e0b;
  }

  /* ── Entrance animations ── */
  .im-reveal { opacity: 0; transform: translateY(28px); }
  .island-hero.is-ready .im-reveal {
    animation: imRise 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: var(--im-delay, 0s);
  }
  @keyframes imRise { to { opacity: 1; transform: translateY(0); } }

  .im-clip { clip-path: inset(0 100% 0 0); }
  .island-hero.is-ready .im-clip {
    animation: imClip 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
    animation-delay: var(--im-delay, 0s);
  }
  @keyframes imClip { to { clip-path: inset(0 0 0 0); } }

  /* ── Floating chips ── */
  .im-float { animation: imFloat 7s ease-in-out infinite; }
  .im-float-slow { animation: imFloat 9s ease-in-out infinite; animation-delay: -2s; }
  @keyframes imFloat {
    0%, 100% { transform: translateY(0) rotate(var(--im-rot, 0deg)); }
    50%       { transform: translateY(-14px) rotate(var(--im-rot, 0deg)); }
  }

  /* ── Marquee ── */
  .im-marquee-track {
    display: flex;
    width: max-content;
    animation: imMarquee 32s linear infinite;
  }
  @keyframes imMarquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── Pulse dot ── */
  .im-pulse-dot {
    animation: imPulse 2.4s ease-out infinite;
  }
  @keyframes imPulse {
    0%   { box-shadow: 0 0 0 0   rgba(220,38,38,0.5); }
    70%  { box-shadow: 0 0 0 9px rgba(220,38,38,0); }
    100% { box-shadow: 0 0 0 0   rgba(220,38,38,0); }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .island-hero .im-reveal,
    .island-hero.is-ready .im-reveal { opacity:1 !important; transform:none !important; animation:none !important; }
    .island-hero .im-clip,
    .island-hero.is-ready .im-clip   { clip-path:none !important; animation:none !important; }
    .im-float, .im-float-slow, .im-marquee-track, .im-pulse-dot { animation:none !important; }
  }
`;

const CATEGORIES = [
  { label: "Vehicles",    icon: Car },
  { label: "Real Estate", icon: Home },
  { label: "Tech",        icon: Cpu },
  { label: "Food",        icon: UtensilsCrossed },
  { label: "Services",    icon: Wrench },
];

interface Props { listingCount?: number; }

export function IslandHero({ listingCount = 0 }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady]   = useState(false);
  const [count, setCount]   = useState(() => {
    if (typeof window === "undefined") return 0;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? listingCount : 0;
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: listingCount, duration: 2, delay: 0.6, ease: "power3.out",
      onUpdate: () => setCount(Math.round(obj.v)),
    });
    return () => { tween.kill(); };
  }, [listingCount]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth  - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(stage, { rotationY: x * 5, rotationX: -y * 5, ease: "power3.out", duration: 1 });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section
      aria-labelledby="island-hero-heading"
      className={["island-hero relative isolate w-full overflow-hidden", display.variable, ready ? "is-ready" : ""].filter(Boolean).join(" ")}
      style={{ backgroundColor: "var(--ih-bg)", color: "var(--ih-ink)", transition: "background-color 0.2s ease, color 0.2s ease" }}
    >
      <style dangerouslySetInnerHTML={{ __html: SCOPED_STYLES }} />

      {/* Background atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Red glow top-right */}
        <div className="absolute -right-[10%] -top-[15%] h-[60vh] w-[60vh] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, var(--ih-red-glow) 0%, transparent 70%)" }} />
        {/* Subtle red bottom-left */}
        <div className="absolute -bottom-[20%] -left-[8%] h-[50vh] w-[50vh] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, var(--ih-red-glow) 0%, transparent 70%)" }} />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--ih-border) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 80% 70% at 30% 30%, black 10%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 30% 30%, black 10%, transparent 75%)",
          }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[85svh] w-full max-w-7xl flex-col px-5 pb-8 pt-20 sm:px-8 sm:pt-24 lg:min-h-[100svh] lg:px-10 lg:pt-32">

        {/* Eyebrow */}
        <div className="im-reveal mb-5 flex flex-wrap items-center gap-3 lg:mb-8" style={{ ["--im-delay" as string]: "0.05s" }}>
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ backgroundColor: "var(--ih-pill-bg)", color: "var(--ih-pill-color)" }}>
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Trinidad &amp; Tobago
          </span>
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
            style={{ color: "var(--ih-muted)" }}>
            <span className="im-pulse-dot h-2 w-2 rounded-full inline-block" style={{ backgroundColor: "var(--ih-dot-color)" }} aria-hidden="true" />
            Live across the islands · priced in TTD
          </span>
        </div>

        {/* Main grid */}
        <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">

          {/* Left: headline */}
          <div className="lg:col-span-6">
            <h1 id="island-hero-heading"
              className="font-[family-name:var(--font-island-display)] text-[clamp(2.2rem,8vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.03em]"
              style={{ color: "var(--ih-ink)" }}>
              <span className="im-reveal block" style={{ ["--im-delay" as string]: "0.15s" }}>
                Buy &amp; sell locally,
              </span>
              <span className="im-clip mt-1 block" style={{ ["--im-delay" as string]: "0.45s", color: "var(--ih-red)" }}>
                right here.
              </span>
            </h1>

            <p className="im-reveal mt-4 max-w-md text-sm leading-relaxed sm:mt-7 sm:text-base lg:text-lg"
              style={{ color: "var(--ih-muted)", ["--im-delay" as string]: "0.6s" }}>
              <span className="font-semibold" style={{ color: "var(--ih-ink)" }}>TriniSell</span>{" "}
              connects buyers and sellers across Trinidad &amp; Tobago — vehicles, real estate, tech, food, services and more.
            </p>

            {/* Search */}
            <form action="/listings" method="GET" role="search" aria-label="Search listings"
              className="im-reveal mt-5 flex max-w-md flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-2.5"
              style={{ ["--im-delay" as string]: "0.7s" }}>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--ih-muted)" }} aria-hidden="true" />
                <label htmlFor="island-hero-search" className="sr-only">Search listings</label>
                <input
                  id="island-hero-search"
                  type="text"
                  name="search"
                  placeholder="Search vehicles, homes, tech…"
                  className="w-full rounded-full py-3.5 pl-11 pr-4 text-sm font-medium shadow-sm outline-none transition"
                  style={{
                    background: "var(--ih-bg)",
                    color: "var(--ih-ink)",
                    border: "1.5px solid var(--ih-border)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--ih-red)"; e.target.style.boxShadow = "0 0 0 3px var(--ih-red-glow)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "var(--ih-border)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <button type="submit"
                className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none"
                style={{ background: "var(--ih-red)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--ih-red-deep)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--ih-red)"; }}>
                Search
              </button>
            </form>

            {/* CTA + counter */}
            <div className="im-reveal mt-5 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-9"
              style={{ ["--im-delay" as string]: "0.8s" }}>
              <a href="/listings/new"
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none"
                style={{ background: "linear-gradient(135deg, var(--ih-red) 0%, var(--ih-red-deep) 100%)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px var(--ih-red-glow)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
                Start selling today.
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>

              <div className="flex items-center gap-3">
                <div className="font-[family-name:var(--font-island-display)] text-4xl font-extrabold tracking-tight"
                  style={{ color: "var(--ih-ink)" }}>
                  {count.toLocaleString("en-US")}
                  <span style={{ color: "var(--ih-red)" }}>+</span>
                </div>
                <div className="text-xs font-semibold uppercase leading-tight tracking-[0.12em]"
                  style={{ color: "var(--ih-muted)" }}>
                  Active Listings<br />
                  <span className="font-normal normal-case tracking-normal">updated daily</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: showcase card — hidden on mobile to keep hero compact */}
          <div className="relative hidden lg:col-span-6 lg:block">
            <div ref={stageRef}
              className="im-reveal relative mx-auto aspect-[5/6] w-full max-w-md [transform-style:preserve-3d]"
              style={{ ["--im-delay" as string]: "0.4s", perspective: "1200px" }}>

              {/* Main card */}
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] p-7 shadow-2xl"
                style={{
                  background: "linear-gradient(160deg, var(--ih-card-from) 0%, var(--ih-card-to) 100%)",
                  boxShadow: "0 40px 80px -28px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.06)",
                }}>
                {/* Red accent glow inside card */}
                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl"
                  style={{ background: "var(--ih-card-shine)" }} aria-hidden="true" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full blur-2xl"
                  style={{ background: "var(--ih-card-shine)", opacity: 0.5 }} aria-hidden="true" />

                <div className="relative flex h-full flex-col justify-between text-white">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                      style={{ background: "var(--ih-red)", color: "white" }}>
                      Featured
                    </span>
                    <h2 className="mt-5 font-[family-name:var(--font-island-display)] text-2xl font-bold leading-tight sm:text-3xl"
                      style={{ color: "rgba(255,255,255,0.90)" }}>
                      The Trinidad &amp; Tobago marketplace.
                    </h2>
                  </div>

                  {/* Wordmark */}
                  <div className="font-[family-name:var(--font-island-display)] text-[clamp(2rem,7vw,3.2rem)] font-extrabold uppercase leading-none tracking-tight"
                    style={{ color: "rgba(255,255,255,0.15)" }}>
                    TRINISELL
                  </div>

                  {/* Category pills */}
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(({ label, icon: Icon }) => (
                      <span key={label}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur"
                        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.80)", border: "1px solid rgba(255,255,255,0.10)" }}>
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chip 1 — vehicle */}
              <div className="im-float absolute -left-4 top-10 w-52 rounded-2xl p-3.5 backdrop-blur sm:-left-8"
                style={{ ["--im-rot" as string]: "-4deg", background: "var(--ih-chip-bg)", boxShadow: "var(--ih-chip-shadow)", border: "1px solid var(--ih-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0"
                    style={{ backgroundColor: "var(--ih-red)" }} aria-hidden="true">
                    <Car className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" style={{ color: "var(--ih-ink)" }}>Toyota Hilux 2019</p>
                    <p className="text-xs font-medium" style={{ color: "var(--ih-red)" }}>TTD&nbsp;185,000</p>
                  </div>
                </div>
              </div>

              {/* Chip 2 — real estate */}
              <div className="im-float-slow absolute -right-3 bottom-12 w-48 rounded-2xl p-3.5 backdrop-blur sm:-right-7"
                style={{ ["--im-rot" as string]: "5deg", background: "var(--ih-chip-bg)", boxShadow: "var(--ih-chip-shadow)", border: "1px solid var(--ih-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0"
                    style={{ backgroundColor: "var(--ih-gold)" }} aria-hidden="true">
                    <Home className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" style={{ color: "var(--ih-ink)" }}>Apartment · Diego Martin</p>
                    <p className="text-xs font-medium" style={{ color: "var(--ih-red)" }}>TTD&nbsp;4,500/mo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="im-reveal relative mt-6 overflow-hidden border-t pt-5 lg:mt-12 lg:pt-6"
          style={{
            ["--im-delay" as string]: "0.9s",
            borderColor: "var(--ih-border)",
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
          aria-hidden="true">
          <div className="im-marquee-track items-center gap-8 py-1">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex items-center gap-8">
                {["Vehicles", "Real Estate", "Tech & Gadgets", "Local Food", "Services", "Fashion", "Home & Garden"].map((c) => (
                  <span key={`${dup}-${c}`}
                    className="flex items-center gap-8 whitespace-nowrap font-[family-name:var(--font-island-display)] text-sm font-semibold uppercase tracking-widest"
                    style={{ color: "var(--ih-muted)" }}>
                    {c}
                    <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--ih-red)" }} />
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
