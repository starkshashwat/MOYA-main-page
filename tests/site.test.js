const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const files = require('../public-files');
const { handleRequest } = require('../server');
const flow = require('../lead-flow');
const root = path.resolve(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, name), 'utf8');
let server;
let origin;

before(async () => {
  server = http.createServer(handleRequest);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });

test('all five intent routes are preserved and arbitrary URLs/keys are refused', () => {
  for (const goal of ['start', 'stuck', 'team', 'system']) {
    assert.equal(flow.destination(goal), `/services.html?intent=${goal}`);
  }
  assert.equal(flow.destination('live'), '/events.html');
  for (const bad of ['__proto__', 'constructor', 'https://evil.example', '', null]) {
    assert.equal(flow.destination(bad), null);
    assert.equal(flow.formUrl(bad), null);
  }
});

test('form gets fresh intent/source/campaign fields but no contact or redirect query injection', () => {
  const url = new URL(flow.formUrl('team', '?moya_intent=start&email=private@example.com&redirect=https://evil.example&utm_source=youtube&utm_campaign=launch'));
  assert.equal(url.origin, 'https://pay.mechanismofya.com');
  assert.equal(url.searchParams.get('moya_intent'), 'team');
  assert.equal(url.searchParams.get('source'), 'MOYA Website');
  assert.equal(url.searchParams.get('utm_source'), 'youtube');
  assert.equal(url.searchParams.has('email'), false);
  assert.equal(url.searchParams.has('redirect'), false);
});

test('pending flows must be current, matching and well formed', () => {
  const now = Date.now();
  const pending = { id: 'test-flow', intent: 'system', createdAt: now - 1000 };
  assert.equal(flow.validPending(pending, 'system', now), true);
  assert.equal(flow.validPending(pending, 'start', now), false);
  assert.equal(flow.validPending({ ...pending, createdAt: now - 7200001 }, 'system', now), false);
  assert.equal(flow.validPending({ ...pending, createdAt: now + 1000 }, 'system', now), false);
  assert.equal(flow.validPending(null, 'system', now), false);
});

test('public files are served, missing files return actual 404, repository files are not exposed', async () => {
  for (const file of files) {
    if (file === 'index.html') continue;
    const response = await fetch(`${origin}/${file}`, { method: 'HEAD', redirect: 'manual' });
    assert.equal(response.status, 200, file);
    assert.ok(Number(response.headers.get('content-length')) > 0, file);
  }
  for (const file of ['missing', 'missing.js', 'server.js', 'package.json', '.git/config', 'docs/GHL-SETUP.md', 'dist/index.html', '%2e%2e%2fpackage.json']) {
    const response = await fetch(`${origin}/${file}`);
    assert.equal(response.status, 404, file);
  }
  assert.equal((await fetch(`${origin}/`, { method: 'POST' })).status, 405);
  assert.equal((await fetch(`${origin}/bad%ZZ`)).status, 400);
});

test('canonical redirects preserve intent; SEO and completion response types are correct', async () => {
  for (const [from, to] of [['/index.html', '/'], ['/services', '/services.html'], ['/events', '/events.html']]) {
    const response = await fetch(`${origin}${from}?intent=team`, { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), `${to}?intent=team`);
  }
  const xml = await fetch(`${origin}/sitemap.xml`);
  assert.match(xml.headers.get('content-type'), /application\/xml/);
  const robots = await fetch(`${origin}/robots.txt`);
  assert.match(robots.headers.get('content-type'), /text\/plain/);
  const relay = await fetch(`${origin}/lead-complete.html`);
  assert.match(relay.headers.get('content-security-policy'), /frame-ancestors 'self' https:\/\/pay.mechanismofya.com/);
  assert.equal(relay.headers.get('cache-control'), 'no-store');
  assert.match(relay.headers.get('x-robots-tag'), /noindex/);
});

