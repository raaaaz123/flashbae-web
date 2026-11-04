// Search-intent landing pages: each opens one of the free browser tools already set up for the thing people search
// for ("4 cut photo booth online", "y2k filter online free"...), then answers the questions Google autocompletes for
// that search. Keyword research behind them: SEO-PLAN.md.

export type LandingTool =
  | { kind: "booth"; layoutId?: string; filmId?: string }
  | { kind: "photo"; filmId: string; stamp: boolean };

export type Landing = {
  slug: string;
  /** Short name for breadcrumbs, the tools hub and the footer. */
  name: string;
  icon: string;
  /** <title>: the exact search first, ~60 characters. */
  title: string;
  /** Meta description, under ~155 characters. */
  description: string;
  h1: string;
  lede: string;
  tool: LandingTool;
  sections: { h: string; p: string[] }[];
  faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
  updated: string;
};

export const LANDINGS: Landing[] = [
  {
    slug: "4-cut-photo-booth",
    name: "4-cut photo booth",
    icon: "🎞️",
    title: "4 cut photo booth online, free: Korean-style 2x2 strip",
    description: "A free 4 cut photo booth online: four poses, a 3-2-1 countdown and a flash, laid out in a Korean-style 2x2 grid. Webcam or phone, no sign-up.",
    h1: "4 cut photo booth, online and free",
    lede: "The four-frame grid from Korean self photo studios, in your browser. Pick your poses, count down, and download a 2x2 photo strip with the date on it. Nothing is uploaded.",
    tool: { kind: "booth", layoutId: "grid4", filmId: "flashglow" },
    sections: [
      { h: "What is a 4 cut photo?", p: [
        "A 4 cut photo (네컷 사진, \"four-cut\") is four photos taken in a row in a self photo booth and printed together, usually in a two-by-two grid or a tall strip. It started in Korean photo studios, where friends and couples drop in for a quick round of poses, and it spread with K-pop and TikTok.",
        "The booth above shoots the same way: one pose prompt per frame, a 3, 2, 1 countdown, a screen flash to brighten your face, then the four frames laid out in a grid on a white, black or cream frame.",
      ] },
      { h: "Tips for a cute 4 cut", p: [
        "Plan the four frames as a little story: a normal smile, a silly face, a pose together, a candid laugh. Hearts with your hands, chin on fist and peace signs are the classics.",
        "Sit close to a window or a lamp, hold the phone at eye level, and turn the flash on for that bright, clean booth look. Flash Glow gives the soft, glowy skin of a studio booth; B&W is the moody one.",
      ] },
    ],
    faq: [
      { q: "Is this 4 cut photo booth free?", a: "Yes. No sign-up, no limit, and the photos never leave your device. The strip has a small flashbae mark in the corner." },
      { q: "Can I do a 4 cut with a friend who is far away?", a: "In the browser you shoot on one camera. To shoot with someone far away, the Flashbae iPhone app puts you both on live video, counts down on both phones at once and builds one strip with both of you in it." },
      { q: "What size is a 4 cut photo?", a: "A printed 4 cut is usually a 4x6 inch sheet (10x15 cm) with a 2x2 grid, or a 2x6 inch strip with four frames stacked. The strip you download here prints well at either size." },
      { q: "Can I make a 4 cut from photos I already have?", a: "Yes. Use the photo strip maker: pick four photos and the 4-cut layout." },
    ],
    related: [
      { href: "/photo-strip-maker/", label: "Photo strip maker" },
      { href: "/photo-booth-poses/", label: "Pose generator" },
      { href: "/photo-strip-templates/", label: "Printable strip templates" },
    ],
    updated: "2026-11-04",
  },
  {
    slug: "black-and-white-photo-booth",
    name: "Black and white photo booth",
    icon: "🖤",
    title: "Black and white photo booth online: free B&W photo strip",
    description: "Take a black and white photo strip online, free: a classic silver booth filter, a 3-2-1 countdown and a flash. Webcam or phone, nothing uploaded.",
    h1: "Black and white photo booth, online",
    lede: "The silvery black and white strip of a classic coin-op booth, made with your webcam or phone. Four poses, a countdown and a flash, then download the strip.",
    tool: { kind: "booth", layoutId: "classic4", filmId: "photobooth" },
    sections: [
      { h: "Why black and white photo booth strips look so good", p: [
        "Old booths used a bright flash, a fixed camera and black and white paper. The flash flattens skin, the mono film hides colour casts from bad lighting, and the deep blacks make faces pop. That's why a B&W strip looks good on almost anyone.",
        "The booth above has three black and white films: Photobooth (silvery and bright, the classic), B&W (crisp and high-contrast with grain) and 1930s Booth (heavy grain, dust and dark corners for an antique strip).",
      ] },
      { h: "Getting a classic look", p: [
        "Stand in front of a plain wall, keep the screen flash on and look straight into the lens. Classic booth strips are four frames in a column; finish with a black or white frame and the date at the bottom.",
      ] },
    ],
    faq: [
      { q: "Is the black and white photo booth free?", a: "Yes, with no sign-up. Your photos are made and saved on your device; nothing is uploaded." },
      { q: "Can I switch to colour after taking the strip?", a: "Yes. After the last frame, tap any film to change it; your frames are kept, so you can try colour and black and white on the same strip." },
      { q: "How do I print the strip?", a: "Download the PNG and print it on 4x6 photo paper, or use the printable templates to put two strips side by side on one sheet and cut them apart." },
    ],
    related: [
      { href: "/vintage-photo-booth/", label: "Vintage photo booth" },
      { href: "/films/", label: "All film looks" },
      { href: "/photo-strip-templates/", label: "Printable strip templates" },
    ],
    updated: "2026-11-04",
  },
  {
    slug: "vintage-photo-booth",
    name: "Vintage photo booth",
    icon: "📷",
    title: "Vintage photo booth online: free retro photo strip filter",
    description: "A free vintage photo booth online: 1930s grain, sepia, faded 70s film and light leaks on a real photo strip. Use your webcam or phone, nothing uploaded.",
    h1: "Vintage photo booth, in your browser",
    lede: "Take a photo strip that looks like it came out of an old booth: grain, dust, faded blacks and dark corners. Webcam or phone camera, free, nothing uploaded.",
    tool: { kind: "booth", layoutId: "classic4", filmId: "booth30s" },
    sections: [
      { h: "Five vintage films to try", p: [
        "1930s Booth is the antique one: heavy grain, dust specks and dark corners. Sepia gives the warm brown of an old print. Faded 70s lifts the blacks and warms everything up like a family album. Light Leak adds orange glows at the edges, and Polaroid gives soft, creamy instant-film colour.",
        "Shoot first, then switch films on the finished strip: your four frames are kept, so you can compare them all.",
      ] },
      { h: "Make it look older", p: [
        "Vintage strips look most convincing with simple poses and plain clothes, a light background and no ring light. A cream frame and the date at the bottom finish the look.",
      ] },
    ],
    faq: [
      { q: "Is the vintage photo booth free?", a: "Yes. No account and no limits; everything runs in your browser." },
      { q: "Can I add a vintage filter to photos I already have?", a: "Yes. The photo strip maker uses the same films on photos from your camera roll, and the Polaroid filter page works on a single photo." },
      { q: "Is there a vintage photo booth app?", a: "Flashbae for iPhone has 33 booth films, including all of these, plus stickers, frames and AI looks." },
    ],
    related: [
      { href: "/black-and-white-photo-booth/", label: "Black and white photo booth" },
      { href: "/polaroid-filter/", label: "Polaroid filter" },
      { href: "/photo-strip-maker/", label: "Photo strip maker" },
    ],
    updated: "2026-11-04",
  },
  {
    slug: "y2k-filter",
    name: "Y2K filter",
    icon: "💿",
    title: "Y2K filter online, free: 2000s flash photo effect",
    description: "Free Y2K filter online: give any photo the bright flash, cool colour and orange date stamp of a 2000s digital camera. No app, no sign-up, nothing uploaded.",
    h1: "Y2K filter, free and online",
    lede: "Make any photo look like it was shot on a 2000s point-and-shoot: hard flash, glowing skin, punchy colour and the orange date in the corner. Free, in your browser.",
    tool: { kind: "photo", filmId: "flashglow", stamp: true },
    sections: [
      { h: "How to make your photos look Y2K", p: [
        "The Y2K look comes from the cheap compact cameras of 2000 to 2008: a direct flash that blows out the highlights, slightly cool or slightly warm colour, a little noise, and the date burned into the corner in orange.",
        "Pick a photo above. Flash Glow gives the bright party-flash look, CCD Cam gives the cooler, sharper digicam colour, and the date stamp uses the day the photo was taken when the photo still carries it.",
      ] },
      { h: "Shooting it from the start", p: [
        "For a real Y2K photo, shoot at night or indoors with the phone flash on, from a little above, and don't fix the lighting. Mirror selfies with the flash are a classic. Then run the photo through the filter for the colour and the date.",
      ] },
    ],
    faq: [
      { q: "Is the Y2K filter free?", a: "Yes, with no watermark on single photos, no sign-up, and nothing uploaded: the photo is edited on your device." },
      { q: "Can I turn off the date stamp?", a: "Yes. Switch the date stamp off to keep only the colour." },
      { q: "Is there a Y2K filter on iPhone?", a: "Flashbae for iPhone has Y2K Digicam, CCD Cam and Disposable films in its photo booth, and AI looks that relight your selfie as if a real flash went off." },
    ],
    related: [
      { href: "/digicam-filter/", label: "Digicam filter" },
      { href: "/guides/y2k-flash-photos/", label: "Y2K flash photo guide" },
      { href: "/date-stamp-photo/", label: "Date stamp tool" },
    ],
    updated: "2026-11-04",
  },
  {
    slug: "polaroid-filter",
    name: "Polaroid filter",
    icon: "🤍",
    title: "Polaroid filter online, free: instant film photo effect",
    description: "A free Polaroid filter online: soft, creamy instant-film colour for any photo, or the brighter Instax look. No app or sign-up; your photo stays on your device.",
    h1: "Polaroid filter, free in your browser",
    lede: "Give any photo the soft, faded colour of instant film. Choose Polaroid for creamy, lifted tones or Instax for brighter, cleaner colour, then download it.",
    tool: { kind: "photo", filmId: "polaroid", stamp: false },
    sections: [
      { h: "What makes a photo look like a Polaroid", p: [
        "Instant film has low contrast, lifted blacks, soft highlights and a slight green or cyan cast in the shadows. Faces look soft and warm, and nothing is quite sharp. The Polaroid film above copies that recipe; Instax is the brighter, more saturated Fujifilm cousin.",
      ] },
      { h: "Make it look like a real print", p: [
        "Use a square-ish crop, a plain background and soft daylight. To finish the look, add a date in the corner, or put three or four photos in a strip with the photo strip maker.",
      ] },
    ],
    faq: [
      { q: "Is the Polaroid filter free?", a: "Yes. No sign-up, no limit, and your photo never leaves your device." },
      { q: "Can I add a date to the photo?", a: "Yes. Turn the date stamp on to add an orange date in the corner, using the day the photo was taken." },
      { q: "Does it work on iPhone and Android?", a: "Yes, in Safari, Chrome and any modern browser." },
    ],
    related: [
      { href: "/vintage-photo-booth/", label: "Vintage photo booth" },
      { href: "/disposable-camera-filter/", label: "Disposable camera filter" },
      { href: "/photo-strip-maker/", label: "Photo strip maker" },
    ],
    updated: "2026-11-04",
  },
  {
    slug: "disposable-camera-filter",
    name: "Disposable camera filter",
    icon: "📸",
    title: "Disposable camera filter online, free: film + date stamp",
    description: "Free disposable camera filter online: warm film colour, light leaks, grain and an orange date stamp on any photo. No app, no sign-up, nothing uploaded.",
    h1: "Disposable camera filter, online",
    lede: "The look of a party disposable: warm film colour, a light leak, grain and the date in the corner. Pick a photo and download it. Free, nothing uploaded.",
    tool: { kind: "photo", filmId: "lightleak", stamp: true },
    sections: [
      { h: "What a disposable camera photo looks like", p: [
        "Disposable cameras had a fixed lens, a small flash and cheap film. Photos come out warm, a little soft and grainy, often with an orange light leak at the edge, and many cameras printed the date in the corner.",
        "Light Leak gives the warm, leaky film look; Faded 70s is softer and more nostalgic; Flash Glow is the bright party flash. Keep the date stamp on for the full effect.",
      ] },
      { h: "How to get the disposable camera filter on iPhone", p: [
        "This page works in Safari on iPhone: tap Choose a photo, pick one from your library, and save the result back to Photos. For live shooting with the effect, Flashbae for iPhone has a Disposable film in its photo booth.",
      ] },
    ],
    faq: [
      { q: "Is the disposable camera filter free?", a: "Yes. No sign-up and no watermark on single photos. The photo is edited on your device and never uploaded." },
      { q: "Can I use it on several photos?", a: "Yes. Download one, then tap Use another photo. To combine three or four into one strip, use the photo strip maker." },
      { q: "Can I change the date?", a: "Yes. Pick any date, the order (year, month or day first), the colour and the corner." },
    ],
    related: [
      { href: "/y2k-filter/", label: "Y2K filter" },
      { href: "/date-stamp-photo/", label: "Date stamp tool" },
      { href: "/digicam-filter/", label: "Digicam filter" },
    ],
    updated: "2026-11-04",
  },
];
