/**
 * ==========================================================================
 * MOYA ACADEMY — SERVICES MATRIX & SELECTION FUNNEL ENGINE
 * Continuous Intent Storytelling • Dynamic Pricing Reveal • GSAP Micro-Interactions
 * ==========================================================================
 */

// 1. SERVICES KNOWLEDGE BASE & CUMULATIVE DELIVERABLES REGISTRY
const SERVICES_DATA = {
  webinar: {
    id: "serviceWebinar",
    badge: "Live 3-Hour Broadcast Pass",
    name: "I just want to join the webinar",
    desc: "Fast-track live breakdown of the Mechanism of YouTube Automation & direct channel diagnostics with Savan Matariya.",
    btnLabel: "Reserve Masterclass Seat",
    btnUrl: "https://ai.mechanismofya.com",
    subNote: "Instant Confirmation • Live Interactive Broadcast Access",
    checklist: [
      { text: "3-Hour Live Mechanism of YouTube Automation Masterclass", included: true },
      { text: "Live Interactive Q&A & Direct Channel Diagnostic Session with Savan Sir", included: true },
      { text: "System Cheat-Sheet & Case Study Vault PDF", included: true },
      { text: "Full MOYA Core Operating System (8 Modules & All Lectures)", included: false },
      { text: "19 Implementation Bonuses Stack (Canva/PSD Templates & SOPs)", included: false },
      { text: "2-Day Fast-Track Onboarding Bootcamp Access & Weekly Live Review Calls", included: false },
      { text: "End-to-End Video Production (Scripting, Voiceover, 4K Editing)", included: false },
      { text: "6-Month 1-on-1 Strategic Mentorship Journey with Savan Sir", included: false }
    ]
  },
  program: {
    id: "serviceProgram",
    badge: "Includes Tier 01 + Full System",
    name: "I want program which can guide me in the right direction",
    desc: "The complete self-paced YouTube automation curriculum, retention playbooks, and algorithmic growth blueprints.",
    btnLabel: "Access Full MOYA Blueprint",
    btnUrl: "https://vsl.mechanismofya.com",
    subNote: "Instant Dashboard Access • Includes All Future Updates",
    checklist: [
      { text: "3-Hour Live Masterclass Access INCLUDED", included: true, inherit: true },
      { text: "System Cheat-Sheet & Case Study Vault PDF INCLUDED", included: true, inherit: true },
      { text: "Full MOYA Core Operating System (All 8 Modules: Mindset, Niche, Setup, Team, Viral Ideas, Production)", included: true },
      { text: "The Complete 19 Bonus Stack (Worth ₹50,000+ Free: Niche Masterfiles, Canva Templates, PSDs, SOPs)", included: true },
      { text: "18 Plug-and-Play Bonus Frameworks (Core Systems, Operational SOPs & Creative Toolkits)", included: true },
      { text: "Private Creator Mastermind Community (Networking, Peer Feedback & Q&A)", included: true },
      { text: "Weekly Live Review & Doubt-Clearing Calls with MOYA Team", included: true },
      { text: "2-Day Fast-Track Setup Bootcamp Access", included: true },
      { text: "Dedicated Media Production Team (Scripting, Voiceover, 4K Editing)", included: false },
      { text: "6-Month 1-on-1 Strategic Mentorship with Savan Sir", included: false }
    ]
  },
  production: {
    id: "serviceProduction",
    badge: "Includes Tiers 01–02 + Studio Pipeline",
    name: "I want video making support",
    desc: "End-to-end done-with-you and done-for-you production: retention scripting, high-CTR packaging & elite 4K editing.",
    btnLabel: "Book Studio Discovery Call",
    btnUrl: "https://www.instagram.com/mechanism_ya/",
    subNote: "Application Required • We Only Accept Channels We Can Scale",
    checklist: [
      { text: "Live Masterclass Pass INCLUDED", included: true, inherit: true },
      { text: "Full MOYA Core Program & Complete 19 Implementation Bonuses INCLUDED", included: true, inherit: true },
      { text: "Private Creator Mastermind Community & Weekly Review Calls INCLUDED", included: true, inherit: true },
      { text: "FREE VIP Entry to all upcoming Bootcamps & Live Events", included: true, isHighlight: true },
      { text: "Channel Niche Finalization & Complete Branding Architecture", included: true },
      { text: "Viral Topic Engineering, Storyboarding & Retention Scripting", included: true },
      { text: "High-CTR Thumbnail Design (A/B Tested Visual Concepts & Title Strategy)", included: true },
      { text: "Cinema 4K Video Editing, Motion Graphics & Audio Mastering (Ready to Upload)", included: true },
      { text: "Private 6-Month 1-on-1 Direct Advisory with Savan Sir", included: false }
    ]
  },
  mentorship: {
    id: "serviceMentorship",
    badge: "Full Ecosystem + 1-on-1 with Savan Sir",
    name: "I want 1-1 mentorship with Savan sir",
    desc: "Direct, personal strategic advisory with Savan Matariya for custom channel growth architecture & pre-upload audits.",
    btnLabel: "Apply for 1-on-1 Mentorship",
    btnUrl: "https://www.instagram.com/mechanism_ya/",
    subNote: "Strictly Limited Capacity • Custom Tailored 6-Month Strategic Advisory",
    checklist: [
      { text: "Live Masterclass Pass INCLUDED", included: true, inherit: true },
      { text: "Complete MOYA Operating System + 19 Implementation Bonus Stack INCLUDED", included: true, inherit: true },
      { text: "Mastermind Community + Unlimited FREE Access to All Bootcamps & Events INCLUDED", included: true, inherit: true },
      { text: "Complete Video Production Architecture, Templates & SOPs INCLUDED", included: true, inherit: true },
      { text: "6-Month Structured Strategic Journey with Savan Matariya (Months 1–2: Weekly calls • Months 3–4: Fortnightly deep-dives • Months 5–6: Monthly check-ins)", included: true, isHighlight: true },
      { text: "Custom Market Positioning & Data-Backed Decisions (Tailored for Dominance)", included: true },
      { text: "Direct VIP Priority Access Line with Savan Sir (Pre-upload video & thumbnail reviews)", included: true, isHighlight: true }
    ]
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
 * 3. SERVICES SELECTION ENGINE & DELIVERABLES REVEAL DOCK
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

    // B. Populate Deliverables Dock Data
    updatePricingDock(data, isInitial);

    // C. Reveal Dock
    if (pricingDock) {
      pricingDock.classList.add('is-revealed');
      if (typeof gsap !== 'undefined' && !isInitial) {
        gsap.fromTo(pricingDock,
          { scale: 0.98, opacity: 0.85 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
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
 * Updates the text and deliverables in the Activation Dock
 */
function updatePricingDock(data, isInitial) {
  const serviceName = document.getElementById('dockServiceName');
  const badgeTag = document.getElementById('dockBadge');
  const featuresList = document.getElementById('dockFeaturesList');
  const ctaBtn = document.getElementById('dockCtaBtn');
  const btnLabel = document.getElementById('dockBtnLabel');
  const actionSub = document.getElementById('dockActionSub');

  if (serviceName) serviceName.textContent = data.name;
  if (badgeTag) badgeTag.textContent = data.badge;
  if (btnLabel) btnLabel.textContent = data.btnLabel;
  if (actionSub) actionSub.textContent = data.subNote;
  if (ctaBtn) ctaBtn.href = data.btnUrl;

  // Populate deliverables list with Tick ✓ (included) and Cross ✕ (excluded)
  if (featuresList && data.checklist) {
    featuresList.innerHTML = data.checklist.map(item => {
      if (item.included) {
        const highlightClass = item.isHighlight ? 'is-highlight' : '';
        const inheritClass = item.inherit ? 'is-inherit' : '';
        return `
          <li class="checklist-item is-included ${highlightClass} ${inheritClass}">
            <span class="icon-wrap check-wrap" aria-hidden="true">
              <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span class="item-text">${item.text}</span>
          </li>
        `;
      } else {
        return `
          <li class="checklist-item is-excluded">
            <span class="icon-wrap cross-wrap" aria-hidden="true">
              <svg class="cross-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </span>
            <span class="item-text">${item.text}</span>
          </li>
        `;
      }
    }).join('');

    // Animate list items on selection
    if (typeof gsap !== 'undefined' && !isInitial) {
      gsap.fromTo(featuresList.querySelectorAll('.checklist-item'),
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.22, stagger: 0.015, ease: "power2.out" }
      );
    }
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