test('built pages have valid local references, unique IDs, metadata and crawlable sitemap', () => {
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const dom = new JSDOM(source(file));
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll('h1').length, 1, file);
    const ids = Array.from(doc.querySelectorAll('[id]'), el => el.id);
    assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
    doc.querySelectorAll('[src], link[href], a[href]').forEach(el => {
      const ref = el.getAttribute('src') || el.getAttribute('href');
      if (!ref || ref.startsWith('http') || ref.startsWith('#')) return;
      const target = ref.split('?')[0].replace(/^\//, '') || 'index.html';
      assert.ok(files.includes(target), `${file} references unpublished ${target}`);
    });
    doc.querySelectorAll('script[type="application/ld+json"]').forEach(el => assert.doesNotThrow(() => JSON.parse(el.textContent)));
    if (['index.html', 'services.html'].includes(file)) {
      assert.ok(doc.querySelector('link[rel="canonical"]').href.startsWith('https://mechanismofya.com/'));
      assert.ok(doc.querySelector('meta[name="description"]').content.length > 50);
      assert.ok(doc.querySelector('meta[property="og:image"]'));
    }
    dom.window.close();
  }
  const xml = new JSDOM(source('sitemap.xml'), { contentType: 'application/xml' });
  assert.deepEqual(Array.from(xml.window.document.querySelectorAll('loc'), el => el.textContent), [
    'https://mechanismofya.com/', 'https://mechanismofya.com/services.html', 'https://mechanismofya.com/events.html'
  ]);
  xml.window.close();
  for (const file of files) assert.deepEqual(fs.readFileSync(path.join(root, file)), fs.readFileSync(path.join(root, 'dist', file)), file);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'server.js')), false);
});

