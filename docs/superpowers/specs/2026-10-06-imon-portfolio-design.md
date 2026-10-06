# Samiul Arafat Imon — Portfolio: Design Spec & Master Plan

**Status:** v2 — approved to start Phases 0–2 ("improve, then start", 2026-10-06) · **Date:** 2026-10-06 · **Project root:** `/Users/mac/Developer/Offices/Montage/imon-portfolio`

This is the master plan: what we build, how it looks, how the code and data are organised, and the order of work.
**How it moves and behaves** (every animation, interaction and UX rule, with numbers) lives in the companion: [Motion & UX Spec](2026-10-06-motion-and-ux-spec.md).
Task-level plans (exact files, steps, tests) are written **per phase** (see §11), so they never go stale.

**What changed in v2:** added the Motion & UX Spec (boot sequence, scroll engine, tone curtain, timeline bar, cursor, route transitions, 3D ribbon spec, chapter-by-chapter Home choreography, micro-interactions, capability matrix, QA); verified Lenis↔GSAP, `useGSAP`, SplitText, `next/font` axes, R3F `frameloop` and Next 16 View Transitions against current docs; dropped the extra `motion` library; execution is inline with a stop at each phase gate; the `needsReview` build gate applies to production only; added a "you'll see" column to the roadmap.

---

## 0. In one paragraph

A multi-page, cinematic portfolio for Samiul Arafat Imon — video editor of 10 years and founder of Montage Motion. It looks and behaves like an edit suite: **footage sections go dark ("lights down"), reading sections go light ("lights up")**, a live **timeline bar** is the navigation, and one **3D film ribbon** built from Imon's real work is the hero. Parallax is a system, not decoration. **All content lives in a separate `content/` layer** that components never import directly, so copy, work, case studies and numbers can change without touching UI code. Every page has its own SEO. Three case studies follow the work samples.

---

## 1. Goal, audience, success

| | |
|---|---|
| **Single job of the site** | Turn a visitor into a booked 30-min call (Calendly) or a WhatsApp message. |
| **Primary audience** | YouTubers, podcasters, SaaS founders, brands and agencies deciding whom to trust with their footage. |
| **Secondary audience** | Collaborators, hires, press, people searching Imon's name. |
| **Proof order on the page** | Real work → real clients → real numbers → real words from clients. |
| **Two ways to buy** | *Hands-on with Imon* (this site) or *the Montage Motion team* (links to montagemotion.com). |

**Done means:** all pages in §6 live; Lighthouse/axe/Web-Vitals gates in §9 pass; no unverified claim ships; Imon can change any content by editing one file in `content/`.

---

## 2. What the two source sites gave us

**Old portfolio** (`transcendent-semolina-11650f.netlify.app`) — single page, dark navy + gold + orange, Bebas Neue / DM Sans. Good bones for *information*; weak as *evidence*: the work gallery tiles are emoji placeholders and the player modal literally says "Video player would load here. Connect your project files."

**Montage Motion** (`montagemotion.com`) — Next.js site, cyan brand (`#1FB5DD`, `#CCF4FF`, `#2B6AB2`), Poppins / Open Sans / DM Sans. Has the *real* material: 6 published case studies with attributed client quotes, 6 services, a 5-stage process, a team page, and real work samples (3 MP4 + 3 YouTube videos with thumbnails).

### 2.1 What carries over

| Information | From | Goes to |
|---|---|---|
| Bio, story, 2016→2025 milestones, education (Govt. Titumir College, University of Dhaka), Dhaka | Old | `about.ts` |
| Tools: Premiere Pro, DaVinci Resolve, After Effects, Photoshop, Lightroom, Final Cut Pro | Old | `about.ts` |
| Contact: email, WhatsApp +880 1786 546 949, Calendly 30-min, Instagram `@_samiul_arafat`, LinkedIn `samiul-arafat`, YouTube `@samiularafatimon`, Fiverr `samiularafat` | Old + Agency | `site.ts` |
| 6 services (merged from both sites, see §6) | Both | `services/*.ts` |
| Process: Discover & Align → Strategy & Creative Direction → Edit → Review & Refine → Deliver | Agency | `process.ts` |
| Packages: Starter / Pro / Agency (no prices — "Custom") | Old | `pricing.ts` |
| 7 FAQs (delivery, revisions, formats, international, payment, samples, how to start) | Old | `faq.ts` (rewritten) |
| 6 case studies, 5 with attributed client quotes | Agency | `case-studies/*.ts` (3 chosen, §6.1) |
| Real work samples (3 MP4 `wor-1..3`, 3 YouTube IDs, thumbnails) | Agency | `work.ts` seed |
| Real client names for the proof strip: Pathao, Arkangel University, Elite Rentals Dubai, Fafa Fitness, JetEdCo, Rich From Anywhere | Agency | `clients.ts` |

