# Phase 0 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. *(Decision D11 in the master spec: this project is executed inline with `executing-plans`.)*

**Goal:** A clean, verifiable Next.js 16 app with the right type system, colour tokens, strict TypeScript, enforced content/UI boundaries, and unit + e2e test rails — ready for the content layer (Phase 1).

**Architecture:** Next 16 App Router + TypeScript + Tailwind 4, `src/` for code, a root-level `content/` folder reserved for data. Path aliases `@/*` → `src/*` and `@content/*` → `content/*`. ESLint rules make the "UI never imports content directly" rule fail the build. Vitest covers logic (TDD); Playwright covers the real browser (fonts, overflow, console errors).

**Tech Stack:** Next 16.3, React 19.2, TypeScript 5.9, Tailwind 4.3, ESLint 9 (flat config), Zod 4, Vitest, Playwright, pnpm 10, Node 20.

**Spec:** [master spec](../specs/2026-10-06-SamiulArafatImon-design.md) · [Motion & UX spec](../specs/2026-10-06-motion-and-ux-spec.md)

**Facts verified before writing this plan (scaffold probe, 2026-10-06):** `create-next-app@latest` produces Next 16.3.8, React 19.2.8, TS 5.9.3, ESLint 9.39, Tailwind 4.3.3, an `AGENTS.md` + `CLAUDE.md` (agent rules), `eslint.config.mjs` using `eslint-config-next/core-web-vitals` + `/typescript`, and `LayoutProps<"/">` route-type helpers. Archivo's font data lists axes `wdth 62–125` and `wght 100–900`, so `axes: ["wdth"]` is valid. Docs ship in `node_modules/next/dist/docs/`.

---

## File map (what this phase creates or changes)

| File | Responsibility |
|---|---|
| `package.json` | Scripts (`typecheck`, `lint`, `test`, `test:e2e`, `check`), engines |
| `.nvmrc`, `.env.example`, `.gitignore` | Toolchain pin, documented env vars, ignore rules |
| `tsconfig.json` | Strict TS + `@content/*` alias |
| `eslint.config.mjs` | Boundary rules (content ↔ UI), parent-relative import ban |
| `vitest.config.mts` | Unit test runner with tsconfig paths |
| `playwright.config.ts` | e2e runner (builds, starts on :3100) |
| `src/config/env.ts` | Pure, testable env parsing (`parseEnv`) |
| `src/config/env.server.ts` | Server-only parsed `env` singleton |
| `src/styles/tokens.css` | Colour, tone, motion, layout tokens + `--wdth` property |
| `src/app/globals.css` | Tailwind import, theme mapping, base styles |
| `src/app/layout.tsx` | Fonts (Archivo/DM Sans/DM Mono), viewport, metadata base |
| `src/app/page.tsx` | Temporary foundation page (replaced in Phase 3) |
| `tests/unit/env.test.ts` | TDD for env parsing |
| `tests/unit/boundaries.test.ts` | TDD for the lint boundary rules |
| `tests/e2e/foundation.spec.ts` | Real-browser checks: heading, console, width axis, overflow |
| `.github/workflows/ci.yml` | Same checks in CI |
| `CLAUDE.md`, `README.md` | Project rules and how to run |
| `docs/notes/next16-notes.md` | What we learned from the bundled Next docs |

---

### Task 1: Initialise git and scaffold the app

**Files:**
- Create: everything `create-next-app` generates, in the project root
- Move: `profile.jpg` → `assets/source/profile.jpg`
- Modify: `.gitignore`

- [ ] **Step 1: Initialise the repository**

```bash
cd /Users/mac/Developer/Offices/Montage/SamiulArafatImon
git init -b main
git config user.name >/dev/null || echo "NO NAME SET"
git config user.email >/dev/null || echo "NO EMAIL SET"
```
Expected: `Initialized empty Git repository`. If either "NO … SET" line prints, set a repo-local identity: `git config user.name "Imon Portfolio Dev"` and `git config user.email "imonofficial2@gmail.com"`.

- [ ] **Step 2: Scaffold Next into the current folder**

