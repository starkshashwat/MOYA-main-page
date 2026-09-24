/**
 * MOYA ACADEMY GATEWAY — FAST GSAP INTERACTION ENGINE
 * Glitch Word Rotator • Hyperiux Button Interactions • Founder Proof Parallax
 */

// ==========================================================================
// 1. CENTRAL CONFIGURATION & ROUTING
// Zero WhatsApp Links — Pure Portal & Social Routing
// ==========================================================================
const MOYA_CONFIG = {
  // Flagship Webinar / Masterclass
  webinarUrl: "https://ai.mechanismofya.com",
  
  // Pathway Target Portals
  mentorshipUrl: "#mentorship",
  productionsUrl: "#production",
  courseUrl: "https://vsl.mechanismofya.com",
  eventsUrl: "#events",

  // Social Media Channels
  youtubeUrl: "https://www.youtube.com/channel/UCx4bJ-Q2aSiEn6WnTwAXxKg",
  instagramUrl: "https://www.instagram.com/mechanism_ya/",
  facebookUrl: "https://www.facebook.com/mechanismofya/"
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bind URLs to social channels
  initUrlBindings();

  // 2. Set current copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Initialize Interactive Goal Card Selection & Dynamic CTA Button
  initGoalSelection();

  // 4. Initialize Mobile Horizontal Carousel Sync
  initCarouselScrollSync();

  // 5. Initialize Glitch Word Alternator ("Choose Your Goal / Path / System...")
  initGlitchWordRotator();

  // 6. Initialize Card mouse spotlight tracking (Linear style)
  initCardSpotlight();

  // 7. Initialize GSAP animations
  if (typeof gsap !== 'undefined') {
    initGatewayEntrance();
    initBadgeFloatingMotion();
    initIntentCardHover();
    initFounderParallax();
  }
});

/**
 * Connect social anchor elements to MOYA_CONFIG
 */
