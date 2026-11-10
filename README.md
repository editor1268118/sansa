# SANSA Hospital website

Existing React 18 / Vite 5 / JavaScript project, redesigned in place using SCSS modules and original hospital content and media.

## Local development on Windows

```powershell
npm.cmd install
npm.cmd run dev
```

Use the URL printed by Vite, normally http://localhost:5173/. `npm.cmd` avoids PowerShell’s blocked `npm.ps1` launcher. Vite’s cache is in `.vite-cache` to avoid Windows permissions on an older node_modules cache.

Copy `.env.example` to `.env` and configure the hospital’s public reCAPTCHA v2 site key for API consultation forms. Never place backend CAPTCHA secrets in a VITE variable. Without a site key, the website loads and clearly offers phone booking. The original FormSubmit appointment/contact integrations are independent of that API CAPTCHA key.

## Checks and build

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

The build generates a sitemap, bundles the app with route splitting and writes separate initial HTML metadata for all existing routes. Serve `dist/` on the canonical hospital domain with SPA fallback. No deployment has been performed. Keep URL spelling/capitalization unchanged.

## Content and media

- `src/data/original-content.json`: original department, doctor, FAQ, gallery, facility and values content.
- `src/data/site.js`: shared navigation, contact information, photographs and source testimonials.
- `src/data/privacy.json`: original legal wording with semantic layout.
- `src/data/routes.json`: route metadata and sitemap source.
- `public/media/`: optimized derivative JPEG copies; originals remain in public and src/compressed.
- `docs/original-source/`: text snapshots of original source, styles, configuration and tracking markup.

See REVAMP_AUDIT.md, ASSET_INVENTORY.md, PAGE_CONTENT_MAP.md, FUNCTIONALITY_CHECKLIST.md, REVAMP_COMPLETION_REPORT.md and REMAINING_ISSUES.md.

## Browser QA

The repository includes `scripts/browser-qa.mjs` (all routes, ten viewport sizes, metadata/images, gallery keyboard behavior and mobile navigation) and `scripts/forms-qa.mjs` (intercepted API/FormSubmit contracts). They use Node 22’s WebSocket and an explicitly launched local Chromium debug session on port 9223; no browser dependency was installed. Start the ordinary dev server on 5173. For form QA, run a separate server:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5174 --strictPort --config scripts/vite-qa.config.mjs
node scripts/browser-qa.mjs
node scripts/forms-qa.mjs
```

The test-only configuration supplies a dummy public key only on the separate server. The form suite intercepts every CAPTCHA, API and FormSubmit request before delivery, including preflight. Never manually submit test appointments to production. Evidence is stored under `docs/qa/`.
