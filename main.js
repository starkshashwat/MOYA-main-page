/**
 * MOYA GATEWAY HERO CONTROLLER — STUDIOVA LAYOUT
 * Centered Composition, Side Gateways, Mobile Dock
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

  // Magnetic hover effect on pill CTA
  initMagneticButtons();

  // Hover effects on side gateway buttons
  initSideGatewayEffects();

  // Year in signature footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/**
 * Connect all anchor elements to MOYA_CONFIG
 * Supports both desktop side gateways and mobile dock duplicates
 */
function initUrlBindings() {
  const bindings = [
    // Desktop side gateways
    { id: 'navQuickCallBtn', url: MOYA_CONFIG.quickCallUrl },
    { id: 'footerQuickCall', url: MOYA_CONFIG.quickCallUrl },
    { id: 'ctaMentorship', url: MOYA_CONFIG.mentorshipUrl },
    { id: 'ctaProductions', url: MOYA_CONFIG.productionsUrl },
    { id: 'ctaWebinar', url: MOYA_CONFIG.webinarUrl },
    { id: 'ctaWhatsapp', url: MOYA_CONFIG.whatsappUrl },
    // Mobile dock duplicates
    { id: 'ctaMentorshipMobile', url: MOYA_CONFIG.mentorshipUrl },
    { id: 'ctaProductionsMobile', url: MOYA_CONFIG.productionsUrl },
    { id: 'ctaWebinarMobile', url: MOYA_CONFIG.webinarUrl },
    { id: 'ctaWhatsappMobile', url: MOYA_CONFIG.whatsappUrl }
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
 * Magnetic button hover effect on pill CTA
 */
function initMagneticButtons() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const buttons = document.querySelectorAll('.brand-pill-cta');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) scale(1.1)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

/**
 * Side gateway hover enhancements — subtle glow pulse on hover
 */
function initSideGatewayEffects() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const gateways = document.querySelectorAll('.side-gateway-btn');
  gateways.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const icon = btn.querySelector('.sgw-icon');
      if (icon) {
        icon.style.background = 'rgba(255, 255, 255, 0.15)';
        icon.style.transform = 'scale(1.1)';
      }
    });

    btn.addEventListener('mouseleave', () => {
      const icon = btn.querySelector('.sgw-icon');
      if (icon) {
        icon.style.background = 'rgba(255, 255, 255, 0.08)';
        icon.style.transform = 'scale(1)';
      }
    });
  });
}
