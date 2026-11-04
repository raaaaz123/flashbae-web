# Action plan (from the 2026-11-05 claude-seo audit)

## Fixed in this change
- [x] `seoTitle()` in lib/site.ts drops the brand suffix when a title would pass 60 characters; applied to every
      keyword page, tool landing and guide. Rewrote the five titles still over 60 on their own.
- [x] Separate ≤155-character search snippets (`META`) on 11 pages; the on-page lede and schema text are unchanged.
      Guides trimmed; look pages shorten their summary at a word.
- [x] MobileApplication `offers`/`downloadUrl` only render once `NEXT_PUBLIC_APP_STORE_ID` is set (en, ja, ko).
- [x] /looks/ gets a "How AI looks work" section (privacy answer, links to the free tools).
- [x] Pages show the 600 px WebP look images (4.4 MB → 1.1 MB); JPEGs stay for OG, schema and the AI sample upload.
- [x] Speculation rules prefetch internal links on hover.
- [x] Em dashes out of the home and look-page titles; curly quotes stripped from API taglines.
- [x] /ai-photo-generator/ title and description rewritten.

## Next (needs you)
- [ ] Deploy, then `node scripts/indexnow.mjs`.
- [ ] `/seo drift baseline https://www.flashbae.com` after deploy, then `/seo drift compare` weekly.
- [ ] Google API key in `~/.config/claude-seo/google-api.json` (PSI/CrUX), GSC service account for `/seo google`.
- [ ] When the app goes live: set `NEXT_PUBLIC_APP_STORE_ID`; the offer schema and Safari banner switch on by themselves.
- [ ] Grow the thinnest tool pages (polaroid, disposable, y2k, vintage) with an example strip and 2-3 more FAQs.
- [ ] Rename look pages around what they do (plan 5.3).
- [ ] Distribution items in SEO-PLAN.md section 4 (directories, Reddit, short video, Pinterest) are still the main lever.
