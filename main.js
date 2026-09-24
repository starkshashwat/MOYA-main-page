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
  youtubeUrl: "https://www.youtube.com",
  instagramUrl: "https://www.instagram.com",
  facebookUrl: "https://www.facebook.com"
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bind URLs to clickable elements
  initUrlBindings();

  // 2. Set current copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Initialize Audio Unlock & Sound Toggle Pill
  initAudioUnlock();
  initSoundToggle();

  // 4. Initialize Glitch Word Alternator ("Choose Your Goal / Path / System...")
  initGlitchWordRotator();

  // 5. Initialize Card mouse spotlight tracking (Linear style)
  initCardSpotlight();

  // 6. Initialize GSAP animations
  if (typeof gsap !== 'undefined') {
    initGatewayEntrance();
    initBadgeFloatingMotion();
    initIntentCardHover();
    initFounderParallax();
  }
});

/**
 * Connect anchor elements to MOYA_CONFIG
 */
function initUrlBindings() {
  const bindings = [
    // 5 Intent Pathways
    { id: 'pathStart', url: MOYA_CONFIG.webinarUrl },
    { id: 'pathStuck', url: MOYA_CONFIG.mentorshipUrl },
    { id: 'pathTeam', url: MOYA_CONFIG.productionsUrl },
    { id: 'pathSystem', url: MOYA_CONFIG.courseUrl },
    { id: 'pathLive', url: MOYA_CONFIG.eventsUrl },
    
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
 * 2. PROCEDURAL CYBER GLITCH SOUND EFFECT (Web Audio API)
 * Zero external audio files • Bandpass white noise micro-burst + frequency chirp
 * Compliant with modern browser autoplay policies (resumes on user gesture)
 * ==========================================================================
 */
let audioCtx = null;
let isSoundMuted = false;

// Check persistent muted preference
try {
  isSoundMuted = localStorage.getItem('moya_sfx_muted') === 'true';
} catch (e) {
  isSoundMuted = false;
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function initAudioUnlock() {
  const unlockEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
  const unlockHandler = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch (e) {}
    unlockEvents.forEach(evt => window.removeEventListener(evt, unlockHandler));
  };
  unlockEvents.forEach(evt => window.addEventListener(evt, unlockHandler, { once: true, passive: true }));
}

function initSoundToggle() {
  const toggleBtn = document.getElementById('soundToggleBtn');
  const statusText = document.getElementById('soundStatusText');
  if (!toggleBtn) return;

  if (isSoundMuted) {
    toggleBtn.setAttribute('data-muted', 'true');
    if (statusText) statusText.textContent = 'MUTED';
  } else {
    toggleBtn.setAttribute('data-muted', 'false');
    if (statusText) statusText.textContent = 'SFX ON';
  }

  toggleBtn.addEventListener('click', () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    isSoundMuted = !isSoundMuted;
    try {
      localStorage.setItem('moya_sfx_muted', isSoundMuted ? 'true' : 'false');
    } catch (e) {}

    if (isSoundMuted) {
      toggleBtn.setAttribute('data-muted', 'true');
      if (statusText) statusText.textContent = 'MUTED';
    } else {
      toggleBtn.setAttribute('data-muted', 'false');
      if (statusText) statusText.textContent = 'SFX ON';
      playCyberGlitchSound();
    }
  });
}

function playCyberGlitchSound() {
  if (isSoundMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;

    // Layer 1: Bandpassed White Noise Micro-Burst (~35ms)
    const noiseDuration = 0.035;
    const bufferSize = Math.floor(ctx.sampleRate * noiseDuration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2800, now);
    bandpass.Q.setValueAtTime(3.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.045, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0005, now + noiseDuration);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    // Layer 2: Cyber micro-pip (Modulated frequency chirp ~40ms)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';

    // Fast frequency sweep down from 2100Hz to 650Hz
    osc.frequency.setValueAtTime(2100, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.04);

    const oscFilter = ctx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(2600, now);

    oscGain.gain.setValueAtTime(0.022, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscFilter.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.042);
  } catch (err) {
    // Non-critical audio failure, degrade silently
  }
}

/**
 * ==========================================================================
 * 3. GLITCH WORD ROTATOR (YouTube Synonyms & High-Impact Terms)
 * Glitches every ~2.2s with sound effect and character scramble
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
    
    // Play cyber glitch sound effect when word glitch begins
    playCyberGlitchSound();

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
 * 5. LINEAR-STYLE MOUSE-TRACKING SPOTLIGHT
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
 * 6. INTENT CARDS HOVER & SIBLING DIMMING
 * ==========================================================================
 */
function initIntentCardHover() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isReduced || isTouch) return;

  const cards = document.querySelectorAll('.intent-card');
  if (!cards.length) return;

  cards.forEach(card => {
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

    card.addEventListener('mouseleave', () => {
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
