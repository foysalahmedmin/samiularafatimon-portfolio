import type { MetadataRoute } from "next";
import { env } from "@/config/env.server";

/** Production is open to crawlers; previews and local builds are not. */
export default function robots(): MetadataRoute.Robots {
  if (!env.isProductionDeployment) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${env.siteUrl}/sitemap.xml` };
}
