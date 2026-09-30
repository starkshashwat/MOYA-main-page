# MOYA — one GHL form, five destinations

Website: **https://mechanismofya.com** (Coolify / GitHub / Dockerfile)

Form: **MOYA Webiste organic leads**, ID `lmEIPrjjK5rZ1x0oLzZe`.

The website opens this form only after a visitor selects a homepage goal and
clicks **Proceed to Services** or **Explore Events**. Service-page CTAs retain
their existing destinations. There is no automatic page-load popup.

## 1. Configure the intent field in GHL

1. Open the correct GHL sub-account → **Sites → Forms → Builder**.
2. Open the form above; keep its existing name, phone, email and income fields.
3. Create a **Contact** custom field of type **Single Line**, named **Website Intent**.
4. Add that field to this form. Select it and set its **Query Key** to `moya_intent`,
   then enable **Hidden**. Do not set a fixed default such as `start`.
5. If your builder assigns a query key instead of allowing edits, copy the exact
   key shown in the field settings and change `intentQueryKey` in `lead-flow.js`
   to match before deploying. A field label or CRM merge-field key is not proof
   that the form uses that same query key.
6. Add the **Source** field with value `MOYA Website`.
7. Save. The embed sends `moya_intent=start|stuck|team|system|live` and
   `source=MOYA Website`. Standard safe campaign tokens are forwarded separately;
   Source is not the same as GHL's First/Latest Attribution.

## 2. Set post-submission redirect rules

Open **Conditional Logic → Add New Condition → Redirect to URL**.
Create these five rules. In each, choose **Website Intent → is equal to** the
exact value in the first column. Paste the full HTTPS URL from the second column.

| Website Intent | Redirect to URL |
| --- | --- |
| `start` | `https://mechanismofya.com/lead-complete.html?intent=start` |
| `stuck` | `https://mechanismofya.com/lead-complete.html?intent=stuck` |
| `team` | `https://mechanismofya.com/lead-complete.html?intent=team` |
| `system` | `https://mechanismofya.com/lead-complete.html?intent=system` |
| `live` | `https://mechanismofya.com/lead-complete.html?intent=live` |

Remove/replace any conflicting redirect rules for this form. Do not add a generic
always-matching conditional rule ahead of these. Set the default post-submission
redirect (when no intent is present) to `https://mechanismofya.com/`.
Save the form.

**Do not use the final service URL directly in these rules.** The completion
page handles top-level and embedded redirects consistently and sends the lead
event before continuing. It accepts only the five known intent values; it never
accepts a user-provided destination URL.

Final destinations:
- `start`, `stuck`, `team`, `system` → `/services.html?intent=<value>`
- `live` → `/events.html` (temporary, noindex demo)

No GHL API key or CRM secret belongs in this site's JavaScript. GHL itself
validates and stores the submission. Parent-page code does not read form inputs.

## 3. Optional CRM follow-up

Create a workflow with **Form Submitted**, filtered to this specific form.
Branch on **Website Intent** to add tags or notify the appropriate team. Review
contact deduplication preferences so repeat submissions update contacts as intended.
Workflow execution is asynchronous; it does not perform the browser redirect.

## 4. Publish with Coolify

1. Commit and push the reviewed changes to the GitHub branch connected to Coolify.
2. In Coolify choose **Dockerfile** build pack, repository root `/`, Dockerfile
   `/Dockerfile`, application/container port **80**. Nginx also listens on 3000
   for existing configurations.
3. Set the public domain to `https://mechanismofya.com` and enable HTTPS at the
   Coolify proxy. If using `www`, provision its DNS/TLS too; Nginx redirects it
   to the apex domain.
4. Deploy; verify the `/health` check. The Docker build copies only the generated
   `dist/` public files. `analytics.js` and all form/SEO files are included.
5. Do not add a proxy-wide `X-Frame-Options: DENY` header. The completion page
   must be allowed inside our own page (and the GHL form origin if nested).
   Its route-specific `frame-ancestors` header is already in `nginx.conf`.

The build uses Node only during compilation; the final image is static Nginx.
Generated `dist/` is replaceable build output, not an editing directory.

## 5. Required live verification

Use test details you control (form workflows may send email/SMS). For each of
the five goals:

1. Select the card and click its CTA; confirm only one modal opens.
2. Try submitting with required fields empty; it must stay on the form.
3. Complete the form and submit once.
4. Confirm the browser navigates to the correct final destination, not a site
   nested in the iframe.
5. In **Sites → Forms → Submissions**, confirm the saved values including
   Website Intent. In **Contacts**, confirm the corresponding record.
6. Check GA4 Realtime/DebugView for `lead_form_open` and one `generate_lead`.
   Register `goal` and `service` as event-scoped custom dimensions if you want
   them in standard reports; mark `generate_lead` as a key event.

Also test closing/reopening, selecting another goal, browser Back, mobile keyboard,
blocked third-party scripts and the "Open form directly" fallback.

If every submission goes home, inspect the actual query key and rule values.
If submission saves but does not navigate, inspect the form's redirect settings
and completion-page response headers. The code does not guess a GHL success
message, observe submit-button clicks, or redirect after a timer while filling.

The completion route is a browser funnel signal, **not server-authenticated CRM
proof or a payment/access gate**. A direct visit without a matching recent flow
does not count as a GA4 lead. GHL Submissions is the source of truth for lead data.
Live CRM delivery cannot be certified until these account settings and tests are complete.

## 6. SEO launch checks

- Homepage canonical: `https://mechanismofya.com/`
- Services canonical: `https://mechanismofya.com/services.html`
- Submit `https://mechanismofya.com/sitemap.xml` to your verified Google Search
  Console property. Only Home and Services are listed.
- Events demo and completion pages are noindex. When the real Events page is
  ready, remove its noindex and add its canonical URL to the sitemap.
- Unknown routes must return HTTP 404, not homepage HTML with HTTP 200.
- Metadata, JSON-LD, image dimensions and OG previews are shipped; ranking and
  field Core Web Vitals still depend on the deployed site and real traffic.

## References

- [GHL conditional redirects](https://help.gohighlevel.com/support/solutions/articles/155000001314-conditional-logic-v2-in-forms-and-surveys-)
- [GHL source field](https://help.gohighlevel.com/support/solutions/articles/155000001506-source-field-in-forms-and-surveys)
- [GHL embedding options](https://help.gohighlevel.com/support/solutions/articles/155000004538-how-to-use-embedding-options-for-forms-triggers-layouts-and-deactivation-settings-explained)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
