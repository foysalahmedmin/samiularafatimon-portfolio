import type { Legal } from "./schema/pages";

const reviewNote =
  "Drafted in plain language from how the site actually works. Have it checked by someone qualified before launch, and confirm the hosting and email providers named here.";

export const legal: Legal = {
  privacy: {
    needsReview: true,
    reviewNote,
    kicker: "Privacy",
    title: "Your information, in plain language.",
    lede: "This page says what this site collects, why, and who else touches it. It is short because there isn't much.",
    updatedLabel: "Last updated",
    updated: "6 October 2026",
    sections: [
      {
        id: "what-is-collected",
        heading: "What this site collects",
        body: [
          "If you use the contact form, I receive what you type: your name, email address, project type, budget and message.",
          "Like any website, the hosting provider keeps standard server logs (such as IP address and browser type) for security and reliability.",
        ],
      },
      {
        id: "how-it-is-used",
        heading: "What I do with it",
        body: [
          "I use your message to reply to you and to talk about your project. I do not sell your information, and I do not add you to a mailing list unless you ask me to.",
        ],
      },
      {
        id: "who-else",
        heading: "Who else handles it",
        body: [
          "The site is hosted on Vercel. Contact-form messages are delivered by email through Resend. If you book a call, Calendly handles that booking under its own privacy policy.",
          "Videos from YouTube load only after you press play, and use YouTube's privacy-enhanced mode. Fonts are served from this site, not from a third party.",
        ],
      },
      {
        id: "cookies",
        heading: "Cookies and tracking",
        body: [
          "This site does not use advertising or tracking cookies. The opening animation remembers that you have seen it for the length of your visit, using your browser's session storage. That value never leaves your device.",
        ],
      },
      {
        id: "how-long",
        heading: "How long I keep it",
        body: ["I keep a message for as long as it is useful for the enquiry and any follow-up, and delete it when you ask."],
      },
      {
        id: "your-rights",
        heading: "Your choices",
        body: [
          "You can ask to see, correct or delete what I hold about you at any time. Email {email} and I will reply within 24 hours.",
        ],
      },
    ],
  },
  terms: {
    needsReview: true,
    reviewNote,
    kicker: "Terms",
    title: "The ground rules, in plain language.",
    lede: "These terms cover using this website. Working on a project together is agreed separately, in writing, for each project.",
    updatedLabel: "Last updated",
    updated: "6 October 2026",
    sections: [
      {
        id: "using-the-site",
        heading: "Using this site",
        body: [
          "The information here is general. It describes the work and services of Samiul Arafat Imon and Montage Motion and may change without notice.",
          "Videos, thumbnails, logos and names of clients belong to their owners and appear here with their permission to show past work. Please do not copy or reuse them.",
        ],
      },
      {
        id: "projects",
        heading: "Working together",
        body: [
          "Scope, price, revisions, delivery dates and payment are agreed in writing before a project starts. Packages and plans on this site describe what each level usually includes; they are not an offer until we agree on a specific project.",
        ],
      },
      {
        id: "no-guarantees",
        heading: "No guarantees about results",
        body: [
          "A good edit helps, but views, growth and sales depend on many things outside an editor's control. Case studies describe what was made and how it landed for that client; they are not a promise of the same result.",
        ],
      },
      {
        id: "links",
        heading: "Links to other sites",
        body: ["This site links to other websites. I am not responsible for their content or how they handle your information."],
      },
      {
        id: "changes",
        heading: "Changes",
        body: ["If these terms change, the date at the top of this page changes with them."],
      },
      {
        id: "contact",
        heading: "Questions",
        body: ["Email {email}."],
      },
    ],
  },
};
