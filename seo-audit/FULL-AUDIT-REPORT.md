# flashbae.com SEO audit (claude-seo 2.5.0)

Run 2026-11-05 on https://www.flashbae.com with the claude-seo runtime: `sitemap_discovery`, `parse_html` on all 40
sitemap URLs, `render_page` (Playwright), `agentic_check`, `preload_check`. PageSpeed Insights was rate-limited (the
shared keyless quota), and there are no Google, Moz or Matomo credentials, so there is no field CWV, GSC or backlink data.
Raw output is in `raw/` (git-ignored).

**Business type:** consumer app marketing site plus free browser tools (SaaS/tool pattern, not local, not e-commerce).

## SEO health score: 78/100 before fixes

| Category | Weight | Score | Notes |
|---|---|---|---|
| Technical SEO | 22% | 92 | 40/40 URLs return 200, self-canonicals, www canonical, hreflang en/ja/ko, real 404, robots allows all, sitemap OK |
| Content quality | 23% | 68 | 14 pages under 400 words; /looks/ hub had 35 words; 14 near-template look pages |
| On-page SEO | 20% | 62 | 15 titles over 60 characters, 16 meta descriptions over 155 characters, em dashes in titles |
| Schema | 10% | 85 | JSON-LD on every page (WebApplication, HowTo, FAQPage, BreadcrumbList, Article, ItemList); MobileApplication offered a "Free download" for an app that is not on the App Store yet |
| Performance | 10% | 75 (lab, partial) | LCP image preloaded with fetchpriority=high; no speculation rules; home page ships ~90 look images as 900 px JPEG |
| AI search readiness | 10% | 85 | llms.txt passes Lighthouse rules, content present without JS, no AI-crawler blocks; no Content-Signal or Markdown twin (optional) |
| Images | 5% | 80 | Every meaningful image has alt text; empty alts are decorative duplicates. JPEG where WebP is half the bytes |

## Findings

### High
1. **Titles cut off in results (15 pages).** The " · Flashbae" suffix pushed keyword titles to 61-81 characters
   (e.g. "Photo booth pose generator: random poses for solo, couples and friends · Flashbae").
2. **Meta descriptions cut off (16 pages, 161-224 characters):** aesthetic-quiz, ai-photo-generator, date-stamp-photo,
   films, free-tools, both long guides, long-distance, online-photo-booth, photo-booth-app, poses, strip-maker,
   strip-templates, three look pages.
3. **App schema claims a free download that doesn't exist.** `MobileApplication.offers` and `downloadUrl` on /, /ja/
   and /ko/ point at a stopgap URL; the iTunes lookup for com.flashbae.app returns 0 results. Rich-result eligibility
   for software apps needs a real listing, and the mismatch is a trust signal against us.

### Medium
4. **Thin hub:** /looks/ had 35 words of body copy for a page targeting "AI photo looks and filters".
5. **Thin tool landings:** /polaroid-filter/ (244), /disposable-camera-filter/ (291), /y2k-filter/ (304),
   /vintage-photo-booth/ (309), /black-and-white-photo-booth/ (358), /ai-photo-generator/ (211), /guides/ (257).
   The tool is the main content, so this is acceptable for now; grow each with one real example strip and 2-3 FAQs.
6. **Look pages are near-duplicates** (377-399 words, same template). Titles are look names nobody searches
   ("Dreamlight", "Face Roll"). Rename around what they do when the next looks batch lands.
7. **Image weight:** ~4.4 MB of look JPEGs vs 1.1 MB as WebP twins.
8. **No speculation rules** (preload_check 75/100).

### Low
9. Em dashes in the home and look-page titles (house style: none).
10. No Content-Signal line in robots.txt and no Markdown twin of pages (optional agent-readiness items).
11. /ai-photo-generator/ title was a bare "AI Photo Generator" (29 chars) with no qualifier.

## What works
- Clean crawl: no redirects chains, no noindex, no duplicate titles or descriptions.
- Structured data everywhere, matching visible content.
- llms.txt, hreflang, IndexNow key already in place.
- Search-intent tool pages from the 2026-11-05 plan are live and linked from the footer and the /free-tools/ hub.

## Not measured
- Field Core Web Vitals (CrUX), indexation and queries (GSC), backlinks (Moz/Bing). Add a Google API key in
  `~/.config/claude-seo/google-api.json` to unlock `/seo google` and PSI without the shared quota.
