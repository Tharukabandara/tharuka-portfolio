import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111924 0%, #090c10 100%)",
          borderRadius: "40px",
          border: "4px solid rgba(32, 207, 255, 0.55)",
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 82,
          letterSpacing: "-0.06em",
          color: "#ffffff",
        }}
      >
        <span>T</span>
        <span style={{ color: "#20cfff" }}>B</span>
        <span style={{ color: "#c8ff00" }}>.</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
