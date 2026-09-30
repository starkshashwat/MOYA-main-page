/** Shared, allowlisted routing. Store only intent and short-lived flow metadata. */
(function (root) {
  'use strict';
  const routes = Object.freeze({
    start: '/services.html?intent=start',
    stuck: '/services.html?intent=stuck',
    team: '/services.html?intent=team',
    system: '/services.html?intent=system',
    live: '/events.html'
  });
  const formId = 'lmEIPrjjK5rZ1x0oLzZe';
  const storageKey = 'moya.lead-flow.v1';
  const maxAge = 2 * 60 * 60 * 1000;
  // Set this exact Query Key on the Website Intent field in the GHL builder.
  const intentQueryKey = 'moya_intent';
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  function destination(intent) {
    return Object.prototype.hasOwnProperty.call(routes, intent) ? routes[intent] : null;
  }

  function validPending(record, intent, now = Date.now()) {
    return Boolean(record && destination(intent) && record.intent === intent &&
      typeof record.id === 'string' && record.id.length > 0 &&
      Number.isFinite(record.createdAt) && now >= record.createdAt && now - record.createdAt < maxAge);
  }

  function save(record) {
    try { root.sessionStorage.setItem(storageKey, JSON.stringify(record)); } catch (_) { /* Private browsing: memory flow still works. */ }
  }

  function read() {
    try { return JSON.parse(root.sessionStorage.getItem(storageKey)); } catch (_) { return null; }
  }

  function clear() {
    try { root.sessionStorage.removeItem(storageKey); } catch (_) { /* Storage may be disabled. */ }
  }

  function formUrl(intent, search = '') {
    if (!destination(intent)) return null;
    const url = new URL(`https://pay.mechanismofya.com/widget/form/${formId}`);
    url.searchParams.set(intentQueryKey, intent);
    url.searchParams.set('source', 'MOYA Website');
    const campaign = new URLSearchParams(search);
    campaignKeys.forEach(key => {
      const value = campaign.get(key);
      if (value && /^[a-zA-Z0-9_.~-]{1,120}$/.test(value)) url.searchParams.set(key, value);
    });
    return url.href;
  }

  function navigate(url) {
    if (typeof root.location !== 'undefined') {
      let target = url;
      if (root.location.protocol === 'file:' && target.startsWith('/')) {
        target = target.slice(1);
      }
      if (typeof root.location.assign === 'function') {
        root.location.assign(target);
      } else {
        root.location.href = target;
      }
    }
  }

  const api = Object.freeze({ destination, validPending, formUrl, formId, save, read, clear, navigate });
  root.MoyaFlow = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
