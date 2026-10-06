# Motion & UX Spec — Samiul Arafat Imon Portfolio

**Companion to:** [2026-10-06-imon-portfolio-design.md](2026-10-06-imon-portfolio-design.md) · **Status:** Draft v2 for build · **Date:** 2026-10-06

The master spec says *what* the site is. This document says *how it feels*: every animation, interaction and UX rule, with numbers an implementer can type in. Patterns marked ✔ were checked against current official docs (GSAP, Lenis, Next 16.2, React Three Fiber) on 2026-10-06.

Each spec entry follows one shape: **Trigger → Effect → Timing → Mobile → Reduced motion.**

---

## 1. Motion grammar

The site speaks in the verbs of editing. Nothing else.

| Verb | Meaning on screen | Used for |
|---|---|---|
| **Cut** | Instant or ≤ 160 ms change, no in-between | State changes, tab switches, filter results |
| **Wipe** | `clip-path` reveal along one edge | Images, video, section tone changes, route changes |
| **Match cut** | One shape continues across a change | Name → header wordmark · card → case-study hero · thumbnail → lightbox |
| **Dissolve** | Opacity crossfade | Rare: canvas ↔ poster, quote swap on reduced motion |
| **Speed ramp** | Strong ease: slow → fast → settle | Reveals and scene moves |
| **Rack focus** | Blur → sharp | Hero ribbon on load and lightbox only. **Never on text.** |
| **Timecode** | Numbers tick | Loader, stats, timeline bar, form "sending" state |

**Six rules**

1. **Cut, don't fade.** No bounces, springs on layout, spins, or wobble.
2. **Every motion has a source and a meaning.** Source: *time*, *scroll*, or *pointer*. Meaning: *orient, reveal, emphasise, confirm*. If it does none of these, delete it.
3. **One star per viewport.** One scene (pin, big parallax, 3D) leads; everything around it stays at "subtle".
4. **Content is never hostage to animation.** HTML is complete and visible without JS; reveals are an enhancement with a CSS failsafe (§9.3).
5. **Speed hierarchy.** Micro 160 · UI 280 · reveal 700 · scene 1100 ms. Nothing the visitor waits on exceeds 1.4 s. Scroll-scrubbed motion has no duration.
6. **One camera.** Parallax follows depth: farther = slower. Light always comes from top-left.

---

## 2. Tokens (one source: `src/lib/motion/tokens.ts` mirrored in `tokens.css`)

| Token | Value | Notes |
|---|---|---|
| `ease.cut` | `cubic-bezier(.76,0,.24,1)` | Wipes, tone, scenes. GSAP: `CustomEase.create("cut", ".76,0,.24,1")` |
| `ease.glide` | `cubic-bezier(.22,1,.36,1)` | Reveals, hovers. GSAP `expo.out` is the near-equivalent |
| `ease.ramp` | `cubic-bezier(.55,0,1,.45)` | Exits only |
| `ease.linear` | `linear` | All scrubbed motion |
| `dur.micro / ui / reveal / scene` | 160 / 280 / 700 / 1100 ms | |
| `dist.nudge / rise / lift` | 8 / 32 / 64 px | Reveal offsets |
| `stagger.chars / words / lines / items / groups` | .02 / .05 / .09 / .08 / .12 s | |
| `parallax.subtle / medium / strong` | .08 / .16 / .30 | Fraction of the container's height travelled each way across a viewport pass (formula §9.5) |
| `depth` (hero layers) | bg .08 · mid .16 · fg .30 | Far = slow |
| `tilt.max` | 6° · perspective 900 px | Cards |
| `fps.target` | 24 | Timeline bar frame counter |

---

## 3. Global systems

### 3.1 Boot sequence — Home only, first visit per session, ≤ 1.6 s, skippable

| t | What happens |
|---|---|
| 0 | Ink screen. Mono timecode `00:00:00:00` bottom-left, small Rec dot. The hero `<h1>` is already in the DOM underneath (LCP is the text, not the overlay) |
| 0 – 0.9 s | Timecode counts up fast. The name *"SAMIUL ARAFAT IMON"* appears with width axis `62 → fit-to-viewport` and weight 800 (the "reframe") |
| 0.9 – 1.3 s | **Cut:** overlay wipes upward (`clip-path inset(0 0 100% 0)`, 400 ms `cut`). The name is the same element → it lands in its hero position (match cut) |
| 1.3 – 1.6 s | Ribbon rack-focuses in (blur 12 px → 0, scale 1.08 → 1); header and timeline bar rise in (y 24 → 0, 280 ms) |

