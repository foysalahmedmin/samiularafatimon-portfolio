# Changing what the site says

Everything the site says lives in `content/`. Components never contain copy, so you change data, not code.

| To change | Edit |
|---|---|
| Name, contact, socials, nav, footer, availability | `content/site.ts` |
| Home headings and buttons | `content/home.ts` |
| Numbers (years, clients…) | `content/stats.ts` (years is computed from `site.careerStartYear`) |
| A work sample | `content/work.ts` + its media in `content/media.ts` |
| A service page | `content/services/<slug>.ts` (register new ones in `content/services/index.ts`) |
| A case study | `content/case-studies/<slug>.ts` (register in `content/case-studies/index.ts`; set `next` so the cases form a loop) |
| Testimonials, FAQ, pricing, process, About | `testimonials.ts`, `faq.ts`, `pricing.ts`, `process.ts`, `about.ts` |
| Page titles and descriptions | `content/seo.ts` (services and case studies carry their own `seo`) |
| Button labels, aria text, 404 and error copy | `content/ui.ts` |
| Privacy and Terms | `content/legal.ts` |

## Images and video

1. Add an entry to `content/media.ts` (alt text is required).
2. Run `pnpm media:sync` (needs `ffmpeg` for hover previews). It downloads/optimises into `public/media/` and updates `content/media.manifest.json`.
3. Reference it by `id` from other content files.

## Checking your edit

`pnpm content:check` validates every file (shapes, links, unique ids, SEO lengths, missing files) and lists every fact still marked `needsReview: true`. The **production deployment fails to build while any remain**; local and preview builds only warn. Remove the flag once the fact is confirmed.

## Environment

See `.env.example`. Production needs `SITE_URL`. The contact form needs `RESEND_API_KEY` and `CONTACT_FROM`.
