/** This page is the GHL post-submission redirect, never the form's submit handler. */
(function () {
  'use strict';
  const flow = window.MoyaFlow;
  const intent = new URLSearchParams(window.location.search).get('intent');
  const destination = flow.destination(intent);
  const link = document.getElementById('continueLink');
  const status = document.getElementById('completionStatus');
  if (!destination) {
    status.textContent = 'Please return to the homepage and select your goal.';
    link.href = '/';
    link.textContent = 'Choose your goal';
    return;
  }
  link.href = destination;
  if (window.parent !== window) {
    // The parent owns navigation and analytics for embedded submissions.
    window.parent.postMessage({ type: 'moya:lead-complete', formId: flow.formId, intent }, window.location.origin);
    return;
  }
  const record = flow.read();
  flow.clear();
  let navigated = false;
  const navigate = () => {
    if (!navigated) {
      navigated = true;
      window.location.replace(destination);
    }
  };
  // Direct visits/reloads without a matching pending flow do not create leads in GA4.
  if (flow.validPending(record, intent)) {
    window.moyaAnalytics?.track('generate_lead', {
      goal: intent, form_id: flow.formId, event_callback: navigate
    });
  }
  window.setTimeout(navigate, 600);
})();
