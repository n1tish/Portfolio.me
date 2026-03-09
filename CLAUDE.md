# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio site for Nitish Upadhyay — deployed on GitHub Pages. No build step, no package manager, no framework. Files are served directly.

**Stack:** Vanilla HTML5 + CSS3 + JavaScript (ES6+), Google Fonts (Readex Pro), Spline 3D embed (iframe).

## Development

Open `index.html` directly in a browser (no local server required). For live-reload during development, use any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

No build, lint, or test commands exist.

## Architecture

Three files make up the entire site:

- **`index.html`** — Single-page layout. Sections in order: Hero → About → Work → Case Studies → Products → Contact. Each scroll section uses `.scroll-section > .section-container` for fade-in targeting.
- **`style.css`** — All styles. Design tokens are defined as CSS custom properties in `:root` (colors, font sizes, font families). Section backgrounds alternate between `bg-primary` and `bg-secondary` classes.
- **`main.js`** — All interactivity: typewriter animation (hero), mobile nav toggle, smooth scroll with fixed navbar offset compensation (52px), Products carousel, and IntersectionObserver fade-ins for `.scroll-section .section-container`.

## Key Design Conventions

- **Color tokens:** `--bg` (#e3e3e3), `--surface` (#f5f5f7), `--border` (#d2d2d7), `--text-primary` (#1d1d1f), `--text-secondary` (#6e6e73). Monochrome/minimal palette — no accent colors.
- **Font:** Readex Pro via Google Fonts. Typography scale uses named tokens (`--font-hero`, `--font-h2`, etc.).
- **Section numbering:** Sections are labeled `01 — ABOUT`, `02 — WORK`, etc. Maintain sequence when adding/removing sections.
- **Scroll animations:** Sections fade in via `.is-visible` class added by IntersectionObserver (threshold: 0.15). Initial state is `opacity: 0; transform: translateY(30px)` on `.section-container`.
- **Navbar height:** Fixed at 52px. Smooth scroll offset in `main.js` hardcodes `navbarHeight = 52`.

## Products Carousel

The carousel in the Products section (`#products`) calculates card widths dynamically based on viewport:
- Desktop (>1024px): 3 visible cards
- Tablet (769–1024px): 2 visible cards
- Mobile (≤768px): 1 visible card

Cards use CSS `transform: translateX()` for sliding. Gap between cards is 24px (hardcoded as `GAP = 24` in `main.js`). Auto-advances every 4 seconds; pauses on hover.

## Performance Notes

GSAP + ScrollTrigger + Lenis were trialled and reverted — they caused noticeable slowness. Avoid adding heavy animation libraries. Stick to CSS transitions/IntersectionObserver for animations.
