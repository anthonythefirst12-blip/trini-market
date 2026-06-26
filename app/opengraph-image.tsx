import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 900,
              fontSize: 32,
            }}
          >
            TM
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 56, letterSpacing: "-2px" }}>
            Trini<span style={{ color: "#60a5fa" }}>Market</span>
          </span>
        </div>

        <p style={{ color: "#94a3b8", fontSize: 28, margin: 0, textAlign: "center" }}>
          Trinidad &amp; Tobago&apos;s Online Marketplace
        </p>

        <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
          {["🚗 Vehicles", "🏠 Real Estate", "📱 Electronics", "👗 Fashion"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: "10px 20px",
                color: "#cbd5e1",
                fontSize: 18,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
