import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/work",
  "/case-studies",
  "/case-studies/pathao",
  "/case-studies/rich-from-anywhere",
  "/case-studies/fafa-fitness",
  "/services",
  "/services/short-form-video-editing",
  "/services/youtube-video-editing",
  "/services/podcast-video-editing",
  "/services/motion-graphics-explainers",
  "/services/promo-commercial-video",
  "/services/thumbnail-design",
  "/about",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
];

const quiet = (path: string) => `${path}${path.includes("?") ? "&" : "?"}boot=0`;

async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test.describe("every page", () => {
  for (const path of routes) {
    test(`${path} has one h1, real metadata and no console errors`, async ({ page }) => {
      const errors = await collectErrors(page);
      const response = await page.goto(quiet(path));
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");

      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);
      expect(await page.locator('meta[name="description"]').getAttribute("content")).toMatch(/.{60,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached();
      expect(errors).toEqual([]);
    });

    for (const width of [375, 768, 1440]) {
      test(`${path} does not overflow horizontally at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(quiet(path));
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }
});

test("display font serves a working width axis", async ({ page }) => {
  await page.goto(quiet("/"));
  await page.evaluate(() => document.fonts.ready);
  const widths = await page.evaluate(() => {
    const measure = (wdth: number) => {
      const el = document.createElement("span");
      el.textContent = "Samiul Arafat Imon";
      el.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-family:var(--next-font-display);font-weight:800;font-size:64px;font-variation-settings:"wdth" ${wdth}`;
      document.body.appendChild(el);
      const width = el.getBoundingClientRect().width;
      el.remove();
      return width;
    };
    return { narrow: measure(62), regular: measure(100), wide: measure(125) };
  });
  expect(widths.narrow).toBeLessThan(widths.regular);
  expect(widths.regular).toBeLessThan(widths.wide);
  expect(widths.wide / widths.narrow).toBeGreaterThan(1.3);
});

test.describe("motion contract", () => {
  test("without JavaScript the content is there and the opening screen is gone", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Samiul Arafat Imon");
    await expect(page.locator(".boot-overlay")).toBeHidden();
    await expect(page.getByText("The track record, in numbers.")).toBeVisible();
    await context.close();
  });

  test("reduced motion: nothing is hidden, no smooth scroll, no canvas", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const state = await page.evaluate(() => ({
      html: document.documentElement.className,
      hidden: [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity === "0").length,
      canvases: document.querySelectorAll("canvas").length,
      lenis: document.documentElement.classList.contains("lenis"),
    }));
    expect(state.html).toContain("reduced");
    expect(state.html).not.toContain("js");
    expect(state.hidden).toBe(0);
    expect(state.canvases).toBe(0);
    expect(state.lenis).toBe(false);
    await context.close();
  });

  test("tier A renders the WebGL ribbon, tier C does not", async ({ page }) => {
    await page.goto(quiet("/?tier=a"));
    await expect(page.locator("canvas")).toHaveCount(1);
    await page.goto(quiet("/?tier=c"));
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-tier", "c");
  });

  test("scrolling the whole Home page leaves nothing stuck hidden", async ({ page }) => {
    await page.goto(quiet("/"));
    await page.waitForLoadState("networkidle");
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1200);
    const stuck = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-reveal]")]
        .filter((el) => el.offsetParent !== null && !el.closest("[data-hero-fade]") && getComputedStyle(el).opacity === "0")
        .map((el) => `${el.tagName}.${el.className.slice(0, 40)}`),
    );
    expect(stuck).toEqual([]);
  });
});

test.describe("interface", () => {
  test("the timeline bar lists chapters and J / L jump between them", async ({ page }) => {
    await page.goto(quiet("/"));
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("navigation", { name: "Page chapters" }).getByRole("link")).toHaveCount(8);
    const before = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("l");
    await page.waitForTimeout(1800);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 200);
  });

  test("the work lightbox opens from a card, deep-links, and closes with Escape", async ({ page }) => {
    await page.goto(quiet("/work"));
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: /Panel Reveal/ }).click();
    await expect(page).toHaveURL(/v=panel-reveal/);
    await expect(page.getByRole("dialog", { name: "Panel Reveal" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.goto("/work?v=crazy-genius&boot=0");
    await expect(page.getByRole("dialog", { name: "Crazy Genius" })).toBeVisible();
  });

  test("the contact form explains what is wrong, then confirms a valid message", async ({ page }) => {
    await page.goto(quiet("/contact"));
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator('form [role="alert"]')).toContainText("Check the highlighted fields");

    await page.locator("#name").fill("Test Person");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("A 90 second launch video for a SaaS product.");
    await page.waitForTimeout(2200);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Sent.");
  });

  test("a missing page is on brand and returns 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("isn't in the timeline");
  });
});

test.describe("search engines", () => {
  test("sitemap lists every page and robots keeps previews out", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect((sitemap.match(/<loc>/g) ?? []).length).toBe(routes.length);
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /");
  });
});
