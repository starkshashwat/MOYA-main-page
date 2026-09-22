/**
 * MOYA GATEWAY — GSAP CINEMATIC INTERACTION CONTROLLER
 * High-End Awwwards-Level Hero Choreography, Text Reveals & Zero-Flicker Parallax
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
  
  // YouTube Automation Masterclass (Price: ₹199)
  webinarUrl: "https://ai.mechanismofya.com",
  
  // Official WhatsApp Channel
  whatsappUrl: "https://whatsapp.com/channel/0029VajcJRV2UPB940uoYv10"
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bind URLs to buttons
  initUrlBindings();

  // 2. Set current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Initialize GSAP animations
  if (typeof gsap !== 'undefined') {
    initGSAPHeroChoreography();
  } else {
    // Fallback if GSAP is not loaded
    initFallbackParallax();
  }
});

/**
 * Connect all anchor elements to MOYA_CONFIG
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
 * ==========================================================================
 * 2. MASTER GSAP HERO CHOREOGRAPHY
 * Staggered Entrance -> Text Reveals -> Button Sibling Fade-Out
 * ==========================================================================
 */
function initGSAPHeroChoreography() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Split editorial statement words into spans for granular stagger
  splitEditorialWords();

  // Elements
  const topNav = document.getElementById('topNav');
  const navMenuBtn = document.getElementById('navMenuBtn');
  const letters = document.querySelectorAll('#oversizedTitle .letter-reveal');
  const superscript = document.querySelector('#oversizedTitle .superscript-mark');
  const asterisk = document.querySelector('.editorial-asterisk');
  const editorialWords = document.querySelectorAll('.editorial-statement .word-split');
  const pillCta = document.getElementById('navQuickCallBtn');
  const sideButtonsLeft = document.querySelectorAll('.side-gateways--left .side-gateway-btn');
  const sideButtonsRight = document.querySelectorAll('.side-gateways--right .side-gateway-btn');
  const mobileButtons = document.querySelectorAll('.mobile-gateway-dock .mobile-gw-btn');
  const allGatewayButtons = document.querySelectorAll('.side-gateway-btn, .mobile-gw-btn');
  const footer = document.querySelector('.hero-signature-strip');
  const ambientMesh = document.getElementById('ambientMesh');

  // If reduced motion is requested, instantly reveal
  if (isReduced) {
    gsap.set([topNav, letters, superscript, asterisk, editorialWords, pillCta, allGatewayButtons, footer], {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'none'
    });
    return;
  }

  // Initial Pre-animation States (Hidden cleanly without FOUC)
  gsap.set(topNav, { y: -35, opacity: 0 });
  if (navMenuBtn) gsap.set(navMenuBtn, { scale: 0.6, opacity: 0, rotate: -45 });
  gsap.set(letters, { yPercent: 120, opacity: 0, rotateZ: 3 });
  if (superscript) gsap.set(superscript, { scale: 0, opacity: 0, rotate: -20 });
  if (asterisk) gsap.set(asterisk, { scale: 0, opacity: 0, rotate: -180 });
  gsap.set(editorialWords, { y: 22, opacity: 0, filter: 'blur(6px)' });
  if (pillCta) gsap.set(pillCta, { scale: 0, opacity: 0, rotate: -90 });
  gsap.set(sideButtonsLeft, { x: -45, opacity: 0, scale: 0.92, filter: 'blur(8px)' });
  gsap.set(sideButtonsRight, { x: 45, opacity: 0, scale: 0.92, filter: 'blur(8px)' });
  gsap.set(mobileButtons, { y: 30, opacity: 0, scale: 0.92, filter: 'blur(8px)' });
  gsap.set(footer, { y: 20, opacity: 0 });

  // Gateway internal element initial states (icons, labels, price, arrow)
  const buttonIcons = document.querySelectorAll('.side-gateway-btn .sgw-icon');
  const buttonLabels = document.querySelectorAll('.side-gateway-btn .sgw-label');
  const buttonPrices = document.querySelectorAll('.side-gateway-btn .sgw-price');
  const buttonArrows = document.querySelectorAll('.side-gateway-btn .sgw-arrow');
  gsap.set([buttonIcons, buttonLabels, buttonPrices, buttonArrows], { opacity: 0, x: -8 });

  // -------------------------------------------------------------
  // MASTER TIMELINE SEQUENCE
  // Top nav & UI -> Grand MOYA text -> Buttons & Editorial cascade
  // -------------------------------------------------------------
  const masterTl = gsap.timeline({
    delay: 0.15,
    onComplete: () => {
      // Enable live parallax and hover interactions after entrance
      initGSAPParallax();
      initGSAPButtonHover();
      initGSAPMagneticPill();
      initAmbientBreathing();
    }
  });

  // Stage 1: Top Navigation Drop
  masterTl.to(topNav, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: "power3.out"
  });

  if (navMenuBtn) {
    masterTl.to(navMenuBtn, {
      scale: 1,
      opacity: 1,
      rotate: 0,
      duration: 0.7,
      ease: "back.out(1.8)"
    }, "-=0.6");
  }

  // Stage 2: Background Ambient mesh awakens
  if (ambientMesh) {
    masterTl.to(ambientMesh, {
      opacity: 1,
      scale: 1.03,
      duration: 1.5,
      ease: "power2.out"
    }, "-=0.8");
  }

  // Stage 3: Grand MOYA* Typography Reveal
  masterTl.to(letters, {
    yPercent: 0,
    opacity: 1,
    rotateZ: 0,
    duration: 1.1,
    stagger: 0.08,
    ease: "power4.out"
  }, "-=0.7");

  if (superscript) {
    masterTl.to(superscript, {
      scale: 1,
      opacity: 1,
      rotate: 0,
      duration: 0.5,
      ease: "back.out(2)"
    }, "-=0.4");
  }

  // Stage 4: Editorial Words & Circular Arrow Pill Reveal
  if (asterisk) {
    masterTl.to(asterisk, {
      scale: 1,
      opacity: 1,
      rotate: 0,
      duration: 0.6,
      ease: "back.out(2)"
    }, "-=0.3");
  }

  masterTl.to(editorialWords, {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.65,
    stagger: 0.04,
    ease: "power2.out"
  }, "-=0.4");

  if (pillCta) {
    masterTl.to(pillCta, {
      scale: 1,
      opacity: 1,
      rotate: 0,
      duration: 0.7,
      ease: "back.out(1.9)"
    }, "-=0.4");
  }

  // Stage 5: Gateway Buttons Reveal Animatedly
  masterTl.to(sideButtonsLeft, {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.85,
    stagger: 0.12,
    ease: "power3.out"
  }, "-=0.35");

  masterTl.to(sideButtonsRight, {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.85,
    stagger: 0.12,
    ease: "power3.out"
  }, "-=0.55");

  masterTl.to(mobileButtons, {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.75,
    stagger: 0.08,
    ease: "power3.out"
  }, "-=0.55");

  // Animate elements inside the buttons one by one (Text, Icon, Price, Arrow)
  masterTl.to(buttonIcons, { opacity: 1, x: 0, scale: 1, duration: 0.4, stagger: 0.06 }, "-=0.4");
  masterTl.to(buttonLabels, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06 }, "-=0.35");
  masterTl.to(buttonPrices, { opacity: 1, x: 0, scale: 1, duration: 0.45, ease: "back.out(2)" }, "-=0.3");
  masterTl.to(buttonArrows, { opacity: 0.7, x: 0, duration: 0.35, stagger: 0.06 }, "-=0.25");

  // Footer reveal
  masterTl.to(footer, {
    y: 0,
    opacity: 1,
    duration: 0.6
  }, "-=0.3");
}

