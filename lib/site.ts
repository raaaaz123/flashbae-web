// Everything the site says about the app in one place, so the pages, the structured data
// and llms.txt never disagree.

/** Set NEXT_PUBLIC_SITE_URL to the real domain at build time (e.g. https://flashbae.app). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://flashbae.app").replace(/\/$/, "");

/** The numeric App Store id once the app is live; until then the download link redirects through the API. */
export const APP_STORE_ID = process.env.NEXT_PUBLIC_APP_STORE_ID ?? "";
export const APP_STORE_URL = APP_STORE_ID
  ? `https://apps.apple.com/app/id${APP_STORE_ID}`
  : "https://vocavoy.dietly.life/flashbie/app";

export const NAME = "Flashbae";
export const STORE_NAME = "Flashbae: AI Photo Booth";
export const TAGLINE = "AI photo booth & vintage film camera for iPhone";
export const DESCRIPTION =
  "Flashbae is an AI photo booth for iPhone. Shoot four-frame photo strips with 33 film looks, booth together with a friend over live video, " +
  "and let AI re-shoot your selfie in digicam flash, golden hour or Y2K. Free to download.";

/** What search results show under the title (kept under ~160 characters so it isn't cut). */
export const META_DESCRIPTION =
  "AI photo booth for iPhone: photo strips with 33 film looks, booths with friends over live video, and AI looks like digicam flash and golden hour. Free.";

export const LEGAL = {
  privacy: "https://vocavoy.dietly.life/flashbie/privacy",
  terms: "https://vocavoy.dietly.life/flashbie/terms",
  support: "https://vocavoy.dietly.life/flashbie/support",
};

export const BOOTH = { layouts: 4, films: 33, freeFilms: 11, languages: 14 };

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is Flashbae free?",
    a: `Yes. The photo booth, ${BOOTH.freeFilms} of its ${BOOTH.films} films and the film editor are free. AI looks and the Pro booth extras come with a subscription in the app.`,
  },
  {
    q: "What does an AI look do to my photo?",
    a: "You pick a look, add a selfie, and AI re-shoots it in that style: a digicam flash, golden-hour light, warm film, a Y2K camera or a whole new scene. It keeps your face and pose, and you can fade the result back toward your original with the intensity slider.",
  },
  {
    q: "How does the photo booth work?",
    a: `Choose a layout (Classic, 4-cut, Trio or 6-cut), follow the pose prompts and the 3-2-1 countdown, and the booth flashes and builds your strip. Then add one of ${BOOTH.films} film looks, a frame, stickers, a caption and the date, and save it as a strip, an Instagram Story or a print sheet.`,
  },
  {
    q: "Can I do a photo booth with my partner who lives far away?",
    a: "Yes. Send a link or a six-letter code. You see and hear each other on live video, both phones count down together and flash at the same moment, and you both get one strip with the two of you in it. Live video is never recorded.",
  },
  {
    q: "Are my photos private?",
    a: "There's no account: no name, email or phone number. Studio edits never leave your phone. For AI looks the photo you pick is sent to Google's Gemini image model to make your result; the upload isn't kept, and Google doesn't train on it. Settings → Delete my data removes everything we stored.",
  },
  {
    q: "Is Flashbae on Android?",
    a: "Not yet. Flashbae is for iPhone and iPad, in 14 languages.",
  },
  {
    q: "Can I remove the Flashbae logo from my strips?",
    a: "Yes. Subscribers get clean strips and shared photos without the logo.",
  },
];
