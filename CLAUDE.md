@AGENTS.md

# Imon portfolio — project rules

Specs: `docs/superpowers/specs/` (master spec + Motion & UX spec). Plans: `docs/superpowers/plans/`. Next 16 notes: `docs/notes/next16-notes.md`.

## Non-negotiables
- **Content is data.** All copy, work items, case studies, stats, contact details and SEO text live in `content/`. UI code reads them only through `@/lib/content`. ESLint enforces this; do not disable the rule.
- **No literal copy in JSX** (labels, headings, aria text, alt text, error messages come from `content/`).
- **Never invent facts.** Unverified claims carry `needsReview: true`; the production build fails while any remain.
- **One accent, two tones.** Colours and spacing come from `src/styles/tokens.css`; components read `--tone-*`.
- **Motion has a source and a meaning**, and every effect has a reduced-motion variant (see the Motion & UX spec).
- Use the `@/` alias; parent-relative imports are banned in `src/`.

## Commands
`pnpm dev` · `pnpm check` (typecheck + lint + unit tests + build) · `pnpm test:e2e` (Playwright)
