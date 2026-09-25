/**
 * ==========================================================================
 * MOYA ACADEMY — SERVICES & PRICING BLUEPRINTS ENGINE
 * Self-Contained Pricing Cards • Continuous Intent Continuity • GSAP Micro-Interactions
 * ==========================================================================
 */

// 1. CONTINUOUS INTENT MAPPING (From Home Gateway)
const INTENT_MAPPING = {
  start: {
    cardId: "planWebinar",
    lead: "RECOMMENDED PATHWAY //",
    desc: "Starting Out? The Live Masterclass is your ideal foundational entry."
  },
  system: {
    cardId: "planProgram",
    lead: "RECOMMENDED PATHWAY //",
    desc: "Building a Media Engine? MOYA 1.0 provides the complete operating framework."
  },
  team: {
    cardId: "planProduction",
    lead: "RECOMMENDED PATHWAY //",
    desc: "Need an Execution Team? Growth Studio handles end-to-end video engineering."
  },
  stuck: {
    cardId: "planMentorship",
    lead: "RECOMMENDED PATHWAY //",
    desc: "Stuck with Algorithm Bottlenecks? 1-on-1 Advisory will audit and scale."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Set copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize Glitch Word Rotator
  initGlitchWordRotator();

  // Initialize Intent Routing & Card Focus
  initIntentHandling();

  // Initialize Card Mouse Tracking Spotlight
  initCardSpotlight();

  // GSAP Entrance & Interactions
  if (typeof gsap !== 'undefined') {
    initPricingEntrance();
    initPricingCardHoverPhysics();
  }
});

/**
 * ==========================================================================
 * 2. INTENT HANDLING & FOCUSED CARD GUIDANCE
 * ==========================================================================
 */
function initIntentHandling() {
  const urlParams = new URLSearchParams(window.location.search);
  const incomingIntent = urlParams.get('intent');
  const contextDesc = document.getElementById('contextDesc');

  if (incomingIntent && INTENT_MAPPING[incomingIntent]) {
    const intentConfig = INTENT_MAPPING[incomingIntent];
    if (contextDesc) {
      contextDesc.textContent = intentConfig.desc;
    }

    const targetCard = document.getElementById(intentConfig.cardId);
    if (targetCard) {
      targetCard.classList.add('intent-focus');

      // On mobile or small screens, scroll smoothly to the recommended card
      if (window.innerWidth <= 1024) {
        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
      }
    }
  }
}

/**
 * ==========================================================================
 * 3. GLITCH WORD ROTATOR ("Blueprints", "Systems", "Pathways", "Engines")
 * ==========================================================================
 */
function initGlitchWordRotator() {
  const el = document.getElementById('glitchWord');
  if (!el) return;

  const words = ["Blueprints", "Systems", "Pathways", "Engines", "Architectures", "Pipelines"];
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~0123456789";
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % words.length;
    const targetWord = words[currentIndex];
    
    el.classList.add('is-glitching');

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
  }, 2600);
}

/**
 * ==========================================================================
 * 4. MOUSE-TRACKING SPOTLIGHT ON CARDS
 * ==========================================================================
 */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.pricing-card');
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
 * 5. GSAP ENTRANCE ANIMATION TIMELINE
 * ==========================================================================
 */
function initPricingEntrance() {
  const nav = document.getElementById('servicesNav');
  const header = document.getElementById('servicesHeader');
  const cards = document.querySelectorAll('.pricing-card');
  const footer = document.getElementById('servicesFooter');

  gsap.set(nav, { y: -20, autoAlpha: 0 });
  if (header) gsap.set(header, { y: 15, autoAlpha: 0 });
  gsap.set(cards, { y: 25, autoAlpha: 0, scale: 0.96 });
  if (footer) gsap.set(footer, { y: 15, autoAlpha: 0 });

  const tl = gsap.timeline({ delay: 0.05 });

  tl.to(nav, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 0);
  if (header) tl.to(header, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 0.1);
  tl.to(cards, {
    y: 0,
    autoAlpha: 1,
    scale: 1,
    duration: 0.5,
    stagger: 0.07,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility"
  }, 0.2);
  if (footer) tl.to(footer, { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.45);
}

/**
 * ==========================================================================
 * 6. DESKTOP 3D TILT PHYSICS ON PRICING CARDS
 * ==========================================================================
 */
function initPricingCardHoverPhysics() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const cards = document.querySelectorAll('.pricing-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const isRecommended = card.classList.contains('is-recommended');
    const baseScale = isRecommended ? 1.025 : 1;

    const setRotateX = gsap.quickTo(card, "rotateX", { duration: 0.3, ease: "power2.out" });
    const setRotateY = gsap.quickTo(card, "rotateY", { duration: 0.3, ease: "power2.out" });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((y - centerY) / centerY) * -4;
      const tiltY = ((x - centerX) / centerX) * 4;

      setRotateX(tiltX);
      setRotateY(tiltY);
    });

    card.addEventListener('pointerleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto"
      });
    });
  });
}