/**
 * Split the editorial text into individual span words for staggered reveal
 */
function splitEditorialWords() {
  const statement = document.querySelector('.editorial-statement');
  if (!statement) return;

  const childNodes = Array.from(statement.childNodes);
  statement.innerHTML = '';

  childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.trim().split(/\s+/);
      words.forEach((word, idx) => {
        if (!word) return;
        const span = document.createElement('span');
        span.className = 'word-split';
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity';
        span.textContent = word;
        statement.appendChild(span);
        statement.appendChild(document.createTextNode(' '));
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const span = document.createElement('span');
      span.className = 'word-split';
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.appendChild(node);
      statement.appendChild(span);
      statement.appendChild(document.createTextNode(' '));
    }
  });
}

/**
 * ==========================================================================
 * 3. ZERO-FLICKER GSAP AMBIENT PARALLAX
 * High-Precision quickTo Interpolation for Atmospheric Depth
 * ==========================================================================
 */
function initGSAPParallax() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const canvas = document.getElementById('heroCanvas');
  const mesh = document.getElementById('ambientMesh');
  if (!canvas || !mesh) return;

  const xToMesh = gsap.quickTo(mesh, "x", { duration: 1.1, ease: "power2.out" });
  const yToMesh = gsap.quickTo(mesh, "y", { duration: 1.1, ease: "power2.out" });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    xToMesh(normX * -30);
    yToMesh(normY * -22);
  });

  canvas.addEventListener('mouseleave', () => {
    xToMesh(0);
    yToMesh(0);
  });
}

