"use server";

import { env } from "@/config/env.server";
import { getSite } from "@/lib/content";
import { contactSchema, type ContactState } from "./schema";

/** Validates the message and emails it through Resend. Never throws to the client. */
export async function sendMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "invalid", fields: [...new Set(parsed.error.issues.map((issue) => String(issue.path[0])))] };
  }
  const data = parsed.data;

  // Bots: filled the honeypot, or "submitted" faster than a person can type.
  if (data.website || (data.startedAt && Date.now() - data.startedAt < 2000)) return { status: "success" };

  const site = await getSite();
  const to = env.email.to ?? site.contact.email;
  const { resendApiKey, from } = env.email;

  if (!resendApiKey || !from) {
    console.error("Contact form: RESEND_API_KEY and CONTACT_FROM are not set. Message not sent.");
    return env.isProductionDeployment ? { status: "failure" } : { status: "success" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `New project enquiry from ${data.name}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Project type: ${data.projectType || "-"}`,
          `Budget: ${data.budget || "-"}`,
          "",
          data.message,
        ].join("\n"),
      }),
    });
    return response.ok ? { status: "success" } : { status: "failure" };
  } catch {
    return { status: "failure" };
  }
}
