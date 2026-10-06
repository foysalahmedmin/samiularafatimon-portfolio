import { expect, test } from "@playwright/test";

test("home renders the foundation page without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Samiul Arafat Imon");
  expect(errors).toEqual([]);
});

test("display font serves a working width axis", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const widths = await page.evaluate(() => {
    const measure = (wdth: number) => {
      const el = document.createElement("span");
      el.textContent = "Samiul Arafat Imon";
      el.style.cssText = [
        "position:absolute",
        "visibility:hidden",
        "white-space:nowrap",
        "font-family:var(--next-font-display)",
        "font-weight:800",
        "font-size:64px",
        `font-variation-settings:"wdth" ${wdth}`,
      ].join(";");
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

test("the page does not overflow horizontally at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