- **Real readiness:** the overlay waits for `document.fonts.ready` and the first ribbon frame, with a 700 ms minimum and a 1.6 s hard cap. It is honest, not fake.
- **CSS-first:** the overlay is a CSS animation that finishes by itself; JS only *skips* it (any click, key or scroll). If JS fails, it still disappears.
- **Skip:** same session, return visit, `prefers-reduced-motion`, inner-page landings (SEO visitors see content immediately), `Save-Data`.
- **Reduced motion:** straight to hero, 300 ms opacity fade.

### 3.2 Scroll engine ✔

- **Lenis** for desktop pointer devices: `lerp: 0.1`, `autoRaf: false`, `syncTouch: false` (touch stays native — no scroll-jacking on phones).
- **GSAP drives Lenis:** `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`.
- With Lenis smoothing, ScrollTrigger uses `scrub: true` (not a number) so smoothing doesn't stack.
- `ScrollTrigger.config({ ignoreMobileResize: true })` stops the mobile address bar from re-triggering pins.
- Overlays (menu, lightbox) call `lenis.stop()`; inner scrollers carry `data-lenis-prevent`.
- **Refresh points:** `document.fonts.ready`, route mount, tab visibility return, and any image without reserved aspect-ratio (there should be none).
- **Reduced motion:** Lenis is never created; native scroll.

### 3.3 House lights (tone system)

- **Mechanism:** a dark section does not fade in. Its background is a pseudo-layer that *rises like a curtain*: `clip-path: inset(100% 0 0 0) → inset(0)`, scrubbed from `top 90%` to `top 40%`. Lights-up is the same curtain in light. Text colours switch via CSS variables on the section, so nothing is interpolated at runtime.
- **Chrome adapts:** one `IntersectionObserver` reads the tone under the header and timeline bar and sets `data-chrome-tone` on `<html>`; header and bar re-colour in 240 ms `glide`.
- **Rule:** tone is set per `<Section tone>`; never per page, never ad hoc.
- **Reduced motion:** hard cut, no curtain.

### 3.4 Header

| Item | Spec |
|---|---|
| Height | 76 px → 60 px after 80 px of scroll |
| Hide/show | Hides on scroll-down after 1.2 viewports (delta > 8 px); returns on scroll-up (delta > 4 px). Never hides while menu is open or anything inside has focus |
| Contents | Wordmark · nav (Work, Case studies, Services, About, Pricing) · availability pill (Rec dot pulses 2 s, text from `site.availability`) · **Book a call** |
| Nav hover | Underline wipes in left → right 240 ms; wipes out to the right on leave. Current page: small filled dot |
| Services menu | Opens on click/Enter/focus, hover with 80 ms intent delay; lists 6 services with one line each; `aria-expanded`; Esc closes |
| Mobile | Full-screen sheet: large Archivo links, line-mask stagger (.09 s), focus trap, closes on route change, `lenis.stop()` |
| Match cut | On Home the big hero name shrinks and travels to the wordmark position over the first 100vh of scroll (FLIP via scrubbed timeline, `invalidateOnRefresh: true`). The wordmark fades in the frame the name lands. Fallback: crossfade |

### 3.5 Timeline bar (signature UI)

| Item | Spec |
|---|---|
| Desktop | Fixed bottom-centre, `min(880px, 100vw − 48px)` × 44 px, Console fill, 1 px border, radius 12 |
| Left | Timecode `HH:MM:SS:FF` in DM Mono. Scroll 0 → 1 maps to `0 → site.timelineRuntime` (default 90 s at 24 fps). Updated with `gsap.quickSetter`, **not React state**. Pauses (frame holds) when scrolling stops |
| Centre | Track of **clips** = chapters, width ∝ section height (min 24 px). Current clip = Signal. Hover shows a tooltip (chapter name, 120 ms) |
| Playhead | 2 px Signal line + triangle cap, follows scroll 1:1 |
| Right | After the hero: **Book a call** mini button (so the CTA never disappears when the header hides). Before: total runtime |
| Click a clip | `lenis.scrollTo(section, { duration: clamp(.8, distance/4000, 1.6) })` with `cut` ease |
| Drag playhead | Pointer events; scrub is immediate; clips highlight as you pass |
| Keyboard | Bar focused: ← → previous/next chapter, Home/End. Global `J` / `L` do the same unless focus is in a form field or a modifier key is held |
| A11y | `<nav aria-label="Page chapters">` with a real `<ol>` of links (the clips); playhead is `role="slider"` with `aria-valuetext="Work, 00:00:42:08"` |
| Hides | In the footer, when a modal is open, and on pages with fewer than 3 chapters (then only a 3 px progress line + title) |
| Mobile | 3 px progress line at top + a floating chip with the chapter name; tap opens a bottom sheet of chapters |
| Reduced motion | Fully functional; jumps instead of tweening |

