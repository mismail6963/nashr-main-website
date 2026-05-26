// WhatsApp pre-filled message is bilingual (EN then a blank line then AR),
// so both locales use the same URL. The Arabic text spelling 'نَشر' keeps
// the brand mark without the sukun for natural mobile-keyboard rendering.
const whatsappMessage =
  "Hi NASHR, I'm interested in improving my company's website and would like to learn how you can help.\n\n" +
  "مرحباً نَشر، مهتم أطور موقع شركتي وأخليه احترافي أكثر، وودي أعرف كيف تقدرون تساعدوني.";

export const CONTACT = {
  calcom: "https://cal.com/nashr/free-mockup-walkthrough-call",
  whatsapp: `https://wa.me/966555987440?text=${encodeURIComponent(whatsappMessage)}`,
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
    // WhatsApp URL is identical in both locales (bilingual pre-filled text).
    whatsapp: CONTACT.whatsapp,
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
