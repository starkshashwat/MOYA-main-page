/**
 * ==========================================================================
 * MOYA ACADEMY — SERVICES MATRIX & SELECTION FUNNEL ENGINE
 * Continuous Intent Storytelling • Dynamic Pricing Reveal • GSAP Micro-Interactions
 * ==========================================================================
 */

// 1. SERVICES KNOWLEDGE BASE & PRICING REGISTRY
const SERVICES_DATA = {
  webinar: {
    id: "serviceWebinar",
    tier: "LIVE MASTERCLASS",
    status: "● LIMITED SEATS AVAILABLE",
    name: "I just want to join the webinar",
    currency: "₹",
    price: "499",
    term: "",
    guarantee: "Instant Access • 100% Actionable",
    features: [
      "Live 2-Hour Intensive Mechanism Breakdown with Savan Matariya",
      "Live Q&A Session for Direct Channel Diagnostics",
      "Exclusive System Cheat-Sheet & Case Study Vault PDF"
    ],
    btnLabel: "Lock My Seat Now",
    btnUrl: "https://ai.mechanismofya.com",
    subNote: "Secure Checkout • Instant Confirmation via WhatsApp & Email"
  },
  program: {
    id: "serviceProgram",
    tier: "CORE BLUEPRINT",
    status: "● LIFETIME CURRICULUM ACCESS",
    name: "I want program which can guide me in the right direction",
    currency: "₹",
    price: "9,999",
    term: "",
    guarantee: "Full Lifetime Curriculum Access",
    features: [
      "The Complete 8-Module YouTube Automation Engineering System",
      "Algorithmic Retention Frameworks & High-CTR Thumbnail Playbooks",
      "Private Community of Dedicated High-Growth Creators"
    ],
    btnLabel: "Enroll in Complete Program",
    btnUrl: "https://vsl.mechanismofya.com",
    subNote: "Instant Dashboard Access • Includes All Future Updates"
  },
  production: {
    id: "serviceProduction",
    tier: "STUDIO EXECUTION",
    status: "● LIMITED CAPACITY: 3 SLOTS/MO",
    name: "I want video making support",
    currency: "From ₹",
    price: "24,999",
    term: "/mo",
    guarantee: "Dedicated Media Production Team",
    features: [
      "End-to-End Retention Scripting & Packaging Strategy",
      "High-Velocity Video Editing by MOYA Senior Video Architects",
      "A/B Tested Packaging: Thumbnails, Titles & Metadata Engineering"
    ],
    btnLabel: "Apply for Production Team",
    btnUrl: "https://www.instagram.com/mechanism_ya/",
    subNote: "Application Required • We Only Accept Channels We Can Scale"
  },
  mentorship: {
    id: "serviceMentorship",
    tier: "1-ON-1 ADVISORY",
    status: "● DIRECT WITH SAVAN MATARIYA",
    name: "I want 1-1 mentorship with Savan sir",
    currency: "₹",
    price: "49,999",
    term: "",
    guarantee: "Private Channel Audit & Custom Growth Model",
    features: [
      "Direct 1-on-1 Strategic Consulting with Savan Matariya",
      "Comprehensive Channel Audit & Algorithmic Bottleneck Breakdown",
      "Custom Tailored 90-Day Execution Roadmap & Direct Review Access"
    ],
    btnLabel: "Book 1-on-1 Advisory Session",
    btnUrl: "https://www.instagram.com/mechanism_ya/",
    subNote: "Strictly Limited to 2 Creators Per Month • Application Only"
  }
};