**Chapters per page** come from `<Section chapter="…">` — Home: Title · Proof · Reel · Work · Cases · Services · About · Contact.

### 3.6 Cursor (fine pointers only)

The system cursor stays. A follower is added: 8 px dot (exact) + 36 px ring (`lerp .2`). One delegated `pointerover` handler reads `data-cursor`.

| `data-cursor` | Ring |
|---|---|
| (default) | 36 px, 1 px Signal 60% |
| `link` | Scales 1.6, fill Signal 12% |
| `play` | 72 px, label **PLAY** (mono) — video cards, ribbon frames |
| `drag` | 72 px, label **DRAG** — horizontal work track |
| `view` | 72 px, label **VIEW** — case-study cards |

Hidden on touch and reduced motion.

### 3.7 Route transitions ✔ (Next 16.2: `experimental.viewTransition` + React `<ViewTransition>` + `<Link transitionTypes>`)

| Case | Effect |
|---|---|
| Default page → page | **Cut-wipe:** new page `clip-path inset(0 0 100% 0) → inset(0)`, 520 ms `cut` |
| Back / forward | Same wipe, reversed direction (`nav-back` type) |
| Case-study card → case-study page | **Match cut:** the card image is the shared element (`<ViewTransition name="cs-{slug}">`) and grows into the hero |
| Work thumbnail → lightbox | Match cut from the thumbnail |
| Unsupported browser | Instant navigation + 240 ms fade-in of main content |
| Reduced motion | None |

Always on route change: `lenis.scrollTo(0, { immediate: true })`, `ScrollTrigger.refresh()`, and `useGSAP` contexts revert on unmount. **The site must work with transitions disabled** (the flag is experimental) — transitions are a layer, never a dependency.

### 3.8 Inner-page entrance

No loader. In the first viewport only: kicker slides in (mono, 280 ms) → `h1` mask-reveal by line (700 ms, stagger .09) → lede rises (600 ms, +.2 s) → hero media wipes in (900 ms `cut`). Everything below the fold uses scroll reveals.

### 3.9 Reveal vocabulary (four types, chosen with `data-reveal`)

| Type | For | Effect | Timing |
|---|---|---|---|
| `mask` | Headlines | SplitText lines in a mask; each line rises `yPercent 110 → 0` | 800 ms `glide`, stagger .09 |
| `wipe` | Images, video | `clip-path inset(0 0 100% 0) → inset(0)` + inner image `scale 1.15 → 1` | 1000 ms `cut` + 1400 ms `glide` |
| `rise` | Paragraphs, cards | `y 32 → 0`, opacity 0 → 1; groups use `ScrollTrigger.batch` | 700 ms `glide`, stagger .08 |
| `fade` | Small meta | Opacity only | 400 ms |

Default trigger `top 85%`, **`once: true`** (no replay on scroll-up). Pinned scenes are the only scrubbed-both-ways motion.

### 3.10 Parallax

- One primitive with three speeds (§2).
- Layer travel = `speed × containerHeight` each way; the inner layer is inset by that travel so edges never show.
- Only `y` (and `x` for marquees/type). No rotation parallax.
- `will-change: transform` is toggled by ScrollTrigger `onToggle` (on only while in view).
- Mobile ×0.5; reduced motion 0.

### 3.11 Focus, forms, feedback

- Focus ring: 2 px Signal, 2 px offset, drawn in 120 ms; `:focus-visible` only.
- Skip link first in tab order. Menu and lightbox trap focus; Esc closes.
- Inputs: floating label; on focus a 2 px Signal line draws from left (280 ms). Errors: icon + text + colour (never colour alone), `aria-live="polite"`.
- Submit: button label becomes a ticking timecode while sending. Success: "Sent. I reply within 24 hours." with an SVG check that draws in 400 ms. Failure: says what happened and offers WhatsApp/email.
- Toast: from bottom-right, 280 ms, `role="status"`.
- Sound: none, ever. No autoplay with audio.

