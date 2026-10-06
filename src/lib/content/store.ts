import { z } from "zod";
import { content } from "@content/index";
import { contentSchemas, type ContentKey, type ParsedContent } from "./schemas";

let cache: ParsedContent | undefined;

/**
 * The validated content. Parsed once per process; a shape error throws with a readable list,
 * so a broken data file fails the dev server and the build instead of rendering garbage.
 */
export function store(): ParsedContent {
  if (cache) return cache;

  const problems: string[] = [];
  const parsed: Record<string, unknown> = {};
  for (const key of Object.keys(contentSchemas) as ContentKey[]) {
    const result = (contentSchemas[key] as z.ZodType).safeParse(content[key]);
    if (result.success) parsed[key] = result.data;
    else
      for (const issue of result.error.issues)
        problems.push(`${[key, ...issue.path.map(String)].join(".")}: ${issue.message}`);
  }
  if (problems.length > 0) throw new Error(`Invalid content:\n  ${problems.join("\n  ")}`);

  cache = parsed as ParsedContent;
  return cache;
}