function initUrlBindings() {
  const bindings = [
    // Social Media Icons
    { id: 'socialYoutube', url: MOYA_CONFIG.youtubeUrl },
    { id: 'socialInstagram', url: MOYA_CONFIG.instagramUrl },
    { id: 'socialFacebook', url: MOYA_CONFIG.facebookUrl }
  ];

  bindings.forEach(b => {
    const el = document.getElementById(b.id);
    if (el) {
      el.href = b.url;
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/**
 * ==========================================================================
 * 1B. DYNAMIC SELECTION PORTAL ENGINE
 * Interactive choice cards + Dynamic action button below the cards
 * ==========================================================================
 */
const GOAL_PORTALS = {
  cardStart: {
    label: "Launch My Channel",
    url: MOYA_CONFIG.webinarUrl,
    theme: "violet"
  },
  cardStuck: {
    label: "Fix My Growth",
    url: MOYA_CONFIG.mentorshipUrl,
    theme: "violet"
  },
  cardTeam: {
    label: "Build With Team",
    url: MOYA_CONFIG.productionsUrl,
    theme: "violet"
  },
  cardSystem: {
    label: "Get The System",
    url: MOYA_CONFIG.courseUrl,
    theme: "violet"
  },
  cardLive: {
    label: "Explore Events",
    url: MOYA_CONFIG.eventsUrl,
    theme: "violet"
  }
};

function initGoalSelection() {
  const cards = document.querySelectorAll('.intent-card');
  const ctaStage = document.getElementById('dynamicCtaStage');
  const actionBtn = document.getElementById('dynamicActionBtn');
  const btnLabel = document.getElementById('dynamicBtnLabel');

  if (!cards.length) return;

  cards.forEach(card => {
    function handleSelect() {
      const goal = GOAL_PORTALS[card.id];
      if (!goal) return;

      // 1. Remove active state from all cards
      cards.forEach(c => {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
        if (typeof gsap !== 'undefined') {
          gsap.to(c, { y: 0, duration: 0.3, ease: "power2.out" });
        }
      });

      // 2. Activate selected card
      card.classList.add('is-selected');
      card.setAttribute('aria-checked', 'true');
      if (typeof gsap !== 'undefined') {
        gsap.to(card, { y: -4, duration: 0.35, ease: "back.out(2)" });
      }

      // 3. Update & reveal the dynamic action button
      if (actionBtn && btnLabel && ctaStage) {
        actionBtn.classList.remove('btn-gold', 'btn-violet');
        actionBtn.classList.add(`btn-${goal.theme}`);
        actionBtn.href = goal.url;
        btnLabel.textContent = goal.label;

        ctaStage.classList.add('is-visible');

        // Micro punch entrance animation
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(actionBtn,
            { scale: 0.94, opacity: 0.8 },
            { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(2)" }
          );
        }
      }

      // 4. On mobile, smoothly center the selected card in horizontal view & stop auto-scroll
      stopMobileAutoScroll();
      if (window.innerWidth <= 640) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    card.addEventListener('click', handleSelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    });
  });
}

/**
 * ==========================================================================
 * 1C. MOBILE HORIZONTAL CAROUSEL SYNC & CONTROLS
 * Provides Prev/Next arrows, dot indicators, dot navigation, and auto-scroll
 * ==========================================================================
 */
let mobileAutoScrollTimer = null;
let autoScrollResumeTimeout = null;

function stopMobileAutoScroll() {
  if (mobileAutoScrollTimer) {
    clearInterval(mobileAutoScrollTimer);
    mobileAutoScrollTimer = null;
  }
  if (autoScrollResumeTimeout) {
    clearTimeout(autoScrollResumeTimeout);
    autoScrollResumeTimeout = null;
  }
}

function initCarouselScrollSync() {
  const grid = document.getElementById('intentGrid');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const cards = Array.from(document.querySelectorAll('.intent-card'));

  if (!grid || !cards.length) return;

  let currentActiveIndex = 0;

  // Calculates which card is currently closest to the center of the mobile screen
  function getClosestCardIndex() {
    const gridCenter = grid.scrollLeft + grid.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(gridCenter - cardCenter);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = idx;
      }
    });

    return closestIndex;
  }

  function updateControlsState() {
    currentActiveIndex = getClosestCardIndex();

    // Update pagination dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentActiveIndex);
    });

    // Arrow visual indicators (always clickable and functional, slightly dimmer at absolute edges)
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    if (prevBtn) {
      prevBtn.classList.toggle('is-disabled', currentActiveIndex === 0 && grid.scrollLeft <= 5);
    }
    if (nextBtn) {
      nextBtn.classList.toggle('is-disabled', currentActiveIndex === cards.length - 1 && grid.scrollLeft >= maxScroll - 5);
    }
  }

  // Smoothly center a specific card index in viewport
  function scrollToCard(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;

    currentActiveIndex = index;
    const targetCard = cards[index];
    if (!targetCard) return;

    // Calculate exact left offset to center the card on mobile
    const targetLeft = targetCard.offsetLeft - grid.offsetLeft - (grid.clientWidth - targetCard.offsetWidth) / 2;

    grid.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth'
    });

    // Instant dot update for crisp visual response
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === index);
    });
  }

  // Scroll listener with requestAnimationFrame
  grid.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateControlsState);
  }, { passive: true });

  // Initial check after DOM paint
  setTimeout(updateControlsState, 120);

  // Prev Button Click - Moves 1 card left (or wraps around to the last card)
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      pauseAutoScrollTemporarily();
      const current = getClosestCardIndex();
      const prevIndex = current > 0 ? current - 1 : cards.length - 1;
      scrollToCard(prevIndex);
    });
  }

  // Next Button Click - Moves 1 card right (or wraps around to the first card)
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      pauseAutoScrollTemporarily();
      const current = getClosestCardIndex();
      const nextIndex = current < cards.length - 1 ? current + 1 : 0;
      scrollToCard(nextIndex);
    });
  }

  // Dot Click Navigation
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      pauseAutoScrollTemporarily();
      scrollToCard(idx);
    });
  });

  // User Touch / Manual Interaction: pause auto-scroll
  function pauseAutoScrollTemporarily() {
    stopMobileAutoScroll();
    // Don't resume if user has an active card selection
    if (document.querySelector('.intent-card.is-selected')) return;

    // Resume after 5 seconds of idle
    autoScrollResumeTimeout = setTimeout(() => {
      startMobileAutoScroll();
    }, 5000);
  }

  grid.addEventListener('touchstart', pauseAutoScrollTemporarily, { passive: true });
  grid.addEventListener('pointerdown', pauseAutoScrollTemporarily, { passive: true });

  // Mobile Auto-Scroll Loop
  function startMobileAutoScroll() {
    if (window.innerWidth > 640) return;
    if (mobileAutoScrollTimer) return;
    if (document.querySelector('.intent-card.is-selected')) return;

    mobileAutoScrollTimer = setInterval(() => {
      if (window.innerWidth > 640 || document.querySelector('.intent-card.is-selected')) {
        stopMobileAutoScroll();
        return;
      }

      const current = getClosestCardIndex();
      const next = (current + 1) % cards.length;
      scrollToCard(next);
    }, 3800);
  }

  // Start auto scroll if on mobile
  if (window.innerWidth <= 640) {
    startMobileAutoScroll();
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) {
      stopMobileAutoScroll();
    } else if (!document.querySelector('.intent-card.is-selected')) {
      startMobileAutoScroll();
    }
  });
}