---

## 4. The hero ribbon (3D) — spec

**What it is.** A film strip curving through space, built from Imon's real frames. It is the one WebGL scene (also used, re-staged, at the contact section).

| Aspect | Spec |
|---|---|
| Path | `CatmullRomCurve3` through ~8 control points: a lazy helix in the hero, relaxing to a straight line on scroll |
| Base strip | Custom `BufferGeometry` swept along the curve (width 1.0), UVs along length. Texture: a canvas-painted film base with sprocket holes and tiny edge numbers (mono) — painted once into a `CanvasTexture`, crisp at any size |
| Frames | 12–14 rounded planes placed along the curve, tangent-aligned; textures from `media.ts` thumbnails, ≤ 1024 px, sRGB, mipmaps on, anisotropy 4, `toneMapped: false` so the footage keeps its colour |
| Material | Base: `MeshStandardMaterial` (Console, roughness .55). Edge glow: a thin additive plane in Signal at .35 opacity (fake bloom — no post-processing) |
| Light | One cool-white directional from top-left, one Signal rim from behind-right, ambient .35. No HDR environment |
| Camera | FOV 32. Scroll (0 → 1 across the 100vh pin): dolly z 9 → 3, roll −6° → 0, ribbon unrolls via `smoothstep(.55, 1, p)` |
| Pointer | `rotation.y = damp(pointer.x · .15)`, `rotation.x = damp(−pointer.y · .08)`, λ = 4 |
| Idle | Slow flow along the curve (`t · .04`); stops when hidden |
| Hover/click a frame | Scale 1.06, lift z + .15, cursor `play`; click opens that work in the lightbox (R3F pointer events) |
| Hand-off | As the hero ends the strip is flat and the canvas dissolves (200 ms) into the Proof section. *Stretch goal:* align it to the DOM marquee for a true match cut |
| Contact bookend | Same scene, camera pulled back, frames dimmed except one lit "play" frame that acts as the CTA |

**Performance**

- `<Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} performance={{ min: 0.6 }}>` ✔ (`frameloop` accepts `always | demand | never`).
- `PerformanceMonitor` lowers DPR to 1 when the average drops under 40 fps for 2 s; a second drop downgrades to Tier B.
- 14 frame meshes + 1 base = ≈ 15 draw calls. Textures load under `<Suspense fallback={null}>`; the canvas fades in over 600 ms after its first frame.
- `alpha: true`, `powerPreference: "high-performance"`, antialias only at DPR ≤ 1.5.
- The 3D chunk is `dynamic(..., { ssr: false })` and starts after first paint.

**Tiers** (force with `?tier=a|b|c` in non-production for QA)

| Tier | Condition | Result |
|---|---|---|
| A | WebGL2 + GPU tier ≥ 2 + not Save-Data + motion allowed | Full scene |
| B | Weak GPU, `deviceMemory ≤ 4`, phones | Same composition as CSS-3D: 7 frame `<div>`s on an arc with `perspective(1200px)`, pointer/scroll parallax by GSAP |
| C | Reduced motion or no WebGL | Static poster (AVIF) of the composed ribbon |

---

## 5. Home — choreography by chapter

Tone in brackets. "Star" = the one leading motion.

