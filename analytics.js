/** GA4: page views and a small, explicit funnel event vocabulary. */
(function (window, document) {
  'use strict';
  if (window.moyaAnalytics) return;
  if (document.body.dataset.analyticsPage === 'completion' && window.parent !== window) return;
  const measurementId = 'G-304WG9J9Z8';
  const goals = ['start', 'stuck', 'team', 'system', 'live'];
  const parameterKeys = new Set(['goal', 'service', 'cta_label', 'destination', 'network', 'form_id', 'event_callback']);
  const eventNames = new Set(['select_goal', 'cta_click', 'social_click', 'lead_form_open', 'generate_lead']);

  function cleanUrl(value) {
    try {
      const url = new URL(value, window.location.origin);
      const intent = url.searchParams.get('intent');
      url.search = '';
      url.hash = '';
      if (goals.includes(intent)) url.searchParams.set('intent', intent);
      return url.href;
    } catch (_) { return ''; }
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const config = {
    send_page_view: document.body.dataset.analyticsPage !== 'completion',
    page_location: cleanUrl(window.location.href),
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
    transport_type: 'beacon'
  };
  // Preserve ordinary campaign tokens, never arbitrary contact query parameters.
  const query = new URLSearchParams(window.location.search);
  const campaigns = { utm_source: 'campaign_source', utm_medium: 'campaign_medium', utm_campaign: 'campaign_name', utm_term: 'campaign_term', utm_content: 'campaign_content' };
  Object.entries(campaigns).forEach(([key, setting]) => {
    const value = query.get(key);
    if (value && /^[a-zA-Z0-9_.~-]{1,120}$/.test(value)) config[setting] = value;
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, config);

  window.moyaAnalytics = {
    track(name, parameters = {}) {
      if (!eventNames.has(name)) return;
      const safe = {};
      Object.entries(parameters).forEach(([key, value]) => {
        if (!parameterKeys.has(key) || value === undefined) return;
        if (key === 'event_callback' && typeof value === 'function') safe[key] = value;
        else if (typeof value === 'string') safe[key] = key === 'destination' ? cleanUrl(value) : value.slice(0, 120);
      });
      window.gtag('event', name, safe);
    }
  };

  // Local development still queues events for tests but does not pollute GA4.
  if (!['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a');
    if (!link) return;
    const service = link.closest('.pricing-card');
    if (service && link.classList.contains('card-btn')) {
      window.moyaAnalytics.track('cta_click', {
        service: service.dataset.plan,
        cta_label: link.textContent.replace(/\s+/g, ' ').trim(),
        destination: link.href
      });
    } else if (['socialYoutube', 'socialInstagram', 'socialFacebook'].includes(link.id)) {
      window.moyaAnalytics.track('social_click', {
        network: link.id.replace('social', '').toLowerCase(), destination: link.href
      });
    }
  });
})(window, document);
