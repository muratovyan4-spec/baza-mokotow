(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasScrollTrigger = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  var isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var enableInteractiveFx = hasGsap && !reduceMotion && isFinePointer;

  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Header scroll state
     ------------------------------------------------------------------ */
  var header = document.getElementById('siteHeader');
  var lastScrollState = false;

  function updateHeader() {
    var scrolled = window.scrollY > 24;
    if (scrolled !== lastScrollState) {
      header.classList.toggle('is-scrolled', scrolled);
      lastScrollState = scrolled;
    }
  }
  if (header) {
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* ------------------------------------------------------------------
     Mobile nav
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    if (!mobileNav || !mobileNav.classList.contains('is-open')) return;
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Otwórz menu');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    mobileNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Zamknij menu');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('is-open');
      if (isOpen) { closeMobileNav(); } else { openMobileNav(); }
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) closeMobileNav();
    });
  }

  /* ------------------------------------------------------------------
     Sticky mobile CTA — appears once the hero is scrolled past
     ------------------------------------------------------------------ */
  var stickyCta = document.getElementById('stickyCta');
  var heroSection = document.getElementById('top');

  if (stickyCta && heroSection && 'IntersectionObserver' in window) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
        });
      },
      { rootMargin: '-80% 0px 0px 0px' }
    );
    ctaObserver.observe(heroSection);
  }

  /* ------------------------------------------------------------------
     Scroll reveal for [data-reveal] elements
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     Hero cinematic entrance
     Cyber-Ronin-inspired: radial-mask image reveal + Ken Burns zoom,
     word-by-word blur-to-sharp headline, staggered HUD/stat elements.
     ------------------------------------------------------------------ */
  var heroAnimTargets = document.querySelectorAll('[data-anim]');
  var heroReveal = document.querySelector('[data-hero-reveal]');
  var metaItems = document.querySelectorAll('.hero-meta__item');
  var glassCard = document.querySelector('[data-glass-card]');
  var heroFlash = document.querySelector('.hero-flash');
  var HERO_CLIP_VISIBLE = 'circle(150% at 68% 38%)';

  function revealHeroInstantly() {
    heroAnimTargets.forEach(function (el) { el.style.opacity = '1'; el.style.filter = 'none'; el.style.transform = 'none'; });
    document.querySelectorAll('.hero-title .word').forEach(function (w) {
      w.style.opacity = '1'; w.style.filter = 'none'; w.style.transform = 'none';
    });
    metaItems.forEach(function (i) { i.style.opacity = '1'; i.style.transform = 'none'; });
    if (glassCard) glassCard.style.opacity = '1';
    if (heroFlash) heroFlash.style.opacity = '0';
    if (heroReveal) {
      heroReveal.style.clipPath = HERO_CLIP_VISIBLE;
      heroReveal.style.transform = 'none';
    }
  }

  if (reduceMotion || !hasGsap) {
    revealHeroInstantly();
  } else {
    var words = document.querySelectorAll('.hero-title .word');
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    gsap.set(words, { opacity: 0, y: '0.75em', rotationX: -55, filter: 'blur(16px)' });
    gsap.set('.hero-eyebrow, .hero-sub, .hero-actions, .hero-scroll-cue', { opacity: 0, y: 18 });
    gsap.set(metaItems, { opacity: 0, y: 14 });
    if (glassCard) gsap.set(glassCard, { opacity: 0 });
    if (heroReveal) gsap.set(heroReveal, { clipPath: 'circle(0% at 68% 38%)', scale: 1.12 });

    /* Power-on flash punctuates the very start, then the radial-mask
       reveal and headline cascade play over it. */
    if (heroFlash) {
      tl.fromTo(heroFlash, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'power1.in' }, 0)
        .to(heroFlash, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.12);
    }

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.5 }, 0.1);

    if (heroReveal) {
      tl.to(heroReveal, { clipPath: HERO_CLIP_VISIBLE, scale: 1, duration: 2.1, ease: 'power3.out' }, '-=0.05');
    }

    tl.to(words, { opacity: 1, y: 0, rotationX: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.09 }, '-=1.7')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.55')
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to(metaItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.3');

    if (glassCard) tl.to(glassCard, { opacity: 1, duration: 0.6 }, '-=0.5');

    tl.to('.hero-scroll-cue', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
  }

  /* Safety net: if hero content is still hidden after 3s (slow network,
     script error), force it visible so the page never appears blank. */
  window.setTimeout(function () {
    var stillHidden = document.querySelector(
      '.hero-eyebrow[style*="opacity: 0"], .hero-title .word[style*="opacity: 0"]'
    );
    if (stillHidden) revealHeroInstantly();
  }, 3000);

  /* ------------------------------------------------------------------
     Desktop-only interactive layer: cursor spotlight + mouse parallax
     + magnetic CTAs. Gated to fine-pointer devices with motion allowed;
     touch devices fall back to plain tap/hover-free interaction.
     ------------------------------------------------------------------ */
  if (enableInteractiveFx && heroSection) {
    var spotlight = document.querySelector('[data-spotlight]');
    var parallaxEls = Array.prototype.slice.call(heroSection.querySelectorAll('[data-parallax]'));

    var parallaxSetters = parallaxEls.map(function (el) {
      var strength = parseFloat(el.getAttribute('data-parallax-strength')) || 10;
      return {
        strength: strength,
        setX: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
        setY: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' })
      };
    });

    /* 3D cursor-tilt on the hero visual card — the same element already
       animates clip-path/scale for its entrance reveal; GSAP composes
       rotationX/rotationY/scale/x/y on one element without conflict as
       long as nothing outside GSAP also touches its transform. */
    var tiltCard = document.querySelector('[data-hero-reveal]');
    var tiltSetX = tiltCard ? gsap.quickTo(tiltCard, 'rotationY', { duration: 0.7, ease: 'power3.out' }) : null;
    var tiltSetY = tiltCard ? gsap.quickTo(tiltCard, 'rotationX', { duration: 0.7, ease: 'power3.out' }) : null;

    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width - 0.5;
      var ny = (e.clientY - rect.top) / rect.height - 0.5;

      parallaxSetters.forEach(function (item) {
        item.setX(nx * item.strength);
        item.setY(ny * item.strength);
      });

      if (tiltSetX && tiltSetY) {
        tiltSetX(nx * 12);
        tiltSetY(ny * -10);
      }

      if (spotlight) {
        var px = ((e.clientX - rect.left) / rect.width) * 100;
        var py = ((e.clientY - rect.top) / rect.height) * 100;
        spotlight.style.setProperty('--mx', px + '%');
        spotlight.style.setProperty('--my', py + '%');
      }
    });

    heroSection.addEventListener('mouseenter', function () {
      if (spotlight) spotlight.classList.add('is-active');
    });

    heroSection.addEventListener('mouseleave', function () {
      if (spotlight) spotlight.classList.remove('is-active');
      parallaxSetters.forEach(function (item) { item.setX(0); item.setY(0); });
      if (tiltSetX && tiltSetY) { tiltSetX(0); tiltSetY(0); }
    });

    /* Magnetic CTAs */
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var setX = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      var setY = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      var strength = 0.35;
      var maxOffset = 14;

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - (rect.left + rect.width / 2);
        var relY = e.clientY - (rect.top + rect.height / 2);
        setX(Math.max(-maxOffset, Math.min(maxOffset, relX * strength)));
        setY(Math.max(-maxOffset, Math.min(maxOffset, relY * strength)));
      });

      btn.addEventListener('mouseleave', function () {
        setX(0);
        setY(0);
      });
    });
  }

  /* ------------------------------------------------------------------
     Smooth scroll-driven transition from hero into the next section
     ------------------------------------------------------------------ */
  if (hasScrollTrigger && !reduceMotion) {
    /* Targets deliberately avoid .hero-content and .hero-visual (the outer
       wrapper) — both already carry continuous mouse-parallax/tilt tweens
       on x/y/rotation, and a second GSAP tween fighting the same element's
       property from scroll input would jitter if a user scrolls while
       moving the mouse. .hero .container and .hero-visual__reveal are
       untouched by the interactive layer, so the scroll-exit owns them
       exclusively. */
    var heroContainerEl = document.querySelector('.hero .container');
    var heroVisualCardEl = document.querySelector('.hero-visual__reveal');
    var heroVignetteEl = document.querySelector('.hero-scene__vignette');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    })
      .to(heroContainerEl, { y: -90, opacity: 0, filter: 'blur(6px)', ease: 'none' }, 0)
      .to(heroVisualCardEl, { y: 60, scale: 1.15, opacity: 0, filter: 'blur(4px)', ease: 'none' }, 0)
      .to(heroVignetteEl, { opacity: 1.6, ease: 'none' }, 0);
  }

  document.body.classList.remove('js-loading');
})();
