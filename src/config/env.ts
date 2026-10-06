import { z } from "zod";

const DEFAULT_SITE_URL = "http://localhost:3000";

const rawSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  VERCEL_URL: z.string().min(1).optional(),
  SITE_URL: z.string().min(1).optional(),
  CONTENT_STRICT: z.enum(["0", "1"]).optional(),
});

export type Env = {
  /** Absolute origin without a trailing slash, e.g. https://example.com */
  siteUrl: string;
  /** True only on the live production deployment. */
  isProductionDeployment: boolean;
  /** When true, content still marked `needsReview` fails the build. */
  contentStrict: boolean;
};

function toOrigin(value: string, name: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute URL, got "${value}"`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use http or https, got "${value}"`);
  }
  return url.origin;
}

export function parseEnv(source: Record<string, string | undefined>): Env {
  const raw = rawSchema.parse(source);
  const isProductionDeployment = raw.VERCEL_ENV === "production";

  let siteUrl: string;
  if (raw.SITE_URL) {
    siteUrl = toOrigin(raw.SITE_URL, "SITE_URL");
  } else if (isProductionDeployment) {
    throw new Error("SITE_URL is required on the production deployment");
  } else if (raw.VERCEL_URL) {
    siteUrl = toOrigin(`https://${raw.VERCEL_URL}`, "VERCEL_URL");
  } else {
    siteUrl = DEFAULT_SITE_URL;
  }

  return {
    siteUrl,
    isProductionDeployment,
    contentStrict: raw.CONTENT_STRICT === "1" || isProductionDeployment,
  };
}
