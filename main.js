/**
 * MOYA GATEWAY HERO CONTROLLER
 * Architectural Scripts & Micro-Interactions
 */

// ==========================================================================
// 1. CENTRAL URL CONFIGURATION
// Add your live production URLs here. All CTAs read from this object.
// ==========================================================================
const MOYA_CONFIG = {
  quickCallUrl: "https://calendly.com",
  mentorshipUrl: "https://mentorship.moya.com",
  productionsUrl: "https://productions.moya.com",
  webinarUrl: "https://webinar.moya.com",
  whatsappUrl: "https://whatsapp.com/channel/moya"
};

document.addEventListener('DOMContentLoaded', () => {
  // Bind all URLs dynamically
  initUrlBindings();

  // Subtle cursor parallax on hero ambient glow & mentor silhouette
  initCursorParallax();

  // Magnetic hover effect on primary pill CTAs
  initMagneticButtons();

  // Interactive spotlight card illumination
  initGatewayCards();

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
      mesh.style.transform = `translateX(${currentX * -25}px) translateY(${currentY * -20}px) scale(1.02)`;
    }

    if (mentor) {
      mentor.style.transform = `translateX(${currentX * 18}px) translateY(${currentY * 12}px)`;
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
 * Interactive card highlighting and keyboard trigger
 */
function initGatewayCards() {
  const cards = document.querySelectorAll('.gateway-card');

  cards.forEach(card => {
    // Mouse radial spotlight effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const glow = card.querySelector('.gateway-card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(180px circle at ${x}px ${y}px, rgba(225, 224, 204, 0.5), transparent 70%)`;
        glow.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.gateway-card-glow');
      if (glow) {
        glow.style.opacity = '0';
      }
    });

    // Keyboard support: Enter / Space triggers CTA
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const actionBtn = card.querySelector('.gateway-action-btn');
        if (actionBtn) {
          actionBtn.click();
        }
      }
    });

    // Clicking anywhere on card triggers the CTA button
    card.addEventListener('click', (e) => {
      const actionBtn = card.querySelector('.gateway-action-btn');
      if (actionBtn && !e.target.closest('.gateway-action-btn')) {
        actionBtn.click();
      }
    });
  });
}