/**
 * ==========================================================================
 * 2. GLITCH WORD ROTATOR (YouTube Synonyms & High-Impact Terms)
 * Glitches every 2 seconds and smoothly transitions with character scramble
 * ==========================================================================
 */
function initGlitchWordRotator() {
  const el = document.getElementById('glitchWord');
  if (!el) return;

  const words = ["Goal", "Path", "Breakthrough", "System", "Playbook", "Blueprint"];
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~0123456789";
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % words.length;
    const targetWord = words[currentIndex];
    
    // Add glitching class
    el.classList.add('is-glitching');

    // Scramble effect
    let iteration = 0;
    const maxIterations = 8;
    const interval = setInterval(() => {
      iteration++;
      if (iteration < maxIterations) {
        let scrambled = "";
        for (let i = 0; i < targetWord.length; i++) {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = scrambled;
      } else {
        clearInterval(interval);
        el.textContent = targetWord;
        el.setAttribute('data-text', targetWord);
        el.classList.remove('is-glitching');
      }
    }, 30);
  }, 2200);
}

/**
 * ==========================================================================
 * 3. FAST SUB-SECOND ENTRANCE TIMELINE
 * Total duration: ~0.85s - Snappy, modern, zero delay
 * ==========================================================================
 */
function initGatewayEntrance() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  const topNav = document.getElementById('topNav');
  const backdropText = document.getElementById('founderBackdropText');
  const portrait = document.getElementById('founderPortrait');
  const badges = document.querySelectorAll('.floating-metric-badge');
  const designation = document.getElementById('founderDesignation');
  const intentHeader = document.getElementById('intentHeader');
  const intentCards = document.querySelectorAll('.intent-card');
  const footer = document.getElementById('gatewayFooter');
  const ambientMesh = document.getElementById('ambientMesh');

  // Pre-set initial states cleanly with autoAlpha to prevent any FOUC
  gsap.set(topNav, { y: -25, autoAlpha: 0 });
  if (backdropText) gsap.set(backdropText, { scale: 0.92, autoAlpha: 0, y: 15 });
  if (portrait) gsap.set(portrait, { y: 25, autoAlpha: 0 });
  gsap.set(badges, { scale: 0.75, autoAlpha: 0 });
  if (designation) gsap.set(designation, { y: 15, autoAlpha: 0 });
  if (intentHeader) gsap.set(intentHeader, { y: 15, autoAlpha: 0 });
  gsap.set(intentCards, { y: 25, autoAlpha: 0, scale: 0.96 });
  if (footer) gsap.set(footer, { y: 15, autoAlpha: 0 });
  if (ambientMesh) gsap.set(ambientMesh, { opacity: 0.5, scale: 0.98 });

  // Master timeline with tight, overlapping timing
  const tl = gsap.timeline({
    delay: 0.05,
    defaults: { force3D: true }
  });

  // 1. Top Nav slides down
  tl.to(topNav, {
    y: 0,
    autoAlpha: 1,
    duration: 0.45,
    ease: "power3.out"
  }, 0);

  // 2. Background mesh awakens
  if (ambientMesh) {
    tl.to(ambientMesh, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    }, 0.1);
  }

  // 3. Savan Matariya Backdrop Name resolves
  if (backdropText) {
    tl.to(backdropText, {
      scale: 1,
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
      ease: "power3.out"
    }, 0.1);
  }

  // 4. Founder portrait rises smoothly
  if (portrait) {
    tl.to(portrait, {
      y: 0,
      autoAlpha: 1,
      duration: 0.65,
      ease: "power3.out"
    }, 0.18);
  }

  // 5. 4 Floating achievement badges pop in
  tl.to(badges, {
    scale: 1,
    autoAlpha: 1,
    duration: 0.5,
    stagger: 0.06,
    ease: "back.out(1.8)"
  }, 0.28);

  // 6. Designation strip resolves
  if (designation) {
    tl.to(designation, {
      y: 0,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power2.out"
    }, 0.38);
  }

  // 7. Intent Header & 5 Intent Cards cascade in
  if (intentHeader) {
    tl.to(intentHeader, {
      y: 0,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power2.out"
    }, 0.4);
  }

  tl.to(intentCards, {
    y: 0,
    autoAlpha: 1,
    scale: 1,
    duration: 0.45,
    stagger: 0.04,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility"
  }, 0.46);

  // 8. Footer resolves
  if (footer) {
    tl.to(footer, {
      y: 0,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power2.out"
    }, 0.6);
  }
}

