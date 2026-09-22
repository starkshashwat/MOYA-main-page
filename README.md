# MOYA Gateway — Main Landing Page

The official digital front door for **MOYA (Mechanism of YouTube Automation)**.

Crafted with an editorial luxury aesthetic inspired by cinematic studio design systems, featuring atmospheric lighting, oversized typography, dimensional mentor layering, and an interactive floating gateway dock connecting visitors to MOYA's 4 core service pathways.

---

## 🏛 The 4 Core Pathways

1. **One-to-One Mentorship**: High-touch, direct guidance to build scalable YouTube channel assets (no price displayed).
2. **Productions**: Done-for-you content production built for channel scaling.
3. **YouTube Automation Masterclass (Webinar)**: Live intensive system breakdown priced at **₹1,999**.
4. **WhatsApp Channel**: The official broadcast community for updates and insights (`JOIN WHATSAPP CHANNEL`).

---

## ⚡ Tech Stack & Architecture

- **HTML5**: Semantic, accessible markup with OpenGraph & Twitter metadata.
- **CSS3**: Custom design tokens, fluid typography via viewport units, backdrop blur filters, and GPU-accelerated transforms.
- **Vanilla JavaScript**: Lightweight (~3KB), zero external dependencies, 60 FPS requestAnimationFrame cursor parallax, magnetic button interactions, and centralized URL configuration.
- **Performance**: Optimized WebP imagery, asynchronous font preloading, 60 FPS rendering target, full `prefers-reduced-motion` compliance.

---

## 🔗 Central URL Configuration

All primary CTAs across the header, gateway cards, and footer read dynamically from a single configuration object in `main.js`:

```javascript
const MOYA_CONFIG = {
  quickCallUrl: "https://calendly.com",
  mentorshipUrl: "https://mentorship.moya.com",
  productionsUrl: "https://productions.moya.com",
  webinarUrl: "https://webinar.moya.com",
  whatsappUrl: "https://whatsapp.com/channel/moya"
};
```

Simply update these values to point to your live booking and registration links.

---

## 🚀 Deployment

The repository is pre-configured for zero-config, 1-click deployments on:

### Vercel
1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Other**.
3. Root Directory: `./` (leave default).
4. Click **Deploy**.

### Netlify
1. Connect this repository to [Netlify](https://netlify.com).
2. Publish Directory: `.`
3. Build Command: *(Leave blank)*.
4. Click **Deploy Site**.

### GitHub Pages
1. Go to repository **Settings** &rarr; **Pages**.
2. Source: **Deploy from a branch** &rarr; Branch: `main` / `(root)`.
3. Click **Save**.

---

## 📱 Responsiveness

- **Desktop (1440 × 900)**: Framed gallery canvas with atmospheric depth, ambient mesh glow, and floating 4-card dock.
- **Tablet (1024 × 768)**: Fluid 2x2 gateway grid with balanced mentor visual.
- **Mobile (390 × 844)**: Responsive column layout, touch-optimized hit areas, zero clipping.
