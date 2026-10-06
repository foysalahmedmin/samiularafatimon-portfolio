import type { Contact } from "./schema/pages";

export const contact: Contact = {
  hero: {
    kicker: "Contact",
    title: "Let's cut something good.",
    lede: "Tell me about the project. I reply within 24 hours.",
  },
  form: {
    nameLabel: "Your name",
    emailLabel: "Email",
    projectTypeLabel: "Project type",
    budgetLabel: "Budget",
    messageLabel: "About the project",
    messagePlaceholder: "What are you making, who is it for, and when do you need it?",
    submitLabel: "Send message",
    sendingLabel: "Sending",
    optionalLabel: "Optional",
    projectTypes: [
      "Short-form video",
      "Long-form YouTube",
      "Podcast editing",
      "Motion graphics",
      "Brand commercial",
      "Corporate video",
      "Something else",
    ],
    budgets: ["Under $100", "$100 – $500", "$500 – $1,000", "$1,000 – $5,000", "$5,000+"],
  },
  states: {
    success: "Sent. I reply within 24 hours.",
    failure: "That didn't send. Try again, or message me on WhatsApp.",
    invalid: "Check the highlighted fields and send it again.",
  },
  alternatives: {
    title: "Prefer another way?",
    callLabel: "Book a free 30-minute call",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    copiedLabel: "Copied",
    clockLabel: "Dhaka",
  },
};
