import Link from "next/link";

interface CategoryMeta {
  icon: string;
  gradient: string;
  description: string;
  emoji: string;
}

const META: Record<string, CategoryMeta> = {
  Vehicles: {
    icon: "🚗",
    emoji: "🚗 🚙 🏍️",
    gradient: "from-blue-900 via-blue-800 to-slate-900",
    description: "Cars, trucks, SUVs, motorcycles, and more from sellers across T&T.",
  },
  "Real Estate": {
    icon: "🏠",
    emoji: "🏠 🏡 🏗️",
    gradient: "from-emerald-900 via-teal-800 to-slate-900",
    description: "Apartments, houses, land, and commercial property for sale or rent.",
  },
  Electronics: {
    icon: "📱",
    emoji: "📱 💻 🎮",
    gradient: "from-violet-900 via-purple-800 to-slate-900",
    description: "Phones, laptops, gaming, cameras, and the latest tech deals.",
  },
  Fashion: {
    icon: "👗",
    emoji: "👗 👟 👜",
    gradient: "from-pink-900 via-rose-800 to-slate-900",
    description: "Clothing, shoes, bags, accessories, and designer brands.",
  },
  "Food & Beverage": {
    icon: "🍽️",
    emoji: "🍽️ 🍰 🌶️",
    gradient: "from-orange-900 via-amber-800 to-slate-900",
    description: "Local produce, packaged goods, catering services, and more.",
  },
  Services: {
    icon: "⚙️",
    emoji: "⚙️ 🔧 🛠️",
    gradient: "from-gray-800 via-gray-700 to-slate-900",
    description: "Contractors, tutors, freelancers, and skilled tradespeople.",
  },
  "Home & Garden": {
    icon: "🌿",
    emoji: "🌿 🪴 🛋️",
    gradient: "from-green-900 via-lime-800 to-slate-900",
    description: "Furniture, appliances, décor, garden supplies, and tools.",
  },
  "Sports & Outdoors": {
    icon: "⚽",
    emoji: "⚽ 🏄 🎾",
    gradient: "from-cyan-900 via-sky-800 to-slate-900",
    description: "Sporting equipment, outdoor gear, gym, water sports, and more.",
  },
};

interface Props {
  category: string;
  count: number;
}

export function CategoryHero({ category, count }: Props) {
  const meta = META[category];
  if (!meta) return null;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient}`}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Floating emoji */}
      <div
        aria-hidden="true"
        className="absolute right-6 top-1/2 -translate-y-1/2 text-5xl opacity-10 select-none pointer-events-none hidden sm:block tracking-wider"
      >
        {meta.emoji}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-4 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/listings" className="hover:text-white/70 transition-colors">Listings</Link>
          <span>/</span>
          <span className="text-white/70">{category}</span>
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-4xl sm:text-5xl shrink-0">{meta.icon}</div>
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">{category}</h1>
            <p className="text-white/50 text-sm mt-1 max-w-md">{meta.description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {count.toLocaleString()} listing{count !== 1 ? "s" : ""} available
          </span>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
          >
            + Sell in {category}
          </Link>
        </div>
      </div>
    </div>
  );
}
