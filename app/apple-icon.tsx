import { ImageResponse } from "next/og";

// Apple touch icon for iOS home-screen pin. Same brand mark as the
// favicon, sized to 180×180 with extra padding so it looks balanced
// behind iOS's rounded-rect mask.

export const size = { width: 180, height: 180 };
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
          background: "#08090A",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 999,
            background: "#C7B27A",
          }}
        />
      </div>
    ),
    size,
  );
}
