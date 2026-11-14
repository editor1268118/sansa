# Cardiology and Surgical Oncology update

Implemented from the hospital's request and supplied portraits on 10 November 2026.

- `/Cardiology`: ECG, 2D echo and cardiac monitoring. Cath lab is explicitly described as a future planned service, outside the currently available service cards.
- `/Surgical-Oncology`: general surgery, surgical oncology and urological surgeries.
- Both pages use the same department hero, service cards, specialist section, FAQs, cross-links and appointment CTA as the existing departments.
- Both supplied portraits are copied unchanged into `public/media/`. Their intrinsic dimensions are recorded in `src/data/media.json`; the existing doctor-image frames are retained with top-aligned cropping. Browser checks confirm identical frame width/height to existing doctors at 1440px and 390px.
- Homepage specialty cards, homepage doctor cards, doctor directory, desktop/mobile speciality menus, footer, department sidebars and contact specialty links use the shared data and include both additions.
- Appointment and contact FormSubmit menus include Cardiology and Surgical Oncology. New doctor appointment links preselect the matching department. The original API endpoint/JSON contract is unchanged; the API form links these departments to the native appointment form rather than sending unverified new enum values to the production API.
- Unique metadata, canonical URLs, medical-service structured data and sitemap entries are generated for both pages.

## Confirmed profile details

The user supplied the following details in the follow-up request. They are now used by homepage doctor cards, the doctor directory, department specialist sections and FAQs, portrait alt text and named Physician metadata:

- Dr. Mohammed Zakria — MBBS, MD, DM(Cardiology).
- Dr. Jakkula Srikanth — MBBS (Osm), MS(General Surgery), DNB Surgical Oncology, FMAS, FIAFES.

The shared profiles remain in `src/data/additional-services.js`. No experience figures or additional credentials were added.

## Validation

### 14 November interface refinements

- Homepage Cardiology and Surgical Oncology speciality cards now use original SANSA patient-monitor and operation-theatre photographs. Department heroes and doctor profiles retain their supplied portraits.
- Email is optional in both native appointment/contact forms and all API consultation forms. A provided email must be syntactically valid; the former Gmail-only restriction is removed. Field names and request destinations remain unchanged. Delivery with blank email still requires verification against the external production services; browser submission tests use intercepted responses.
- Dr. Jakkula Srikanth's portrait uses `object-fit: contain` on mobile, keeping the full image visible inside the existing frame.
- The mobile sticky call action uses an accessible phone icon; the appointment action is unchanged.

- Lint and production build passed.
- Targeted service/doctor/appointment checks: `docs/qa/service-expansion-results.json`.
- All sixteen routes passed all ten requested viewport sizes (160 combinations), with no overflow, missing images, local HTTP errors or runtime exceptions. Gallery keyboard controls and mobile navigation also passed; see `docs/qa/responsive-results.json`.
- Initial SEO HTML checks: 16 route documents, 15 sitemap URLs; original tracking IDs retained.
- No test appointment or enquiry was submitted to production.
- Existing `REVAMP_*` documents describe the earlier fourteen-route baseline; this document records the subsequent expansion to sixteen routes and four doctor profiles.
