# Analytics Setup

## Production information

- Site: `https://david-maestas.github.io`
- GA4 Measurement ID: `G-HLYDVDVPLS`
- Source: `GA_MEASUREMENT_ID` near the top of `analytics.js`

The site uses Google Analytics 4 only after a visitor explicitly allows analytics. The Google tag is loaded dynamically; it is not requested before consent.

## Consent behavior

- **Allowed:** `dm_analytics_consent_v1=granted` is saved in browser local storage. GA4 loads and the current page sends one explicit `page_view`.
- **Declined:** `dm_analytics_consent_v1=denied` is saved. GA4 does not load.
- **Changed later:** the **Privacy choices** footer link reopens the consent control. Revoking consent stores `denied`, removes accessible cookies beginning with `_ga`, and reloads if analytics was active.
- **Storage unavailable:** analytics remains optional and the website continues to work. A visitor may be asked again on a future page.

Automatic page views from the GA4 configuration are disabled with `send_page_view: false`. The site sends one manual page view after analytics starts, preventing a config event and manual event from double-counting the first page.

## Expected GA4 events

Enhanced Measurement is configured in the GA4 web stream for the standard events:

- `page_view`
- `scroll`
- `click` for eligible outbound links
- `file_download` for eligible file links

These events are available only after analytics consent because the Google tag is not loaded beforehand.

The site also sends:

### `site_link_click`

Sent once for each instrumented navigation, call-to-action, profile, bibliography, publication, CV, or contact link.

- `link_category`: normalized link class such as `navigation`, `internal_cta`, `cv`, `profile`, `bibliography`, `publication`, or `contact`
- `link_label`: stable label such as `google_scholar` or `pubmed_36780522`
- `link_placement`: stable interface location such as `header`, `hero`, `publication_timeline`, or `contact_card`
- `destination_domain`: destination hostname only; no query or fragment
- `destination_path`: destination path only; no query or fragment
- `source_page`: normalized page name such as `home`, `research`, or `cv`

### `cv_download`

Sent when an intentional CV PDF control is activated, in addition to any standard `file_download` event.

- `file_name`: safe PDF filename derived from the link path
- `link_placement`: location of the CV control
- `source_page`: normalized source page

This records activation of the PDF link. It does not prove that the file was saved or read.

### `contact_click`

Sent when the email control is activated.

- `contact_method`: `email`
- `link_placement`: location of the contact control
- `source_page`: normalized source page

The email address and `mailto:` destination are not included in custom analytics parameters.

## Privacy safeguards

Custom event URLs are reduced to hostname and path. Query strings, URL fragments, `mailto:` destinations, and arbitrary page text are excluded. The explicit analytics page location is reduced to `origin + pathname`. No advertising, remarketing, fingerprinting, heatmaps, or session recording are used.

## Owner controls

Use these URLs in the browser you use for routine site maintenance:

- `https://david-maestas.github.io/?analytics_owner_opt_out=1` saves `dm_analytics_owner_opt_out_v1=1`, removes accessible GA cookies, and disables analytics in that browser even if visitor consent was previously granted.
- `https://david-maestas.github.io/?analytics_owner_opt_in=1` clears the owner flag and returns the browser to its ordinary saved consent state.

The control parameter is removed from the visible URL with `history.replaceState`. Owner opt-out takes precedence over consent and debug mode.

## Debugging

Open `https://david-maestas.github.io/?analytics_debug=1`, then allow analytics if prompted. Debug mode respects consent and owner opt-out. The query parameter is removed from the address bar and is excluded from the analytics page location.

Use **Realtime** in GA4 to check current visits and events. Use **Admin > DebugView** (or the current DebugView location in GA4) for event-by-event troubleshooting. Browser privacy tools and blockers may still prevent debug traffic.

## Reporting in GA4

After deployment and consented traffic begins arriving, GA4 can report:

- users, sessions, and page views in acquisition and engagement reports
- traffic/referral sources in Traffic acquisition
- approximate geography in demographic reports, when available
- standard file downloads in the Events report under `file_download`
- deliberate link, CV, and email interactions in the Events report under the custom event names above

Register useful event parameters as **event-scoped custom dimensions** in the GA4 interface if they are needed in standard reports or explorations. Recommended parameters are:

- `link_category`
- `link_label`
- `link_placement`
- `destination_domain`
- `destination_path`
- `source_page`
- `contact_method`
- `file_name`

These custom dimensions are not created by the website code and must be configured manually in the authenticated GA4 property after events begin arriving.

## Limitations

- Analytics begin only after these changes are deployed; historical traffic cannot be reconstructed.
- Visitor and event totals are estimates, not a complete census.
- Declined consent, browser restrictions, blockers, network failures, and other technical limits may exclude traffic.
- Geographic data are approximate.
- A `file_download` or `cv_download` event records link activation, not proof that the file was saved or read.
