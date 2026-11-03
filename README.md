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
- sitemap.xml
- robots.txt
- assets/
- data/

The site includes canonical and social metadata, a sitemap, and robots directives. It uses no visitor analytics, tracking scripts, cookies, or browser storage. Publication search filters the existing page content locally without saving or sending queries. The privacy page distinguishes this site behavior from GitHub Pages hosting practices.

The repository remains directly deployable through GitHub Pages without a build step.

## Editing the site

- `index.html`: professional overview, selected research, profile links, and news.
- `research.html`: funded work, research direction, and software descriptions.
- `publications.html`: peer-reviewed articles and separately labeled public preprints.
- `data/publication-authors.json`: verified ordered author lists and their article XML or publisher-deposited Crossref sources. Keep the HTML author lists and this provenance record in sync when updating citations. Published spelling is retained; David's canonical name is an additional search alias.
- `cv.html`: concise web CV; keep dates and appointment status explicit.
- `contact.html`: professional contact information and profile links.
- `privacy.html`: brief explanation of site functionality, hosting, and external links.
- `style.css` and `script.js`: responsive presentation, accessible navigation, and publication filtering.
- `assets/`: headshot, research visuals, favicon, and downloadable CV.
- `assets/mtbio/`: author-provided Materials Today Bio microscopy panels with lossless WebP copies and PNG originals. Preserve complete panels, channel labels and scale bars; see the included attribution notes.
- `assets/selected-publications/`: complete author-supplied study images for the homepage, with exact lossless WebP copies, PNG originals, and source notes.

Preview locally with `python -m http.server 8000 --bind 127.0.0.1`, then open
`http://127.0.0.1:8000/`. No dependencies or build tools are required.

Check internal links and anchors, all CV download links, image loading, mobile
navigation, keyboard focus, and page metadata after editing. Update the sitemap
dates when page content changes. Commit locally before a separately authorized push.

## Content status — November 2026

The web pages reflect the November 2026 CV and list 23 peer-reviewed articles.
The two FIRE software manuscripts are **in preparation**; public code availability
has not been verified, so no software repository or preprint links are presented.
The software cards link to contact information for availability inquiries.
The Spring 2027 junior-instructor role is explicitly an upcoming appointment.

Long author lists preserve publication order, show David's name in bold, and
expand through native keyboard-accessible details. Search includes the complete
author lists, David's canonical name, and publication years; accents are optional.
The author metadata file is a maintenance record, not a client-side request.

The downloadable PDF is `assets/CV_David_Maestas_Nov_2026.pdf`. Its two FIRE
research-output lines state that the manuscripts are in preparation; the original
supplied CV was preserved. All eight download controls point to this website copy.
