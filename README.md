# Flashbae website

Next.js 16 static site (Three.js hero, Framer Motion) for the Flashbae iOS app.

```sh
npm install        # node_modules lives in node_modules.nosync (iCloud skips it); re-link if npm replaces the symlink:
                   #   rm -rf node_modules.nosync && mv node_modules node_modules.nosync && ln -s node_modules.nosync node_modules
npm run dev        # http://localhost:3100
npm run looks      # re-pull the looks catalog + before/after images from the live API
npm run build      # static HTML in out/ — upload that folder to any static host
```

Build-time settings:
- `NEXT_PUBLIC_SITE_URL` — the real domain (default https://flashbae.app); used for canonical URLs, the sitemap and structured data.
- `NEXT_PUBLIC_APP_STORE_ID` — once the app is live: download buttons go straight to the App Store and Safari shows the smart app banner.

Content lives in `lib/site.ts` (copy, FAQ) and `lib/looks.ts` (which looks are shown; `HIDDEN` keeps
celebrity look-alikes and trademarked/poster shots off the site). The FAQ and looks feed the page, the JSON-LD
and `/llms.txt` from one source.
