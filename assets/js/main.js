(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

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
     Cyber-Ronin-inspired: progressive word reveal + fade/blur + stagger
     ------------------------------------------------------------------ */
  var heroAnimTargets = document.querySelectorAll('[data-anim]');

  function revealHeroInstantly() {
    heroAnimTargets.forEach(function (el) { el.style.opacity = '1'; el.style.filter = 'none'; el.style.transform = 'none'; });
    document.querySelectorAll('.hero-title .word').forEach(function (w) {
      w.style.opacity = '1'; w.style.filter = 'none'; w.style.transform = 'none';
    });
  }

  if (reduceMotion || !hasGsap) {
    revealHeroInstantly();
  } else {
    var words = document.querySelectorAll('.hero-title .word');
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    gsap.set(words, { opacity: 0, y: '0.6em', filter: 'blur(14px)' });
    gsap.set('.hero-eyebrow, .hero-sub, .hero-actions, .hero-meta, .hero-scroll-cue', {
      opacity: 0, y: 16
    });

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.5 })
      .to(words, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.09
      }, '-=0.25')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.hero-meta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.hero-scroll-cue', { opacity: 1, duration: 0.5 }, '-=0.3');
  }

  /* Safety net: if for any reason hero content is still hidden after 2.5s
     (slow network, script error), force it visible so the page never
     appears blank. */
  window.setTimeout(function () {
    var stillHidden = document.querySelector('.hero-eyebrow[style*="opacity: 0"], .hero-title .word[style*="opacity: 0"]');
    if (stillHidden) revealHeroInstantly();
  }, 2500);

  document.body.classList.remove('js-loading');
})();
