interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="page-hero relative overflow-hidden py-20 sm:py-28 px-4 text-center">
      {/* Theme-aware backdrop */}
      <style>{`
        .page-hero {
          background: #ffffff;
        }
        .page-hero-glow {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(220,38,38,0.12) 0%, transparent 70%);
        }
        .page-hero-dots {
          background-image: radial-gradient(circle, rgba(220,38,38,0.15) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        [data-theme="dark"] .page-hero {
          background: #111111;
        }
        [data-theme="dark"] .page-hero-glow {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(220,38,38,0.28) 0%, transparent 70%);
        }
        [data-theme="dark"] .page-hero-dots {
          background-image: radial-gradient(circle, rgba(220,38,38,0.2) 1px, transparent 1px);
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .page-hero { background: #111111; }
          :root:not([data-theme="light"]) .page-hero-glow {
            background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(220,38,38,0.28) 0%, transparent 70%);
          }
          :root:not([data-theme="light"]) .page-hero-dots {
            background-image: radial-gradient(circle, rgba(220,38,38,0.2) 1px, transparent 1px);
          }
        }
        .page-hero-eyebrow {
          color: #dc2626;
          border-color: rgba(220,38,38,0.25);
          background: rgba(220,38,38,0.06);
        }
        .page-hero-title { color: #111827; }
        .page-hero-sub { color: #6b7280; }
        [data-theme="dark"] .page-hero-eyebrow {
          color: #fca5a5;
          border-color: rgba(220,38,38,0.3);
          background: rgba(220,38,38,0.12);
        }
        [data-theme="dark"] .page-hero-title { color: #f9fafb; }
        [data-theme="dark"] .page-hero-sub { color: rgba(255,255,255,0.45); }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .page-hero-eyebrow {
            color: #fca5a5;
            border-color: rgba(220,38,38,0.3);
            background: rgba(220,38,38,0.12);
          }
          :root:not([data-theme="light"]) .page-hero-title { color: #f9fafb; }
          :root:not([data-theme="light"]) .page-hero-sub { color: rgba(255,255,255,0.45); }
        }
      `}</style>

      {/* Glow layer */}
      <div className="page-hero-glow absolute inset-0 pointer-events-none" />
      {/* Dot pattern */}
      <div className="page-hero-dots absolute inset-0 opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {eyebrow && (
          <span className="page-hero-eyebrow inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border">
            {eyebrow}
          </span>
        )}
        <h1 className="page-hero-title font-display font-bold text-4xl sm:text-5xl leading-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="page-hero-sub text-lg max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
