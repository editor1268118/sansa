# Functionality preservation and QA checklist

- [x] Record all fourteen routes and retain exact URL spelling.
- [x] Preserve original source before redesign and extract original content.
- [x] Inventory original photographs; distinguish authentic facilities from explanatory imagery.
- [x] Record two distinct form systems and exact field names.
- [x] Preserve Google Ads, GA, Meta Pixel and Clarity IDs.
- [x] Preserve original Google Maps embed, social accounts, phone/email/address/hours.
- [x] Responsive navigation, active states and keyboard interactions.
- [x] API request payloads, loading/error states, reCAPTCHA missing/expired/error handling.
- [x] FormSubmit field names, POST action, no duplicate submissions, redirect handling.
- [x] All original departments, doctor qualifications, testimonials, FAQs, gallery and privacy text.
- [x] Lightbox keyboard navigation and focus restoration.
- [x] All route titles, descriptions, canonical URLs, breadcrumbs and accurate structured data.
- [x] Sitemap and robots output.
- [x] All ten requested viewport sizes, missing images, runtime errors and links.
- [x] Dependency installation, lint and production build.

Production appointments must never be used for tests. Requests will be intercepted with explicit success/failure fixtures; live backend delivery, FormSubmit activation, analytics account receipt and production CAPTCHA acceptance remain external verification items.

