# SlateTasks website

Static marketing site for the forthcoming **Slate** iOS/macOS task manager.

## Pages

- **Homepage**: `/index.html`
- **Support / FAQ**: `/support/index.html` (also duplicated at `/support.html`)

## Email signup (Early Access)

The signup form is wired in `script.js`. Because GitHub Pages is static, you’ll need a hosted form endpoint to actually collect emails.

- **Recommended**: Formspree
  - Create a form in Formspree and copy your endpoint URL
  - Paste it into `SIGNUP_ENDPOINT` in `script.js`

Once configured, the homepage form will POST:

- `email`
- `source` (the current page URL)
