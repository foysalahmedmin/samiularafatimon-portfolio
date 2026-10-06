import { z } from "zod";
import { staticPaths, serviceBase, caseStudyBase } from "@/lib/routes";
import { contentSchemas, type ContentKey, type ParsedContent } from "./schemas";

export type Issue = { path: string; message: string };
export type ReviewItem = { path: string; note: string | undefined };
export type ValidationResult = { errors: Issue[]; reviews: ReviewItem[] };

type Raw = { [K in ContentKey]: unknown };

const formatPath = (key: string, path: ReadonlyArray<PropertyKey>) =>
  [key, ...path.map(String)].join(".").replace(/\.(\d+)/g, "[$1]");

/** Every record that says `needsReview: true`, with where it lives. */
export function collectReviews(value: unknown, path = ""): ReviewItem[] {
  const found: ReviewItem[] = [];
  const visit = (node: unknown, at: string) => {
    if (Array.isArray(node)) {
      node.forEach((child, index) => visit(child, `${at}[${index}]`));
      return;
    }
    if (node && typeof node === "object") {
      const record = node as Record<string, unknown>;
      if (record.needsReview === true) {
        found.push({ path: at, note: typeof record.reviewNote === "string" ? record.reviewNote : undefined });
      }
      for (const [key, child] of Object.entries(record)) visit(child, at ? `${at}.${key}` : key);
    }
  };
  visit(value, path);
  return found;
}

/** All internal hrefs (starting with "/") found anywhere in the content. */
function collectInternalHrefs(value: unknown): string[] {
  const hrefs: string[] = [];
  const visit = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(node)) {
        if (key === "href" && typeof child === "string" && child.startsWith("/")) hrefs.push(child);
        else visit(child);
      }
    }
  };
  visit(value);
  return hrefs;
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const value of values) (seen.has(value) ? dup : seen).add(value);
  return [...dup];
}

type Options = { fileExists: (publicPath: string) => boolean };

