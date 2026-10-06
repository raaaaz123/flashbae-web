// Pulls the live looks catalog and saves each look's before/after locally, resized for the web.
// Run with `npm run looks` whenever looks change in the admin, then rebuild the site.
// A weekly GitHub Action (.github/workflows/looks.yml) runs it too and opens a pull request with any changes.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const API = process.env.FLASHBAE_API ?? "https://vocavoy.dietly.life/flashbie";
const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "public/looks");
mkdirSync(outDir, { recursive: true });

const catalog = await (await fetch(`${API}/looks`)).json();

// When each look first appeared on the site: kept across runs, so pages and the sitemap show honest dates.
const listPath = join(root, "lib/looks.json");
const previous = existsSync(listPath) ? JSON.parse(readFileSync(listPath, "utf8")) : [];
const addedOn = Object.fromEntries(previous.map((l) => [l.id, l.added]));
const today = new Date().toISOString().slice(0, 10);
const categories = Object.fromEntries((catalog.categories ?? []).map((c) => [c.id, c.title]));

async function save(url, file) {
  const path = join(outDir, file);
  if (existsSync(path)) return `/looks/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  // Longest side 900 px: sharp on retina at the sizes the site shows, light on mobile data.
  execFileSync("sips", ["-Z", "900", "-s", "formatOptions", "78", path], { stdio: "ignore" });
  return `/looks/${file}`;
}

const looks = [];
for (const l of catalog.looks) {
  // Booth styles have no before/after pair; the site shows looks people can compare.
  const after = l.after_url ?? l.preview_url;
  if (!l.before_url || !after) continue;
  looks.push({
    id: l.id,
    title: l.title,
    tagline: l.tagline ?? "",
    kind: l.kind,
    category: categories[l.category] ?? l.category,
    premium: !!l.premium,
    trending: !!l.trending,
    people: l.people ?? 1,
    before: await save(l.before_url, `${l.id}-before.jpg`),
    after: await save(after, `${l.id}-after.jpg`),
    added: addedOn[l.id] ?? today,
  });
  process.stdout.write(".");
}

writeFileSync(listPath, JSON.stringify(looks, null, 2) + "\n");
console.log(`\n${looks.length} looks → lib/looks.json`);
