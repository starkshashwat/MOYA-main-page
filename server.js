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
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }
  let url;
  let pathname;
  try {
    url = new URL(req.url, 'http://localhost');
    pathname = decodeURIComponent(url.pathname);
  } catch (_) { res.writeHead(400); return res.end('Bad request'); }
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
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535');
  const server = http.createServer(handleRequest);
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '0.0.0.0', () => console.log(`MOYA preview: http://localhost:${port}`));
}
module.exports = { handleRequest };
