# BAZA Cyber Lounge Mokotów — Landing Page

Static, dependency-light landing page (plain HTML/CSS/JS, no build step). Open
`index.html` directly or serve the folder with any static file server.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Brand references — what's verified vs. placeholder

**Instagram access was blocked at the network level for this build**
(`@baza.gg.mokotow` — `EGRESS_BLOCKED` on `www.instagram.com`), so the site
could not be built from scraped Instagram content as originally requested.
Per your direction, the page was built from the facts and copy you gave
directly, with everything else left as a clearly marked, easy-to-find
placeholder rather than invented.

**Used verbatim from your brief (verified):**
- Brand name, hero headline text ("BAZA / CYBER LOUNGE / MOKOTÓW")
- CTA copy: "Zarezerwuj stanowisko" / "Zobacz bazę"
- Address: Wincentego Rzymowskiego 34, Warszawa, Mokotów
- Phone: +48 731 830 500
- Booking link: https://clxb.ee/BAZA_Mokotow
- Instagram handle: @baza.gg.mokotow
- Stats: 4.7/5 rating, 171+ reviews
- Color direction: black + neon yellow
- Section architecture: hero → setup → experience → equipment → location → booking

**Left as placeholders (search for `[placeholder]` / `[do potwierdzenia]` in
`index.html`) — replace with real BAZA material before launch:**
- Real photography of the space/setups (hero and "Doświadczenie" section
  currently use CSS/SVG-generated cyber atmosphere graphics instead of fake
  photos, since no real BAZA imagery was accessible)
- Official logo file (currently a text wordmark, "BAZA.")
- Exact PC/GPU specs per station type
- Number of stations
- Opening hours
- Any additional amenities, offers, or exact Instagram captions/terminology

Once you can share Instagram exports, screenshots, or official brand assets,
swap them in directly — the structure is built to make that a drop-in
replacement, not a rebuild.

## Design system

- **Colors**: near-black (`#030303`–`#141414`) base, neon yellow `#ffd400`
  accent (buttons, active states, numbers, borders), off-white body text.
  Exact yellow hex is a placeholder pending BAZA's official brand color —
  swap `--yellow-500` in `assets/css/style.css` if you have the real value.
- **Type**: Anton (display/headlines) + Inter (body/UI) + JetBrains Mono
  (technical labels, stats, HUD-style details) — chosen via the UI/UX Pro Max
  skill for an aggressive-but-premium cyber-gaming tone.
- **Motion**: GSAP-driven cinematic hero sequence — the hero visual (a
  stylized HUD/monitor SVG, standing in for real BAZA photography) reveals
  through an expanding radial mask with a Ken Burns zoom, while the headline
  cascades in word-by-word with blur-to-sharp + upward motion, followed by
  staggered CTA/stat/HUD-chip reveals. On desktop (fine pointer, no
  `prefers-reduced-motion`), the hero also has a cursor-following spotlight,
  multi-layer mouse parallax (background/image/UI move at different
  strengths), and magnetic CTA buttons; scrolling out of the hero drives a
  smooth parallax/fade transition into the next section via ScrollTrigger.
  Every other section still uses IntersectionObserver scroll reveals.
  Touch/coarse-pointer devices automatically skip the hover-only effects
  (spotlight/parallax/magnetic) but keep the full entrance animation.
  Respects `prefers-reduced-motion` throughout (all of the above is skipped
  and content renders in its final state immediately), and degrades
  gracefully to a fully visible static page if GSAP fails to load for any
  reason. See `assets/js/main.js`.
- GSAP is **self-hosted** in `assets/js/vendor/` (installed via `npm i
  gsap@3.12.5`, see `package.json`) rather than loaded from a CDN — this
  environment's network policy blocks cdnjs.cloudflare.com, and self-hosting
  is more robust for production anyway (no third-party CDN dependency/outage
  risk). To update GSAP: bump the version in `package.json`, `npm install`,
  then copy `node_modules/gsap/dist/{gsap.min.js,ScrollTrigger.min.js}` into
  `assets/js/vendor/`.
- All tokens live in `:root` in `assets/css/style.css`.

## Structure

```
index.html                 Single-page markup, all sections
assets/css/style.css        Design tokens + all styling
assets/js/main.js           Nav, scroll reveals, hero animation, parallax,
                             spotlight, magnetic CTAs, sticky CTA
assets/js/vendor/            Self-hosted GSAP + ScrollTrigger
```

## Notes

- The location map uses a free OpenStreetMap embed (no API key). Swap for
  Google Maps if you prefer once you have a Maps API key.
- Tested responsive at 375/390/768/1024/1240/1440px, with
  `prefers-reduced-motion`, and with touch/coarse-pointer emulation, via
  Playwright + Chromium — including verifying the hero's radial-mask reveal,
  word-by-word blur-to-sharp cascade, mouse parallax, cursor spotlight, and
  magnetic CTA buttons actually animate (not just that the code exists).
