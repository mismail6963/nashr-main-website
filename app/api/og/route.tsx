import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "ar" ? "ar" : "en";

  const tagline =
    locale === "ar"
      ? "استوديو تصميم ويب ثنائي اللغة · الرياض"
      : "Bilingual Web Design Studio · Riyadh";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(circle at 80% 20%, rgba(164,143,96,0.25), transparent 60%), radial-gradient(circle at 10% 90%, rgba(12,36,60,0.9), transparent 60%), #07101C",
          color: "#F2EFE8",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              background: "#A48F60",
              borderRadius: 999,
            }}
          />
          <div style={{ fontSize: 36, fontStyle: "italic", letterSpacing: -1 }}>
            NASHR
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: -2,
              fontWeight: 400,
            }}
          >
            {locale === "ar"
              ? "مواقع تحتاجها أعمال السعودية، فعلاً."
              : "Websites Saudi businesses actually need."}
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#A48F60",
              fontFamily: "sans-serif",
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