export function validateContent(raw: Raw, options: Options): ValidationResult {
  const errors: Issue[] = [];
  const parsed: Partial<ParsedContent> = {};

  // 1. Shape: every part must match its schema.
  for (const key of Object.keys(contentSchemas) as ContentKey[]) {
    const result = (contentSchemas[key] as z.ZodType).safeParse(raw[key]);
    if (result.success) (parsed as Record<string, unknown>)[key] = result.data;
    else
      for (const issue of result.error.issues)
        errors.push({ path: formatPath(key, issue.path), message: issue.message });
  }
  if (errors.length > 0) return { errors, reviews: collectReviews(raw) };

  const c = parsed as ParsedContent;
  const err = (path: string, message: string) => errors.push({ path, message });

  // 2. Unique ids.
  const uniques: Array<[string, string[]]> = [
    ["media", c.media.map((m) => m.id)],
    ["services", c.services.map((s) => s.slug)],
    ["caseStudies", c.caseStudies.map((s) => s.slug)],
    ["work.items", c.work.items.map((i) => i.id)],
    ["work.categories", c.work.categories.map((i) => i.id)],
    ["testimonials", c.testimonials.map((t) => t.id)],
    ["clients", c.clients.map((cl) => cl.slug)],
    ["stats", c.stats.map((s) => s.id)],
    ["processStages", c.processStages.map((p) => p.id)],
    ["faq.groups", c.faq.groups.map((g) => g.id)],
    ["faq.items", c.faq.groups.flatMap((g) => g.items.map((i) => i.id))],
  ];
  for (const [where, ids] of uniques)
    for (const id of duplicates(ids)) err(where, `duplicate id "${id}"`);

  // 3. References.
  const mediaById = new Map(c.media.map((m) => [m.id, m]));
  const mustBeImage = (path: string, id: string | undefined) => {
    if (!id) return;
    const item = mediaById.get(id);
    if (!item) err(path, `unknown media id "${id}"`);
    else if (item.kind !== "image") err(path, `media "${id}" must be an image`);
  };
  const mustBePlayable = (path: string, id: string) => {
    const item = mediaById.get(id);
    if (!item) err(path, `unknown media id "${id}"`);
    else if (item.kind === "image") err(path, `media "${id}" must be a video or youtube entry`);
  };

  mustBePlayable("home.reel.media", c.home.reel.media);
  mustBeImage("about.portrait", c.about.portrait);
  mustBeImage("site.agency.logo", c.site.agency.logo);
  for (const m of c.media) {
    if (m.kind === "video") mustBeImage(`media.${m.id}.poster`, m.poster);
    if (m.kind === "youtube") mustBeImage(`media.${m.id}.thumbnail`, m.thumbnail);
  }
  const categoryIds = new Set(c.work.categories.map((x) => x.id));
  const workIds = new Set(c.work.items.map((x) => x.id));
  c.work.items.forEach((item, i) => {
    mustBePlayable(`work.items[${i}].media`, item.media);
    mustBeImage(`work.items[${i}].thumbnail`, item.thumbnail);
    if (!categoryIds.has(item.category)) err(`work.items[${i}].category`, `unknown category "${item.category}"`);
  });
  const caseSlugs = new Set(c.caseStudies.map((x) => x.slug));
  const serviceSlugs = new Set(c.services.map((x) => x.slug));
  const testimonialIds = new Set(c.testimonials.map((x) => x.id));
  c.testimonials.forEach((t, i) => {
    mustBeImage(`testimonials[${i}].photo`, t.photo);
    if (t.caseStudy && !caseSlugs.has(t.caseStudy)) err(`testimonials[${i}].caseStudy`, `unknown case study "${t.caseStudy}"`);
  });
  c.clients.forEach((cl, i) => {
    if (cl.caseStudy && !caseSlugs.has(cl.caseStudy)) err(`clients[${i}].caseStudy`, `unknown case study "${cl.caseStudy}"`);
  });
  c.services.forEach((s, i) => {
    s.relatedWork.forEach((id, j) => {
      if (!workIds.has(id)) err(`services[${i}].relatedWork[${j}]`, `unknown work item "${id}"`);
    });
    if (s.relatedCase && !caseSlugs.has(s.relatedCase)) err(`services[${i}].relatedCase`, `unknown case study "${s.relatedCase}"`);
  });
  c.caseStudies.forEach((cs, i) => {
    mustBeImage(`caseStudies[${i}].hero`, cs.hero);
    mustBeImage(`caseStudies[${i}].client.logo`, cs.client.logo);
    cs.services.forEach((slug, j) => {
      if (!serviceSlugs.has(slug)) err(`caseStudies[${i}].services[${j}]`, `unknown service "${slug}"`);
    });
    if (cs.testimonial && !testimonialIds.has(cs.testimonial)) err(`caseStudies[${i}].testimonial`, `unknown testimonial "${cs.testimonial}"`);
    if (!caseSlugs.has(cs.next)) err(`caseStudies[${i}].next`, `unknown case study "${cs.next}"`);
    else if (cs.next === cs.slug && c.caseStudies.length > 1) err(`caseStudies[${i}].next`, "points at itself");
  });

  // 4. Files that content points at must exist.
  for (const m of c.media) {
    if (m.kind === "image") {
      if (!options.fileExists(`media/${m.file}`)) err(`media.${m.id}`, `missing file public/media/${m.file}. Run pnpm media:sync`);
      if (!c.mediaManifest[m.id]) err(`media.${m.id}`, "no size/blur entry in media.manifest.json. Run pnpm media:sync");
    }
    if (m.kind === "video" && m.preview && !options.fileExists(`media/previews/${m.preview}`))
      err(`media.${m.id}`, `missing preview public/media/previews/${m.preview}. Run pnpm media:sync`);
  }

  // 5. Every internal link must land on a real page.
  const knownPaths = new Set<string>([
    ...staticPaths,
    ...c.services.map((s) => `${serviceBase}${s.slug}`),
    ...c.caseStudies.map((s) => `${caseStudyBase}${s.slug}`),
  ]);
  for (const href of new Set(collectInternalHrefs(raw))) {
    const pathOnly = href.split("#")[0] ?? href;
    if (!knownPaths.has(pathOnly)) err("links", `internal link "${href}" does not match any page`);
  }

  // 6. Meta must be unique per page.
  const metas: Array<[string, { title: string; description: string }]> = [
    ...Object.entries(c.seo.routes).map(([k, v]) => [`seo.routes.${k}`, v] as [string, { title: string; description: string }]),
    ...c.services.map((s, i) => [`services[${i}].seo`, s.seo] as [string, { title: string; description: string }]),
    ...c.caseStudies.map((s, i) => [`caseStudies[${i}].seo`, s.seo] as [string, { title: string; description: string }]),
  ];
  for (const title of duplicates(metas.map(([, m]) => m.title))) err("seo", `duplicate page title "${title}"`);
  for (const [where, meta] of metas) {
    const finalTitle = where === "seo.routes.home" ? meta.title : c.seo.titleTemplate.replace("%s", meta.title);
    if (finalTitle.length > 65) err(where, `final title is ${finalTitle.length} characters (max 65): "${finalTitle}"`);
  }
  for (const description of duplicates(metas.map(([, m]) => m.description)))
    err("seo", `duplicate meta description "${description.slice(0, 60)}…"`);

  return { errors, reviews: collectReviews(raw) };
}
