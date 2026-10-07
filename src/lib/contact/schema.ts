import { z } from "zod";

/** Shared by the form (client) and the server action, so both agree on what is valid. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(120),
  email: z.email("email").max(200),
  projectType: z.string().trim().max(80).optional(),
  budget: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10, "message").max(4000),
  /** Honeypot: real visitors never see or fill this. */
  website: z.string().max(0).optional(),
  /** When the form was rendered (ms). Messages sent within two seconds are bots. */
  startedAt: z.coerce.number().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "failure" }
  | { status: "invalid"; fields: string[] };

export const initialContactState: ContactState = { status: "idle" };
