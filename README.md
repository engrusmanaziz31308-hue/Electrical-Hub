# Electrical Hub — سولر اور الیکٹریکل کیلکولیٹر

Offline-first website: Solar system design, electrical calculators (Ohm's law, power,
energy bill, 3-phase, voltage drop), a load calculator, a wire/breaker reference chart,
a **Quotation Maker** (customer quotations with items, pricing & signature lines,
downloadable/printable as PDF), and a bilingual (English/Urdu) electrical glossary.

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

## Quotation Maker
Open the **Quotation** tab: fill in quotation no./date/validity, customer name,
company, phone & address, then add item rows (S.No, Item Name, Specification, Unit
Price, Total Amount — auto-calculated). Subtotal, discount and grand total update
live. Tap **Download / Print Quotation (PDF)** to open the print dialog — choose
"Save as PDF" or print directly. The printed quotation includes the app logo,
your entered details, the item table, totals, and signature/stamp lines at the
bottom. Your in-progress quotation is auto-saved on this device (localStorage) so
it's not lost if you switch tabs or close the app.

## Update your existing GitHub repo / APK (same steps as before)
1. Replace the files in your GitHub repository with the updated ones in this folder
   (`index.html`, `app.js`, `i18n.js`, `data.js`, `sw.js` — `manifest.json` and the
   icons are unchanged).
2. Commit & push — if GitHub Pages is already enabled it updates automatically.
3. Go to **pwabuilder.com**, paste your GitHub Pages URL again, and let it re-scan
   the site (it picks up `manifest.json` and `sw.js` automatically).
4. Download the new **Android package** and install/share the updated APK.

The service worker uses a network-first strategy, so anyone already using the app
online will pick up this update automatically the next time they open it with an
internet connection — no need to clear app storage.
