// Tell Bing, Yandex, Seznam and Naver (and through Bing, ChatGPT search and Copilot) about every page in the live
// sitemap, so new and changed pages are crawled in hours instead of weeks. Run after each deploy:
//   node scripts/indexnow.mjs            (all sitemap URLs)
//   node scripts/indexnow.mjs /y2k-filter/ /polaroid-filter/   (just these)
// The key is public on purpose: IndexNow checks that https://www.flashbae.com/<key>.txt holds it.
const KEY = "069c423da5324833d3ce4128fb2bd8ad";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.flashbae.com").replace(/\/$/, "");
const host = new URL(SITE).host;

const args = process.argv.slice(2);
const urls = args.length
  ? args.map((p) => (p.startsWith("http") ? p : SITE + p))
  : [...(await (await fetch(`${SITE}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);
if (res.status >= 400) console.log(await res.text());
