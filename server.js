/** Local preview with the same public-file boundary and routes as production. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream');
const publicFiles = new Set(require('./public-files'));
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml'
};
const redirects = {
  '/index.html': '/', '/services': '/services.html', '/services/': '/services.html',
  '/events': '/events.html', '/events/': '/events.html', '/lead-complete': '/lead-complete.html'
};

function handleRequest(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  res.setHeader('Cache-Control', 'no-cache');
  let url;
  let pathname;
  try {
    url = new URL(req.url, 'http://localhost');
    pathname = decodeURIComponent(url.pathname);
  } catch (_) { res.writeHead(400); return res.end('Bad request'); }

  // API Proxy for GHL Direct Contact Upsert with CORS Support
  if (pathname === '/api/lead') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Version');
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }
    if (req.method !== 'POST') {
      res.writeHead(405, { Allow: 'POST, OPTIONS' });
      return res.end();
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const GOAL_TAGS = {
          start: 'Goal: Webinar',
          stuck: 'Goal: Mentorship',
          team: 'Goal: Production',
          system: 'Goal: Course',
          live: 'Goal: Live Event'
        };
        const goalTag = payload.intent && GOAL_TAGS[payload.intent] ? GOAL_TAGS[payload.intent] : null;
        const tags = Array.isArray(payload.tags) && payload.tags.length > 0
          ? payload.tags
          : ['Website Lead', goalTag].filter(Boolean);
        const ghlData = JSON.stringify({
          locationId: payload.locationId || 'jsuZqhDRfnfSBFMgdfs2',
          name: payload.name || '',
          email: payload.email || '',
          phone: payload.phone || '',
          tags: tags,
          source: payload.source || 'MOYA Website'
        });

        const https = require('node:https');
        const ghlReq = https.request({
          hostname: 'services.leadconnectorhq.com',
          path: '/contacts/upsert',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer pit-2fcd87af-adc1-406e-9350-734a48dcff54',
            'Version': '2021-07-28',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(ghlData)
          }
        }, ghlRes => {
          let ghlResData = '';
          ghlRes.on('data', chunk => { ghlResData += chunk; });
          ghlRes.on('end', () => {
            res.writeHead(ghlRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(ghlResData);
          });
        });

        ghlReq.on('error', err => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        });
        ghlReq.write(ghlData);
        ghlReq.end();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD, POST' });
    return res.end();
  }
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(req.method === 'HEAD' ? undefined : 'OK');
  }
  if (Object.prototype.hasOwnProperty.call(redirects, pathname)) {
    res.writeHead(308, { Location: redirects[pathname] + url.search });
    return res.end();
  }
  let file = pathname === '/' ? 'index.html' : pathname.slice(1);
  const found = publicFiles.has(file);
  if (!found) file = '404.html';
  if (file === 'lead-complete.html') {
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://pay.mechanismofya.com");
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
  }
  const filePath = path.join(__dirname, file);
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(500); return res.end('Required site file unavailable'); }
    res.writeHead(found ? 200 : 404, { 'Content-Type': mime[path.extname(file)], 'Content-Length': stat.size });
    if (req.method === 'HEAD') return res.end();
    pipeline(fs.createReadStream(filePath), res, () => {});
  });
}

if (require.main === module) {
  const ports = new Set([80, 3000]);
  if (process.env.PORT) {
    const p = Number(process.env.PORT);
    if (Number.isInteger(p) && p >= 1 && p <= 65535) ports.add(p);
  }

  ports.forEach(p => {
    const s = http.createServer(handleRequest);
    s.on('error', error => {
      console.warn(`[Port ${p}] notice: ${error.message}`);
    });
    s.listen(p, '0.0.0.0', () => {
      console.log(`MOYA preview: http://0.0.0.0:${p}`);
    });
  });
}
module.exports = { handleRequest };