```bash
pnpm dlx create-next-app@latest . --ts --app --src-dir --tailwind --eslint \
  --import-alias "@/*" --use-pnpm --disable-git --yes
```
Expected: ends with `Success! Created SamiulArafatImon at …`. The existing `docs/` and `profile.jpg` are not conflicts.

- [ ] **Step 3: Keep the original photo out of `public/`**

```bash
mkdir -p assets/source && mv profile.jpg assets/source/profile.jpg && ls assets/source
```
Expected: `profile.jpg`.

- [ ] **Step 4: Extend `.gitignore`**

Append to `.gitignore`:

```gitignore

# env files: ignore real ones, keep the documented example
!.env.example

# test output
/test-results
/playwright-report
```

- [ ] **Step 5: Verify the untouched scaffold builds**

Run: `pnpm build`
Expected: `✓ Compiled successfully`; route table lists `/` as static (`○`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 app and add design spec

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Read the bundled Next 16 docs and record what matters

**Files:**
- Create: `docs/notes/next16-notes.md`

`AGENTS.md` says Next 16 differs from training data. Read before coding.

- [ ] **Step 1: Skim the guides this project depends on**

```bash
cd node_modules/next/dist/docs/01-app/02-guides
sed -n 1,80p view-transitions.md
sed -n 1,60p json-ld.md
sed -n 1,80p production-checklist.md
sed -n 1,60p lazy-loading.md
sed -n 1,60p environment-variables.md
```
Note anything that contradicts the plan (Tailwind, fonts, metadata, env handling).

- [ ] **Step 2: Write the notes file**

Create `docs/notes/next16-notes.md` with exactly these sections, filled from what you read: **Async request APIs** (`await params`, `await searchParams`), **`proxy.ts`** (renamed from `middleware`), **Fonts** (`next/font/google` `axes` only with variable fonts and no explicit `weight`), **View Transitions** (`experimental.viewTransition`, `<ViewTransition>`, `<Link transitionTypes>`), **JSON-LD** (how the docs recommend injecting it, including `<` escaping), **Environment variables**, **Images** (`images.qualities` required), **Lint** (no `next lint`; run `eslint` directly), **Route types** (`LayoutProps`, `PageProps`). Each section: 1–3 bullets plus the doc path.

- [ ] **Step 3: Commit**

```bash
git add docs/notes/next16-notes.md
git commit -m "docs: record Next 16 constraints from bundled docs

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Strict TypeScript and the `@content` alias

**Files:**
- Modify: `tsconfig.json`
- Modify: `package.json` (engines, packageManager already set)
- Create: `.nvmrc`

- [ ] **Step 1: Edit `tsconfig.json`**

Set `"target": "ES2022"`, add two strictness flags, and add the alias. The relevant parts must read:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "paths": {
      "@/*": ["./src/*"],
      "@content/*": ["./content/*"]
    }
  }
}
```
Leave every other generated option as it is.

- [ ] **Step 2: Pin the toolchain**

```bash
printf '20\n' > .nvmrc
node -e 'const p=require("./package.json"); p.engines={node:">=20.9"}; require("fs").writeFileSync("package.json", JSON.stringify(p,null,2)+"\n")'
```

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: no output, exit code 0. (If `noUncheckedIndexedAccess` flags generated code, fix the generated code, not the flag.)

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json package.json .nvmrc
git commit -m "chore: strict TypeScript, @content alias, Node pin

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Env parsing (TDD)

**Files:**
- Create: `vitest.config.mts`
- Create: `tests/unit/env.test.ts`
- Create: `src/config/env.ts`
- Create: `src/config/env.server.ts`
- Create: `.env.example`
- Modify: `package.json` (scripts, deps)

- [ ] **Step 1: Install test tooling and runtime deps**

```bash
pnpm add zod server-only
pnpm add -D vitest vite-tsconfig-paths
```

- [ ] **Step 2: Create `vitest.config.mts`**

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 3: Add scripts to `package.json`**

Set `"scripts"` to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Write the failing test** — `tests/unit/env.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { parseEnv } from "@/config/env";

describe("parseEnv", () => {
  it("falls back to localhost when SITE_URL is not set", () => {
    expect(parseEnv({}).siteUrl).toBe("http://localhost:3000");
  });

  it("reduces SITE_URL to its origin (no trailing slash or path)", () => {
    expect(parseEnv({ SITE_URL: "https://example.com/" }).siteUrl).toBe("https://example.com");
    expect(parseEnv({ SITE_URL: "https://example.com/portfolio?x=1" }).siteUrl).toBe("https://example.com");
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
```

- [ ] **Step 5: Run it and watch it fail**

Run: `pnpm test`
Expected: FAIL — `Failed to resolve import "@/config/env"`.

- [ ] **Step 6: Implement** — `src/config/env.ts`

```ts
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
```

- [ ] **Step 7: Server-only singleton** — `src/config/env.server.ts`

```ts
import "server-only";
import { parseEnv } from "./env";

/** Parsed environment. Importable from server code only. */
export const env = parseEnv(process.env);
```

- [ ] **Step 8: Document the variables** — `.env.example`

```dotenv
# Public origin of the site (no trailing slash). Required on the production deployment.
SITE_URL=http://localhost:3000

# Set to 1 to make unresolved `needsReview` content fail the build locally.
# Always on for the production deployment.
CONTENT_STRICT=0
```

- [ ] **Step 9: Run tests, expect pass**

Run: `pnpm test`
Expected: `10 passed`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(config): validated environment parsing with tests

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Enforce the content/UI boundary with ESLint (TDD)

**Files:**
- Create: `tests/unit/boundaries.test.ts`
- Modify: `eslint.config.mjs`

Rules to enforce (master spec §7.2): UI code can't import `@content/*`; `src/` has no parent-relative imports; `content/` is plain data (type-only imports from `src/`, no React/Next).

- [ ] **Step 1: Write the failing test** — `tests/unit/boundaries.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { ESLint, type Linter } from "eslint";

const eslint = new ESLint({ cwd: process.cwd() });

async function restricted(code: string, filePath: string): Promise<Linter.LintMessage[]> {
  const [result] = await eslint.lintText(code, { filePath });
  return (result?.messages ?? []).filter((m) => m.ruleId?.endsWith("no-restricted-imports"));
}

describe("content/UI boundaries", () => {
  it("blocks UI components from importing content directly", async () => {
    const messages = await restricted(
      `import { site } from "@content/site";\nexport const x = site;\n`,
      "src/components/ui/example.tsx",
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.message).toMatch(/@\/lib\/content/);
  });

  it("blocks app routes from importing content directly", async () => {
    const messages = await restricted(
      `import { site } from "@content/site";\nexport default function Page() { return site; }\n`,
      "src/app/example/page.tsx",
    );
    expect(messages).toHaveLength(1);
  });

  it("lets the content accessors import content", async () => {
    const messages = await restricted(
      `import { site } from "@content/site";\nexport const getSite = () => site;\n`,
      "src/lib/content/site.ts",
    );
    expect(messages).toHaveLength(0);
  });

  it("blocks parent-relative imports inside src", async () => {
    const messages = await restricted(
      `import { x } from "../util";\nexport const y = x;\n`,
      "src/features/hero/hero.ts",
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.message).toMatch(/alias/);
  });

  it("allows type-only imports from src inside content files", async () => {
    const messages = await restricted(
      `import type { Site } from "@/lib/content/types";\nexport const site: Site = {} as Site;\n`,
      "content/example.ts",
    );
    expect(messages).toHaveLength(0);
  });

  it("blocks runtime imports from src inside content files", async () => {
    const messages = await restricted(
      `import { cn } from "@/lib/utils";\nexport const x = cn;\n`,
      "content/example.ts",
    );
    expect(messages).toHaveLength(1);
  });

  it("blocks React and Next imports inside content files", async () => {
    const messages = await restricted(
      `import React from "react";\nexport const x = React;\n`,
      "content/example.ts",
    );
    expect(messages).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm exec vitest run tests/unit/boundaries.test.ts`
Expected: FAIL — tests expecting 1 message get 0 (the rules don't exist yet).

- [ ] **Step 3: Implement the rules** — replace `eslint.config.mjs`

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const noParentRelative = {
  regex: "^\\.\\./",
  message: "Use the '@/' alias instead of parent-relative imports.",
};

const contentOnlyViaAccessors = {
  group: ["@content", "@content/*"],
  message: "UI code must not import content directly. Use the accessors in '@/lib/content'.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // UI and routes: no direct content imports, no parent-relative imports.
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [noParentRelative, contentOnlyViaAccessors] },
      ],
    },
  },

  // The accessor layer is the one place allowed to read content.
  {
    files: ["src/lib/content/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [noParentRelative] }],
    },
  },

  // Content is plain data: only type imports from src, no UI frameworks.
  {
    files: ["content/**/*.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/*"],
              allowTypeImports: true,
              message: "Content is plain data: only `import type` from src is allowed.",
            },
            {
              group: ["react", "react-dom", "next", "next/*"],
              message: "Content must not depend on React or Next.",
            },
          ],
        },
      ],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**", "playwright-report/**", "test-results/**"]),
]);

export default eslintConfig;
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm exec vitest run tests/unit/boundaries.test.ts`
Expected: `7 passed`. If a case fails because the rule id differs, print `messages` once, adjust the test's `ruleId` filter, never weaken the rule.

- [ ] **Step 5: Whole-repo lint still clean**

Run: `pnpm lint`
Expected: exit code 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(lint): enforce content/UI boundaries with tests

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Fonts, tokens and the foundation page

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Tokens** — `src/styles/tokens.css`

```css
/* Design tokens. One source for colour, tone, motion and layout.
   Motion values are mirrored in src/lib/motion/tokens.ts (Phase 2). */

