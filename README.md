# Flashbae website

Next.js 16 static site (Three.js hero, Framer Motion) for the Flashbae iOS app.

```sh
npm install        # node_modules lives in node_modules.nosync (iCloud skips it); re-link if npm replaces the symlink:
                   #   rm -rf node_modules.nosync && mv node_modules node_modules.nosync && ln -s node_modules.nosync node_modules
npm run dev        # http://localhost:3100
npm run build      # static HTML in out/ — upload that folder to any static host
```

Build-time settings:
- `NEXT_PUBLIC_SITE_URL` — the real domain (default https://www.flashbae.com — flashbae.com redirects there); used for canonical URLs, the sitemap and structured data.
- `NEXT_PUBLIC_APP_STORE_ID` — once the app is live: download buttons go straight to the App Store and Safari shows the smart app banner.

- `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` — PostHog analytics and session replay (defaults to the Flashbae project on us.i.posthog.com). Replays are recorded unmasked.

Content lives in `lib/site.ts` (copy, FAQ), `lib/looks.ts` (the looks, read from the backend's `/looks`, the same catalog the app shows), `lib/films.ts` (the booth films, kept in step with
`BoothFilm.all` in the app), `lib/guides.tsx` (how-to guides) and `lib/locales.ts` (the Japanese and Korean home pages,
built from the App Store listings in `AppStore/locales`). The same sources feed the pages, the JSON-LD, the sitemap and
`/llms.txt`, so they never disagree.

Pages: `/` and the AI looks under `/looks/`; feature pages `/photo-booth-app/`, `/long-distance-photo-booth/`,
`/digicam-filter/` and `/films/`; guides under `/guides/`; and `/ja/` and `/ko/`. Each language has its own root
layout (`app/(en)`, `app/ja`, `app/ko`) so `<html lang>` is right; `app/global-not-found.tsx` is the shared 404.

Looks: there is no list in this repo. `next.config.ts` reads `/flashbie/looks` (the API the iOS app uses) at build time, so every page, the sitemap and `/llms.txt` show exactly the looks switched on in the admin; a build fails if the API is down, so the last good deploy stays up. The generator (`useLiveLooks`) re-reads `/looks` in the browser, so a look switched on later is pickable at once and gets its own `/looks/<slug>/` page on the next deploy. Looks without example photos (the AI booth styles) show in the generator and under "More styles". The WebGL hero and the sample selfie load photos through `/flashbie/looks/<id>/image/<before|after>`, because the media host sends no CORS headers.

## Google sign-in (AI generator)

Generating an AI photo needs a Google sign-in; new accounts get 5 free credits, once.

1. Google Cloud console → APIs & Services → Credentials → Create OAuth client ID → **Web application**.
2. Authorized JavaScript origins: `https://www.flashbae.com` and `http://localhost:3100` (plus `http://localhost` for local testing). No redirect URI is needed.
3. Website: set `NEXT_PUBLIC_GOOGLE_CLIENT_ID=<client id>` (Vercel env and `.env.local`).
4. Backend (`langify_backend`): set `FLASHBIE_GOOGLE_CLIENT_IDS=<client id>`. Credits: `FLASHBIE_WEB_SIGNUP_CREDITS` (default 5, one-time) and `FLASHBIE_WEB_DAILY_CREDITS` (default 0).
