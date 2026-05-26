export const CONTACT = {
  calcom: "https://cal.com/nashr/free-mockup-walkthrough-call",
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

/**
 * Cal.com popup trigger attributes. Spread onto any element to make it
 * open the booking popup on click. The Cal.com embed.js (initialised
 * globally in app/[locale]/layout.tsx) binds the click handler and
 * calls preventDefault itself, so anchors keep working as fallbacks
 * if the script fails to load.
 */
export const CAL = {
  link: "nashr/free-mockup-walkthrough-call",
  namespace: "free-mockup-walkthrough-call",
  config: JSON.stringify({
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
  }),
} as const;
