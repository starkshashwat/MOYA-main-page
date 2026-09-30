/** A single on-demand GHL iframe. GHL owns field validation and CRM submission. */
(function () {
  'use strict';
  const flow = window.MoyaFlow;
  const dialog = document.getElementById('leadDialog');
  const trigger = document.getElementById('dynamicActionBtn');
  const slot = document.getElementById('leadFrameSlot');
  const status = document.getElementById('leadStatus');
  const retry = document.getElementById('leadRetry');
  const direct = document.getElementById('leadDirectLink');
  if (!flow || !dialog || !trigger || !slot) return;
  let frame;
  let active;
  let embedPromise;
  let waitTimer;
  let scrollY = 0;
  let previousBodyStyle;

  function loadEmbed() {
    if (embedPromise) return embedPromise;
    embedPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://pay.mechanismofya.com/js/form_embed.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        embedPromise = null;
        reject(new Error('The form helper could not load.'));
      };
      document.head.appendChild(script);
    });
    return embedPromise;
  }

  function showLoadingHelp() {
    if (!dialog.open) return;
    status.textContent = 'Taking longer than expected? Retry or open the form directly below.';
    retry.hidden = false;
  }

  function loadForm() {
    if (!active) return;
    clearTimeout(waitTimer);
    status.textContent = 'Loading your form…';
    retry.hidden = true;
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = `inline-${flow.formId}`;
      frame.title = 'MOYA Website organic leads';
      frame.className = 'lead-frame';
      frame.dataset.layout = JSON.stringify({ id: 'INLINE' });
      frame.dataset.formId = flow.formId;
      frame.dataset.layoutIframeId = frame.id;
      frame.dataset.formName = 'MOYA Webiste organic leads';
      frame.dataset.height = '594';
      frame.dataset.cookieConsent = 'true';
      frame.dataset.cookieConsentProvider = 'auto';
      frame.addEventListener('load', () => {
        // Loading is never treated as submission success.
        clearTimeout(waitTimer);
        status.textContent = 'Complete the form to continue to your selected destination.';
        retry.hidden = false;
      });
      slot.appendChild(frame);
    }
    const url = flow.formUrl(active.intent, window.location.search);
    direct.href = url;
    frame.src = url;
    waitTimer = window.setTimeout(showLoadingHelp, 15000);
    loadEmbed().catch(showLoadingHelp);
  }

  trigger.addEventListener('click', () => {
    const intent = trigger.dataset.intent;
    if (!flow.destination(intent) || dialog.open) return;
    active = { intent, id: window.crypto.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`, createdAt: Date.now() };
    flow.save(active);
    if (typeof dialog.showModal !== 'function') {
      window.location.assign(flow.formUrl(intent, window.location.search));
      return;
    }
    document.getElementById('leadSelectedGoal').textContent =
      document.querySelector('.intent-card.is-selected .card-intent-heading')?.textContent || '';
    scrollY = window.scrollY;
    previousBodyStyle = document.body.getAttribute('style');
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    Object.assign(document.body.style, {
      position: 'fixed', top: `-${scrollY}px`, left: '0', right: '0',
      paddingRight: `${scrollbar}px`, overflow: 'hidden'
    });
    dialog.showModal();
    loadForm();
    window.moyaAnalytics?.track('cta_click', { goal: intent, destination: flow.destination(intent) });
    window.moyaAnalytics?.track('lead_form_open', { goal: intent, form_id: flow.formId });
  });

  document.getElementById('leadClose').addEventListener('click', () => dialog.close());
  retry.addEventListener('click', loadForm);
  dialog.addEventListener('close', () => {
    clearTimeout(waitTimer);
    flow.clear();
    active = null;
    if (previousBodyStyle === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', previousBodyStyle || '');
    window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    trigger.focus({ preventScroll: true });
  });

  // Only our completion page in THIS iframe can finish THIS open flow.
  // There is deliberately no guessed GHL "formSubmitted" event listener.
  window.addEventListener('message', event => {
    if (event.origin !== window.location.origin || event.source !== frame?.contentWindow || !dialog.open) return;
    const message = event.data;
    if (!message || message.type !== 'moya:lead-complete' || message.formId !== flow.formId ||
        !flow.validPending(active, message.intent)) return;
    const intent = active.intent;
    active = null; // One event/navigation per completion, even if a message repeats.
    flow.clear();
    const go = () => window.location.assign(flow.destination(intent));
    let navigated = false;
    const navigateOnce = () => { if (!navigated) { navigated = true; go(); } };
    window.moyaAnalytics?.track('generate_lead', {
      goal: intent, form_id: flow.formId, event_callback: navigateOnce
    });
    window.setTimeout(navigateOnce, 600); // Analytics blocking must never block navigation.
  });

  window.addEventListener('pageshow', event => {
    if (event.persisted && dialog.open) dialog.close();
  });
})();
