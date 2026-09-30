/** MOYA gateway: stable selection, manual carousel and lightweight motion. */
const MOYA_CONFIG = {
  webinarUrl: 'https://ai.mechanismofya.com',
  mentorshipUrl: 'services.html?intent=stuck',
  productionsUrl: 'services.html?intent=team',
  courseUrl: 'https://vsl.mechanismofya.com',
  eventsUrl: 'events.html',
  youtubeUrl: 'https://www.youtube.com/channel/UCx4bJ-Q2aSiEn6WnTwAXxKg',
  instagramUrl: 'https://www.instagram.com/mechanism_ya/',
  facebookUrl: 'https://www.facebook.com/mechanismofya/'
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
  initGoalSelection();
  initCarousel();
  initWordRotator();
  initSpotlight();
  initEntrance();
  initBadgeFloatingMotion();
  initIntentCardHover();
  initFounderParallax();
});

function initGoalSelection() {
  const cards = Array.from(document.querySelectorAll('.intent-card'));
  const stage = document.getElementById('dynamicCtaStage');
  const button = document.getElementById('dynamicActionBtn');
  const label = document.getElementById('dynamicBtnLabel');
  if (!cards.length || !button || !stage || !label) return;

  function select(card) {
    const intent = card.dataset.goal;
    if (!window.MoyaFlow.destination(intent)) return;
    const changed = card.getAttribute('aria-checked') !== 'true';
    cards.forEach(item => {
      const selected = item === card;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-checked', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    button.dataset.intent = intent;
    button.disabled = false;
    label.textContent = intent === 'live' ? 'Explore Events' : 'Proceed to Services';
    stage.classList.add('is-visible');
    if (changed) window.moyaAnalytics?.track('select_goal', { goal: intent });

    // Lock horizontal window scroll to 0 — viewport must never shift or jerk sideways
    if (typeof window !== 'undefined' && window.scrollX && window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY, behavior: 'instant' });
    }
  }

  cards.forEach((card, index) => {
    card.tabIndex = index === 0 ? 0 : -1;
    card.addEventListener('click', () => {
      select(card);
      if (typeof window !== 'undefined' && window.scrollX && window.scrollX !== 0) {
        window.scrollTo({ left: 0, top: window.scrollY, behavior: 'instant' });
      }
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select(card);
        return;
      }
      const movement = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(event.key in movement) && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1
        : (index + movement[event.key] + cards.length) % cards.length;
      cards[next].focus({ preventScroll: true });
      select(cards[next]);
      scrollCardIntoTrack(cards[next]);
    });
  });
}

function scrollCardIntoTrack(card) {
  const grid = document.getElementById('intentGrid');
  if (!grid || !window.matchMedia('(max-width: 640px)').matches) return;
  const track = grid.getBoundingClientRect();
  const box = card.getBoundingClientRect();
  const left = grid.scrollLeft + box.left - track.left - (grid.clientWidth - box.width) / 2;
  grid.scrollTo({
    left: Math.max(0, Math.min(left, grid.scrollWidth - grid.clientWidth)),
    behavior: reducedMotion.matches ? 'auto' : 'smooth'
  });
}

function initCarousel() {
  const grid = document.getElementById('intentGrid');
  const cards = Array.from(document.querySelectorAll('.intent-card'));
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  const prev = document.getElementById('carouselPrevBtn');
  const next = document.getElementById('carouselNextBtn');
  if (!grid || !cards.length || !prev || !next) return;
  let scheduled = false;

  function closest() {
    const bounds = grid.getBoundingClientRect();
    const center = bounds.left + grid.clientWidth / 2;
    return cards.reduce((best, card, index) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity }).index;
  }

  function update() {
    scheduled = false;
    const active = closest();
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === active);
      dot.setAttribute('aria-current', index === active ? 'true' : 'false');
    });
    prev.disabled = grid.scrollLeft <= 2;
    next.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
  }

  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }

  prev.addEventListener('click', () => scrollCardIntoTrack(cards[Math.max(0, closest() - 1)]));
  next.addEventListener('click', () => scrollCardIntoTrack(cards[Math.min(cards.length - 1, closest() + 1)]));
  dots.forEach((dot, index) => dot.addEventListener('click', () => scrollCardIntoTrack(cards[index])));
  grid.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(grid);
  update();
}

function initWordRotator() {
  const word = document.getElementById('glitchWord');
  if (!word) return;
  const words = ['Goal', 'Path', 'Breakthrough', 'System', 'Playbook', 'Blueprint'];
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~0123456789';
  let index = 0;

  window.setInterval(() => {
    if (reducedMotion.matches || document.hidden || document.getElementById('leadDialog')?.open) return;
    index = (index + 1) % words.length;
    const targetWord = words[index];

    word.classList.add('is-glitching');
    let iteration = 0;
    const maxIterations = 8;
    const interval = setInterval(() => {
      iteration++;
      if (iteration < maxIterations) {
        let scrambled = '';
        for (let i = 0; i < targetWord.length; i++) {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        word.textContent = scrambled;
      } else {
        clearInterval(interval);
        word.textContent = targetWord;
        word.dataset.text = targetWord;
        word.classList.remove('is-glitching');
      }
    }, 30);
  }, 3000);
}

function initSpotlight() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion.matches) return;
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    });
  });
}

