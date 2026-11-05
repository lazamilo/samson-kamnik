# Samson Kamnik redesign

Static redesign pitch for samson-kamnik.si by AKEO. Plain HTML, CSS and JS, no build step.

- `index.html`: homepage (hero, about and stats, scroll expand, 12 categories, references, e-shops, news, contact)
- `kategorija.html?k=<key>`: category template for all 12 categories, with product search
- `assets/js/data.js`: categories, product lists, references, news and shops, crawled from the current site
- `assets/img`: generated stills (Higgsfield, Nano Banana Pro) plus the client's own logo and photos
- Motion: GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 (bundled locally)

Run locally: `python3 -m http.server` in this folder.

Font: Maison Neue (Book, Medium, Demi). Production use needs a licence.
