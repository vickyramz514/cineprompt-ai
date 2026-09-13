import { ImageResponse } from "next/og";

export const alt = "Data Captain — US ETF Data API for developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0a0a12 0%, #12122a 45%, #1a1040 100%)",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a5b4fc",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Data Captain
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#f8fafc",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            US ETF Data API for builders
          </div>
          <div style={{ color: "#94a3b8", fontSize: 28, maxWidth: 820, lineHeight: 1.35 }}>
            Historical prices · screener · backtesting · portfolio tools — free API key to start
          </div>
        </div>
        <div style={{ display: "flex", color: "#818cf8", fontSize: 22 }}>
          www.datacaptain.in
        </div>
      </div>
    ),
    { ...size }
  );
}
