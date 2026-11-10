# SANSA revamp audit

Audit completed before source replacement on 6 November 2026. Original source is preserved verbatim under `docs/original-source/`; no original photograph will be overwritten or deleted.

## Existing application
React 18 / Vite 5 / JSX / React Router 6, SCSS modules. Fourteen explicit routes. Navbar is hidden on the separate laser campaign; `/page` duplicates an older homepage and includes its own API form. Keep its URL and form rather than silently redirecting a possible campaign landing page.

## Content and media
112 image/icon files inventoried in ASSET_INVENTORY.md. JPEG/PNG contact sheet visually inspected; original patient care, treatment rooms, pharmacy, doctors, team and department images identified. Some bundled images are generic explanatory photography/illustrations; do not describe them as SANSA premises. Two verified source doctor profiles and all qualifications must remain verbatim. Four actual source testimonials are in DermaLP; homepage contains only “Reviews coming soon”. Twenty-four department treatment entries, ten laser FAQs and 32 gallery photographs are extracted into centralized data before editing.

## Integrations
Axios POST `https://api.sansahospital.com/api/send-email`, JSON fields `name`, `mobile`, `email`, `department`, `recaptchaToken`. Main homepage enforces ten-digit mobile, Gmail and department; laser enforces alphabetic name and ten-digit mobile, with empty department in the original payload. Preserve these differences. Appointment and contact pages use native POST to `https://formsubmit.co/info@sansahospital.com`. Their distinct field names must remain unchanged. Existing map embed and published contact/social details retained.

Tracking IDs in index.html: Google Ads AW-16486238727 (conversion fM1pCPWbgpoZEIeUoLU9), GA G-BHHJV6SPF7, Meta 3889613317984622, Clarity qxpgytcjju. Retain scripts and IDs.

## Baseline defects
`npm.cmd run build` passes with stale Browserslist, missing Tailwind content and large chunk warnings. Lint fails with 53 errors (unused code, missing PropTypes and unescaped apostrophes). reCAPTCHA key is absent in this checkout; previously fixed crash must stay fixed. Header appointment link targets home; several links use inconsistent capitalization; gallery has autoplay but no lightbox. Form validation sometimes runs before preventDefault. Contact lacks iframe title. Privacy contains invalid nested paragraphs. SEO hook is unused and missing routes; index.html has invalid head/article markup and unsubstantiated aggregate rating. Root robots.txt is not copied to public and has an invalid absolute disallow.

## Implementation sequence
1. Preserve source and extract content; inventory and inspect media.
2. Build navy/teal/light visual foundation with original red/black SANSA logo; shared responsive navigation, footer, cards, breadcrumbs and CTAs.
3. Complete editorial split-photo homepage with verified content and actual photography.
4. Redesign every internal route using shared layouts and full original department/doctor/legal content.
5. Preserve both form contracts, improve validation/errors/accessibility, safely test through intercepted requests only.
6. Add route metadata, canonical/OG/Twitter, accurate structured data and complete sitemap/robots.
7. Install/check dependencies, lint/build, browser route and responsive QA; document external verification limits.
