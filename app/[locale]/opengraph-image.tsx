import { ImageResponse } from "next/og";

// Generated at request time. Next.js auto-emits the corresponding
// <meta property="og:image"> for the parent route's metadata.
// File-convention takes precedence over any explicit images: [] in
// the metadata block — keep that absent so this is the source of truth.

export const alt = "NASHR — Bilingual Web Design Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(circle at 75% 15%, rgba(199,178,122,0.18), transparent 55%), radial-gradient(circle at 10% 90%, rgba(12,36,60,0.85), transparent 60%), #08090A",
          color: "#F7F8F8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#A48F60",
            }}
          />
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            NASHR
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: isAr ? 80 : 92,
              lineHeight: isAr ? 1.15 : 0.98,
              letterSpacing: isAr ? "0" : "-0.04em",
              fontWeight: 500,
            }}
          >
            {isAr
              ? "مواقع تحتاجها أعمال السعودية، فعلاً."
              : "Websites Saudi businesses actually need."}
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C7B27A",
              fontFamily: "monospace",
            }}
          >
            {isAr
              ? "استوديو تصميم مواقع · الرياض"
              : "BILINGUAL WEB DESIGN STUDIO · RIYADH"}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
