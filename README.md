# Samiul Arafat Imon — portfolio

Cinematic portfolio for Samiul Arafat Imon, video editor and founder of Montage Motion.

## Run

    pnpm install
    pnpm dev            # http://localhost:3000
    pnpm check          # typecheck, lint, unit tests, production build
    pnpm test:e2e       # Playwright (builds and serves on :3100)

Requires Node 20+ and pnpm 10. Copy `.env.example` to `.env.local` to change settings.

## Pages

Home · Work (filter + lightbox) · Case studies (3) · Services (6) · About · Pricing · Contact · Privacy · Terms. See `docs/CONTENT_GUIDE.md` to change content.

## Where things live

- `content/` — all site data (copy, work, case studies, stats, SEO). Edit here to change what the site says.
- `src/` — code. UI reads data only through `src/lib/content`.
- `docs/superpowers/specs/` — design and motion specs. `docs/superpowers/plans/` — implementation plans.
