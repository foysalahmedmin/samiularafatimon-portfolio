/**
 * Validates everything in content/ and lists the facts that still need a human check.
 *
 *   pnpm content:check              errors fail; unresolved reviews are listed as a warning
 *   CONTENT_STRICT=1 pnpm content:check   unresolved reviews fail too (always on in production)
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { content } from "@content/index";
import { parseEnv } from "@/config/env";
import { validateContent } from "@/lib/content/validate";

const env = parseEnv(process.env);
const publicDir = path.join(process.cwd(), "public");

const { errors, reviews } = validateContent(content, {
  fileExists: (publicPath) => existsSync(path.join(publicDir, publicPath)),
});

if (errors.length > 0) {
  console.error(`\n✖ ${errors.length} content error${errors.length === 1 ? "" : "s"}\n`);
  for (const { path: where, message } of errors) console.error(`  ${where}\n    ${message}`);
  process.exit(1);
}

console.log("✔ content is valid");

if (reviews.length > 0) {
  const heading = `${reviews.length} item${reviews.length === 1 ? "" : "s"} still need${reviews.length === 1 ? "s" : ""} review`;
  if (env.contentStrict) {
    console.error(`\n✖ ${heading} (strict mode)\n`);
    for (const { path: where, note } of reviews) console.error(`  ${where}${note ? `\n    ${note}` : ""}`);
    process.exit(1);
  }
  console.warn(`\n⚠ ${heading}. Production builds will fail until they are resolved.\n`);
  for (const { path: where, note } of reviews) console.warn(`  ${where}${note ? `\n    ${note}` : ""}`);
} else {
  console.log("✔ nothing needs review");
}