/* Registered so the font width axis can be transitioned and tweened. */
@property --wdth {
  syntax: "<number>";
  inherits: true;
  initial-value: 100;
}

:root {
  /* Brand palette (master spec §4.2) */
  --c-ink: #050d14;
  --c-console: #0e1c28;
  --c-raised: #15293a;
  --c-paper: #eef4f7;
  --c-paper-2: #ffffff;
  --c-paper-3: #e1eaef;
  --c-bone: #e9f1f5;
  --c-mist: #8ca3b1;
  --c-slate: #4a6070;
  --c-signal: #1fb5dd;
  --c-signal-deep: #0a6f90;
  --c-signal-glow: #ccf4ff;
  --c-rec: #ff5a47;

  /* Motion (Motion & UX spec §2) */
  --ease-cut: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-glide: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-ramp: cubic-bezier(0.55, 0, 1, 0.45);
  --dur-micro: 160ms;
  --dur-ui: 280ms;
  --dur-reveal: 700ms;
  --dur-scene: 1100ms;

  /* Layout */
  --gutter: clamp(16px, 4vw, 48px);
  --container: 1360px;
  --section-y: clamp(96px, 14vw, 200px);
  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-lg: 24px;
}

/* Tones: dark = footage, light = reading. Components read --tone-* only. */
[data-tone="dark"] {
  --tone-bg: var(--c-ink);
  --tone-surface: var(--c-console);
  --tone-fg: var(--c-bone);
  --tone-muted: var(--c-mist);
  --tone-accent: var(--c-signal);
  --tone-line: rgb(233 241 245 / 0.12);
}

