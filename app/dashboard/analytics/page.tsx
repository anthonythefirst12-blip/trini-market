"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutList,
  MessagesSquare,
  Tag,
  Sparkles,
  Wallet,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  ALL_CATEGORIES,
  TIER_COLORS,
  TIME_RANGES,
  computeMetrics,
  formatTTD,
  type Category,
  type ListingTier,
  type TimeRangeId,
  type TopListing,
} from "./analytics-data";

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}

function KpiCard({ label, value, sub, icon }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        {/* Icon tile uses the brand blue at a low tint for a calm accent. */}
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-700">
          {icon}
        </span>
      </div>
      <div className="font-display font-bold text-2xl text-gray-900 mt-3">
        {value}
      </div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

// Shared card shell for charts so spacing/borders stay consistent.
function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <header className="mb-4">
        <h2 className="font-display font-semibold text-base text-gray-900">
          {title}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </header>
      {children}
    </section>
  );
}

// Consistent recharts tooltip styling matching the app's light cards.
const tooltipContentStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #E5E7EB",
  borderRadius: "0.5rem",
  boxShadow: "0 4px 12px -2px rgba(0,0,0,0.08)",
  fontSize: "12px",
};

// ---------------------------------------------------------------------------
// Sortable top-listings table
// ---------------------------------------------------------------------------

type SortKey = "inquiries" | "comments" | "price";

function TierBadge({ tier }: { tier: ListingTier }) {
  if (tier === "premium")
    return (
      <span className="text-xs bg-blue-700 text-white font-bold px-1.5 py-0.5 rounded">
        ★ Premium
      </span>
    );
  if (tier === "featured")
    return (
      <span className="text-xs bg-blue-100 text-blue-700 border border-blue-300 font-semibold px-1.5 py-0.5 rounded">
        ◆ Featured
      </span>
    );
  return <Badge variant="gray">Free</Badge>;
}

function TopListingsTable({ rows }: { rows: TopListing[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("inquiries");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const factor = dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => (a[sortKey] - b[sortKey]) * factor);
  }, [rows, sortKey, dir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDir("desc");
    }
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (column !== sortKey)
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" aria-hidden />;
    return dir === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-700" aria-hidden />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-700" aria-hidden />
    );
  }

  const numericCols: { key: SortKey; label: string }[] = [
    { key: "inquiries", label: "Inquiries" },
    { key: "comments", label: "Comments" },
    { key: "price", label: "Price" },
  ];

  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <header className="p-5 pb-3">
        <h2 className="font-display font-semibold text-base text-gray-900">
          Top listings by engagement
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Click a column header to sort.
        </p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Listings sorted by {sortKey}, {dir === "asc" ? "ascending" : "descending"}
          </caption>
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50/60 text-left">
              <th scope="col" className="px-5 py-2.5 font-medium text-gray-500">
                Listing
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium text-gray-500">
                Tier
              </th>
              {numericCols.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    sortKey === col.key
                      ? dir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="px-3 py-2.5 font-medium text-gray-500"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors rounded"
                  >
                    {col.label}
                    <SortIcon column={col.key} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  No listings match the current filter.
                </td>
              </tr>
            )}
            {sorted.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-5 py-3 max-w-[260px]">
                  <Link
                    href={`/listings/${row.id}`}
                    className="font-medium text-gray-900 hover:text-blue-700 transition-colors block truncate"
                  >
                    {row.title}
                  </Link>
                  <span className="text-xs text-gray-400">{row.category}</span>
                </td>
                <td className="px-3 py-3">
                  <TierBadge tier={row.tier} />
                </td>
                <td className="px-3 py-3 tabular-nums text-gray-700">
                  {row.inquiries}
                </td>
                <td className="px-3 py-3 tabular-nums text-gray-700">
                  {row.comments}
                </td>
                <td className="px-3 py-3 tabular-nums font-medium text-gray-900">
                  {formatTTD(row.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnalyticsPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [range, setRange] = useState<TimeRangeId>("90d");

  // Recompute every derived metric whenever the filters change.
  const metrics = useMemo(
    () => computeMetrics(category, range),
    [category, range],
  );

  const paidPct = Math.round(metrics.paidShare * 100);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">
              Marketplace Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Insights across all TriniMarket listings, inquiries and spend.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-700 hover:underline self-start sm:self-auto"
          >
            ← Back to dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          {/* Category filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="category-filter"
              className="text-sm font-medium text-gray-600"
            >
              Category
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Category | "all")
              }
              className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 hover:border-gray-300 transition-colors"
            >
              <option value="all">All categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Time-range toggle (segmented control) */}
          <div
            className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit"
            role="group"
            aria-label="Time range"
          >
            {TIME_RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={range === r.id}
                onClick={() => setRange(r.id)}
                className={[
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  range === r.id
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900",
                ].join(" ")}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard
            label="Total Listings"
            value={String(metrics.totalListings)}
            sub={category === "all" ? "All categories" : category}
            icon={<LayoutList className="w-4 h-4" />}
          />
          <KpiCard
            label="Inquiries"
            value={String(metrics.totalInquiries)}
            sub="In selected range"
            icon={<MessagesSquare className="w-4 h-4" />}
          />
          <KpiCard
            label="Avg. Price"
            value={formatTTD(metrics.avgPrice)}
            sub="Per listing"
            icon={<Tag className="w-4 h-4" />}
          />
          <KpiCard
            label="Paid Share"
            value={`${paidPct}%`}
            sub={`${metrics.paidCount} featured / premium`}
            icon={<Sparkles className="w-4 h-4" />}
          />
          <KpiCard
            label="Wallet Spend"
            value={formatTTD(metrics.totalWalletSpend)}
            sub="Promotions in range"
            icon={<Wallet className="w-4 h-4" />}
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Listings by category (bar) */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Listings & inquiries by category"
              description="Catalogue depth vs. buyer interest per category."
            >
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.categoryData}
                    margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
                    barGap={2}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E5E7EB"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="category"
                      stroke="#6B7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#E5E7EB" }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      contentStyle={tooltipContentStyle}
                      cursor={{ fill: "rgba(29,78,216,0.05)" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar
                      dataKey="listings"
                      name="Listings"
                      fill="#1D4ED8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="inquiries"
                      name="Inquiries"
                      fill="#0EA5E9"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Listings by tier (donut) */}
          <ChartCard
            title="Listings by tier"
            description="Mix of free vs. paid promotion tiers."
          >
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.tierData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {metrics.tierData.map((entry) => (
                      <Cell
                        key={entry.tier}
                        fill={TIER_COLORS[entry.tier]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={tooltipContentStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Trend (area) */}
        <div className="mb-6">
          <ChartCard
            title="Inquiries & promotion spend over time"
            description="Daily buyer inquiries and wallet spend within the selected range."
          >
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metrics.trendData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
                >
                  <defs>
                    <linearGradient id="fillInquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    contentStyle={tooltipContentStyle}
                    formatter={(value, name) => {
                      const num = Number(value) || 0;
                      return name === "Spend (TTD)"
                        ? [formatTTD(num), name]
                        : [num, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Area
                    type="monotone"
                    dataKey="inquiries"
                    name="Inquiries"
                    stroke="#1D4ED8"
                    strokeWidth={2}
                    fill="url(#fillInquiries)"
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    name="Spend (TTD)"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#fillSpend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Top listings table */}
        <TopListingsTable rows={metrics.topListings} />
      </div>
    </div>
  );
}
