// How-to guides: written for the questions people type into search and ask AI assistants.
// Each guide is plain prose with real steps in the app; `steps` also feeds the HowTo structured data.

import { BOOTH, NAME } from "@/lib/site";

export type Guide = {
  slug: string;
  title: string;
  /** The short name for cards and breadcrumbs. */
  short: string;
  description: string;
  published: string;
  updated: string;
  steps?: { name: string; text: string }[];
  faq?: { q: string; a: string }[];
  body: React.ReactNode;
};

const POSES = [
  "Big smile 😁", "Laugh like you mean it 😂", "Look away, all mysterious 👀", "Blow a kiss 😘",
  "Peace sign ✌️", "Surprised face 😮", "Chin on hand, editorial 💅", "Squeeze in close 🫶",
  "Silly face 🤪", "Wink 😉", "Hands in a heart 🫰", "Serve a model pose 📸",
];

export const GUIDES: Guide[] = [
  {
    slug: "y2k-flash-photos",
    title: "How to get the Y2K flash photo look on iPhone",
    short: "Y2K flash photos",
    description:
      "What makes a photo look like it came from a 2000s digicam, how to shoot it on an iPhone, and how to add the flash look to a photo you already took.",
    published: "2026-10-06",
    updated: "2026-10-06",
    steps: [
      { name: "Shoot at night or indoors", text: "The look depends on the flash being the brightest light in the scene, so turn down the lamps or step outside after dark." },
      { name: "Use a flash, close up", text: "Stand about an arm's length from the camera. A close, direct flash gives bright faces and a dark background." },
      { name: "Pick a digicam film", text: `In the ${NAME} photo booth, choose CCD Cam (free) or Y2K Digicam for the whole strip.` },
      { name: "Or re-shoot an existing photo", text: "Pick an AI look such as Disposable Flash, add the photo, and tap Make it." },
      { name: "Finish with a date stamp", text: "Add the date to the strip, the way the old cameras printed it in the corner." },
    ],
    faq: [
      { q: "Why don't my iPhone flash photos look like a digicam?",
        a: "The iPhone blends its flash with the room's light and processes the photo heavily, so faces come out even and soft. Digicams had a small, hard flash, a smaller sensor and simpler processing: harsher light, darker backgrounds, cooler colour." },
      { q: "Can I get the look in daylight?",
        a: "Not with a filter alone: the look comes from the flash being the main light. An AI look can relight a daylight selfie as if a flash had gone off." },
    ],
    body: (
      <>
        <p>
          The Y2K flash look is the photo from a compact digital camera around the year 2000: a hard flash straight on,
          faces bright and a little shiny, the background falling off into dark, colours cool and punchy, and highlights
          that blow out to white. It&apos;s the opposite of the soft, evened-out photo a modern phone takes.
        </p>
        <h2 id="what">What makes a photo look Y2K</h2>
        <ul>
          <li><strong>Direct flash</strong> as the main light, close to the lens.</li>
          <li><strong>A dark background</strong>, because the flash only reaches a few metres.</li>
          <li><strong>Cool, crisp colour</strong> from the cameras&apos; simple white balance.</li>
          <li><strong>Blown highlights</strong> on foreheads, cheeks and anything shiny.</li>
          <li><strong>A date stamp</strong> in the corner, for the full effect.</li>
        </ul>
        <h2 id="shoot">How to shoot it</h2>
        <p>
          Light matters more than the filter. Shoot at night or in a dim room, get close, and let the flash do the work.
          In the {NAME} photo booth the screen itself flashes white for every frame, lighting your face from the front
          the way a small on-camera flash would.
        </p>
        <p>
          Then pick a flash film for the strip. <strong>CCD Cam</strong> (free) gives the cool, crisp 2000s digicam;
          {" "}<strong>Flash Glow</strong> (free) is warmer, with glowing skin; <strong>Y2K Digicam</strong> is punchier,
          with dark corners; <strong>Disposable</strong> has the grain of a throwaway camera. <a href="/films/#g-flash">Compare the flash films</a>.
        </p>
        <h2 id="existing">How to add the look to a photo you already have</h2>
        <p>
          A colour filter can&apos;t add a flash that wasn&apos;t there. An AI look can: it re-shoots the photo with the light of a
          flash while keeping your face and pose. <a href="/looks/disposable-flash/">Disposable Flash</a> adds direct flash and
          punchy Y2K colour; <a href="/looks/midnight-flash/">Midnight Flash</a> puts you on a dark street under a raw flash.
          Results take about 15 seconds, and an intensity slider fades back toward your original.
        </p>
        <p>
          If the photo already has flash, the free film editor&apos;s Digicam and Flash Pop filters push the colour the rest of
          the way without AI. More options: <a href="/digicam-filter/">digicam and Y2K flash filters</a>.
        </p>
      </>
    ),
  },
  {
    slug: "photo-strip-on-iphone",
    title: "How to make a photo booth strip on iPhone",
    short: "Make a photo strip",
    description:
      "Make a real four-frame photo booth strip on your iPhone: set up the shot, follow the countdown, choose a film and frame, then save it as a strip, a Story or a print sheet.",
    published: "2026-10-06",
    updated: "2026-10-06",
    steps: [
      { name: "Set up your phone", text: "Prop it at eye level about an arm's length away, facing a window or lamp." },
      { name: "Choose a layout", text: `Open the Booth tab in ${NAME} and pick Classic, 4-cut, Trio or 6-cut.` },
      { name: "Shoot", text: "Follow each pose prompt; the booth counts down 3, 2, 1 and flashes for every frame." },
      { name: "Decorate", text: "Pick a film, a frame colour, stickers, a caption and the date." },
      { name: "Save", text: "Save it as a strip, an Instagram Story or a print sheet, or a behind-the-scenes video." },
    ],
    faq: [
      { q: "How many photos are in a photo strip?",
        a: "Classically four, stacked. In Flashbae, Classic and 4-cut have four frames, Trio has three and 6-cut has six." },
      { q: "Can I print the strip?",
        a: "Yes. Save it as a print sheet, a page laid out for printing, then cut the strips apart." },
      { q: "Can I make a strip with someone who isn't with me?",
        a: "Yes. Booth together connects you on live video and flashes both phones at once. See the long-distance photo booth." },
    ],
    body: (
      <>
        <p>
          A photo strip is a short story in four frames: the coin-op booth gave you a few seconds between flashes to
          change your pose, and that rhythm is what makes strips fun. Here&apos;s how to get it on an iPhone.
        </p>
        <h2 id="setup">1. Set up the shot</h2>
        <p>
          Prop your phone at eye level, about an arm&apos;s length away, so you can both fit without anyone holding it.
          Face a window or a lamp: soft light from the front is the flattering part, and the booth&apos;s screen flash adds the sparkle.
        </p>
        <h2 id="layout">2. Pick a layout</h2>
        <ul>
          <li><strong>Classic:</strong> four frames stacked, the original booth strip.</li>
          <li><strong>4-cut:</strong> four portrait frames in a two-by-two grid.</li>
          <li><strong>Trio:</strong> three frames, a little bigger each.</li>
          <li><strong>6-cut:</strong> six frames for a group or a longer story (Pro).</li>
        </ul>
        <h2 id="shoot">3. Shoot</h2>
        <p>
          Tap start and the booth runs itself: a pose prompt, a 3, 2, 1 countdown and a flash for each frame. Strips look
          best when they change pace: start calm, then a big reaction, something silly, and end on a serious model pose.
          Need ideas? Try these <a href="/guides/photo-booth-pose-ideas/">photo booth pose ideas</a>.
        </p>
        <h2 id="decorate">4. Pick a film and decorate</h2>
        <p>
          One film covers the whole strip so the frames match: a silvery <strong>Photobooth</strong> black and white,
          a <strong>1930s Booth</strong> with dust and grain, a <strong>CCD Cam</strong> digicam flash and {BOOTH.films - 3} more
          {" "}(<a href="/films/">see them all</a>). Then choose a frame colour, add stickers, write a caption and stamp the date.
        </p>
        <h2 id="save">5. Save, share or print</h2>
        <ul>
          <li><strong>Strip:</strong> the classic image for your camera roll or group chat.</li>
          <li><strong>Story:</strong> sized for Instagram Stories.</li>
          <li><strong>Print sheet:</strong> a page laid out for printing, ready to cut.</li>
          <li><strong>Behind the scenes:</strong> a short video of the shoot.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "photo-booth-pose-ideas",
    title: "Photo booth pose ideas for friends, couples and solo strips",
    short: "Photo booth pose ideas",
    description:
      "Photo booth pose ideas that make a strip tell a story: the twelve prompts the Flashbae booth uses, plus ideas for couples, friends, long-distance strips and posing alone.",
    published: "2026-10-06",
    updated: "2026-10-06",
    faq: [
      { q: "What are good photo booth poses?",
        a: "Mix them up across the strip: a calm smile, a big laugh, something silly like a surprised face or a wink, then a serious model pose. The change between frames is what makes a strip fun." },
      { q: "How do you pose in a photo booth alone?",
        a: "Use the frames as a sequence: a smile, a look away, a wink, then chin on hand. Moving closer and further from the camera between frames also adds variety." },
    ],
    body: (
      <>
        <p>
          The best strips tell a little story. The {NAME} booth gives a pose prompt for every frame and always opens calm,
          then mixes it up: a big reaction, something playful, something editorial. Here are the prompts it uses, and how to
          build your own.
        </p>
        <h2 id="prompts">The twelve booth prompts</h2>
        <ul>{POSES.map((p) => <li key={p}>{p}</li>)}</ul>
        <h2 id="story">Build the strip like a story</h2>
        <ol>
          <li><strong>Start calm:</strong> a natural smile, so there&apos;s one frame that&apos;s just you.</li>
          <li><strong>Then a big reaction:</strong> a real laugh or a surprised face.</li>
          <li><strong>Then something playful:</strong> a wink, a peace sign or a silly face.</li>
          <li><strong>End editorial:</strong> chin on hand or a serious model pose. It looks great as the last frame.</li>
        </ol>
        <h2 id="couples">Ideas for couples</h2>
        <ul>
          <li>Squeeze in close, then a kiss on the cheek, then both looking away.</li>
          <li>Make a heart with one hand each.</li>
          <li>One serious, one laughing, then swap.</li>
          <li>Forehead to forehead for the last frame.</li>
        </ul>
        <h2 id="friends">Ideas for friends</h2>
        <ul>
          <li>Everyone does the same pose, except one person who does the opposite.</li>
          <li>A frame where everyone points at one friend.</li>
          <li>Recreate an old photo of yourselves.</li>
          <li>Pile into the frame from one side.</li>
        </ul>
        <h2 id="apart">Ideas for long-distance strips</h2>
        <p>
          In a <a href="/long-distance-photo-booth/">long-distance booth</a> you each shoot your own frames at the same moment.
          Poses that reach across the gap work best: a hand stretched toward the other frame, a heart that meets in the
          middle, a kiss blown toward the other side, or matching faces. With the Couple vibe, the booth&apos;s own prompts
          are made to meet in the middle.
        </p>
        <h2 id="solo">Ideas for solo strips</h2>
        <ul>
          <li>Change distance: close-up, then step back, then back in.</li>
          <li>Use props: sunglasses on, sunglasses off.</li>
          <li>A slow turn: front, three-quarter, profile, over the shoulder.</li>
        </ul>
        <p>Ready to shoot? Here&apos;s <a href="/guides/photo-strip-on-iphone/">how to make a photo strip on iPhone</a>.</p>
      </>
    ),
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