| # | Chapter | Job | Layout | Motion (load / scroll / hover) | Mobile |
|---|---|---|---|---|---|
| 1 | **Title** [dark] | Say who and why in 5 s | Name (width-fit), role line (mono), headline, 2 CTAs, availability pill; ribbon behind/right | Boot §3.1. **Star:** ribbon pinned 100vh — dolly + unroll; headline lines lift and fade to .3; name → wordmark match cut | Tier B ribbon; no pin; name stacks two lines |
| 2 | **Proof** [light] | Evidence in numbers | 4 stats; client names as outlined display marquee | Curtain rise. Stats count up at 60% visible (1.4 s `glide`, `tabular-nums`). Marquee base 60 px/s × `1 + clamp(|v|/1500, 0, 2.5)`, direction follows scroll | 2 × 2 grid; marquee slower |
| 3 | **Reel** [dark] | Prove craft in 60–90 s | 16:9 "monitor" with camera crop marks, REC dot, timecode | **Star:** monitor scales .82 → 1 and radius 48 → 0 (scrub) as it centres. Muted preview loop when > 50% visible; click = sound on, NLE-style scrub bar. Inner poster parallax subtle | Inline player, no scale scrub |
| 4 | **Work** [dark] | Selected work, fast to scan | Mixed 16:9 and 9:16 cards on one baseline (the aspect-ratio idea) | **Star:** pinned horizontal track (length = track − viewport, capped at 400vh); image parallax via `containerAnimation`; hover = tilt + muted 4 s preview + cursor `PLAY`; mini timeline shows position | No pin: native scroll-snap carousel + dots |
| 5 | **Cases** [dark] | Depth, 3 stories | Sticky card stack: top = 10vh; earlier cards scale `1 − (n−i)·.04` and darken to .45 | Image parallax medium; hover cursor `VIEW`; click = match cut to the case study | Stacked normally |
| 6 | **Services** [light] | Offer clarity | Editorial list of 6; each row carries an aspect-ratio glyph (9:16, 16:9, waveform…) — *true* information, not decoration | Hover: row widens (display width axis condensed → expanded, 320 ms), thumbnail follows cursor (`lerp .15`); focus shows an inline preview | Tap rows; one-line description under each |
| 7 | **Process** [light] | Reduce risk | 5 stages — a *real sequence*, so numbered 01–05 | **Star:** pinned 250vh; playhead rail advances; each stage swaps with a wipe; durations shown ("24–48 h to start") | Vertical list; SVG line draws with scroll |
| 8 | **About** [light] | Put a human behind it | 2.5D portrait (sky · hills · subject · laptop) + short bio + 3 facts | Layers at .08/.12/.20/.30 with ±12 px pointer shift by depth; bio `mask` | Two layers (background, subject) at half speed; no pointer shift |
| 9 | **Words** [dark] | Third-party trust | One large quote at a time, name + org + link to case | Cut-wipe between quotes (500 ms); auto-advance 7 s with linear progress; pauses on hover/focus; drag on touch | Swipe |
| 10 | **Studio** [light] | Route bigger jobs to the agency | Montage Motion band: 3 facts + external CTA | Rise; service names marquee | Same |
| 11 | **FAQ** [light] | Remove objections | Accordion, one open | Height via `grid-template-rows 0fr → 1fr` 320 ms; plus → minus morph; deep-linkable `#faq-…` | Same |
| 12 | **Contact** [dark] | Close | Ribbon bookend + "Let's cut something good." + 3 buttons; footer laid out as **end credits** (role in mono, name right) | Magnetic primary CTA; pointer glow; ribbon pulled back | Tier B/C |

Timeline chapters = 1, 2, 3, 4, 5, 6, 8, 12 (the rest are sub-sections).

---

## 6. Other pages

| Page | Choreography |
|---|---|
| **About** | Hero with 2.5D portrait + one-sentence statement. Story paragraphs with sticky year ticks. **Milestones** (2016 → today) as a horizontal scrubbed timeline, nodes from `about.ts`. Tools as type-set chips with magnetic hover. Values. CTA. |
| **Work** | Filter chips (aspect-ratio glyph + category). Grid mixes 16:9 / 9:16. Filtering = Flip plugin, 500 ms `cut`. **Lightbox:** match cut from thumbnail, page dims to Ink 92% ("house lights down"), custom controls, ← → between works, `?v=slug` deep link, focus trap, Esc, `lenis.stop()`. |
| **Case study** | Six scenes — see master §4.5. Hero image parallax `.16`; **Approach pinned**: 3 steps, frames wipe on the left while text swaps on the right; **Result**: metrics count up (or outcome narrative if none); quote set in display type with the width-axis reveal; **Next case** = full-bleed teaser, click → match cut (never auto-navigate). |
| **Services (index)** | Same editorial list as Home, with a one-line "who it's for" per row. |
| **Service detail** | Hero shows a looping aspect-ratio morph (9:16 ↔ 16:9, 6 s) around a sample frame. Deliverables tick in (check draws, stagger .08). Related work (horizontal), related case, FAQ, CTA. |
| **Pricing** | 3 cards with tilt; "Most popular" gets a slow conic border (8 s). Feature rows tick in. Sticky comparison header. FAQ. Custom-quote band. |
| **Contact** | Fields appear in sequence. Budget as segmented chips. Email "copy" button → "Copied ✓" toast. **Live Dhaka clock** ("Dhaka · 14:32 GMT+6") — true, useful information. WhatsApp deep link with prefilled message. Calendly. |
| **404** | "This frame isn't in the timeline." Tier-B ribbon with one black frame; links back to Work and Home. |
| **Legal** | Plain type; reveals only. |

