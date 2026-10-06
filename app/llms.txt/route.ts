import { FILM_GROUPS, FILMS } from "@/lib/films";
import { GUIDES } from "@/lib/guides";
import { LOOKS } from "@/lib/looks";
import { APP_STORE_URL, BOOTH, DESCRIPTION, FAQ, LEGAL, NAME, SITE_URL, STORE_NAME } from "@/lib/site";

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

## Free web tools
- [Online photo booth](${SITE_URL}/online-photo-booth/): free, in the browser, with the webcam or phone camera; pose prompts, a 3-2-1 countdown and screen flash; download a photo strip. Nothing is uploaded.
- [Photo strip maker](${SITE_URL}/photo-strip-maker/): free; turn 3 or 4 of your photos into a booth strip with a film, frame colour, caption and date. Nothing is uploaded.
- [Date stamp and digicam filter](${SITE_URL}/date-stamp-photo/): free; add the orange date stamp of a 2000s camera to a photo (using the date it was taken), with a CCD or flash colour grade. Nothing is uploaded.
- [Printable photo strip templates](${SITE_URL}/photo-strip-templates/): free 2×6 strips and 4×6 print sheets at 300 dpi with custom text, or a transparent overlay for photo booth software.

## Pages
- [Photo booth app for iPhone](${SITE_URL}/photo-booth-app/): how the booth works, layouts, films, saving and printing.
- [Long-distance photo booth](${SITE_URL}/long-distance-photo-booth/): one strip with someone far away, on live video.
- [Digicam and Y2K flash filters](${SITE_URL}/digicam-filter/): booth films, AI looks and editor filters for the flash look.
- [Film looks](${SITE_URL}/films/): all ${BOOTH.films} booth films.
- In Japanese: ${SITE_URL}/ja/ · In Korean: ${SITE_URL}/ko/

## Guides
${GUIDES.map((g) => `- [${g.title}](${SITE_URL}/guides/${g.slug}/): ${g.description}`).join("\n")}

## Film looks (photo booth)
${FILM_GROUPS.map((g) => `### ${g.title}\n${FILMS.filter((f) => f.group === g.id).map((f) => `- ${f.title}${f.free ? " (free)" : ""}: ${f.text}`).join("\n")}`).join("\n\n")}

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