### 2.2 What must be confirmed before launch (nothing here is silently shipped)

| Claim | Old site | Agency site | Plan |
|---|---|---|---|
| Clients | 700+ | 1000+ | May be personal vs agency-wide (both true). Confirm; show each under the right label. |
| Team size | 20+ | 12+ | **Conflict.** Dev default: 12+ (agency's own 2026 About page). |
| Years of experience | "8+" | — | Start year 2016 → **10 years as of 2026**. Stored as `careerStartYear`, computed, never hard-coded. |
| 30+ countries · 50K+ YouTube subs · Fiverr Top Rated 5.0 / 500+ reviews · Montage Motion founded 2021 | yes | — | Unverifiable from outside. Marked `needsReview`. |
| Brand logos GUCCI, PRAN, CULTMIA, NEXUS, VISTARA, APEX, DELTA, LUMIO, NOVA | yes | — | **Excluded.** Look like template placeholders; a luxury trademark we can't show is a legal and credibility risk. Replaced by the real clients above. |
| Testimonials James Mitchell, Sara Khan, Ahmed Tanvir, Laura Peters | yes | — | **Excluded** unless Imon confirms they are real and cleared. Replaced by the 5 attributed case-study quotes. |
| YouTube "latest videos" with view counts | yes | — | Replaced by a live channel feed (needs channel ID), not hard-coded numbers. |
| Before/after "RAW vs EDITED" slider | demo only | — | Rebuilt as a real component; ships when Imon supplies real raw + graded clips. |

Mechanism: every stat/claim record has `needsReview: true` until cleared. `pnpm content:check` lists them; the **production build fails** while any remain (§7.4).

---

## 3. Decisions I made (change any of them now — cheap now, expensive later)

| # | Decision | Default | Why |
|---|---|---|---|
| D1 | Stack | Next.js 16 App Router, React 19, TypeScript (strict), Tailwind 4, pnpm | Same as the sibling `montage-academy` frontend → one skill set, tokens can be shared later. |
| D2 | Animation | GSAP (ScrollTrigger, SplitText, Flip, CustomEase — free) + Lenis smooth scroll for wheel/trackpad (touch scrolling stays native). **No second animation library.** | One engine drives parallax/pin/scrub/reveals; Lenis is ticked by GSAP (pattern verified in Lenis docs). |
| D3 | 3D | React Three Fiber + drei + three, **one** WebGL scene (hero ribbon, bookended at contact) | Memorable, cheap to maintain; everything else is CSS-3D / 2.5D. |
| D4 | Theme | Content-driven two tones (dark for footage, light for reading). **No user dark/light toggle.** | Fewer states to polish; the old toggle goes away. |
| D5 | Language | English only | International client base. Content layer can take a locale later. |
| D6 | Hosting | Vercel; domain TBD (`SITE_URL` env) | Native Next hosting, ISR for the YouTube feed. |
| D7 | Contact | Server Action → Resend email to `imonofficial2@gmail.com`, Cloudflare Turnstile + honeypot; WhatsApp + Calendly alongside | No backend to run; spam-resistant. |
| D8 | Analytics | Vercel Analytics or Plausible (no cookie banner) | Privacy-friendly; GA4 can be added via env. |
| D9 | Case studies | **Pathao** (commercial), **Rich From Anywhere** (long-form YouTube), **Fafa Fitness** (short-form) | Covers Imon's three core formats; Fafa has the only hard number (556K subscribers — audience size, not growth). Swap candidates: Arkangel University, JetEdCo, Elite Rentals Dubai (see §6.1). |
| D10 | Out of scope v1 | Blog/Journal, Bengali, CMS UI, reviews page, theme toggle, live YouTube feed (needs a confirmed channel ID) | Not needed to launch; architecture leaves room (§7.5). |
| D11 | How I execute | Inline in this session, stopping at every phase gate with a live `pnpm dev` URL. Parallel agents only if you ask for them. | Keeps context in one place and costs less; you review before the next phase starts. |
| D12 | Route transitions | Native View Transitions: React `<ViewTransition>` + `<Link transitionTypes>` (Next 16.3 needs no config flag — checked in the bundled docs) as a progressive layer | Match-cut from card to case study without hacks. Browsers differ (Safari/Firefox), so the site must work with transitions off. |
| D13 | Work-card hover previews | Muted ~4 s loop on desktop hover | Strongest "this person edits video" signal on the page. Needs short preview clips (§13). |
| D14 | `needsReview` gate | Fails the build only for the production deployment; previews and local builds warn | Lets you share previews while facts are still being confirmed. |

---

## 4. Design direction

### 4.1 Concept — "Lights down for footage, lights up for reading"

A cinema rule turned into a layout rule. Wherever the page shows moving image (hero, work, case-study approach and deliverables, footer reel) the room is dark. Wherever it asks you to read (about, services, pricing, FAQ, results) the lights come up. Scrolling between them animates the house lights. The structure tells the visitor what kind of content they're in — it isn't decoration.

Both tones share one accent, one type system and one spacing scale, so every page stays consistent. Tone is set per `<Section tone="dark|light">`, never per page.

### 4.2 Tokens

**Colour** (6 named values; ramps derived in `tokens.css`)

| Name | Hex | Role |
|---|---|---|
| Ink | `#050D14` | Dark-tone ground (screening room) |
| Console | `#0E1C28` | Raised surfaces in dark tone |
| Paper | `#EEF4F7` | Light-tone ground — a cool white, not cream |
| Signal | `#1FB5DD` | Brand accent from Montage Motion: playhead, focus ring, key numerals, links on dark |
| Mist | `#8CA3B1` | Secondary text on dark (≈7:1 on Ink) |
| Rec | `#FF5A47` | Micro-signal only: the REC/"booking" dot. Under 2% of pixels. |

Signal on Paper is only ≈2.2:1, so text on Paper uses a derived **Deep Signal** (`#0A6F90`, ≈5:1) and a derived slate for secondary text. Every text pair is checked ≥ 4.5:1 by a script in Phase 2.

**Type** — type is the personality; it's used with restraint.

| Role | Face | Use |
|---|---|---|
| Display | **Archivo** (variable, weight + **width** axis 62–125) | Headlines and the name. The width axis acts as *aspect ratio*: condensed = 9:16 (Shorts), expanded = 16:9 (cinema). The hero name auto-fits its container by changing width; headlines "reframe" on reveal. |
| Body | **DM Sans** | Reading text (same family the agency uses, so the two brands sit together) |
| Utility | **DM Mono** | Timecodes, chapter labels, captions, data |

Scale is fluid (`clamp`) with named steps: `display-xl · display · h2 · h3 · lead · body · small · mono`.

**Layout** — 12-column grid, content max 1360px, fluid gutters; 4px spacing base; section padding `clamp(96px, 14vw, 200px)`; radius scale 4/12/24; motion tokens in the [Motion & UX Spec](2026-10-06-motion-and-ux-spec.md) §2.

**Copy voice** — plain, specific, first person ("I") for Imon, "we" only for Montage Motion. Numbers over adjectives. Buttons say what happens: "Book a call", "Watch the reel", "Send message".

### 4.3 Signature — the page is an edit timeline

1. **Timeline bar** (fixed, bottom on desktop; slim top line + chapter sheet on mobile): a timecode (`HH:MM:SS:FF`) mapped to scroll position, section "clips" sized to their length, a draggable playhead. Dragging it navigates. Keyboard: ←/→ jump chapter. It's real navigation (also exposed as a normal link list), and it carries a mini **Book a call** button so the CTA never disappears when the header hides.
2. **3D film ribbon** in the hero: a ribbon of real frames from Imon's work curving through space; cursor tilts it, scrolling pulls the camera along it and unrolls it into a flat strip as the hero ends. It returns at the contact section ("end of timeline"), where the footer is laid out as **end credits**.
3. **Cuts, not fades**: sections and routes change with wipes and match cuts. Three match cuts are designed in: *hero name → header wordmark*, *case-study card → case-study hero*, *work thumbnail → lightbox*.
4. **Type that reframes**: the display face's width axis plays the role of aspect ratio — condensed = 9:16, expanded = 16:9 — in the boot sequence, the services list hover, and the service-page hero.

Spend boldness here; keep everything else quiet. Full numbers and timings: [Motion & UX Spec](2026-10-06-motion-and-ux-spec.md).

### 4.4 Considered and rejected

- Near-black + one bright accent as the whole page (a default look, not a choice) → replaced by the dual-tone rule.
- Condensed all-caps display like the old site's Bebas Neue (the generic "film" look) → replaced by the width-axis idea.
- Clapperboard / film-reel clip-art, teal-and-orange gradients, glass blobs → cut.
- WebGL in four places → cut to one scene plus CSS depth.

### 4.5 Wireframes

Home hero (desktop):

```
┌──────────────────────────────────────────────────────────────────────────┐
│ SAI.   Work  Case studies  Services  About  Pricing    ● Booking Nov  [Book a call]
│                                                                          │
│ 00:00:03:12                                   ╱▔▔▔╲   3D film ribbon     │
│                                            ╱▔▔▔╱ ▓▓ ╲  (real frames,     │
│ SAMIUL ARAFAT IMON  ← width-axis fit      ▕ ▓▓   ▓▓ ▏   cursor tilt,    │
│ Video editor · Founder, Montage Motion     ╲___╱ ▓▓ ╱   scroll unrolls) │
│ I turn raw footage into stories             ╲▁▁▁╱                        │
│ people finish watching.                                                  │
│ [Book a call]  [▶ Watch the reel]                                        │
│ ▶ 00:00:03:12 ┃ Reel ░░ Proof ░░ Work ░░ Cases ░░ Services ░░ Contact    │ ← timeline bar
└──────────────────────────────────────────────────────────────────────────┘
```

Case-study detail (tones in brackets):

```
[dark ] Hero ─ client · title · 3 facts (Industry / Format / My role) · parallax key frame
[light] Brief ─ sticky label left · challenge text right
[dark ] Approach ─ pinned scene: 3 steps; frames swap left, text right
[dark ] Deliverables ─ video embeds / thumbnails
[light] Result ─ count-up metrics (or outcome narrative if none) · client quote + portrait
[dark ] "Cut to next case study" full-bleed teaser · CTA band
```

---

## 5. Motion, parallax and 3D (summary — the full spec is the [Motion & UX Spec](2026-10-06-motion-and-ux-spec.md))

**Grammar.** The site moves like an edit: *cut, wipe, match cut, speed ramp, rack focus, timecode*. No bounces or spins. Every motion has a source (time, scroll, pointer) and a meaning (orient, reveal, emphasise, confirm). One "star" motion per viewport.

**Systems built once in Phase 2 and used everywhere:** `MotionProvider` (GSAP ticker drives Lenis; fonts-ready and route refresh) · four reveal types (`mask`, `wipe`, `rise`, `fade`) · one `Parallax` primitive with three speeds (.08 / .16 / .30) · `Pin` · `HorizontalTrack` · `TiltCard` · `Magnetic` · `CountUp` · `Marquee` (scroll-velocity reactive) · `ImageReveal` · cursor follower · `ToneSection` (the "house lights" curtain) · timeline bar · cut-wipe route transitions.

**Where parallax lives (required):** hero depth layers · 2.5D About portrait (sky, hills, subject, laptop at different speeds + pointer shift) · image-inside-mask drift on every work/case card · case-study hero · oversized outlined section words.

**3D:** one React Three Fiber scene — the film ribbon — with a three-tier ladder: **A** full WebGL, **B** CSS-3D with the same composition, **C** static poster (reduced motion / no WebGL). `?tier=a|b|c` forces a tier for QA.

**Safety contract:** content is complete without JS; reveals have a pure-CSS failsafe; reduced motion switches off Lenis, parallax, pins, tilt, marquee, 3D, cursor follower and route transitions while keeping every function.

---

## 6. Sitemap and page blueprints (18 URLs)

Every page = `PageShell` (header, timeline bar, footer) + `PageHero` variant + `ToneSection`s from the same primitives. That is how consistency is guaranteed.

| Route | Purpose | Key sections |
|---|---|---|
| `/` | Convert | 12 chapters: Title (hero + ribbon) · Proof (stats + client names) · Reel · Work · Cases (3) · Services · Process · About · Words · Studio (Montage Motion) · FAQ · Contact + credits. Timeline-bar chapters: Title · Proof · Reel · Work · Cases · Services · About · Contact. Choreography: [Motion & UX Spec](2026-10-06-motion-and-ux-spec.md) §5 |
| `/about` | Trust | Story · milestones timeline 2016→now · 2.5D portrait · tools · education · values · agency link |
| `/work` | Evidence | Filterable gallery (Short-form, Long-form, Podcast, Commercial, Motion, Thumbnails) · lightbox player · deep-link `?v=` |
| `/case-studies` | Depth | Index of the 3 |
| `/case-studies/pathao` · `/rich-from-anywhere` · `/fafa-fitness` | Depth | See wireframe §4.5 |
| `/services` | Offer | 6 services overview + how it works |
| `/services/short-form-video-editing` · `youtube-video-editing` · `podcast-video-editing` · `motion-graphics-explainers` · `promo-commercial-video` · `thumbnail-design` | Search + offer | What's included · who it's for · process · related work · related case study · FAQ |
| `/pricing` | Qualify | Starter / Pro / Agency · what's included · FAQ · custom-quote CTA |
| `/contact` | Convert | Form · Calendly · WhatsApp · email · socials · availability |
| `/privacy` · `/terms` | Required | Short, plain legal pages |
| `404` · error · loading | Polish | On-brand, with a path back |
| (system) `sitemap.xml` · `robots.txt` · per-page OG images · `/design-system` (noindex, non-prod) | | |

**Services merged from both sites:** Short-form & Reels · YouTube & talking-head (long-form) · Podcast · Motion graphics & SaaS explainers (2D/3D) · Brand commercials & promos (incl. corporate) · Thumbnail design (delivered by the agency team).

### 6.1 Case-study selection

| Case study | Format it proves | Hard data available | Client quote |
|---|---|---|---|
| **Pathao** *(chosen)* | Commercial + short-form adaptation | Client scale (2,670 staff, BD & Nepal) | None published |
| **Rich From Anywhere** *(chosen)* | Long-form / talking-head system | "100% of episodes got the editing system" | Stephen Blackburn, Co-founder |
| **Fafa Fitness** *(chosen)* | Short-form / Reels / TikTok | 556K subscribers (audience size, not growth) | Fafa, Founder |
| Arkangel University | Recruitment commercial + ad variants | none | Dr Mohamed Khan, Associate Dean |
| JetEdCo | Conversion VSL | Client sells $25M+ charter flights | Jordan Strum, Founder & CEO |
| Elite Rentals Dubai | Premium luxury Reels | none | Julian De Graaf, CEO |

None of the published case studies carry real outcome metrics (views, retention, growth). **We will not invent any.** The Result block renders an outcome narrative when metrics are absent and count-up numbers when Imon supplies real ones. Case-study copy is rewritten in our own words, from Imon's point of view, so it isn't duplicate content of montagemotion.com. Imon's exact role per project is unconfirmed, so the "my role" field is `needsReview` and defaults to "Led by Montage Motion" until confirmed.

---

## 7. Architecture

### 7.1 Folder layout

```
imon-portfolio/
├─ content/                  ← DATA ONLY. No JSX, no component imports.
│  ├─ site.ts  home.ts  about.ts  stats.ts  clients.ts  process.ts
│  ├─ pricing.ts  faq.ts  testimonials.ts  work.ts  seo.ts  ui.ts  media.ts
│  ├─ services/*.ts          one file per service
│  ├─ case-studies/*.ts      one file per case study
│  └─ schema/*.ts            Zod schemas = the contract for every file above
├─ src/
│  ├─ app/                   routes only — thin; no copy, no literals
│  ├─ features/              page sections (Hero, WorkGallery, CaseStudyScene…) — take props
│  ├─ components/ui/         design-system primitives (Button, Badge, Heading, Section…)
│  ├─ components/motion/     Reveal, Parallax, Pin, TiltCard, TimelineBar…
│  ├─ components/three/      R3F scenes, lazy, client-only
│  ├─ lib/content/           ★ the only door to data (async accessors)
│  ├─ lib/seo/               metadata + JSON-LD builders
│  ├─ lib/motion/            GSAP/Lenis provider, tokens, capability detection
│  ├─ lib/routes.ts          typed route helpers (no hard-coded paths)
│  └─ styles/tokens.css      design tokens → Tailwind @theme
├─ public/media/             self-hosted, optimised images/video posters
├─ scripts/                  content:check, media optimise
├─ tests/                    unit (Vitest) · e2e + a11y (Playwright)
└─ docs/                     this spec, phase plans, CONTENT_GUIDE.md
```

### 7.2 The decoupling rules (enforced, not just agreed)

1. `src/components/**` and `src/features/**` **cannot import from `content/`** — only from `lib/content`. (ESLint `no-restricted-imports`.)
2. `content/**` **cannot import from `src/`** except types. Data stays plain.
3. **No literal copy in JSX.** Headings, button labels, aria labels, form messages and empty/error states come from `content/` (`ui.ts` for microcopy).
4. Images/video come from `media.ts` by id; **alt text is required by the schema**. Links come from `routes.ts`.
5. Every `content/` file is validated by Zod in `pnpm content:check` (runs in `pnpm check` and in CI/build).

### 7.3 Swap path (why this stays flexible)

`lib/content` exposes async functions — `getSite()`, `getServices()`, `getCaseStudy(slug)`… Today they return the typed modules. Moving to a CMS (Keystatic, Sanity, Payload, or the Montage backend) means re-implementing those functions against the same Zod schemas; **no component changes**. The YouTube feed already works this way (live fetch with revalidation, static fallback).

### 7.4 Quality guard for claims

Records that carry a claim (stats, "Top Rated", team size…) include `needsReview?: boolean`. `pnpm content:check` prints them everywhere; the build **fails only for the production deployment** (`VERCEL_ENV=production`, or `CONTENT_STRICT=1` locally) while any remain. Local and preview builds warn, so you can share previews while facts are being confirmed.

### 7.5 Changing data later (what Imon or any dev will do)

| Task | Edit |
|---|---|
| New work sample | Add one entry in `content/work.ts` (+ thumbnail via `media.ts`) |
| New case study | Copy `content/case-studies/_template.ts`, fill it, add one line to the index; route and sitemap appear automatically |
| Change a number / contact / social | `content/stats.ts` · `content/site.ts` |
| Change a price or package | `content/pricing.ts` |
| Add Bengali or a blog later | Add a locale key / a `posts` collection beside the others — no restructuring |

`docs/CONTENT_GUIDE.md` documents this at handover.

### 7.6 Versions (checked on npm 2026-10-06; pin at scaffold)

next 16.3.x · react 19.3 · tailwindcss 4.3 · gsap 3.15 · lenis 1.3 · three 0.186 · @react-three/fiber 9.8 · @react-three/drei 10.7 · zod 4.6. **Caveats:** npm also lists TypeScript 7; I'll pin the majors the tooling supports (TS 5.x, as the sibling project) unless Next's bundled docs say otherwise. Verified against Next 16.2 docs: `params`/`searchParams` are async, `middleware` is now `proxy.ts`, Turbopack is the default, `next/image` needs `images.qualities`, there is no `next lint`, and `next/font/google` `axes` works for variable fonts only when no explicit weight is set. The sibling's `AGENTS.md` warns Next 16 has breaking changes: **Phase 0 starts by reading `node_modules/next/dist/docs/`**, not from memory.

---

## 8. SEO plan (per page, from `content/seo.ts`)

- **Every route:** unique `<title>` (≤ 60) and description (≤ 155), canonical, Open Graph + Twitter card with a generated OG image, one `h1`, logical heading order, descriptive alt text, breadcrumb markup, internal links (service ↔ work ↔ case study).
- **Structured data:** `Person` (Imon, `sameAs` all socials, `founder` of the Montage Motion `Organization`) · `WebSite` · `ProfilePage` (About) · `Service` (each service page, `provider` = Imon) · `Article` (case studies) · `VideoObject` (work items) · `FAQPage` (FAQ blocks) · `BreadcrumbList`. No self-review markup (search engines ignore it).
- **Keyword map** (confirmed with Imon, then fixed in data): "Samiul Arafat Imon" (brand/name), "video editor Bangladesh", "freelance video editor for YouTubers", "podcast video editing", "short-form video editor / Reels editing", "video editing pricing", "hire a video editor".
- **Avoid cannibalising montagemotion.com:** different copy, personal first-person angle, clear cross-links, `sameAs` ties the two together.
- **Technical:** `sitemap.ts`, `robots.ts`, `metadataBase`, redirects for any old URLs, Search Console + analytics wired in Phase 7, Web Vitals treated as ranking inputs (§9).

---

## 9. Quality gates (a phase isn't done until these hold)

| Area | Gate |
|---|---|
| Performance (mobile) | Lighthouse ≥ 90 inner pages, ≥ 85 Home; LCP < 2.5s; CLS < 0.05; INP < 200ms |
| Bundles | Initial route ≤ 180KB gz JS; lazy 3D chunk ≤ 250KB gz and loaded after first paint |
| Accessibility | Lighthouse ≥ 95; axe: zero serious/critical; full keyboard pass; visible focus; skip link; contrast ≥ 4.5:1 |
| Motion safety | `prefers-reduced-motion` disables smooth-scroll, parallax, pinning and 3D; no scroll-jacking beyond pinned scenes with clear exits |
| Motion QA | The Playwright "motion contract" suite and manual gates in [Motion & UX Spec](2026-10-06-motion-and-ux-spec.md) §11 pass: no JS → text visible · reduced motion → no transforms · no stuck-hidden elements · each 3D tier renders · ≥ 55 fps hero scrub on a modern laptop |
| Responsive | Screenshot review at 375 · 768 · 1280 · 1920 for every page |
| Browsers/devices | Chrome, Safari, Firefox, iOS Safari, one mid-range Android |
| Content | `content:check` green; `needsReview` list empty before launch |
| Logic code | TDD (Vitest) for schemas, accessors, SEO builders, utilities |
| Visual work | Verified by running pages and screenshots against this spec — not "it compiles" |

---

## 10. Roadmap (effort: S / M / L)

I stop at every gate. "You'll see" is what you can open and judge before the next phase starts.

| Phase | Delivers | Effort | Acceptance | You'll see |
|---|---|---|---|---|
| **0 Foundation** | Read Next 16 docs → scaffold; TS strict; Tailwind tokens; fonts (verify the variable width axis is really served); ESLint boundary rules; Vitest + Playwright; zod-validated env; `pnpm check`; `git init` | S | Empty shell builds; `pnpm check` green; fonts load with no layout shift | Running site with the real type system and colours |
| **1 Content layer** | Zod schemas; seed data from §2 for every page; `lib/content` accessors; `content:check` + `needsReview` report; tests written first (TDD) | M | Every page's data exists in `content/`; boundary lint passes; tests green | `pnpm content:check` output, including the list of facts still to confirm |
| **2 Design system + motion engine** | Tokens + two-tone system; UI primitives; `MotionProvider` (GSAP→Lenis); four reveals, parallax, pin, tilt, magnetic, count-up, marquee, tone curtain; hydration-safe reveal + CSS failsafe; capability detection and `?tier`; `/design-system` page; contrast script | M–L | Every primitive demoed in both tones and in reduced-motion; scroll sync verified; motion-contract tests green | **`/design-system`**: the whole visual language moving, for your review before Home is built |
| **3 Shell + Home** | Header, footer-as-credits, timeline bar, boot sequence, hero + FilmRibbon + tiers A/B/C, all 12 Home chapters | L | Home passes §9; fallbacks tested; screenshot review | The full Home page |
| **4 Case studies** | Index + 3 detail pages, pinned Approach scene, match-cut transitions | M–L | Pass §9; copy approved by you | 3 case-study pages |
| **5 Work · Services · About** | Gallery + lightbox, services index + 6 pages, About with 2.5D portrait + milestones timeline | L | Pass §9 | These pages |
| **6 Pricing · Contact · Legal · 404** | Pricing, contact form (Server Action, Resend, Turnstile), Calendly/WhatsApp, privacy/terms, 404/error | M | Form works end-to-end incl. spam and failure states | Working form |
| **7 SEO + analytics** | Metadata, JSON-LD, OG images, sitemap/robots, analytics, Search Console | M | Rich-results test clean; every route has unique meta | SEO report per route |
| **8 Hardening + launch** | Perf/a11y/device QA, clear `needsReview`, deploy, domain, monitoring, `CONTENT_GUIDE.md` | M | All §9 gates; you sign off | Live site |

Phases 4–6 are independent once Phase 3 locks the shell. They run one after another by default; if you want speed, parallel agents are an option (D11).

---

## 11. How the work will run (superpowers workflow)

1. **Spec approved** — done for Phases 0–2 ("improve, then start").
2. **writing-plans** produces the task-level plan for Phases 0–2: bite-sized tasks, exact files, tests, commands, in `docs/superpowers/plans/`. Later phases are planned when reached, because the Phase 2 and Phase 3 design critiques will change what follows.
3. **Execution is inline** (executing-plans style): I work through the plan task by task in this session, with TDD for logic code and a check after every task. No sub-agents unless you ask (D11).
4. **Design loop** (frontend-design): build → screenshot at 375 / 768 / 1280 / 1920 → critique against §4 and the Motion & UX Spec → remove one "accessory" → fix.
5. **Verification before completion** at every phase gate: run the commands, show the output and screenshots; no "should work".
6. I stop at each phase gate with a live `pnpm dev` URL for you to review.

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| Unverified numbers or logos ship | `needsReview` flag + failing production build (§7.4) |
| 3D hurts low-end phones | Three-tier ladder, `PerformanceMonitor` auto-downgrade, lazy chunk, budgets (§5, §9, Motion spec §4) |
| GSAP/Lenis + App Router bugs (cleanup, route changes) | `useGSAP` scoping, `matchMedia`, provider tested across route changes in Phase 2 |
| Next 16 differs from my memory | Read bundled docs first (Phase 0) |
| Bleeding-edge dependency majors | Pin to versions the tooling and sibling project support |
| Variable width axis not exposed by `next/font` | Verify in Phase 0; fallback is self-hosting the font file |
| Duplicate content with montagemotion.com | First-person rewrite, canonical, cross-links |
| Asset rights / hotlinking the agency bucket | Self-host copies; confirm client permission for thumbnails and quotes |
| Source numbers came through page summarisation | Re-verify each fact against the live source when writing the data files |
| View Transitions behave differently across browsers; the shared-element morph only forms when the destination is prefetched | Transitions are a progressive layer (D12); the site works with them off; prefetch case-study links; verified on Chrome/Safari/Firefox in Phase 3 |
| Hero name → wordmark match cut is fiddly (measure + FLIP across a pin) | Built behind a crossfade fallback; measured on refresh with `invalidateOnRefresh` |
| 2.5D portrait needs clean layer separation from one photo | Try background removal / layer separation first; fall back to a 2-layer parallax or Ken Burns if edges are poor |
| Hover previews need short clips | Generate 4 s 480p loops with ffmpeg from supplied videos (§13); poster-only if none |
| Reveal hides content if JS fails | CSS failsafe + `<noscript>` rules (Motion spec §9.3) and a Playwright test |
| Scope creep (blog, i18n, CMS) | §3 D10 out-of-scope list |

---

## 13. What I need from Imon (none of it blocks Phases 0–2)

| Needed | For | If missing |
|---|---|---|
| Answers to §2.2 (clients, team, countries, subs, Fiverr, founding year) | Stats, About | Placeholders stay flagged; launch blocked |
| Personal showreel (60–90s) | Hero/reel | Temporary: agency `intro.mp4` |
| 9–12 best works with links, category, client, and *which edits are personally Imon's* | Work gallery | Seed with the agency's 6 |
| 1–2 real RAW vs graded clips | Before/after | Component ships hidden |
| Real outcome numbers for the 3 case studies (views, retention, growth) + Imon's exact role | Results blocks | Narrative-only results |
| YouTube channel ID; confirm Fiverr / LinkedIn / Instagram handles are live | Feed, `sameAs` | Static links, no feed |
| Domain name | Canonical, OG, email | `SITE_URL` placeholder |
| Pricing: show numbers or keep "Custom"? | `/pricing` | "Custom quote" |
| Personal logo/wordmark? | Header | Wordmark "Samiul Arafat Imon" + monogram "SAI" |
| Higher-res / extra photos (current `profile.jpg` is 2048², good for the layered portrait) | About | Use current photo |
| Short preview clips (or OK to cut 4 s loops from full videos) | Work-card hover previews | Poster-only cards |

---

## Appendix A — Source notes

- Old portfolio: fetched raw HTML and read all text/scripts (fetched 2026-10-06; its footer says "© 2025").
- Montage Motion: homepage HTML, `/portfolio` HTML (media URLs and video links read directly), `/about-us`, `/case-studies`, and 6 case-study pages (via page summarisation).
- Not verifiable from here: the YouTube channel page (fetch returned only footer links), Fiverr, LinkedIn, Instagram.
- The empty nested folder `imon-portfolio/imon-portfolio/` is untouched; the app will live in the project root unless you say otherwise.
- v2 technical patterns were checked against current docs on 2026-10-06: Lenis README (GSAP ticker integration), GSAP ScrollTrigger / `useGSAP` / `matchMedia` / SplitText guidance, Next 16.2 docs (`next/font` axes, View Transitions, upgrade guide) and React Three Fiber performance docs. Anything not covered there is flagged as "verify in Phase N".
