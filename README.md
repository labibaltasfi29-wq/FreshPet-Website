# FreshPet Bangladesh — Website

A premium D2C e-commerce website prototype for **FreshPet**, a Bangladeshi wet cat food brand.
Built with React, Vite, Tailwind CSS, and lucide-react icons.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

This outputs a static, production-ready site to the `dist/` folder.
Preview the production build locally with:

```bash
npm run preview
```

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects the Vite framework preset. Leave the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. No extra configuration is required.

## Project structure

```
freshpet-website/
├── index.html              Entry HTML (fonts + favicon + root div)
├── package.json             Dependencies & scripts
├── vite.config.js           Vite + React plugin config
├── tailwind.config.js       Tailwind content paths
├── postcss.config.js        PostCSS (Tailwind + Autoprefixer)
├── public/
│   ├── favicon.png
│   └── images/
│       ├── freshpet-logo.png
│       ├── freshpet-front-pouch.jpg
│       ├── freshpet-back-pouch.jpg
│       └── freshpet-combo.jpg
└── src/
    ├── main.jsx             React root render
    ├── App.jsx              The entire website (single component)
    └── index.css            Tailwind directives + base styles
```

All product/packaging/logo images live in `public/images/` and are referenced with
root-relative paths (e.g. `/images/freshpet-logo.png`), so they work identically in
local dev, production builds, and after Vercel deployment — no code changes needed.

## Notes

- This is a front-end prototype only (no backend). Cart, checkout, account dashboard,
  and the pet-profile feeding calculator are fully interactive demo experiences built
  with React state — no data is persisted or sent anywhere.
- Fonts (`Baloo 2`, `Plus Jakarta Sans`) are loaded via Google Fonts in `index.html`.
