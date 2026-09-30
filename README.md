# MOYA Academy website

Static gateway and service comparison site for **https://mechanismofya.com**.
Hosted through a GitHub-connected Coolify Docker deployment.

## Local commands

Node 22+; no runtime npm dependencies. Install development dependencies to run
the DOM integration tests.

```sh
npm ci
npm run build
npm test
npm start
```

Local preview: `http://localhost:3000`. Set `PORT` to use another port.
GA4 queues locally for debugging but does not send localhost traffic to Google.

## Website files

- `index.html`, `styles.css`, `main.js`: homepage with stable goal selection and manual mobile carousel.
- `services.html`, `services.css`, `services.js`: equal-width/height desktop cards; included benefits only.
- `lead-flow.js`, `lead-form.js`, `lead-form.css`: one CTA-triggered GHL form.
- `lead-complete.html`, `lead-complete.js`: allowlisted post-submission routing.
- `events.html`: temporary events preview, excluded from search indexing.
- `analytics.js`: GA4 `G-304WG9J9Z8`, page views and funnel events.
- `sitemap.xml`, `robots.txt`, `404.html`: technical SEO and routing.
- `public-files.js`: explicit public build manifest; `build.js` replaces generated `dist/`.

Keep edits in root source files, then run the build. Docker builds `dist/` from
source automatically. It never serves the repository, setup notes or tests.
Optional image regeneration: `powershell -File tools/generate-images.ps1` on Windows.

## GHL configuration and deployment

See **[docs/GHL-SETUP.md](docs/GHL-SETUP.md)** for the exact hidden field/query key,
five conditional redirect URLs, Coolify settings, analytics and live verification.

The website alone cannot configure GHL's form rules. Configure those rules and
verify real submissions in GHL before treating the funnel as live-ready.
