/**
 * ==========================================================================
 * MOYA ACADEMY — SERVICES & PRICING BLUEPRINTS ENGINE
 * Self-Contained Pricing Cards • Goal-Driven Intent Routing • GSAP Micro-Interactions
 * ==========================================================================
 */

// 1. INTENT MAPPING FROM GATEWAY CHOICES
const INTENT_MAPPING = {
  start: {
    goalTitle: "I Want to Start My Channel",
    cardId: "planWebinar",
    badge: "Matches Your Goal",
    subtitle: "Starting out? We've highlighted the Live Masterclass as your foundational entry."
  },
  system: {
    goalTitle: "I Want to Learn the Whole System",
    cardId: "planProgram",
    badge: "Matches Your Goal",
    subtitle: "Want the complete framework? We've highlighted MOYA 1.0 for self-paced mastery."
  },
  team: {
    goalTitle: "I Want Someone to Build It With Me",
    cardId: "planProduction",
    badge: "Recommended • Matches Goal",
    subtitle: "Need an execution team? We've highlighted Growth Studio for end-to-end production."
  },
  stuck: {
    goalTitle: "I’m Stuck With My Channel",
    cardId: "planMentorship",
    badge: "Matches Your Goal",
    subtitle: "Stuck with growth? We've highlighted 1-on-1 Advisory to audit your bottlenecks."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Set copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize Intent Routing & Card Highlight
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
  const breadcrumbEl = document.getElementById('intentBreadcrumb');
  const breadcrumbTarget = document.getElementById('breadcrumbTarget');
  const subtitleEl = document.getElementById('servicesSubtitle');

  if (incomingIntent && INTENT_MAPPING[incomingIntent]) {
    const config = INTENT_MAPPING[incomingIntent];

    // Reveal and set breadcrumb
    if (breadcrumbEl && breadcrumbTarget) {
      breadcrumbTarget.textContent = config.goalTitle;
      breadcrumbEl.style.display = 'inline-flex';
    }

    // Set contextual subtitle
    if (subtitleEl) {
      subtitleEl.textContent = config.subtitle;
    }

    // Highlight and pop the target card
    const targetCard = document.getElementById(config.cardId);
    if (targetCard) {
      targetCard.classList.add('is-matched');

      // Check if badge already exists
      const existingBadge = targetCard.querySelector('.recommended-badge') || targetCard.querySelector('.intent-match-badge');
      if (existingBadge) {
        existingBadge.textContent = config.badge;
      } else {
        const badge = document.createElement('div');
        badge.className = 'intent-match-badge';
        badge.textContent = config.badge;
        targetCard.prepend(badge);
      }

      // Smooth scroll on mobile/tablet
      if (window.innerWidth <= 1024) {
        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
      }
    }
  }
}

/**
 * ==========================================================================
 * 3. MOUSE-TRACKING SPOTLIGHT ON CARDS
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
 * 4. GSAP ENTRANCE ANIMATION TIMELINE
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
 * 5. DESKTOP 3D TILT PHYSICS ON PRICING CARDS
 * ==========================================================================
 */
function initPricingCardHoverPhysics() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const cards = document.querySelectorAll('.pricing-card');
  if (!cards.length) return;

  cards.forEach(card => {
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
