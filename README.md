# David R. Maestas, Jr., PhD - Personal Website

Static academic personal website built with plain HTML, CSS, and vanilla JavaScript.

This package contains only the deployable website files:
- index.html
- research.html
- publications.html
- cv.html
- contact.html
- privacy.html
- style.css
- script.js
- analytics.js
- sitemap.xml
- robots.txt
- assets/

The site includes consent-aware GA4 analytics, a privacy page, canonical and social metadata, and sitemap/robots files for search readiness. Analytics behavior, owner controls, event definitions, and manual GA4 setup are documented in [ANALYTICS_SETUP.md](ANALYTICS_SETUP.md).

The repository remains directly deployable through GitHub Pages without a build step.

## Editing the site

- `index.html`: professional overview, selected research, profile links, and news.
- `research.html`: funded work, research direction, and software descriptions.
- `publications.html`: peer-reviewed articles and separately labeled public preprints.
- `cv.html`: concise web CV; keep dates and appointment status explicit.
- `contact.html`: professional contact information and profile links.
- `privacy.html` and `analytics.js`: existing optional analytics and privacy controls.
- `style.css` and `script.js`: responsive presentation and accessible navigation.
- `assets/`: headshot, research visual, favicon, and downloadable CV.

Preview locally with `python -m http.server 8000 --bind 127.0.0.1`, then open
`http://127.0.0.1:8000/`. No dependencies or build tools are required.

Check internal links and anchors, all CV download links, image loading, mobile
navigation, keyboard focus, and page metadata after editing. Update the sitemap
dates when page content changes. Commit locally before a separately authorized push.

## Content status — November 2026

The web pages reflect the November 2026 CV and list 23 peer-reviewed articles.
The two FIRE software manuscripts are **in preparation**; public code availability
has not been verified, so no software repository or preprint links are presented.
The Spring 2027 junior-instructor role is explicitly an upcoming appointment.

The downloadable PDF is `assets/CV_David_Maestas_Nov_2026.pdf`. Its two FIRE
research-output lines state that the manuscripts are in preparation; the original
supplied CV was preserved. All eight download controls point to this website copy.
