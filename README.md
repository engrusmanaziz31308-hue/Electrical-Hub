# Electrical Hub — سولر اور الیکٹریکل کیلکولیٹر

Offline-first website: Solar system design, electrical calculators (Ohm's law, power,
energy bill, 3-phase, voltage drop), a load calculator, a wire/breaker reference chart,
and a bilingual (English/Urdu) electrical glossary.

## Files
- `index.html` — main page (open this directly in a browser, works offline)
- `i18n.js` — English/Urdu translations
- `data.js` — appliance list, wire chart, glossary data
- `app.js` — app logic and calculators
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` — PWA files (for APK conversion)

## Use it right now
Just double-click `index.html` — no server, no internet required (except for the
first load, to fetch Google Fonts; after that it still works offline since fonts
are cached by the browser).

## Convert to an Android APK (same steps as your meter app)
1. Push this whole folder to a GitHub repository and enable **GitHub Pages** for it.
2. Go to **pwabuilder.com**, paste your GitHub Pages URL, and let it scan the site
   (it will pick up `manifest.json` and `sw.js` automatically).
3. Download the **Android package** and install/share the APK.
