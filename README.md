# Electrical Hub — سولر اور الیکٹریکل کیلکولیٹر

Offline-first website: Solar system design, electrical calculators (Ohm's law, power,
energy bill, 3-phase, voltage drop), a load calculator, a wire/breaker reference chart,
a **Quotation Maker** (customer quotations with items, pricing, multiple taxes &
signature lines, downloadable/printable as PDF), and a bilingual (English/Urdu)
electrical glossary. New gradient logo and a more colorful theme.

## Files
- `index.html` — main page (open this directly in a browser, works offline)
- `i18n.js` — English/Urdu translations
- `data.js` — appliance list, wire chart, glossary data
- `app.js` — app logic and calculators
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` — PWA files (for APK conversion)

## Use it right now
Just double-click `index.html` — no server, no internet required (except for the
first load, to fetch Google Fonts; after that it still works offline since fonts
are cached by the browser). A fully self-contained single-file version
(`electrical-hub-standalone.html`, everything incl. the logo embedded inline) is
also provided separately for offline laptop/desktop use with zero extra files.

## Battery bank backup autonomy — Days or Hours
In **Solar Design → 3 · Battery Bank**, the "Backup days (autonomy)" field now has
a unit dropdown next to it — switch between **Days** and **Hours**. Changing the
unit auto-converts the number you already entered so the real-world backup time
stays the same, and the battery-bank sizing recalculates instantly either way.

## Quotation Maker
Open the **Quotation** tab: fill in quotation no./date/validity, customer name,
company, phone & address, then add item rows (S.No, Item Name, Specification, Unit
Price, Total Amount — auto-calculated). Below Discount you can also **+ Add Tax**
as many times as needed (e.g. GST 17%, a fixed service charge) — each tax line adds
into the Grand Total (`Subtotal − Discount + Taxes`). Tap **Download / Print
Quotation (PDF)** to open the print dialog — choose "Save as PDF" or print directly.
The printed quotation includes the app logo, your entered details, the item table,
all taxes, totals, and signature/stamp lines at the bottom. Your in-progress
quotation is auto-saved on this device (localStorage) so it's not lost if you
switch tabs or close the app.

## Update your existing GitHub repo / APK
1. Replace the files in your GitHub repository with the updated ones in this folder
   (`index.html`, `app.js`, `i18n.js`, `data.js`, `sw.js`, `manifest.json`,
   `icon-192.png`, `icon-512.png` — **the icons changed this time**, so make sure
   to overwrite those two PNGs as well, not just the code files).
2. Commit & push — if GitHub Pages is already enabled it updates automatically.
3. Go to **pwabuilder.com**, paste your GitHub Pages URL again, and let it re-scan
   the site. Because the icon and theme color changed, PWA Builder needs a **fresh
   scan** (don't reuse a cached scan) so the new icon/splash colors carry into the
   package — if it still shows the old icon, hit "Refresh"/re-enter the URL.
4. Download the new **Android package** and install it over the old one (same
   package name/ID, so it updates in place — no need to uninstall first).

The service worker uses a network-first strategy and its cache version was bumped,
so anyone already using the app online will pick up this update automatically the
next time they open it with an internet connection — no need to clear app storage.