// 2. CONTINUOUS INTENT MAPPING (From Home Gateway)
const INTENT_MAPPING = {
  start: {
    serviceKey: "webinar",
    lead: "RECOMMENDED PATHWAY //",
    desc: "Starting Out? The Live Masterclass is your ideal foundational entry."
  },
  stuck: {
    serviceKey: "mentorship",
    lead: "RECOMMENDED PATHWAY //",
    desc: "Stuck with Growth? 1-on-1 Advisory will audit and break your algorithm bottleneck."
  },
  team: {
    serviceKey: "production",
    lead: "RECOMMENDED PATHWAY //",
    desc: "Need an Execution Team? Our Studio handles scriptwriting, thumbnails and editing."
  },
  system: {
    serviceKey: "program",
    lead: "RECOMMENDED PATHWAY //",
    desc: "Want the Whole System? The Core Blueprint provides the entire self-paced roadmap."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Set copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize Glitch Word Rotator
  initGlitchWordRotator();

  // Initialize Card Spotlight
  initCardSpotlight();

  // Initialize Services Selection & Dynamic Pricing
  initServicesSelection();

  // Initialize Mobile Carousel
  initServicesCarousel();

  // GSAP Entrance
  if (typeof gsap !== 'undefined') {
    initServicesEntrance();
    initServiceCardHoverPhysics();
  }
});

/**
 * ==========================================================================
 * 3. SERVICES SELECTION ENGINE & PRICING REVEAL DOCK
 * ==========================================================================
 */
let currentSelectedService = null;

function initServicesSelection() {
  const cards = document.querySelectorAll('.service-card');
  const pricingDock = document.getElementById('pricingDock');
  const contextDesc = document.getElementById('contextDesc');

  if (!cards.length) return;

  // 1. Detect incoming intent from query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const incomingIntent = urlParams.get('intent');

  let defaultServiceKey = "webinar";
  if (incomingIntent && INTENT_MAPPING[incomingIntent]) {
    const intentConfig = INTENT_MAPPING[incomingIntent];
    defaultServiceKey = intentConfig.serviceKey;
    if (contextDesc) {
      contextDesc.textContent = intentConfig.desc;
    }
  }

  // 2. Select card function
  function selectService(serviceKey, isInitial = false) {
    const data = SERVICES_DATA[serviceKey];
    if (!data) return;

    currentSelectedService = serviceKey;

    // A. Update visual active state on cards
    cards.forEach(card => {
      const isCurrent = card.dataset.service === serviceKey;
      card.classList.toggle('is-selected', isCurrent);
      card.setAttribute('aria-checked', isCurrent ? 'true' : 'false');
      
      if (typeof gsap !== 'undefined' && !isInitial) {
        gsap.to(card, {
          y: isCurrent ? -4 : 0,
          duration: 0.35,
          ease: "power2.out"
        });
      }
    });

    // B. Populate Pricing Dock Data
    updatePricingDock(data, isInitial);

    // C. Reveal Pricing Dock
    if (pricingDock) {
      pricingDock.classList.add('is-revealed');
      if (typeof gsap !== 'undefined' && !isInitial) {
        gsap.fromTo(pricingDock,
          { scale: 0.96, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }
        );
      }
    }

    // D. On mobile, center the selected card
    if (window.innerWidth <= 640 && !isInitial) {
      const targetCard = document.getElementById(data.id);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }

  // Bind click & keyboard handlers to each card
  cards.forEach(card => {
    const key = card.dataset.service;
    card.addEventListener('click', () => selectService(key));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectService(key);
      }
    });
  });

  // Automatically pre-select based on intent (or default)
  setTimeout(() => {
    selectService(defaultServiceKey, true);
  }, 100);
}

/**
 * Updates the text and pricing values in the Pricing Dock
 */
