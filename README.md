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

Content lives in `lib/site.ts` (copy, FAQ), `lib/looks.ts` (which looks are shown; `HIDDEN` keeps
celebrity look-alikes and trademarked/poster shots off the site), `lib/films.ts` (the booth films, kept in step with
`BoothFilm.all` in the app), `lib/guides.tsx` (how-to guides) and `lib/locales.ts` (the Japanese and Korean home pages,
built from the App Store listings in `AppStore/locales`). The same sources feed the pages, the JSON-LD, the sitemap and
`/llms.txt`, so they never disagree.

Pages: `/` and the AI looks under `/looks/`; feature pages `/photo-booth-app/`, `/long-distance-photo-booth/`,
`/digicam-filter/` and `/films/`; guides under `/guides/`; and `/ja/` and `/ko/`. Each language has its own root
layout (`app/(en)`, `app/ja`, `app/ko`) so `<html lang>` is right; `app/global-not-found.tsx` is the shared 404.

Looks refresh: `.github/workflows/looks.yml` runs `npm run looks` every Monday and opens a pull request when the
catalog changed. Each look keeps the date it first appeared (`added`), which the pages and sitemap show. Turn on
Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests" for it to work.