/**
 * ==========================================================================
 * 4. CONTINUOUS FLOATING MOTION FOR 4 ACHIEVEMENT BADGES
 * Subtle, elegant levitation physics
 * ==========================================================================
 */
function initBadgeFloatingMotion() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  const b1 = document.getElementById('badge1');
  const b2 = document.getElementById('badge2');
  const b3 = document.getElementById('badge3');
  const b4 = document.getElementById('badge4');

  if (b1 && b3) {
    gsap.to([b1, b3], {
      y: -6,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  if (b2 && b4) {
    gsap.to([b2, b4], {
      y: 6,
      duration: 3.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5
    });
  }
}

/**
 * ==========================================================================
 * 5. LINEAR-STYLE MOUSE-TRACKING SPOTLIGHT (Fallback / Baseline)
 * ==========================================================================
 */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.spotlight-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * ==========================================================================
 * 6. 21ST.DEV INTERACTIVE 3D TILT, SPRING ELEVATION & SIBLING DIMMING
 * Dynamic interactive placement: card responds to cursor physics and tilts in 3D
 * ==========================================================================
 */
function initIntentCardHover() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const cards = document.querySelectorAll('.intent-card');
  if (!cards.length) return;

  cards.forEach(card => {
    // Quick setters for smooth 60fps 3D tilt
    const setRotateX = gsap.quickTo(card, "rotateX", { duration: 0.3, ease: "power2.out" });
    const setRotateY = gsap.quickTo(card, "rotateY", { duration: 0.3, ease: "power2.out" });
    const setY = gsap.quickTo(card, "y", { duration: 0.3, ease: "power2.out" });

    card.addEventListener('pointerenter', () => {
      // 1. Lift hovered card
      gsap.to(card, {
        scale: 1.025,
        zIndex: 25,
        transformPerspective: 1000,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto"
      });

      // 2. Dim sibling cards
      cards.forEach(sibling => {
        if (sibling !== card) {
          gsap.to(sibling, {
            opacity: 0.36,
            scale: 0.985,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });
    });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 3D tilt physics (max ±5.5 degrees)
      const tiltX = ((y - centerY) / centerY) * -5.5;
      const tiltY = ((x - centerX) / centerX) * 5.5;

      setRotateX(tiltX);
      setRotateY(tiltY);
      setY(-8);

      // Update cursor spotlight position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('pointerleave', () => {
      // Smoothly spring card back to neutral resting state (or active elevated state)
      const isSelected = card.classList.contains('is-selected');
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: isSelected ? -4 : 0,
        scale: 1,
        zIndex: isSelected ? 20 : 5,
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto"
      });

      // Restore all sibling cards
      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto"
      });
    });
  });
}

/**
 * ==========================================================================
 * 7. SUBTLE DESKTOP FOUNDER PARALLAX
 * ==========================================================================
 */
function initFounderParallax() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const root = document.getElementById('gatewayRoot');
  const portrait = document.getElementById('founderPortrait');
  const backdropText = document.getElementById('founderBackdropText');
  if (!root || !portrait) return;

  const movePortraitX = gsap.quickTo(portrait, "x", { duration: 0.9, ease: "power2.out" });
  const movePortraitY = gsap.quickTo(portrait, "y", { duration: 0.9, ease: "power2.out" });

  let moveTextX;
  if (backdropText) {
    moveTextX = gsap.quickTo(backdropText, "x", { duration: 1.2, ease: "power2.out" });
  }

  root.addEventListener('pointermove', (e) => {
    const rect = root.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    movePortraitX(normX * 14);
    movePortraitY(normY * 8);

    if (moveTextX) {
      moveTextX(normX * -20);
    }
  });

  root.addEventListener('mouseleave', () => {
    movePortraitX(0);
    movePortraitY(0);
    if (moveTextX) moveTextX(0);
  });
}

