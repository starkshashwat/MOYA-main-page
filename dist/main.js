/**
 * MOYA GATEWAY — FAST CINEMATIC GSAP INTERACTION ENGINE
 * Sub-Second Entrance • Interactive Bento Grid • Linear Spotlight • Zero-Flicker Micro-Interactions
 */

// ==========================================================================
// 1. CENTRAL ROUTING & URL BINDINGS
// ==========================================================================
const MOYA_CONFIG = {
  // WhatsApp direct click-to-chat (Phone: 9274359207)
  quickCallUrl: "https://wa.me/919274359207?text=Hi%20Savan,%20I'd%20like%20to%20connect%20with%20MOYA.",
  mentorshipUrl: "https://wa.me/919274359207?text=Hi%20Savan,%20I'm%20interested%20in%20MOYA%20One-to-One%20Mentorship.",
  productionsUrl: "https://wa.me/919274359207?text=Hi%20Savan,%20I'm%20interested%20in%20MOYA%20Productions.",
  
  // YouTube Automation Masterclass (Price: ₹199)
  webinarUrl: "https://ai.mechanismofya.com",
  
  // Official WhatsApp Channel
  whatsappUrl: "https://whatsapp.com/channel/0029VajcJRV2UPB940uoYv10"
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bind URLs to clickable elements
  initUrlBindings();

  // 2. Set current copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Initialize Bento card mouse spotlight tracking (Linear style)
  initBentoSpotlight();

  // 4. Initialize GSAP animations (Fast, sub-second entrance)
  if (typeof gsap !== 'undefined') {
    initFastHeroEntrance();
    initBentoInteractions();
    initAmbientMotion();
  }
});

/**
 * Connect anchor elements to MOYA_CONFIG
 */
function initUrlBindings() {
  const bindings = [
    { id: 'navQuickCallBtn', url: MOYA_CONFIG.quickCallUrl },
    { id: 'heroCircularCta', url: MOYA_CONFIG.webinarUrl },
    { id: 'cardMentorship', url: MOYA_CONFIG.mentorshipUrl },
    { id: 'cardProductions', url: MOYA_CONFIG.productionsUrl },
    { id: 'cardMasterclass', url: MOYA_CONFIG.webinarUrl },
    { id: 'cardWhatsapp', url: MOYA_CONFIG.whatsappUrl },
    { id: 'footerChatLink', url: MOYA_CONFIG.quickCallUrl }
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
 * 2. FAST SUB-SECOND GSAP ENTRANCE TIMELINE
 * Total duration: ~0.85s - Snappy, modern, zero delay
 * ==========================================================================
 */
function initFastHeroEntrance() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  const topNav = document.getElementById('topNav');
  const eyebrow = document.getElementById('heroEyebrow');
  const letters = document.querySelectorAll('#oversizedTitle .char-inner');
  const asterisk = document.getElementById('superscriptMark');
  const circularCta = document.getElementById('heroCircularCta');
  const bentoCards = document.querySelectorAll('.bento-card');
  const footer = document.getElementById('heroFooter');
  const ambientMesh = document.getElementById('ambientMesh');

  // Pre-set initial states cleanly with autoAlpha to prevent any FOUC
  gsap.set(topNav, { y: -25, autoAlpha: 0 });
  gsap.set(eyebrow, { y: 15, autoAlpha: 0 });
  gsap.set(letters, { yPercent: 115, autoAlpha: 0 });
  if (asterisk) gsap.set(asterisk, { scale: 0, autoAlpha: 0, rotate: -30 });
  if (circularCta) gsap.set(circularCta, { scale: 0, autoAlpha: 0, rotate: -45 });
  gsap.set(bentoCards, { y: 30, autoAlpha: 0, scale: 0.95 });
  gsap.set(footer, { y: 15, autoAlpha: 0 });
  if (ambientMesh) gsap.set(ambientMesh, { opacity: 0.6, scale: 0.98 });

  // Master timeline with tight, overlapping timing
  const tl = gsap.timeline({
    delay: 0.05,
    defaults: { force3D: true }
  });

  // 1. Top Nav slides down (0.4s)
  tl.to(topNav, {
    y: 0,
    autoAlpha: 1,
    duration: 0.45,
    ease: "power3.out"
  }, 0);

  // 2. Eyebrow fades in (0.35s)
  tl.to(eyebrow, {
    y: 0,
    autoAlpha: 1,
    duration: 0.4,
    ease: "power2.out"
  }, 0.08);

  // 3. Letters slide up through mask with high initial velocity (0.6s)
  tl.to(letters, {
    yPercent: 0,
    autoAlpha: 1,
    duration: 0.55,
    stagger: 0.04,
    ease: "power4.out"
  }, 0.12);

  // 4. Superscript mark & Circular CTA pop in (0.45s)
  if (asterisk) {
    tl.to(asterisk, {
      scale: 1,
      autoAlpha: 1,
      rotate: 0,
      duration: 0.4,
      ease: "back.out(2)"
    }, 0.28);
  }

  if (circularCta) {
    tl.to(circularCta, {
      scale: 1,
      autoAlpha: 1,
      rotate: 0,
      duration: 0.45,
      ease: "back.out(1.8)"
    }, 0.32);
  }

  // 5. Bento cards cascade in cleanly (0.5s)
  tl.to(bentoCards, {
    y: 0,
    autoAlpha: 1,
    scale: 1,
    duration: 0.5,
    stagger: 0.05,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility"
  }, 0.3);

  // 6. Ambient background bloom settles
  if (ambientMesh) {
    tl.to(ambientMesh, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    }, 0.2);
  }

  // 7. Minimal footer resolves
  tl.to(footer, {
    y: 0,
    autoAlpha: 1,
    duration: 0.4,
    ease: "power2.out"
  }, 0.45);
}

