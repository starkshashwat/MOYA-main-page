/**
 * MOYA — Google Analytics 4
 * Measurement ID: G-304WG9J9Z8
 *
 * This file owns the GA4 loader and the small set of conversion events used
 * by the static gateway and services pages. No form values or personal data
 * are sent.
 */
(function initMoyaAnalytics(window, document) {
  const measurementId = 'G-304WG9J9Z8';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
    transport_type: 'beacon'
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  function track(eventName, parameters) {
    window.gtag('event', eventName, parameters || {});
  }

  window.moyaAnalytics = {
    track
  };

  function getDestination(link) {
    return link.href || link.getAttribute('href') || '';
  }

  function getLinkLabel(link) {
    return (link.dataset.analyticsLabel || link.textContent || link.getAttribute('aria-label') || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);
  }

  document.addEventListener('click', (event) => {
    const goalCard = event.target.closest('.intent-card');
    if (goalCard) {
      const goalHeading = goalCard.querySelector('.card-intent-heading');
      track('select_goal', {
        goal: goalCard.dataset.goal || 'unknown',
        goal_label: goalHeading ? goalHeading.textContent.trim() : (goalCard.dataset.goal || 'unknown')
      });
      return;
    }

    const link = event.target.closest('a');
    if (!link) return;

    const destination = getDestination(link);
    const serviceCard = link.closest('.pricing-card');
    const service = serviceCard ? (serviceCard.dataset.plan || 'unknown') : undefined;
    const label = getLinkLabel(link);

    if (link.classList.contains('card-btn') || link.id === 'dynamicActionBtn') {
      track('cta_click', {
        cta_label: label,
        destination,
        service
      });
      return;
    }

    if (link.id === 'socialYoutube' || link.id === 'socialInstagram' || link.id === 'socialFacebook') {
      track('social_click', {
        network: link.id.replace('social', '').toLowerCase(),
        destination
      });
    }
  });
})(window, document);
