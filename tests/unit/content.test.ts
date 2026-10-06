import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { content } from "@content/index";
import {
  getCaseStudy,
  getCaseStudies,
  getService,
  getServices,
  getStats,
  getWorkItems,
  getWorkPage,
} from "@/lib/content";
import { resolveStat } from "@/lib/content/resolve";
import { collectReviews, validateContent } from "@/lib/content/validate";

const fileExists = (publicPath: string) => existsSync(path.join(process.cwd(), "public", publicPath));
const clone = <T,>(value: T): T => structuredClone(value);

describe("content validation", () => {
  it("accepts the real content", () => {
    const { errors } = validateContent(content, { fileExists });
    expect(errors).toEqual([]);
  });

  it("finds every needsReview flag with its path", () => {
    const reviews = collectReviews({ a: { needsReview: true, reviewNote: "check" }, b: [{ needsReview: true }, {}] });
    expect(reviews).toEqual([
      { path: "a", note: "check" },
      { path: "b[0]", note: undefined },
    ]);
  });

  it("catches an unknown media reference", () => {
    const broken = clone(content);
    broken.about.portrait = "does-not-exist";
    const { errors } = validateContent(broken, { fileExists });
    expect(errors.some((e) => e.path === "about.portrait")).toBe(true);
  });

  it("catches a dead internal link", () => {
    const broken = clone(content);
    broken.home.work.cta = { label: "x", href: "/nope" };
    const { errors } = validateContent(broken, { fileExists });
    expect(errors.some((e) => e.message.includes('"/nope"'))).toBe(true);
  });

  it("catches missing alt text", () => {
    const broken = clone(content);
    const image = broken.media.find((m) => m.kind === "image");
    if (image?.kind === "image") image.alt = "";
    const { errors } = validateContent(broken, { fileExists });
    expect(errors.some((e) => e.message.includes("alt text"))).toBe(true);
  });

  it("catches duplicate slugs", () => {
    const broken = clone(content);
    const first = broken.services[0];
    if (first) broken.services.push({ ...first });
    const { errors } = validateContent(broken, { fileExists });
    expect(errors.some((e) => e.message.includes("duplicate id"))).toBe(true);
  });

  it("catches a missing media file", () => {
    const { errors } = validateContent(content, { fileExists: () => false });
    expect(errors.some((e) => e.message.includes("missing file"))).toBe(true);
  });
});

describe("accessors", () => {
  it("computes years from the career start year, not from a literal", () => {
    const stat = content.stats.find((s) => s.kind === "years-since-career-start");
    expect(stat).toBeDefined();
    const resolved = resolveStat(stat!, new Date("2030-06-01"));
    expect(resolved.value).toBe(2030 - content.site.careerStartYear.value);
  });

  it("returns only featured stats when asked", async () => {
    const featured = await getStats({ featuredOnly: true });
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.every((s) => s.featured)).toBe(true);
  });

  it("resolves a case study with its hero image, testimonial and next case", async () => {
    const cs = await getCaseStudy("rich-from-anywhere");
    expect(cs?.hero.width).toBeGreaterThan(0);
    expect(cs?.testimonial?.name).toBe("Stephen Blackburn");
    expect(cs?.nextCase.slug).toBe("fafa-fitness");
  });

  it("forms a loop through all case studies", async () => {
    const cards = await getCaseStudies();
    const seen = new Set<string>();
    let slug = cards[0]!.slug;
    for (let i = 0; i < cards.length; i += 1) {
      seen.add(slug);
      slug = (await getCaseStudy(slug))!.nextCase.slug;
    }
    expect(seen.size).toBe(cards.length);
    expect(slug).toBe(cards[0]!.slug);
  });

  it("returns undefined for an unknown service or case study", async () => {
    expect(await getService("nope")).toBeUndefined();
    expect(await getCaseStudy("nope")).toBeUndefined();
  });

  it("lists six services and resolves related work", async () => {
    expect(await getServices()).toHaveLength(6);
    const podcast = await getService("podcast-video-editing");
    expect(podcast?.relatedWorkItems.map((w) => w.id)).toEqual(["panel-reveal", "hmrc-crackdown"]);
  });

  it("only offers work categories that have work in them", async () => {
    const page = await getWorkPage();
    const items = await getWorkItems();
    const used = new Set(items.map((i) => i.category));
    expect(page.categories.every((c) => used.has(c.id))).toBe(true);
  });
});