/**
 * ==========================================================================
 * 3. LINEAR-STYLE MOUSE-TRACKING SPOTLIGHT
 * High performance via pointermove & CSS variables
 * ==========================================================================
 */
function initBentoSpotlight() {
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
 * 4. BENTO CARD HOVER & SIBLING DIMMING
 * Elevate hovered card + gently dim neighboring cards
 * ==========================================================================
 */
function initBentoInteractions() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const cards = document.querySelectorAll('.bento-card');
  if (!cards.length) return;

  cards.forEach(card => {
    // 3D perspective micro-tilt setup
    const tiltX = gsap.quickTo(card, "rotateX", { duration: 0.35, ease: "power2.out" });
    const tiltY = gsap.quickTo(card, "rotateY", { duration: 0.35, ease: "power2.out" });

    gsap.set(card, { transformPerspective: 1000, transformStyle: "preserve-3d" });

    card.addEventListener('mouseenter', () => {
      // Dim siblings
      cards.forEach(sibling => {
        if (sibling !== card) {
          gsap.to(sibling, {
            opacity: 0.42,
            scale: 0.985,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });
    });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      tiltY(normX * 6); // Max 3deg tilt
      tiltX(-normY * 6);
    });

    card.addEventListener('mouseleave', () => {
      tiltX(0);
      tiltY(0);

      // Restore all cards
      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto"
      });
    });
  });
}

/**
 * ==========================================================================
 * 5. ATMOSPHERIC AMBIENT MOTION & PARALLAX
 * ==========================================================================
 */
function initAmbientMotion() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced) return;

  const mesh = document.getElementById('ambientMesh');
  if (!mesh) return;

  // Gentle breathing glow
  gsap.to(mesh, {
    scale: 1.05,
    opacity: 0.85,
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  if (isTouch) return;

  // Desktop subtle mouse parallax
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const moveX = gsap.quickTo(mesh, "x", { duration: 1.2, ease: "power2.out" });
  const moveY = gsap.quickTo(mesh, "y", { duration: 1.2, ease: "power2.out" });

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    moveX(normX * -25);
    moveY(normY * -18);
  });

  canvas.addEventListener('mouseleave', () => {
    moveX(0);
    moveY(0);
  });
}
