# Flashbae SEO and growth plan

Written 2026-11-05. Data was pulled live that day from Search Console (sc-domain:flashbae.com), Google Trends, Google
Autocomplete and Google search results.

**Goal:** 100 website users a day.

## 1. Where we are

| Signal | Value | What it means |
|---|---|---|
| Search Console, last 28 days | 19 impressions, 1 click, avg position 4.7 | Data starts 27 Oct; the property is about a week old |
| Sitemap | Submitted 28 Oct, read 3 Nov, 34 URLs discovered | Fine |
| Indexed (`site:flashbae.com`) | 8 of 34 pages: home, /ja/, /ko/, quiz, poses, strip maker, AI generator, Y2K guide | Normal for a new domain; the rest are still waiting |
| Page indexing report | "Processing data" | Too new to report |
| Backlinks | Effectively none | The main reason Google ranks us nowhere yet |
| App Store | **Flashbae is not live** (iTunes lookup for com.flashbae.app returns 0) | Every "Download" button lands on a stopgap page whose App Store search finds nothing |
| Technical SEO | Good: 200s, www canonical, HTTPS redirects, hreflang en/ja/ko, JSON-LD on every page, llms.txt, real 404, alt text on all images | Not the problem |

**Diagnosis.** Nothing is broken. Google has barely started: a domain about a week old with no links gets crawled
slowly and ranks low (the "sandbox"). Organic Google traffic will grow over weeks to months, not days. **100 users a
day within a week will not come from Google.** It has to come from distribution: Reddit, TikTok, Pinterest,
directories and Bing. SEO is the compounding layer underneath.

## 2. Keyword research (live, 2026-11-05)

### Google Trends, worldwide, last 90 days (relative interest)

- `pixect` (an online photobooth competitor) > `photo strip` > `photobooth online` > `online photo booth` ≈ `ai photo booth`.
- `digicam filter`, `y2k filter` and `photo strip template` barely register on their own. Their volume comes through long-tail variants (below).
- Breakout rising queries for "online photo booth": **pixect**, **beautyplus** (BeautyPlus launched a web photo booth).
- Rising topic: "PhotoBooth Online" +170%.
- Top regions: US, Philippines, UAE, Hong Kong, Singapore.
- A spike in mid-September hit both `online photo booth` and `ai photo booth` together, likely a viral trend.

**Takeaway:** people search for the one-word spelling **"photobooth online"** more than "online photo booth". The
category is growing, and the winners are small free browser tools.

### Google Autocomplete clusters (what people actually type)

