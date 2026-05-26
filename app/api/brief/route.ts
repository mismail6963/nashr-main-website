// app/api/brief/route.ts
//
// POST /api/brief — receives a JSON body from the (yet-to-be-built) brief
// form and emails the lead to LEAD_TO_EMAIL via Resend.
//
// Server-only: the Resend client uses process.env.RESEND_API_KEY which
// is never exposed to the browser. Do not import this file from any
// client component.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const REQUIRED_FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "hasWebsite",
  "needs",
  "message",
] as const;
const MAX_FIELD_LENGTH = 5000;

const escapeHtml = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  );

export async function POST(req: NextRequest) {
  // Verify env vars are present. Construct the Resend client lazily
  // here (rather than at module load) so an unset key returns a clean
  // 500 JSON response instead of crashing the route's exports.
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error("[api/brief] Missing required env vars");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
  const resend = new Resend(apiKey);

  try {
    const data = await req.json();

    // Honeypot — if a bot fills this hidden field, silently "succeed"
    // without sending. Real users never see it.
    if (typeof data._honeypot === "string" && data._honeypot.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    // Required fields
    for (const field of REQUIRED_FIELDS) {
      const v = data[field];
      if (typeof v !== "string" || v.trim() === "") {
        return NextResponse.json(
          { error: `Missing or empty field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Email format — intentionally simple; Resend itself validates further.
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Length sanity — block obvious abuse
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === "string" && v.length > MAX_FIELD_LENGTH) {
        return NextResponse.json(
          { error: `Field too long: ${k}` },
          { status: 400 },
        );
      }
    }

    const timestamp = new Date().toISOString();
    const link = (data.link as string)?.trim() || "—";

    // Plain-text version (for clients that don't render HTML)
    const text = [
      "New NASHR Website Brief Submission",
      "",
      `Name:             ${data.name}`,
      `Company:          ${data.company}`,
      `Email:            ${data.email}`,
      `Phone / WhatsApp: ${data.phone}`,
      `Has website:      ${data.hasWebsite}`,
      `What they need:   ${data.needs}`,
      `Current link:     ${link}`,
      "",
      "Message:",
      data.message,
      "",
      `Submitted: ${timestamp}`,
    ].join("\n");

    // HTML version — keep it simple. Email clients break on fancy CSS.
    const html = `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#121315;color:#e3e2e3;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#1f2021;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:32px;">
    <h1 style="color:#C7B27A;font-size:20px;margin:0 0 24px;font-weight:500;">New NASHR Brief Submission</h1>
    <table cellpadding="0" cellspacing="0" style="width:100%;color:#cfc5b7;font-size:14px;line-height:1.6;">
      <tr><td style="padding:6px 0;font-weight:600;width:42%;">Name</td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Company</td><td>${escapeHtml(data.company)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Email</td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Phone / WhatsApp</td><td>${escapeHtml(data.phone)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Has website</td><td>${escapeHtml(data.hasWebsite)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">What they need</td><td>${escapeHtml(data.needs)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Current site / IG</td><td>${escapeHtml(link)}</td></tr>
    </table>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
      <div style="font-weight:600;color:#cfc5b7;font-size:14px;margin-bottom:8px;">Message</div>
      <div style="color:#cfc5b7;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
    </div>
    <div style="margin-top:24px;color:#8A8F98;font-size:12px;">Submitted: ${timestamp}</div>
  </div>
</body>
</html>
    `.trim();

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: "New NASHR Website Brief Submission",
      text,
      html,
    });

    if (error) {
      console.error("[api/brief] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/brief] Unhandled error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