---

## 7. Micro-interactions

| Element | Spec |
|---|---|
| Primary button | Label rolls up while a duplicate rolls in (280 ms `glide`). Magnetic radius 80 px, pull .25 (fine pointers). Press scale .97 / 80 ms. Loading: label becomes timecode. |
| Secondary button | 1 px border → Signal; 8% fill wipes in from the left (240 ms). |
| Text link | Underline wipe in/out (240 ms); external arrow ↗ nudges 2 px. |
| Cards | Tilt ≤ 6°, shadow shifts opposite, inner image `scale 1.04` over 600 ms. `:focus-within` mirrors hover. |
| Filter chip | Active = Signal fill via wipe; list re-orders with Flip. |
| Accordion | §5 row 11. |
| Scroll-to-top | Appears after 1.5 viewports; label "▲ 00:00:00:00"; scrolls with `cut` ease. |
| Tooltip | 120 ms fade, no movement. |
| Copy | Button text → "Copied ✓" for 1.6 s + toast. |

---

## 8. Input and capability matrix

| Feature | Desktop (fine pointer) | Tablet | Phone | Reduced motion | Save-Data / low power |
|---|---|---|---|---|---|
| Smooth scroll (Lenis) | ✔ | wheel only (touch native) | touch native | none (native) | none (native) |
| Parallax | full | ×0.7 | ×0.5 | off | ×0.5 |
| Pinned scenes | ✔ | ✔ (shorter) | replaced by stacked / native | off | ✔ |
| Hero 3D | A | A or B | B | C | B |
| Cursor follower | ✔ | – | – | – | – |
| Tilt cards | ✔ | – | – | – | – |
| Hover video preview | ✔ | – | – | – | – |
| Timeline bar | bottom | bottom, compact | top line + sheet | functional, jumps | same |
| Marquee | velocity-reactive | basic | basic | paused | paused |
| Route transitions | ✔ | ✔ | ✔ | none | ✔ |
| Boot sequence | first visit | first visit | first visit | skipped | skipped |

**Reduced-motion contract:** no Lenis; reveals are instant; parallax, pins, tilt, marquee, 3D, cursor follower and view transitions are off; carousels stop; video never autoplays; no information is conveyed by motion alone; the timeline bar still works.

---

## 9. Engineering patterns

### 9.1 `MotionProvider` (client)
Registers plugins once (ScrollTrigger, SplitText, Flip, CustomEase, `useGSAP`); builds Lenis only when allowed; wires the ticker (§3.2); exposes `useMotion() → { lenis, reduced, tier }`; calls `ScrollTrigger.refresh()` on fonts ready and route change.

### 9.2 Components use `useGSAP` ✔
`useGSAP(() => {…}, { scope: ref })` — never a bare selector without scope. Handlers that create tweens are wrapped in `contextSafe`. Responsive and reduced-motion variants live in `gsap.matchMedia()` with named conditions (`reduceMotion: "(prefers-reduced-motion: reduce)"`).

### 9.3 Hydration-safe reveals (no flash, no hostage content)
1. HTML is fully visible by default.
2. An inline script in `<head>` adds `html.js` only when motion is allowed.
3. CSS hides only **below-the-fold** `[data-reveal]` elements under `html.js`: `opacity: 0` (never `display: none`, so SEO and layout are untouched).
4. The engine adds `html.motion-ready`.
5. **Failsafe in pure CSS:** `html.js:not(.motion-ready) [data-reveal]` has an animation that sets `opacity: 1` after 3 s. `<noscript>` rules show everything.

### 9.4 SplitText ✔
`SplitText.create(el, { type: "lines,words", mask: "lines", autoSplit: true, onSplit: self => gsap.from(self.words, {…}) })` — create animations **inside `onSplit` and return them** so re-splits (font load, resize) stay in sync. SplitText adds `aria-label` and `aria-hidden` automatically.