async function gateway() {
  // DOM integration tests: no external resource loading or real GHL submissions.
  const dom = new JSDOM(source('index.html'), {
    url: 'http://localhost/?utm_source=youtube', runScripts: 'outside-only', pretendToBeVisual: true
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
  const { window } = dom;
  window.matchMedia = query => ({ matches: query.includes('max-width'), addEventListener() {} });
  window.scrollTo = () => {};
  const doc = window.document;
  const dialog = doc.getElementById('leadDialog');
  dialog.open = false;
  dialog.showModal = () => { dialog.setAttribute('open', ''); dialog.open = true; };
  dialog.close = () => { dialog.removeAttribute('open'); dialog.open = false; dialog.dispatchEvent(new window.Event('close')); };
  for (const file of ['lead-flow.js', 'analytics.js', 'main.js', 'lead-form.js']) {
    vm.runInContext(source(file), dom.getInternalVMContext(), { filename: file });
  }
  doc.dispatchEvent(new window.Event('DOMContentLoaded'));
  return { dom, window, doc, dialog, button: doc.getElementById('dynamicActionBtn') };
}

const events = window => window.dataLayer.filter(row => row[0] === 'event');

test('mouse and keyboard selection enable CTA without moving the page or opening the form', async () => {
  const app = await gateway();
  try {
    let pageScrolls = 0;
    app.window.scrollTo = () => { pageScrolls++; };
    assert.equal(app.button.disabled, true);
    app.doc.getElementById('cardStart').click();
    assert.equal(app.button.dataset.intent, 'start');
    assert.equal(app.button.disabled, false);
    assert.equal(app.dialog.open, false);
    app.doc.getElementById('cardStuck').dispatchEvent(new app.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    assert.equal(app.button.dataset.intent, 'stuck');
    assert.equal(app.doc.querySelectorAll('[aria-checked="true"]').length, 1);
    assert.equal(events(app.window).filter(row => row[1] === 'select_goal').length, 2);
    assert.equal(pageScrolls, 0);
    assert.equal(app.doc.querySelectorAll('iframe').length, 0);
  } finally { app.dom.window.close(); }
});

test('native modal popup supports all five intents; closing/reopening resets flow', async () => {
  const app = await gateway();
  try {
    for (const goal of ['start', 'stuck', 'team', 'system', 'live']) {
      app.doc.querySelector(`[data-goal="${goal}"]`).click();
      app.button.click();
      app.button.click();
      assert.equal(app.dialog.open, true);
      assert.equal(app.doc.getElementById('leadIntentInput').value, goal);
      assert.ok(app.doc.getElementById('leadSelectedGoal').textContent.length > 0);
      app.doc.getElementById('leadClose').click();
      assert.equal(app.dialog.open, false);
      assert.equal(app.window.MoyaFlow.read(), null);
    }
    assert.equal(events(app.window).filter(row => row[1] === 'lead_form_open').length, 5);
  } finally { app.dom.window.close(); }
});

test('form validation prevents submit with empty/invalid inputs and shows inline errors', async () => {
  const app = await gateway();
  try {
    app.doc.getElementById('cardStart').click();
    app.button.click();
    assert.equal(app.dialog.open, true);
    const form = app.doc.getElementById('leadCustomForm');
    form.dispatchEvent(new app.window.Event('submit', { cancelable: true, bubbles: true }));
    assert.ok(app.doc.getElementById('nameError').textContent.includes('name'));
    assert.ok(app.doc.getElementById('emailError').textContent.includes('email'));
    assert.ok(app.doc.getElementById('phoneError').textContent.includes('phone'));
    assert.equal(events(app.window).filter(row => row[1] === 'generate_lead').length, 0);
  } finally { app.dom.window.close(); }
});

test('valid native form submit dispatches generate_lead and posts to /api/lead with contact data', async () => {
  const app = await gateway();
  try {
    app.doc.getElementById('cardTeam').click();
    app.button.click();
    let apiPayload = null;
    let navigatedTo = null;
    app.window.fetch = async (url, options) => {
      apiPayload = JSON.parse(options.body);
      return { ok: true, json: async () => ({ succeded: true }) };
    };
    app.window.MoyaFlow = { ...app.window.MoyaFlow, navigate: dest => { navigatedTo = dest; } };
    app.doc.getElementById('leadName').value = 'Test User';
    app.doc.getElementById('leadEmail').value = 'user@example.com';
    app.doc.getElementById('leadPhone').value = '+91 98765 43210';
    const form = app.doc.getElementById('leadCustomForm');
    form.dispatchEvent(new app.window.Event('submit', { cancelable: true, bubbles: true }));
    await new Promise(r => setTimeout(r, 50));
    assert.equal(apiPayload.name, 'Test User');
    assert.equal(apiPayload.email, 'user@example.com');
    assert.equal(apiPayload.phone, '+91 98765 43210');
    assert.deepEqual(apiPayload.tags, ['Website Lead', 'Goal: Production']);
    assert.equal(events(app.window).filter(row => row[1] === 'generate_lead').length, 1);
    assert.equal(navigatedTo, '/services.html?intent=team');
  } finally { app.dom.window.close(); }
});

test('submitting lead form on join event card navigates directly to /events.html with Goal: Live Event tag', async () => {
  const app = await gateway();
  try {
    app.doc.getElementById('cardLive').click();
    app.button.click();
    let apiPayload = null;
    let navigatedTo = null;
    app.window.fetch = async (url, options) => {
      apiPayload = JSON.parse(options.body);
      return { ok: true, json: async () => ({ succeded: true }) };
    };
    app.window.MoyaFlow = { ...app.window.MoyaFlow, navigate: dest => { navigatedTo = dest; } };
    app.doc.getElementById('leadName').value = 'Live Attendee';
    app.doc.getElementById('leadEmail').value = 'attendee@example.com';
    app.doc.getElementById('leadPhone').value = '+91 98765 11111';
    const form = app.doc.getElementById('leadCustomForm');
    form.dispatchEvent(new app.window.Event('submit', { cancelable: true, bubbles: true }));
    await new Promise(r => setTimeout(r, 50));
    assert.equal(apiPayload.name, 'Live Attendee');
    assert.equal(apiPayload.email, 'attendee@example.com');
    assert.deepEqual(apiPayload.tags, ['Website Lead', 'Goal: Live Event']);
    assert.equal(navigatedTo, '/events.html');
  } finally { app.dom.window.close(); }
});

test('completion page handles embedded/top-level routing and does not count unsolicited visits', () => {
  for (const embedded of [true, false]) {
    for (const pending of [true, false]) {
      let navigated;
      const messages = [];
      const leadEvents = [];
      const link = {};
      const record = pending ? { id: 'pending', intent: 'live', createdAt: Date.now() } : null;
      const window = {
        MoyaFlow: { ...flow, read: () => record, clear() {} },
        location: { origin: 'https://mechanismofya.com', search: '?intent=live', replace: value => { navigated = value; } },
        moyaAnalytics: { track: (...args) => leadEvents.push(args) },
        setTimeout: callback => callback()
      };
      window.parent = embedded ? { postMessage: (...args) => messages.push(args) } : window;
      vm.runInNewContext(source('lead-complete.js'), { window, document: { getElementById: () => link }, URLSearchParams });
      assert.equal(link.href, '/events.html');
      if (embedded) {
        assert.equal(messages.length, 1);
        assert.equal(navigated, undefined);
        assert.equal(leadEvents.length, 0);
      } else {
        assert.equal(navigated, '/events.html');
        assert.equal(leadEvents.length, pending ? 1 : 0);
      }
    }
  }
});

test('network failure or timeout still safely navigates to destination without blocking user', async () => {
  const app = await gateway();
  try {
    app.doc.getElementById('cardStart').click();
    app.button.click();
    let navigatedTo = null;
    app.window.fetch = async () => { throw new Error('Network error'); };
    app.window.MoyaFlow = { ...app.window.MoyaFlow, navigate: dest => { navigatedTo = dest; } };
    app.doc.getElementById('leadName').value = 'Offline User';
    app.doc.getElementById('leadEmail').value = 'offline@example.com';
    app.doc.getElementById('leadPhone').value = '+91 98765 00000';
    const form = app.doc.getElementById('leadCustomForm');
    form.dispatchEvent(new app.window.Event('submit', { cancelable: true, bubbles: true }));
    await new Promise(r => setTimeout(r, 50));
    assert.equal(navigatedTo, '/services.html?intent=start');
  } finally { app.dom.window.close(); }
});

test('completion rejects missing, unknown and external redirect intent values', () => {
  for (const search of ['', '?intent=constructor', '?intent=https://evil.example']) {
    const elements = { continueLink: {}, completionStatus: {} };
    const window = { MoyaFlow: flow, location: { search }, setTimeout: () => assert.fail('Unexpected navigation') };
    window.parent = window;
    vm.runInNewContext(source('lead-complete.js'), {
      window, document: { getElementById: id => elements[id] }, URLSearchParams
    });
    assert.equal(elements.continueLink.href, '/');
  }
});

test('analytics strips contact queries and counts no local network traffic', () => {
  const dom = new JSDOM('<body></body>', {
    url: 'http://localhost/services.html?intent=start&email=private@example.com#phone', runScripts: 'outside-only'
  });
  try {
    vm.runInContext(source('analytics.js'), dom.getInternalVMContext());
    const config = dom.window.dataLayer.find(row => row[0] === 'config')[2];
    assert.equal(config.page_location, 'http://localhost/services.html?intent=start');
    assert.equal(dom.window.document.querySelectorAll('script').length, 0);
    dom.window.moyaAnalytics.track('cta_click', { destination: '/services.html?email=private@example.com', email: 'private@example.com' });
    const parameters = events(dom.window)[0][2];
    assert.equal(parameters.destination, 'http://localhost/services.html');
    assert.equal(parameters.email, undefined);
  } finally { dom.window.close(); }
});