[data-tone="light"] {
  --tone-bg: var(--c-paper);
  --tone-surface: var(--c-paper-2);
  --tone-fg: var(--c-ink);
  --tone-muted: var(--c-slate);
  --tone-accent: var(--c-signal-deep);
  --tone-line: rgb(5 13 20 / 0.12);
}
```

- [ ] **Step 2: Global styles** — replace `src/app/globals.css`

```css
@import "tailwindcss";
@import "../styles/tokens.css";

@theme inline {
  --color-ink: var(--c-ink);
  --color-console: var(--c-console);
  --color-raised: var(--c-raised);
  --color-paper: var(--c-paper);
  --color-bone: var(--c-bone);
  --color-mist: var(--c-mist);
  --color-slate: var(--c-slate);
  --color-signal: var(--c-signal);
  --color-signal-deep: var(--c-signal-deep);
  --color-signal-glow: var(--c-signal-glow);
  --color-rec: var(--c-rec);

  --font-display: var(--next-font-display), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--next-font-body), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--next-font-mono), ui-monospace, monospace;
}

html {
  background: var(--c-ink);
  color-scheme: dark;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--tone-bg);
  color: var(--tone-fg);
  font-family: var(--next-font-body), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Display type with a variable width axis: condensed = 9:16, expanded = 16:9.
   Uses the next/font variable directly: Tailwind only emits theme variables that a utility uses. */