### 9.5 ScrollTrigger rules ✔
Register once. Create triggers top-to-bottom or set `refreshPriority`. Put a trigger on a timeline or top-level tween — **never on a child tween**, never nest. Don't combine `scrub` and `toggleActions`. Use `ease: "none"` with `containerAnimation`. Remove `markers` from production. Parallax: `travel = speed × containerHeight`; inner layer inset by `travel`; tween `y: -travel → travel`, `ease: "none"`, `scrub: true`.

### 9.6 R3F
`Canvas` is client-only and lazy. `frameloop` switches `always ↔ never` with an `IntersectionObserver`. Hero scroll progress is read from a shared store in `useFrame` (no React state per frame).

### 9.7 Next 16 specifics ✔
`params`/`searchParams` are async (`await params`). `middleware` is now `proxy.ts`. Turbopack is the default for dev and build. `next/image` requires `images.qualities`. There is no `next lint` (run ESLint directly). **`axes` for `next/font/google` is allowed only for variable fonts with no explicit weight** — Archivo is declared as variable with `axes: ["wdth"]`; Phase 0 verifies the width axis is really served.

### 9.8 Performance rules for motion
≤ 1 pinned scene active at a time · ≤ 30 live ScrollTriggers per page (batch the rest) · animate `transform`, `opacity`, `clip-path` only · never animate `filter: blur` or `box-shadow` on large areas · `contain: layout paint` on sections · `will-change` toggled, not permanent · `decoding="async"` on images · all media boxes reserve their aspect ratio.

### 9.9 Dev tooling
`?motion=debug` (non-production): ScrollTrigger markers, FPS meter, tier badge. `?tier=a|b|c` forces a 3D tier. A dev-only `/design-system` route renders every primitive in both tones and in reduced-motion.

---

## 10. UX rules

**Conversion map.** CTA is always within reach: header → hero → after Work → after each case study → end of every service page → pricing → timeline bar (after the hero) → footer. No floating chat bubble.

**Flows to design for**
1. *Search visitor lands on a service page* → sees relevant work and a case study → books a call.
2. *Referral lands on Home* → reel → work → cases → call.
3. *Lead checks pricing* → contact (three fields only: name, email, message; project type and budget are optional chips).
4. *Name search* → About → socials / Montage Motion.

**Writing.** Plain, specific, first person for Imon, "we" only for the studio. Buttons say what happens. Errors say what went wrong and what to do. Numbers beat adjectives. Never "viral" as a promise.

| Where | Copy (draft — final in `content/`) |
|---|---|
| Hero headline (default) | "I cut footage into stories people finish watching." |
| Hero alternates for A/B | "Raw footage in. Stories people finish out." · "Edits that keep people watching." |
| Primary / secondary CTA | "Book a call" · "Watch the reel" |
| Availability pill | "Booking {month}" (from data) |
| Form success | "Sent. I reply within 24 hours." |
| Form failure | "That didn't send. Try again, or message me on WhatsApp." |
| Contact headline | "Let's cut something good." |
| 404 | "This frame isn't in the timeline." |
| Footer credits | Role in mono on the left ("Edited by", "Studio", "Say hello"), names/links on the right |

**States to design for every data-driven block:** loading (shimmer 1.6 s linear), empty ("No works in this category yet — try All"), error (what happened + next step), offline.

---

## 11. Motion QA

**Manual gates**
- Hero scrub ≥ 55 fps on a modern laptop at 1440p; Tier B ≥ 40 fps on a mid-range Android.
- Reload mid-page: elements above the fold are already revealed (no stuck-hidden content). Hash links land correctly. Resize / rotate re-computes pins.
- Keyboard-only run-through; screen-reader pass (SplitText `aria-label`, decorative layers `aria-hidden`).
- Chrome, Safari (macOS + iOS), Firefox.

**Automated (Playwright "motion contract")**
1. JS disabled → all text visible.
2. `reducedMotion: "reduce"` → no transforms on `[data-reveal]`, no Lenis, no canvas.
3. Scroll to bottom → no element left at `opacity: 0`.
4. `?tier=a|b|c` each render (Tier A: canvas is not blank).
5. No console errors; CLS < 0.05.
6. Axe: zero serious/critical.

**Design critique after each page** (frontend-design loop): screenshot at 375 / 768 / 1280 / 1920 → is there *one* star per viewport? → does any motion lack a source or meaning? → remove one accessory → check contrast and focus.
