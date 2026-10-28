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
- `NEXT_PUBLIC_SITE_URL` — the real domain (default https://www.flashbae.com — flashbae.com redirects there); used for canonical URLs, the sitemap and structured data.
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

## Google sign-in (AI generator)

Generating an AI photo needs a Google sign-in; new accounts get 5 free credits, once.

1. Google Cloud console → APIs & Services → Credentials → Create OAuth client ID → **Web application**.
2. Authorized JavaScript origins: `https://www.flashbae.com` and `http://localhost:3100` (plus `http://localhost` for local testing). No redirect URI is needed.
3. Website: set `NEXT_PUBLIC_GOOGLE_CLIENT_ID=<client id>` (Vercel env and `.env.local`).
4. Backend (`langify_backend`): set `FLASHBIE_GOOGLE_CLIENT_IDS=<client id>`. Credits: `FLASHBIE_WEB_SIGNUP_CREDITS` (default 5, one-time) and `FLASHBIE_WEB_DAILY_CREDITS` (default 0).
