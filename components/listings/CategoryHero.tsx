import Link from "next/link";
import { Car, Home, Laptop, Shirt, UtensilsCrossed, Wrench, Sofa, Bike, Truck, Building2, Smartphone, Camera, Gamepad2, ShoppingBag, Leaf, Dumbbell, Waves } from "lucide-react";

interface CategoryMeta {
  Icon: React.ElementType;
  BgIcons: React.ElementType[];
  gradient: string;
  description: string;
}

const META: Record<string, CategoryMeta> = {
  Vehicles: {
    Icon: Car,
    BgIcons: [Car, Truck, Bike],
    gradient: "from-blue-900 via-blue-800 to-slate-900",
    description: "Cars, trucks, SUVs, motorcycles, and more from sellers across T&T.",
  },
  "Real Estate": {
    Icon: Home,
    BgIcons: [Home, Building2, Building2],
    gradient: "from-emerald-900 via-teal-800 to-slate-900",
    description: "Apartments, houses, land, and commercial property for sale or rent.",
  },
  Electronics: {
    Icon: Laptop,
    BgIcons: [Smartphone, Laptop, Gamepad2],
    gradient: "from-violet-900 via-purple-800 to-slate-900",
    description: "Phones, laptops, gaming, cameras, and the latest tech deals.",
  },
  Fashion: {
    Icon: Shirt,
    BgIcons: [Shirt, ShoppingBag, ShoppingBag],
    gradient: "from-pink-900 via-rose-800 to-slate-900",
    description: "Clothing, shoes, bags, accessories, and designer brands.",
  },
  "Food & Beverage": {
    Icon: UtensilsCrossed,
    BgIcons: [UtensilsCrossed, UtensilsCrossed, Camera],
    gradient: "from-orange-900 via-amber-800 to-slate-900",
    description: "Local produce, packaged goods, catering services, and more.",
  },
  Services: {
    Icon: Wrench,
    BgIcons: [Wrench, Wrench, Wrench],
    gradient: "from-gray-800 via-gray-700 to-slate-900",
    description: "Contractors, tutors, freelancers, and skilled tradespeople.",
  },
  "Home & Garden": {
    Icon: Sofa,
    BgIcons: [Sofa, Leaf, Leaf],
    gradient: "from-green-900 via-lime-800 to-slate-900",
    description: "Furniture, appliances, décor, garden supplies, and tools.",
  },
  "Sports & Outdoors": {
    Icon: Dumbbell,
    BgIcons: [Dumbbell, Waves, Bike],
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

  const [BgA, BgB, BgC] = meta.BgIcons;

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

      {/* Floating background icons */}
      <div aria-hidden="true" className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-8 opacity-10 pointer-events-none select-none">
        <BgA className="w-16 h-16 text-white" strokeWidth={1} />
        <BgB className="w-20 h-20 text-white" strokeWidth={1} />
        <BgC className="w-14 h-14 text-white" strokeWidth={1} />
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
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
            <meta.Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={1.5} />
          </div>
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