/**
 * ==========================================================================
 * 4. GSAP BUTTON HOVER ANIMATION WITH SIBLING FADE-OUT
 * User: "so they reveal animatedly, slightly fading out for a very smooth animation with a GSAP feel"
 * ==========================================================================
 */
function initGSAPButtonHover() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const allButtons = document.querySelectorAll('.side-gateway-btn, .mobile-gw-btn');
  if (!allButtons.length) return;

  allButtons.forEach(btn => {
    const icon = btn.querySelector('.sgw-icon');
    const arrow = btn.querySelector('.sgw-arrow');

    btn.addEventListener('mouseenter', () => {
      // 1. Elevate and highlight hovered button
      gsap.to(btn, {
        scale: 1.05,
        y: -3,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto"
      });

      if (icon) {
        gsap.to(icon, {
          scale: 1.18,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          duration: 0.3,
          ease: "back.out(2)"
        });
      }

      if (arrow) {
        gsap.to(arrow, {
          x: 4,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out"
        });
      }

      // 2. Smoothly fade out sibling buttons ("slightly fading out for a very smooth animation with a GSAP feel")
      allButtons.forEach(sibling => {
        if (sibling !== btn) {
          gsap.to(sibling, {
            opacity: 0.38,
            scale: 0.97,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });
    });

    btn.addEventListener('mouseleave', () => {
      // Restore all buttons to full opacity and neutral state
      gsap.to(allButtons, {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto"
      });

      if (icon) {
        gsap.to(icon, {
          scale: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          duration: 0.35
        });
      }

      if (arrow) {
        gsap.to(arrow, {
          x: 0,
          opacity: 0.7,
          duration: 0.3
        });
      }
    });

    // Magnetic cursor tracking within the button
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const deltaX = e.clientX - (rect.left + rect.width / 2);
      const deltaY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(btn, {
        x: deltaX * 0.18,
        y: deltaY * 0.18 - 3,
        duration: 0.25,
        ease: "power1.out",
        overwrite: "auto"
      });
    });
  });
}

/**
 * ==========================================================================
 * 5. GSAP MAGNETIC CIRCULAR ARROW PILL
 * ==========================================================================
 */
function initGSAPMagneticPill() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const pill = document.getElementById('navQuickCallBtn');
  if (!pill) return;

  pill.addEventListener('mouseenter', () => {
    gsap.to(pill, {
      scale: 1.15,
      rotate: 8,
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 30px rgba(225, 224, 204, 0.4)',
      duration: 0.35,
      ease: "back.out(1.8)",
      overwrite: "auto"
    });
  });

  pill.addEventListener('mousemove', (e) => {
    const rect = pill.getBoundingClientRect();
    const deltaX = e.clientX - (rect.left + rect.width / 2);
    const deltaY = e.clientY - (rect.top + rect.height / 2);

    gsap.to(pill, {
      x: deltaX * 0.35,
      y: deltaY * 0.35,
      duration: 0.25,
      ease: "power1.out",
      overwrite: "auto"
    });
  });

  pill.addEventListener('mouseleave', () => {
    gsap.to(pill, {
      scale: 1,
      rotate: 0,
      x: 0,
      y: 0,
      backgroundColor: 'var(--cs-ink)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto"
    });
  });
}

/**
 * Ambient Breathing Motion on the Background Glow
 */
function initAmbientBreathing() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  const mesh = document.getElementById('ambientMesh');
  if (!mesh) return;

  gsap.to(mesh, {
    scale: 1.06,
    opacity: 0.9,
    duration: 4.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

/**
 * Fallback Parallax if GSAP is blocked by client adblocker
 */
function initFallbackParallax() {
  const canvas = document.getElementById('heroCanvas');
  const mesh = document.getElementById('ambientMesh');
  if (!canvas || !mesh) return;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    mesh.style.transform = `translate3d(${normX * -20}px, ${normY * -15}px, 0)`;
  });

  canvas.addEventListener('mouseleave', () => {
    mesh.style.transform = 'translate3d(0, 0, 0)';
  });
}
