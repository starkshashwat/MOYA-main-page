/**
 * MOYA GATEWAY HERO CONTROLLER
 * Architectural Scripts, WhatsApp Routing & Re-Engineered Card Interactions
 */

// ==========================================================================
// 1. CENTRAL URL CONFIGURATION
// Direct WhatsApp Click-to-Chat, AI Masterclass & Official Channel Links
// ==========================================================================
const MOYA_CONFIG = {
  // WhatsApp direct click-to-chat (Phone: 9274359207)
  quickCallUrl: "https://wa.me/919274359207?text=Hi%20Savan,%20I'd%20like%20to%20book%20a%20quick%20call.",
  mentorshipUrl: "https://wa.me/919274359207?text=Hi%20Savan,%20I'm%20interested%20in%20MOYA%20One-to-One%20Mentorship.",
  productionsUrl: "https://wa.me/919274359207?text=Hi%20Savan,%20I'm%20interested%20in%20MOYA%20Productions.",
  
  // YouTube Automation Masterclass
  webinarUrl: "https://ai.mechanismofya.com",
  
  // Official WhatsApp Channel
  whatsappUrl: "https://whatsapp.com/channel/0029VajcJRV2UPB940uoYv10"
};

document.addEventListener('DOMContentLoaded', () => {
  // Bind all URLs dynamically
  initUrlBindings();

  // Subtle cursor parallax on hero ambient glow & mentor silhouette
  initCursorParallax();

  // Magnetic hover effect on primary pill CTAs
  initMagneticButtons();

  // Re-engineered 3D Tilt & Dynamic Cursor Spotlight on Service Cards
  initReEngineeredCards();

  // Year in signature footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/**
 * Connect all anchor elements to MOYA_CONFIG
 */
function initUrlBindings() {
  const bindings = [
    { id: 'navQuickCallBtn', url: MOYA_CONFIG.quickCallUrl },
    { id: 'footerQuickCall', url: MOYA_CONFIG.quickCallUrl },
    { id: 'ctaMentorship', url: MOYA_CONFIG.mentorshipUrl },
    { id: 'ctaProductions', url: MOYA_CONFIG.productionsUrl },
    { id: 'ctaWebinar', url: MOYA_CONFIG.webinarUrl },
    { id: 'ctaWhatsapp', url: MOYA_CONFIG.whatsappUrl }
  ];

  bindings.forEach(b => {
    const el = document.getElementById(b.id);
    if (el) {
      el.href = b.url;
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // Primary Explore scroll-to-dock button
  const exploreBtn = document.getElementById('primaryExploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const gateways = document.getElementById('gateways');
      if (gateways) {
        gateways.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
}

/**
 * Smooth 60 FPS Cursor Parallax (respects prefers-reduced-motion)
 */
function initCursorParallax() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const canvas = document.getElementById('heroCanvas');
  const mesh = document.getElementById('ambientMesh');
  const mentor = document.getElementById('mentorWrap');
  if (!canvas) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    targetX = x;
    targetY = y;

    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  });

  canvas.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function updateParallax() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    if (mesh) {
      mesh.style.transform = `translateX(${currentX * -22}px) translateY(${currentY * -18}px) scale(1.02)`;
    }

    if (mentor) {
      mentor.style.transform = `translateX(${currentX * 16}px) translateY(${currentY * 10}px)`;
    }

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }
}

/**
 * Magnetic button hover effect
 */
function initMagneticButtons() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const buttons = document.querySelectorAll('.reference-pill-cta, .quick-call-cta');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

/**
 * Re-Engineered 3D Tilt & Dynamic Spotlight on Service Cards
 */
function initReEngineeredCards() {
  const cards = document.querySelectorAll('.gateway-card');
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  cards.forEach(card => {
    const spotlight = card.querySelector('.card-ambient-spotlight');

    if (!isReduced && !isTouch) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Dynamic Spotlight coordinate update
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Subtle 3D perspective tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg tilt
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      });
    }

    // Direct card click redirects to action link
    card.addEventListener('click', (e) => {
      const actionBtn = card.querySelector('.gateway-action-btn');
      if (actionBtn && !e.target.closest('.gateway-action-btn')) {
        window.open(actionBtn.href, '_blank', 'noopener,noreferrer');
      }
    });

    // Keyboard navigation (Enter or Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const actionBtn = card.querySelector('.gateway-action-btn');
        if (actionBtn) {
          window.open(actionBtn.href, '_blank', 'noopener,noreferrer');
        }
      }
    });
  });
}
