"use client";

import { useEffect, useRef } from "react";

export function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ["#dc2626", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#ffffff"];
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 3 + Math.random() * 4,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8,
      opacity: 1,
    }));

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      let alive = false;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.vy += 0.12; // gravity
        if (frame > 80) p.opacity -= 0.015;
        if (p.y < canvas.height && p.opacity > 0) alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) animRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[200] pointer-events-none"
    />
  );
}
