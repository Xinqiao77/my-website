# Assisi Care website

A static website built with plain HTML, CSS and JavaScript. It needs no build tools, frameworks or installation.

## View it locally

**Quickest:** double-click `index.html` to open it in your browser.

**Recommended:** run a small local server so everything behaves exactly as it will online. In a terminal in this folder, run:

```
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Press `Ctrl+C` in the terminal to stop the server.

## Folder structure

```
AssisiCare/
├── index.html            Home page
├── science.html          BSP Protein Platform
├── publications.html     Publications & Data (with type filter)
├── services.html         Protein Research, Data Analysis, Strategic Planning
├── about.html            Story, mission, values, team (#team)
├── partner.html          Partnership + investor page
├── news.html             News posts + newsletter signup
├── careers.html          Careers
├── contact.html          Contact form
├── privacy.html          Privacy Policy (template)
├── terms.html            Terms of Use (template)
├── disclaimer.html       Research Disclaimer (template)
├── 404.html              "Page not found" page
├── robots.txt            Instructions for search engines
├── sitemap.xml           List of pages for search engines
├── css/styles.css        All styling. Brand colours and fonts are at the top.
├── js/main.js            Menu, dropdowns, form checks, publications filter
└── assets/
    ├── logo/             SVG logo set (see below)
    └── images/           Illustration, placeholders, share image, app icon
```

### Logo files (`assets/logo/`)

| File | Use |
|---|---|
| `logo-compact.svg` | Header: mark + name, for light backgrounds |
| `logo-compact-reversed.svg` | Same, for dark backgrounds |
| `logo-horizontal.svg` / `-reversed.svg` | Full logo with tagline, side by side |
| `logo-stacked.svg` / `-reversed.svg` | Full logo with the mark above the name |
| `mark.svg` / `mark-reversed.svg` | The "A" mark only (e.g. social profile pictures) |
| `favicon.svg` | Simplified icon for browser tabs |

The lettering has been converted to outlines, so the logos look the same on every computer, even without the fonts installed. Files ending in `-reversed` are for dark backgrounds.

## Before going live: to-do list

1. **Domain:** done. The site uses `https://assisi.care`, set in the `CNAME` file and in each page's canonical/social tags.
2. **Email:** find and replace `contact@example.com` in all `.html` files and in `js/main.js`.
3. **Forms:** the contact and newsletter forms don't send anything yet. Create a form endpoint (for example with [Formspree](https://formspree.io)), then paste its URL into `FORM_ENDPOINT` and `NEWSLETTER_ENDPOINT` at the top of `js/main.js`. Until you do, the forms ask visitors to email you instead.
4. **Placeholder content:** search the `.html` files for `Placeholder` and `[XX]`. This covers the data figures, team names and bios, publications, news posts, milestones, location and partner logos.
5. **Photos:** replace `assets/images/placeholder-*.svg` with real photos. Keep the same shape: square for people, 3:2 for lab photos, 16:9 for news.
6. **Legal pages:** have a lawyer review `privacy.html`, `terms.html` and `disclaimer.html`.
7. **Science claims:** every claim about cancer cells and normal cells should be backed by data you can cite.

## Editing tips

- The header and footer are copied into every page. If you change a menu link, change it in **every** `.html` file. Your editor's "find and replace in files" feature makes this quick.
- To add a news post, copy one `<article class="post">` block in `news.html`. Give it a new `id`, and add a card for it to the "Latest news" section on `index.html`.
- To add a publication, copy one `<li class="pub">` block in `publications.html`. Set `data-type` to `paper`, `poster`, `preprint` or `patent`.
- To change colours or fonts, edit the variables at the top of `css/styles.css`.
