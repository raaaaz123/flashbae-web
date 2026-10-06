import { LOOKS } from "@/lib/looks";
import { APP_STORE_URL, BOOTH, DESCRIPTION, FAQ, LEGAL, NAME, PACKS, PLANS, SITE_URL, STORE_NAME } from "@/lib/site";

export const dynamic = "force-static";

// llms.txt: a plain summary for AI assistants and answer engines (https://llmstxt.org).
export function GET() {
  const body = `# ${STORE_NAME}

> ${DESCRIPTION}

${NAME} is an iPhone and iPad app (iOS 17+) in ${BOOTH.languages} languages. Download: ${APP_STORE_URL}

## What it does
- Photo booth: ${BOOTH.layouts} strip layouts (Classic, 4-cut, Trio, 6-cut), pose prompts, a 3-2-1 countdown and flash; ${BOOTH.films} film looks (${BOOTH.freeFilms} free), frames, stickers, captions and a date stamp; save as a strip, an Instagram Story or a print sheet.
- Booth together: invite a partner or friend with a link or six-letter code; live video and voice while you shoot; both phones count down and flash at the same moment; one shared strip. Live video is never recorded.
- AI looks: pick a look, add a selfie, and AI re-shoots it (digicam flash, night flash, golden hour, warm film, Y2K, scene templates). Results take about 15 seconds; an intensity slider fades back toward the original; a before/after reveal video can be shared.
- Free film editor on the device: film filters, adjustments, face retouch, light leaks and frames.

## Pricing (USD)
- Free: the booth, ${BOOTH.freeFilms} films, the film editor and booth together.
${PLANS.map((p) => `- ${p.name}: $${p.price}/week, ${p.perDay} AI photos a day, every film, theme and sticker, strips without the logo.`).join("\n")}
- Credit packs: ${PACKS.map((p) => `${p.credits} for $${p.price}`).join(", ")}; one-time, never expire.

## Looks
${LOOKS.map((l) => `- [${l.title}](${SITE_URL}/looks/${l.slug}/): ${l.kind}. ${l.tagline}`).join("\n")}

## FAQ
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Links
- [All looks](${SITE_URL}/looks/)
- [Privacy policy](${LEGAL.privacy})
- [Terms](${LEGAL.terms})
- [Support](${LEGAL.support})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