function updatePricingDock(data, isInitial) {
  const tierTag = document.getElementById('dockTierTag');
  const statusTag = document.getElementById('dockStatusTag');
  const serviceName = document.getElementById('dockServiceName');
  const priceVal = document.getElementById('dockPriceVal');
  const priceTerm = document.getElementById('dockPriceTerm');
  const guaranteeNote = document.getElementById('dockGuaranteeNote');
  const featuresList = document.getElementById('dockFeaturesList');
  const ctaBtn = document.getElementById('dockCtaBtn');
  const btnLabel = document.getElementById('dockBtnLabel');
  const actionSub = document.getElementById('dockActionSub');

  if (tierTag) tierTag.textContent = data.tier;
  if (statusTag) statusTag.textContent = data.status;
  if (serviceName) serviceName.textContent = data.name;
  if (priceTerm) priceTerm.textContent = data.term;
  if (guaranteeNote) guaranteeNote.textContent = data.guarantee;
  if (btnLabel) btnLabel.textContent = data.btnLabel;
  if (actionSub) actionSub.textContent = data.subNote;
  if (ctaBtn) ctaBtn.href = data.btnUrl;

  // Numeric count / glitch punch on price change
  if (priceVal) {
    if (typeof gsap !== 'undefined' && !isInitial) {
      gsap.fromTo(priceVal,
        { scale: 0.8, opacity: 0.5, y: -8 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" }
      );
    }
    priceVal.textContent = data.price;
  }

  // Populate deliverables list
  if (featuresList && data.features) {
    featuresList.innerHTML = data.features.map(feat => `
      <li>
        <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>${feat}</span>
      </li>
    `).join('');
  }
}

/**
 * ==========================================================================
 * 4. MOBILE HORIZONTAL CAROUSEL SYNC & CONTROLS
 * ==========================================================================
 */
function initServicesCarousel() {
  const grid = document.getElementById('servicesGrid');
  const dots = document.querySelectorAll('.cards-carousel-dots .carousel-dot');
  const prevBtn = document.getElementById('servicesPrevBtn');
  const nextBtn = document.getElementById('servicesNextBtn');
  const cards = Array.from(document.querySelectorAll('.service-card'));

  if (!grid || !cards.length) return;

  let currentActiveIndex = 0;

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

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentActiveIndex);
    });

    const maxScroll = grid.scrollWidth - grid.clientWidth;
    if (prevBtn) {
      prevBtn.classList.toggle('is-disabled', currentActiveIndex === 0 && grid.scrollLeft <= 5);
    }
    if (nextBtn) {
      nextBtn.classList.toggle('is-disabled', currentActiveIndex === cards.length - 1 && grid.scrollLeft >= maxScroll - 5);
    }
  }

  function scrollToCard(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;

    currentActiveIndex = index;
    const targetCard = cards[index];
    if (!targetCard) return;

    const targetLeft = targetCard.offsetLeft - grid.offsetLeft - (grid.clientWidth - targetCard.offsetWidth) / 2;

    grid.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth'
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === index);
    });
  }

  grid.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateControlsState);
  }, { passive: true });

  setTimeout(updateControlsState, 150);

  // Prev Button Click (with looping)
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = getClosestCardIndex();
      const prevIndex = current > 0 ? current - 1 : cards.length - 1;
      scrollToCard(prevIndex);
    });
  }

  // Next Button Click (with looping)
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = getClosestCardIndex();
      const nextIndex = current < cards.length - 1 ? current + 1 : 0;
      scrollToCard(nextIndex);
    });
  }

  // Dot Click Navigation
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToCard(idx);
    });
  });
}

/**
 * ==========================================================================
 * 5. GLITCH WORD ROTATOR ("Blueprint", "System", "Pathway", "Engine")
 * ==========================================================================
 */
function initGlitchWordRotator() {
  const el = document.getElementById('glitchWord');
  if (!el) return;

  const words = ["Blueprint", "System", "Pathway", "Engine", "Strategy", "Solution"];
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
  }, 2400);
}

/**
 * ==========================================================================
 * 6. LINEAR-STYLE MOUSE-TRACKING SPOTLIGHT
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
 * 7. GSAP ENTRANCE ANIMATION TIMELINE
 * ==========================================================================
 */
function initServicesEntrance() {
  const nav = document.getElementById('servicesNav');
  const header = document.getElementById('servicesHeader');
  const cards = document.querySelectorAll('.service-card');
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
    stagger: 0.06,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility"
  }, 0.2);
  if (footer) tl.to(footer, { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.45);
}

/**
 * ==========================================================================
 * 8. DESKTOP 3D TILT PHYSICS ON SERVICE CARDS
 * ==========================================================================
 */
function initServiceCardHoverPhysics() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const cards = document.querySelectorAll('.service-card');
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

      const tiltX = ((y - centerY) / centerY) * -5;
      const tiltY = ((x - centerX) / centerX) * 5;

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
