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

The signup form is wired in `script.js`. This site is static (GitHub Pages), so we use **Google Sheets via Google Forms** to collect emails for free.

### Setup (Google Sheets via Google Forms)

1. Create a **Google Form** with one question:
   - **Email** (Short answer)
   - Enable email validation (in question settings)
2. In the form, go to **Responses** → **Link to Sheets**.
3. Get your entry id:
   - Form menu **⋮** → **Get pre-filled link**
   - Enter a dummy email, generate link, copy it
   - In the URL you’ll see `entry.<ID>=...` — copy the `<ID>` part
4. In `script.js`, set:
   - `GOOGLE_FORM_ACTION_URL` to `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`
   - `GOOGLE_FORM_EMAIL_ENTRY_ID` to the `<ID>` from step 3
