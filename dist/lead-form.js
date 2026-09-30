/** Native lead form with instant 0ms modal and secure direct GoHighLevel upsert */
(function () {
  'use strict';
  const flow = window.MoyaFlow;
  const dialog = document.getElementById('leadDialog');
  const trigger = document.getElementById('dynamicActionBtn');
  const form = document.getElementById('leadCustomForm');
  const closeBtn = document.getElementById('leadClose');
  const submitBtn = document.getElementById('leadSubmitBtn');
  const submitLabel = document.getElementById('leadSubmitLabel');
  const nameInput = document.getElementById('leadName');
  const emailInput = document.getElementById('leadEmail');
  const phoneInput = document.getElementById('leadPhone');
  const intentInput = document.getElementById('leadIntentInput');
  const goalHeading = document.getElementById('leadSelectedGoal');
  const statusMsg = document.getElementById('leadFormStatus');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  if (!flow || !dialog || !trigger || !form) return;

  let active = null;
  let scrollY = 0;
  let previousBodyStyle;

  function clearErrors() {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (phoneError) phoneError.textContent = '';
    if (statusMsg) {
      statusMsg.textContent = '';
      statusMsg.className = 'lead-form-status';
    }
  }

  function setSubmitting(submitting) {
    if (!submitBtn) return;
    submitBtn.disabled = submitting;
    if (submitLabel) {
      if (submitting) {
        submitLabel.textContent = 'Securing Access…';
      } else {
        const intent = active?.intent || intentInput?.value;
        submitLabel.textContent = intent === 'live' ? 'Proceed to Live Event' : 'Proceed to Blueprint';
      }
    }
  }

  trigger.addEventListener('click', () => {
    const intent = trigger.dataset.intent;
    if (!flow.destination(intent) || dialog.open) return;

    active = {
      intent,
      id: window.crypto && typeof window.crypto.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
      createdAt: Date.now()
    };
    flow.save(active);

    if (typeof dialog.showModal !== 'function') {
      window.location.assign(flow.destination(intent));
      return;
    }

    if (intentInput) intentInput.value = intent;
    if (goalHeading) {
      const selectedEl = document.querySelector(`.intent-card[data-goal="${intent}"] .card-intent-heading`) ||
                         document.querySelector('.intent-card.is-selected .card-intent-heading');
      goalHeading.textContent = selectedEl?.textContent?.trim() || 'Executive Blueprint';
    }

    clearErrors();
    setSubmitting(false);

    scrollY = window.scrollY;
    previousBodyStyle = document.body.getAttribute('style');
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    Object.assign(document.body.style, {
      position: 'fixed',
      top: `-${scrollY}px`,
      left: '0',
      right: '0',
      paddingRight: `${scrollbar}px`,
      overflow: 'hidden'
    });

    dialog.showModal();
    if (nameInput) nameInput.focus({ preventScroll: true });

    window.moyaAnalytics?.track('cta_click', { goal: intent, destination: flow.destination(intent) });
    window.moyaAnalytics?.track('lead_form_open', { goal: intent });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => dialog.close());
  }

  // Backdrop click closes dialog
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    flow.clear();
    active = null;
    clearErrors();
    setSubmitting(false);
    if (previousBodyStyle === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', previousBodyStyle || '');
    window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    trigger.focus({ preventScroll: true });
  });

  // Client-side validation + fast submission to /api/lead + direct redirect
  form.addEventListener('submit', async event => {
    event.preventDefault();
    clearErrors();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const intent = (active?.intent || intentInput?.value || 'start').trim();

    let hasError = false;

    if (!name || name.length < 2) {
      if (nameError) nameError.textContent = 'Please enter your full name.';
      if (!hasError && nameInput) nameInput.focus();
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      if (!hasError && emailInput) emailInput.focus();
      hasError = true;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone || phoneDigits.length < 8) {
      if (phoneError) phoneError.textContent = 'Please enter a valid phone or WhatsApp number.';
      if (!hasError && phoneInput) phoneInput.focus();
      hasError = true;
    }

    if (hasError) return;

    setSubmitting(true);
    if (statusMsg) {
      statusMsg.textContent = 'Connecting…';
      statusMsg.className = 'lead-form-status';
    }

    const dest = flow.destination(intent) || '/services.html';
    let navigated = false;
    const navigateOnce = () => {
      if (!navigated) {
        navigated = true;
        let target = dest;
        if (typeof window !== 'undefined' && window.location?.protocol === 'file:' && target.startsWith('/')) {
          target = target.slice(1);
        }
        const nav = window.MoyaFlow?.navigate || flow?.navigate;
        if (typeof nav === 'function') {
          nav(target);
        } else {
          window.location.assign(target);
        }
      }
    };

    // Tracking generate_lead
    window.moyaAnalytics?.track('generate_lead', {
      goal: intent,
      name,
      email,
      phone,
      event_callback: navigateOnce
    });

    // Safety fallback: Never trap the user if network is slow
    const safetyTimer = window.setTimeout(navigateOnce, 1800);

    const payload = {
      locationId: 'jsuZqhDRfnfSBFMgdfs2',
      name,
      email,
      phone,
      tags: ['website-lead', `intent-${intent}`],
      source: 'MOYA Website'
    };

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      window.clearTimeout(safetyTimer);
      navigateOnce();
    } catch (_) {
      window.clearTimeout(safetyTimer);
      navigateOnce();
    }
  });

  window.addEventListener('pageshow', event => {
    if (event.persisted && dialog.open) dialog.close();
  });
})();