.reframe {
  font-family: var(--next-font-display), ui-sans-serif, system-ui, sans-serif;
  font-variation-settings: "wdth" var(--wdth);
}
```

- [ ] **Step 3: Layout with fonts** — replace `src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono, DM_Sans } from "next/font/google";
import { env } from "@/config/env.server";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--next-font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--next-font-body",
  display: "swap",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--next-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: "Samiul Arafat Imon",
};

export const viewport: Viewport = {
  themeColor: "#050d14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body data-tone="dark">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Temporary foundation page** — replace `src/app/page.tsx`

```tsx
import type { CSSProperties } from "react";

// Temporary: proves fonts, tokens and the width axis. Replaced in Phase 3.
const wdth = (value: number) => ({ "--wdth": value }) as CSSProperties;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-[var(--container)] flex-col justify-center gap-10 px-[var(--gutter)] py-24">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-mist">Foundation · Phase 0</p>
      <h1
        className="reframe text-[clamp(2.75rem,10vw,9rem)] leading-[0.92] font-extrabold"
        style={wdth(125)}
      >
        Samiul Arafat Imon
      </h1>
      <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 text-3xl font-extrabold">
        <span className="reframe" style={wdth(62)}>Condensed 9:16</span>
        <span className="reframe" style={wdth(100)}>Regular</span>
        <span className="reframe" style={wdth(125)}>Expanded 16:9</span>
      </div>
      <p className="max-w-prose text-lg text-mist">
        Body copy in DM Sans on Ink. <span className="font-mono text-signal">00:00:00:00</span>
      </p>
    </main>
  );
}
```

- [ ] **Step 5: Build**

Run: `pnpm build`
Expected: `✓ Compiled successfully`. If the build reports an error about `axes` and `weight`, you passed a `weight` to Archivo — remove it.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: fonts, design tokens and foundation page

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Real-browser checks with Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/foundation.spec.ts`
- Modify: `package.json` (script)

- [ ] **Step 1: Install**

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```
Expected: Chromium downloads; command exits 0.

- [ ] **Step 2: Config** — `playwright.config.ts`

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 3: Script** — add `"test:e2e": "playwright test"` to `package.json` scripts.

- [ ] **Step 4: Write the tests** — `tests/e2e/foundation.spec.ts`

```ts
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
```

- [ ] **Step 5: Run**

Run: `pnpm test:e2e`
Expected: builds, starts on :3100, `3 passed`. If the width-axis test fails with equal widths, the font did not load with the axis: confirm network access during `next build` (Google Fonts are fetched at build time) and that `axes: ["wdth"]` is present in `layout.tsx`. Do not loosen the assertion.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test(e2e): Playwright checks for fonts, console and overflow

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: One command to check everything, CI, and project docs

**Files:**
- Modify: `package.json` (`check` script)
- Create: `.github/workflows/ci.yml`
- Modify: `CLAUDE.md`
- Replace: `README.md`

- [ ] **Step 1: Add the `check` script** to `package.json`:

```json
"check": "pnpm typecheck && pnpm lint && pnpm test && pnpm build"
```

- [ ] **Step 2: CI** — `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
```
(Untested until the repo is pushed to GitHub; it only repeats commands that pass locally.)

- [ ] **Step 3: Project rules** — replace `CLAUDE.md`

```markdown
@AGENTS.md

# SamiulArafatImon — project rules

Specs: `docs/superpowers/specs/` (master spec + Motion & UX spec). Plans: `docs/superpowers/plans/`.

## Non-negotiables
- **Content is data.** All copy, work items, case studies, stats, contact details and SEO text live in `content/`. UI code reads them only through `@/lib/content`. ESLint enforces this; do not disable the rule.
- **No literal copy in JSX** (labels, headings, aria text, alt text, error messages come from `content/`).
- **Never invent facts.** Unverified claims carry `needsReview: true`; the production build fails while any remain.
- **One accent, two tones.** Colours and spacing come from `src/styles/tokens.css`; components read `--tone-*`.
- **Motion has a source and a meaning**, and every effect has a reduced-motion variant (see the Motion & UX spec).
- Use the `@/` alias; parent-relative imports are banned in `src/`.

## Commands
`pnpm dev` · `pnpm check` (typecheck + lint + unit tests + build) · `pnpm test:e2e` (Playwright)
```

- [ ] **Step 4: README** — replace `README.md`

```markdown
# Samiul Arafat Imon — portfolio

Cinematic portfolio for Samiul Arafat Imon, video editor and founder of Montage Motion.

## Run

    pnpm install
    pnpm dev            # http://localhost:3000
    pnpm check          # typecheck, lint, unit tests, production build
    pnpm test:e2e       # Playwright (builds and serves on :3100)

Requires Node 20+ and pnpm 10. Copy `.env.example` to `.env.local` to change settings.

## Where things live

- `content/` — all site data (copy, work, case studies, stats, SEO). Edit here to change what the site says.
- `src/` — code. UI reads data only through `src/lib/content`.
- `docs/superpowers/specs/` — design and motion specs. `docs/superpowers/plans/` — implementation plans.
```

- [ ] **Step 5: Run everything**

```bash
pnpm check && pnpm test:e2e
```
Expected: `check` passes (typecheck clean, lint clean, `17 passed` unit tests, build succeeds), then `3 passed` e2e.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: check script, CI workflow, project rules and README

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

## Phase 0 gate (what to show you)

1. Output of `pnpm check` and `pnpm test:e2e` (all green).
2. Screenshots of the foundation page at 375 / 768 / 1280 / 1920 — real fonts, the Ink ground, Signal accent, and the three width-axis samples (condensed → expanded).
3. `git log --oneline` (8 commits or fewer).

## Self-review against the spec

- §3 D1 stack, §7.1 folder rules, §7.2 decoupling rules 1–2 and the `@content` alias → Tasks 3, 5. Rules 3–5 (no literal copy, `media.ts`, Zod validation) arrive with the content layer in Phase 1.
- §4.2 colours, fonts, tone tokens, `--wdth` → Task 6. Motion & UX §2 tokens (CSS side) → Task 6; the TS mirror is Phase 2.
- §7.4 / D14 `needsReview` gate flags → `env.contentStrict` (Task 4); the check script is Phase 1.
- §9 tooling rails (typecheck, lint, unit, e2e) → Tasks 4, 5, 7, 8.
- Motion & UX §9.7 (`axes` constraint, async APIs) → Tasks 2, 6, 7.
- Not in this phase by design: content schemas (Phase 1), primitives and motion engine (Phase 2).

## Execution notes (what differed from the plan)

- `create-next-app` refuses a folder that already contains non-whitelisted files (`profile.jpg`, the empty nested `SamiulArafatImon/`). I scaffolded into a scratch folder and copied the result in with `rsync` (excluding `node_modules`/`.next`), then ran `pnpm install --frozen-lockfile`. The empty nested folder was left untouched.
- Work happens on branch `feat/foundation`; `main` holds only the docs commit. The machine's existing git identity is used for commits.
- Vitest 5 resolves tsconfig paths natively (`resolve: { tsconfigPaths: true }`), so `vite-tsconfig-paths` was installed, then removed.
- View transitions need **no config flag** in the installed Next 16.3 docs (the 16.2 web docs mention `experimental.viewTransition`). Specs corrected.
- Result: `pnpm check` green (17 unit tests, build ok); `pnpm test:e2e` 3 passed — including the real-browser proof that Archivo's width axis is served (62 → 125 changes rendered width by more than 1.3×).
