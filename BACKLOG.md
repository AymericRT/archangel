# Backlog

## Pending

- [ ] #1 — Remove dead code left over from GSAP removal
  - Unused CSS in `src/routes/layout.css`: `.hero-subtitle`, `.hero-subtitle-2`, `.float-card`, `.pulse-ring`, `.text-gradient-light`, `.animate-on-scroll`
  - Orphan keyframes in `src/routes/layout.css`: `@keyframes fadeUp`, `float`, `pulseRing`
  - Orphan class hooks remaining in markup (no CSS rules exist for them): `.gsap-fade-up`, `.gsap-slide-up`, `.gsap-scale-reveal`, `.gsap-flip-cards`, `.gsap-counter`, `.gsap-contact-reveal`, `.cap-anim`, `.cap-line`, `.cap-item`, `.contact-word`
  - *Partial progress:* some orphan classes were dropped during the content-extraction rewrite (Statement, Ethos, Contact), but Defense/Infra/Investments/Energy still carry `.cap-anim` and `.cap-item` on their elements.

- [ ] #4 — Remove unused `navOnDark` state and scroll math in `src/routes/+page.svelte` (the logic flipped the nav over the old sticky-canvas dark section; no dark section exists anymore, so it's always `false`).

- [ ] #5 — Theme toggle should react to OS preference changes at runtime — add a `matchMedia('(prefers-color-scheme: dark)').addEventListener('change', …)` listener in `ThemeToggle.svelte` so the app follows OS-level theme flips while the tab is open.

- [ ] #6 — Consolidate Defense/Infra/Investments/Energy into a single `<CapabilitySection>` component. Only worth it if more capability sections are added; for 4 instances the current duplication is acceptable.

## Nice-to-have

- [ ] Light-mode variant of the logo (`static/self_logo_light.png`) + wire up `dark:hidden` / `hidden dark:block` pair on the `<img>` tags
- [ ] Accessibility: focus-trap the mobile nav menu when open

## Done

- [x] #2 — Navbar CSS scoped inside `Navbar.svelte` (moved `.liquid-nav`, `.nav-link`, `.nav-dark`, `.nav-hidden`, `.mobile-menu-*` rules out of the global `layout.css`)
- [x] #3 — Content extracted to `src/lib/content.ts` (hero, statement, expertise, about, capabilities, ethos, contact, footer, nav). Section components now import from one source of truth.
- [x] Dark mode toggle (light ↔ full black), localStorage + system preference, no-flash inline script
- [x] Remove default Svelte favicon, use `self_logo.png`
- [x] Frame lines at `max-w-6xl` edges + horizontal dividers stop at the frame
- [x] Left-align content in all sections; uniform padding `py-24 md:py-32` + container `max-w-6xl px-8`
- [x] Standardize type scale across sections; cap subsections sized smaller than parent "Our Capabilities"
- [x] Remove all section numbering pills and per-item numbers
- [x] Remove "15+ years of excellence" counter
- [x] Remove decorative hover arrow on Defense cards
- [x] Restore copy that was truncated / rewritten (CBRNE gloss, Water Security, etc.)
- [x] Strip GSAP / ScrollTrigger / Lenis (smooth-scroll and scroll reveals)
- [x] Strip Three.js and all 3D assets (~10 MB freed; bundle 784 KB → 40 KB)
- [x] Modularize `+page.svelte` into per-section components
