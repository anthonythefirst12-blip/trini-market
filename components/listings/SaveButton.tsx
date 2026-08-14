"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface Particle { x: number; y: number; vx: number; vy: number; life: number; }
interface Props { listingId: string; }

function HeartParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = Array.from({ length: 10 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 5,
      vy: -Math.random() * 4 - 2,
      life: 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.03;
        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = "#ef4444";
          ctx.font = "10px sans-serif";
          ctx.fillText("♥", p.x, p.y);
          ctx.restore();
        }
      }
      if (alive) animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      width={60}
      height={60}
      className="absolute -top-4 -left-4 pointer-events-none z-20"
    />
  );
}

export function SaveButton({ listingId }: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [burst, setBurst] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("saved_listings").select("id")
        .eq("user_id", user.id).eq("listing_id", listingId).maybeSingle();
      setSaved(!!data);
      setLoading(false);
    };
    check();
  }, [listingId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/auth/login"; return; }

    const prev = saved;
    setSaved(!prev);
    if (!prev) {
      setBurst(true);
      setTimeout(() => setBurst(false), 1000);
    }

    try {
      if (prev) {
        await supabase.from("saved_listings").delete().eq("user_id", user.id).eq("listing_id", listingId);
      } else {
        await supabase.from("saved_listings").insert({ user_id: user.id, listing_id: listingId });
      }
    } catch {
      setSaved(prev);
    }
  };

  if (loading) return null;

  return (
    <div className="absolute top-2 right-10 z-10">
      <HeartParticles active={burst} />
      <button
        onClick={toggle}
        aria-label={saved ? "Unsave listing" : "Save listing"}
        className={`relative w-7 h-7 rounded-full flex items-center justify-center shadow transition-all duration-200 ${
          saved
            ? "bg-red-500 text-white scale-110 animate-[heartbeat_0.3s_ease-in-out]"
            : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-400 hover:scale-110 active:scale-90"
        }`}
      >
        <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  );
}
