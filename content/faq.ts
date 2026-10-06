import type { Faq } from "./schema/pages";

export const faq: Faq = {
  groups: [
    {
      id: "working-together",
      title: "Working together",
      items: [
        {
          id: "delivery-time",
          q: "How fast do you deliver?",
          a: "Standard delivery is 2–5 business days, depending on the package and the length of the video. Rush delivery is available for urgent projects. Tell me your deadline on the first call and I'll confirm what's realistic.",
          needsReview: true,
          reviewNote:
            "Old portfolio says 2–5 business days; the studio site says 24–48 hours to start. Confirm the wording.",
        },
        {
          id: "revisions",
          q: "How many revisions are included?",
          a: "Starter includes 1 revision, Pro includes 3, and the Agency package includes unlimited revisions. I want you to be happy with the final cut.",
        },
        {
          id: "formats",
          q: "What file formats do you deliver?",
          a: "MP4 (H.264 or H.265) and MOV, plus platform-specific exports for YouTube, Instagram, TikTok and broadcast. Project source files are available on request.",
        },
        {
          id: "international",
          q: "Do you work with international clients?",
          a: "Yes. We talk by email, WhatsApp or Zoom, whichever suits you, in any time zone.",
        },
        {
          id: "payment",
          q: "How do I pay?",
          a: "Fiverr, PayPal, bank transfer and bKash are accepted. Larger projects need a 50% deposit before work begins.",
          needsReview: true,
          reviewNote: "From the old portfolio. Confirm the payment methods and the deposit rule.",
        },
        {
          id: "samples",
          q: "Can I see samples before I order?",
          a: "Yes. Browse the work page and the case studies, or ask me for samples closest to your format.",
        },
        {
          id: "start",
          q: "How do we start?",
          a: "Book a free 30-minute call, message me on WhatsApp, or use the contact form. I reply within 24 hours.",
        },
      ],
    },
  ],
};
