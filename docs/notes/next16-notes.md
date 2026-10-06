# Next.js 16 notes (from the docs bundled with the installed version, 16.3.8)

Source of truth: `node_modules/next/dist/docs/`. Read on 2026-10-06. Where this differs from the web docs for 16.2.x, the installed docs win.

## Async request APIs
- `params` and `searchParams` are Promises: `const { slug } = await params`. Image/OG routes get async `params` and `id` too.
- Route-typed helpers are generated globally: `LayoutProps<"/">`, `PageProps<"/case-studies/[slug]">`.
- Docs: `01-app/02-guides/upgrading/version-16.md`.

## `proxy.ts`
- `middleware` was renamed to `proxy` (file `proxy.ts`, exported function `proxy`). We don't need one in v1.
- Docs: `01-app/03-api-reference/03-file-conventions/proxy.md`.

## Fonts
- `next/font/google` `axes` is only valid for variable fonts **and only when `weight` is omitted or `"variable"`**.
- Archivo exposes `wdth 62–125` and `wght 100–900`, so `Archivo({ axes: ["wdth"] })` is valid. DM Mono is **not** variable (weights 300/400/500).
- Docs: `01-app/03-api-reference/02-components/font.md`.

## View Transitions
- **No config flag is required** in 16.3 — view transitions work in the App Router out of the box (the App Router ships React canary, which includes `<ViewTransition>`). The flag `experimental.viewTransition` seen in 16.2 web docs does not appear in the installed docs.
- `<ViewTransition>` animates on Transitions, Suspense and `useDeferredValue` — route navigations are Transitions, so it fires automatically.
- Shared element: wrap thumbnail and hero in `<ViewTransition name="x">` with the **same name**. With `default="none"` you must also pass `share="morph"` or the pair silently stops morphing. The morph only forms when the destination renders in the same commit as the navigation (prefetched pages).
- Direction: `<Link transitionTypes={["nav-forward"]}>` and `<ViewTransition enter={{ "nav-forward": "…", default: "none" }}>`.
- Persistent chrome: give the header `viewTransitionName: "site-header"` and suppress its group animation in CSS so it doesn't crossfade.
- Reduced motion: `@media (prefers-reduced-motion: reduce) { ::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) { animation-duration: 0s !important; animation-delay: 0s !important } }`.
- Without browser support the app works normally; transitions just don't animate.
- Docs: `01-app/02-guides/view-transitions.md`, Link `transitionTypes`.

## JSON-LD
- Render as a native `<script type="application/ld+json">` in `layout`/`page` (not `next/script`).
- Escape `<`: `JSON.stringify(data).replace(/</g, "\\u003c")`. `schema-dts` can type it.
- Docs: `01-app/02-guides/json-ld.md`.

## Preventing flash before hydration
- Use an inline `<script>` that runs during parsing to set state before first paint; put `suppressHydrationWarning` on the element the script changes (e.g. `<html>`). In Server Components a plain `<script dangerouslySetInnerHTML>` is fine.
- Docs: `01-app/02-guides/preventing-flash-before-hydration.md`.

## Lazy loading and 3D
- `next/dynamic(..., { ssr: false })` **only works inside a Client Component**; using it in a Server Component is an error. The R3F canvas therefore needs a small `"use client"` wrapper that does the dynamic import.
- Docs: `01-app/02-guides/lazy-loading.md`.

## Environment variables
- Only `NEXT_PUBLIC_*` reaches the browser, inlined at build time. Everything else is server-only. Our parsed env lives in `src/config/env.server.ts` (`server-only`).
- Docs: `01-app/02-guides/environment-variables.md`.

## Images
- `images.qualities` is **required** in `next.config.ts` (e.g. `[60, 75, 90]`); other values are coerced to the nearest allowed.
- Docs: `01-app/03-api-reference/02-components/image.md`.

## Tooling
- Turbopack is the default for `dev` and `build`. There is no `next lint`: run `eslint` directly (our `pnpm lint`).
- Vitest does not support async Server Components: unit-test logic and sync components; use Playwright for pages.
- Docs: `01-app/02-guides/testing/vitest.md`, `playwright.md`.
