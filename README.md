# angiechen
Personal website and resume

A simple, static, dependency-free personal website meant to replace sending a
PDF resume — share the link instead. Built with plain HTML/CSS/JS so it's easy
to customize and deploy.

## Structure

- `index.html` — page content and structure (resume sections: about,
  experience, skills, education, contact)
- `styles.css` — visual design, including a `:root` block of CSS variables
  (colors, fonts, spacing) for easy theming, plus a `[data-theme="dark"]`
  variant for dark mode
- `script.js` — small interactive behaviors (mobile nav toggle, dark mode
  toggle, footer year)

## Customize

1. Replace the placeholder text in `index.html` (name, title, summary,
   experience, skills, education, contact links) with your own resume
   content.
2. Adjust the design tokens at the top of `styles.css` (`--color-*`,
   `--font-*`) to match your own aesthetic. Fonts are loaded from Google
   Fonts in `index.html`'s `<head>` — swap them there too if you change
   `--font-heading` / `--font-body`.
3. Open `index.html` directly in a browser to preview changes locally.

## Deploy with GitHub Pages

1. In the repository settings, go to **Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Choose the branch (e.g. `main`) and root folder (`/`), then save.
4. Your site will be published at `https://<username>.github.io/<repo>/`.
