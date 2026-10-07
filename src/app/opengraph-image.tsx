import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";

export const alt = "Samiul Arafat Imon: video editor and founder of Montage Motion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share card: name, role, a timecode. Colours come from the brand tokens. */
export default async function OpenGraphImage() {
  const site = await getSite();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#050d14",
          color: "#e9f1f5",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8ca3b1", letterSpacing: 4 }}>
          <span>{site.role.toUpperCase()}</span>
          <span style={{ color: "#1fb5dd" }}>00:00:00:00</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4 }}>
          <span>Samiul</span>
          <span>Arafat Imon</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30 }}>
          <span style={{ width: 14, height: 14, borderRadius: 14, background: "#ff5a47" }} />
          <span>{site.tagline}</span>
        </div>
      </div>
    ),
    size,
  );
}
