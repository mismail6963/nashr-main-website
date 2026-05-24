export const CONTACT = {
  // TODO: replace with NASHR's real Cal.com URL
  calcom: "https://cal.com/nashr/intro",
  // TODO: replace with NASHR's real WhatsApp number
  whatsapp:
    "https://wa.me/9665XXXXXXXX?text=" +
    encodeURIComponent("Hi NASHR, I'd like to talk about a website."),
  whatsappAr:
    "https://wa.me/9665XXXXXXXX?text=" +
    encodeURIComponent("السلام عليكم، أبغى أكلمكم عن موقع."),
  // TODO: replace with NASHR's real email
  email:
    "mailto:hello@nashr.sa?subject=" +
    encodeURIComponent("Website enquiry"),
  emailAr:
    "mailto:hello@nashr.sa?subject=" +
    encodeURIComponent("استفسار عن موقع"),
} as const;

export function getContactLinks(locale: string) {
  const isAr = locale === "ar";
  return {
    calcom: CONTACT.calcom,
    whatsapp: isAr ? CONTACT.whatsappAr : CONTACT.whatsapp,
    email: isAr ? CONTACT.emailAr : CONTACT.email,
  };
}
