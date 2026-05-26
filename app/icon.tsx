import { ImageResponse } from "next/og";

// Brand favicon — gold dot mark on the site's deep canvas. Matches the
// header wordmark's leading gold dot. TODO: replace with a hand-crafted
// branded PNG when full brand assets are available.

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "#C7B27A",
          }}
        />
      </div>
    ),
    size,
  );
}
