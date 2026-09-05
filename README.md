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
- **Motion**: GSAP-driven cinematic hero entrance (word-by-word reveal,
  fade+blur, staggered UI), IntersectionObserver-based scroll reveals for
  every other section. Respects `prefers-reduced-motion` throughout, and
  degrades gracefully to a fully visible static page if GSAP/CDN fails to
  load (see `assets/js/main.js`).
- All tokens live in `:root` in `assets/css/style.css`.

## Structure

```
index.html            Single-page markup, all sections
assets/css/style.css   Design tokens + all styling
assets/js/main.js      Nav, scroll reveals, hero animation, sticky CTA
```

## Notes

- The location map uses a free OpenStreetMap embed (no API key). Swap for
  Google Maps if you prefer once you have a Maps API key.
- Tested responsive at 375/390/768/1024/1440px and with reduced motion via
  Playwright + Chromium.