| Cluster | Real queries (autocomplete) | Our page |
|---|---|---|
| Online booth | photobooth online free, photo booth online website, online photo booth with friends, online photo booth for 2 people, photo booth online with filters | /online-photo-booth/ (now also targets "photobooth online") |
| 4-cut / Korean | 4 cut photo booth online, easy 4 cut photo booth online free, korean photo booth online free, 4 cut photo template, japanese photo booth filter online | **NEW /4-cut-photo-booth/** |
| B&W | online photo booth black and white, photo booth filter black and white, black and white photo strip maker | **NEW /black-and-white-photo-booth/** |
| Vintage | vintage photo booth filter online, retro photo strip | **NEW /vintage-photo-booth/** |
| Long distance | online photo booth for long distance couples / relationship / friends, fun dates for long distance relationships photo booth | /long-distance-photo-booth/ (app only, see 4.2) |
| Digicam | digicam filter online free, digicam filter website, digital camera filter online, digicam filter iphone | /digicam-filter/ (now has a working online tool) |
| Y2K | y2k filter online free, y2k photo editor online, how to make your photos look y2k, how to get 2000s filter | **NEW /y2k-filter/** |
| Disposable / Polaroid | how to get disposable camera filter on iphone, y2k disposable camera effect filter, filter for polaroid effect | **NEW /disposable-camera-filter/**, **NEW /polaroid-filter/** |
| Strip templates | photo strip template free / editable / canva / instagram, photo booth template maker online | /photo-strip-templates/ |
| Poses | photo booth pose ideas (high), photo booth poses for couples, poses to do in a photo booth with friends | /photo-booth-poses/ (already indexed) |
| Info | what is a photo strip, how to make photo strips, how to print photo strips, photo strip size | Guides to write (5.2) |
| K-pop | online photo booth with kpop idols (free), kpop photo booth website | **Skip.** Idol photos are someone else's likeness and IP. "Korean-style" is covered by 4-cut |

### Who ranks now (Google US, 2026-11-05)

- **"photobooth online":** photobooth-io.cc, photobooth.online (passport photos), mysketchbooth, beautyplus.com/photo-booth, lensbooth.app, photo.freehihi.com, rollbooth.com, snappybooth.me, photobooth-online.com.
- **"digicam filter online":** digicamfilter.online, digicamfx.com, pokecut, capcut, 10015.io, canva, media.io.
- **"online photo booth long distance":** lensbooth.app, getangie.com, a Reddit post in r/LDR ("we built an online photobooth…"), joinmymoment.com, togetherlens.app, amoreframephotobooth.site.
- **"photo strip template free":** Canva, Pinterest, templatesbooth, PosterMyWall, Vecteezy, Adobe. These are hard; stay long-tail.
- **"ai photo booth online free":** aragon.ai, dreamina (CapCut), photobooth-ai.app, kimg.ai, onreplay.ai.

**Pattern:** single-purpose sites with the exact query in the title and the tool right at the top beat big brands.
We already have the tools; we just weren't naming pages after the searches. Reddit threads also rank, which is a
cheap way in (r/LDR).

## 3. Fixes shipped in this change (deploy to go live)

1. **Six new search-intent landing pages.** Each one opens a real free tool already preset for its search, plus a
   unique how-to and an FAQ written from the autocomplete questions:
   - /4-cut-photo-booth/: 2x2 grid, Flash Glow
   - /black-and-white-photo-booth/: Photobooth mono film
   - /vintage-photo-booth/: 1930s Booth film
   - /y2k-filter/: Flash Glow and date stamp
   - /polaroid-filter/: Polaroid, no stamp
   - /disposable-camera-filter/: Light Leak and date stamp

   Data: `lib/landings.tsx`. Template: `components/ToolLanding.tsx`. Each page ships WebApplication, HowTo, FAQPage
   and BreadcrumbList schema.
2. **/digicam-filter/** used to be an app pitch. It now leads with a working online digicam filter. The title is
   "Digicam filter online, free: Y2K digital camera effect", and two new FAQs cover "free online" and "on iPhone".
3. **/online-photo-booth/** title now includes "photobooth online" (the higher-volume spelling). A new section links
   the 4-cut, B&W, vintage and long-distance pages.
4. **Homepage H1** now starts with "AI photo booth" (a small kicker line; the visual is unchanged).
5. **Internal links:** the new pages are in the footer on every English page, in the /free-tools/ hub (cards plus
   ItemList schema), in the sitemap (priority 0.9) and in /llms.txt.
6. **Tool presets:** `OnlineBooth` takes `layoutId`/`filmId`, `StripStudio` takes `initialFilm`, and `DateStamp`
   takes `filmId`/`stamp` and has a new date stamp On/Off toggle.
7. **IndexNow:** `public/069c423da5324833d3ce4128fb2bd8ad.txt` plus `scripts/indexnow.mjs`. After each deploy, run
   `node scripts/indexnow.mjs`. Bing, Yandex and others crawl within hours, and Bing feeds ChatGPT search and Copilot.

## 4. The 7-day plan (aiming at 100 users/day)

Rough traffic math for a week: Reddit 30–80/day while posts are live, TikTok/Reels 0–200/day (spiky), Pinterest
5–20/day (grows slowly), directories 5–20/day, Bing 5–15/day after IndexNow, Google 5–20/day by the end of the week.

### Day 1 (today)
- [ ] Deploy (push `main`; Vercel builds), then run `node scripts/indexnow.mjs`.
- [ ] Search Console → URL Inspection → **Request indexing** for the 10 pages below. Google allows about 10–12 a day;
      do these first:
      `/online-photo-booth/`, `/4-cut-photo-booth/`, `/digicam-filter/`, `/y2k-filter/`, `/photo-strip-templates/`,
      `/black-and-white-photo-booth/`, `/photo-booth-app/`, `/long-distance-photo-booth/`, `/polaroid-filter/`,
      `/disposable-camera-filter/`.
- [ ] **Bing Webmaster Tools:** sign in, then "Import from Google Search Console" (one click; copies the
      verification and the sitemap).
- [ ] Decide what the download buttons do while the app isn't live. Right now they open a page whose App Store
      search finds nothing. Until launch, point them at the web tools (or a "Get notified" email form), not the
      App Store.

### Day 2: directories (backlinks and referral traffic)

Submit the free online photo booth and the AI photo generator to:
- [ ] There's An AI For That, Futurepedia, Toolify, TopAI.tools, AI Tool Hunt (AI generator)
- [ ] AlternativeTo: list Flashbae as an alternative to **Pixect**, **photobooth-io**, **BeautyPlus photo booth**,
      Photo Booth (Mac) and Boothie
- [ ] Product Hunt: launch "Flashbae free online photo booth" on a Tuesday–Thursday, 12:01 PT
- [ ] SaaSHub, Uneed, Microlaunch, Fazier, BetaList (free tiers)

### Day 3: Reddit (fastest real users; threads also rank on Google)

Post as a maker and be honest. Show a strip, link only when the subreddit allows it, and reply to every comment.
- [ ] r/LDR: "made a free online photo booth you can use on a call; app version shoots together over live video"
      (a competitor's post there ranks #4 for "online photo booth long distance")
- [ ] r/InternetIsBeautiful: the online photo booth (no sign-up, nothing uploaded)
- [ ] r/SideProject, r/webdev (built-with story: canvas films, no upload)
- [ ] r/photobooth, r/kpophelp or r/kpop style threads only where self-promo is allowed, using the 4-cut page
- [ ] Answer existing "free online photo booth" and "digicam filter app" threads (search Reddit for them)

### Days 3–7: short video, daily (the Y2K/digicam niche lives on TikTok)
- [ ] One 7–15 s video a day: a "4 cut photo booth online, no app" screen recording; a "turn your iPhone photo into
      a 2000s digicam in 5 seconds" before/after; a "photo booth with your long-distance bf" duo strip.
- [ ] Put "flashbae.com" as text on screen; link in bio → /free-tools/.
- [ ] Post the same clips to Instagram Reels and YouTube Shorts.

### Days 4–7: Pinterest (strip templates and poses are Pinterest searches)
- [ ] Business account, claim flashbae.com.
- [ ] 5 pins a day: blank strip templates (link → /photo-strip-templates/), pose idea boards (→ /photo-booth-poses/),
      4-cut examples (→ /4-cut-photo-booth/), digicam before/afters (→ /digicam-filter/).

### Every day
- [ ] Search Console → Performance: note impressions and position per page. Request indexing for anything new.

## 5. Next 30–90 days (organic compounding)

### 5.1 Web long-distance booth (highest-value gap)
"Online photo booth for long distance couples/friends" has real demand and weak competitors (lensbooth, getangie).
We already have the backend (`booth_duo.py` sessions plus LiveKit). A browser version would let a couple open one
link and shoot a strip together on video, and it would be the most shareable thing on the site: every use invites
a second person. Build it at /long-distance-photo-booth/ above the app pitch.

### 5.2 Content to write (one a week, each answering an autocomplete question)
- What is a photo strip? (size, history, how to make one)
- How to make photo strips (at home, online, on iPhone)
- How to print photo strips (2x6 on 4x6 paper, cut lines)
- Photo booth poses for couples (high-volume variant of the pose page)
- How to get the disposable camera filter on iPhone
- How to make your photos look Y2K (pairs with /y2k-filter/)
- Photo booth captions for Instagram with friends (autocomplete hit)

### 5.3 Page fixes
- Look pages (/looks/<slug>/) target names nobody searches ("Dreamlight", "Face Roll"). Retitle them by what they
  do: "Disposable flash AI filter", "Subway night photo AI template".
- Meta descriptions on 12 pages run 162–224 characters. Trim them to ≤155 so the ending isn't cut. The same string
  is often the on-page lede, so give pages a separate metadata description.
- Home page: add a "Free tools" row above the fold. The tools are what earns visits; AI looks need sign-in.
- Remove "Free to download" and the MobileApplication Offer until the app is actually on the App Store.

### 5.4 Links
- Write one "how we built a no-upload photo booth with canvas" post for dev.to/Hashnode that links to the tool.
- Pitch "free tools for long-distance dates" listicles: LDR blogs and couple-app roundups.
- Once the app launches: App Store listing → website link, and press kit for AppAdvice/9to5-style roundups.

## 6. How we measure it

| Metric | Where | Target (1 week) | Target (6 weeks) |
|---|---|---|---|
| Indexed pages | Search Console → Pages | 20+ of 40 | all |
| Google impressions/day | Search Console | 50+ | 1,000+ |
| Google clicks/day | Search Console | 5+ | 50+ |
| All website users/day | PostHog project 640314 / Vercel Analytics | 100 | 300 |
| Strips downloaded | PostHog events on the tools | track | track |

## 7. Using claude-seo

[AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) (MIT) is a Claude Code plugin with `/seo audit`,
`/seo technical`, `/seo geo`, `/seo schema`, `/seo cluster`, `/seo google` (GSC and PageSpeed APIs) and
`/seo drift` (change monitoring). This audit followed its checklist manually. To install it for future runs, use the
repo's `install.sh`. It installs a Python runtime and Chromium, so read the script first. Useful later:
- `/seo drift baseline https://www.flashbae.com` now, then `compare` weekly, to catch regressions.
- `/seo geo` once pages are indexed, to check AI-answer citations (ChatGPT, Perplexity, AI Overviews).
- `/seo google` with a GSC service account, to pull query data automatically instead of through the UI.
