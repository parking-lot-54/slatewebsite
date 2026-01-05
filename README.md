# SlateTasks website

Static marketing site for the forthcoming **Slate** iOS/macOS task manager.

## Pages

- **Homepage**: `/index.html`
- **Support / FAQ**: `/support/index.html` (also duplicated at `/support.html`)

## FAQ JSON (single source of truth)

The FAQ is served as JSON at `https://slatetasks.com/support/faq.json` and the Support page renders from it.

## Icons / favicons

Source icon (1024×1024) lives in `assets/` and we generate standard web sizes:

- `assets/slate-icon-1024.png` (source)
- `assets/slate-icon-256.png` (used in-page)
- `assets/apple-touch-icon.png` (iOS home screen)
- `assets/favicon-32.png`, `assets/favicon-16.png`, and `/favicon.ico` (browser favicon)
- `assets/icon-192.png`, `assets/icon-512.png` (PWA/manifest)

## Email signup (Early Access)

The signup form is wired in `script.js`. Because GitHub Pages is static, you’ll need a hosted form endpoint to actually collect emails.

- **Recommended**: Formspree
  - Create a form in Formspree and copy your endpoint URL
  - Paste it into `SIGNUP_ENDPOINT` in `script.js`

Once configured, the homepage form will POST:

- `email`
- `source` (the current page URL)
