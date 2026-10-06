import { describe, expect, it } from "vitest";
import { parseEnv } from "@/config/env";

describe("parseEnv", () => {
  it("falls back to localhost when SITE_URL is not set", () => {
    expect(parseEnv({}).siteUrl).toBe("http://localhost:3000");
  });

  it("reduces SITE_URL to its origin (no trailing slash or path)", () => {
    expect(parseEnv({ SITE_URL: "https://example.com/" }).siteUrl).toBe("https://example.com");
    expect(parseEnv({ SITE_URL: "https://example.com/portfolio?x=1" }).siteUrl).toBe(
      "https://example.com",
    );
  });

  it("rejects a SITE_URL that is not an absolute URL", () => {
    expect(() => parseEnv({ SITE_URL: "not a url" })).toThrow(/SITE_URL must be an absolute URL/);
  });

  it("rejects a SITE_URL that is not http or https", () => {
    expect(() => parseEnv({ SITE_URL: "ftp://example.com" })).toThrow(/http or https/);
  });

  it("requires SITE_URL on the production deployment", () => {
    expect(() => parseEnv({ VERCEL_ENV: "production" })).toThrow(/SITE_URL is required/);
  });

  it("uses VERCEL_URL for preview deployments when SITE_URL is absent", () => {
    const env = parseEnv({ VERCEL_ENV: "preview", VERCEL_URL: "imon-git-x.vercel.app" });
    expect(env.siteUrl).toBe("https://imon-git-x.vercel.app");
    expect(env.isProductionDeployment).toBe(false);
  });

  it("is lenient about content review by default", () => {
    expect(parseEnv({}).contentStrict).toBe(false);
  });

  it("is strict about content review when CONTENT_STRICT=1", () => {
    expect(parseEnv({ CONTENT_STRICT: "1" }).contentStrict).toBe(true);
  });

  it("is strict about content review on the production deployment", () => {
    const env = parseEnv({ VERCEL_ENV: "production", SITE_URL: "https://example.com" });
    expect(env.isProductionDeployment).toBe(true);
    expect(env.contentStrict).toBe(true);
  });

  it("rejects an unknown NODE_ENV", () => {
    expect(() => parseEnv({ NODE_ENV: "staging" })).toThrow();
  });
});