function initEntrance() {
  if (typeof gsap === 'undefined' || reducedMotion.matches) return;

  const topNav = document.getElementById('topNav');
  const backdropText = document.getElementById('founderBackdropText');
  const portrait = document.getElementById('founderPortrait');
  const badges = document.querySelectorAll('.floating-metric-badge');
  const designation = document.getElementById('founderDesignation');
  const intentHeader = document.getElementById('intentHeader');
  const intentCards = document.querySelectorAll('.intent-card');
  const ambientMesh = document.querySelector('.ambient-mesh-glow');
  const footer = document.querySelector('.gateway-footer');

  if (topNav) gsap.set(topNav, { y: -25, autoAlpha: 0 });
  if (ambientMesh) gsap.set(ambientMesh, { opacity: 0.5, scale: 0.98 });
  if (backdropText) gsap.set(backdropText, { scale: 0.92, autoAlpha: 0, y: 15 });
  if (portrait) gsap.set(portrait, { y: 25, autoAlpha: 0 });
  if (badges.length) gsap.set(badges, { scale: 0.75, autoAlpha: 0 });
  if (designation) gsap.set(designation, { y: 15, autoAlpha: 0 });
  if (intentHeader) gsap.set(intentHeader, { y: 15, autoAlpha: 0 });
  if (intentCards.length) gsap.set(intentCards, { y: 25, autoAlpha: 0, scale: 0.96 });
  if (footer) gsap.set(footer, { y: 15, autoAlpha: 0 });

  const tl = gsap.timeline({
    delay: 0.05,
    defaults: { force3D: true }
  });

  if (topNav) {
    tl.to(topNav, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' }, 0);
  }
  if (ambientMesh) {
    tl.to(ambientMesh, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.1);
  }
  if (backdropText) {
    tl.to(backdropText, { scale: 1, y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.1);
  }
  if (portrait) {
    tl.to(portrait, { y: 0, autoAlpha: 1, duration: 0.65, ease: 'power3.out' }, 0.18);
  }
  if (badges.length) {
    tl.to(badges, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.5,
      stagger: 0.06,
      ease: 'back.out(1.8)',
      clearProps: 'transform,opacity,visibility'
    }, 0.28);
  }
  if (designation) {
    tl.to(designation, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, 0.38);
  }
  if (intentHeader) {
    tl.to(intentHeader, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.4);
  }
  if (intentCards.length) {
    tl.to(intentCards, {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      duration: 0.45,
      stagger: 0.04,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility'
    }, 0.46);
  }
  if (footer) {
    tl.to(footer, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.6);
  }
}

function initBadgeFloatingMotion() {
  if (typeof gsap === 'undefined' || reducedMotion.matches) return;

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
      ease: 'sine.inOut'
    });
  }

  if (b2 && b4) {
    gsap.to([b2, b4], {
      y: 6,
      duration: 3.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    });
  }
}

function initIntentCardHover() {
  if (typeof gsap === 'undefined' || reducedMotion.matches) return;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const cards = document.querySelectorAll('.intent-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const setRotateX = gsap.quickTo(card, 'rotateX', { duration: 0.3, ease: 'power2.out' });
    const setRotateY = gsap.quickTo(card, 'rotateY', { duration: 0.3, ease: 'power2.out' });
    const setY = gsap.quickTo(card, 'y', { duration: 0.3, ease: 'power2.out' });

    card.addEventListener('pointerenter', () => {
      gsap.to(card, {
        scale: 1.025,
        zIndex: 25,
        transformPerspective: 1000,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      cards.forEach(sibling => {
        if (sibling !== card) {
          gsap.to(sibling, {
            opacity: 0.38,
            scale: 0.985,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    });

    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((y - centerY) / centerY) * -5.5;
      const tiltY = ((x - centerX) / centerX) * 5.5;

      setRotateX(tiltX);
      setRotateY(tiltY);
      setY(-8);
    });

    card.addEventListener('pointerleave', () => {
      const isSelected = card.classList.contains('is-selected');
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: isSelected ? -4 : 0,
        scale: 1,
        zIndex: isSelected ? 20 : 5,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });
}

function initFounderParallax() {
  if (typeof gsap === 'undefined' || reducedMotion.matches) return;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const root = document.getElementById('gatewayRoot');
  const portrait = document.getElementById('founderPortrait');
  const backdropText = document.getElementById('founderBackdropText');
  if (!root || !portrait) return;

  const movePortraitX = gsap.quickTo(portrait, 'x', { duration: 0.9, ease: 'power2.out' });
  const movePortraitY = gsap.quickTo(portrait, 'y', { duration: 0.9, ease: 'power2.out' });

  let moveTextX;
  if (backdropText) {
    moveTextX = gsap.quickTo(backdropText, 'x', { duration: 1.2, ease: 'power2.out' });
  }

  root.addEventListener('pointermove', e => {
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
