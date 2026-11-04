// The AI photo tools: one page each, named after what people search, run by the Flashbae API (/flashbie/tools/<id>).
// The prompts live on the server; this file only names the presets and writes the page.

export type AIToolOption = { id: string; label: string; icon: string };

export type AITool = {
  /** The page's URL slug. */
  slug: string;
  /** The server's tool id. */
  tool: string;
  icon: string;
  /** Short name for cards, the footer and breadcrumbs. */
  name: string;
  /** Search title, under 60 characters. */
  title: string;
  /** Meta description, under 155 characters. */
  description: string;
  h1: string;
  /** The word in the h1 set in the italic accent. */
  accent: string;
  lede: string;
  /** What the preset row is called ("Background", "Hairstyle"...). */
  optionLabel: string;
  /** The button: "Change background", "Remove it"... */
  action: string;
  options: AIToolOption[];
  /** The remover takes a short "what to remove" note. */
  custom?: { label: string; placeholder: string };
  /** The tool redraws faces (cartoon), so the before/after reads differently. */
  steps: { name: string; text: string }[];
  /** A few tips under the tool, written for the people searching. */
  tips: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  /** Related tools to link at the bottom. */
  related: string[];
  updated: string;
};

const PRIVACY =
  "Your photo is sent to our AI image model only to make your result. The upload isn't kept, the model isn't trained on it, and only you can see the result in My photos, where you can delete it.";
const COST =
  "Sign in with Google and your first 5 photos are free. After that, each photo uses one credit from the Flashbae app.";

export const AI_TOOLS: AITool[] = [
  {
    slug: "ai-background-changer",
    tool: "background",
    action: "Change background",
    icon: "🏝️",
    name: "AI background changer",
    title: "AI background changer: change photo background free",
    description: "Change the background of any photo with AI: beach, city at night, studio, flower wall and more. The person stays the same and is relit to match.",
    h1: "AI background changer",
    accent: "background",
    lede: "Pick a new background and AI cuts you out, hair and all, then relights you so the photo looks like it was taken there.",
    optionLabel: "New background",
    options: [
      { id: "studio", label: "Studio grey", icon: "🎞️" },
      { id: "beach", label: "Beach", icon: "🏝️" },
      { id: "city-night", label: "City at night", icon: "🌃" },
      { id: "golden-field", label: "Golden field", icon: "🌾" },
      { id: "cafe", label: "Cosy café", icon: "☕" },
      { id: "paris", label: "Paris", icon: "🗼" },
      { id: "snow", label: "Snowy mountains", icon: "🏔️" },
      { id: "flowers", label: "Flower wall", icon: "🌸" },
    ],
    steps: [
      { name: "Add a photo", text: "Any photo with a person in it: a selfie, a full-body shot or a group." },
      { name: "Pick a background", text: "Beach, city lights, studio grey, a flower wall and more." },
      { name: "Change it", text: "AI swaps the background and matches the light on you to it, in about 15 seconds." },
      { name: "Download", text: "Save the full-resolution photo, or try another background." },
    ],
    tips: [
      { title: "For a clean cut-out", text: "Use a photo where you're in focus and not cropped at the head. Busy backgrounds are fine." },
      { title: "For a profile picture", text: "Studio grey gives a clean, neutral backdrop that works on LinkedIn and dating apps." },
      { title: "For a travel post", text: "Beach and Paris look best with a full-body or half-body photo taken in daylight." },
    ],
    faq: [
      { q: "Is the AI background changer free?", a: COST },
      { q: "Does it change my face?", a: "No. The tool only replaces what's behind you and adjusts the light on you to match. Your face, hair, clothes and pose stay the same." },
      { q: "Can I get a plain white or transparent background?", a: "Pick Studio grey for a clean backdrop. A see-through PNG isn't available yet." },
      { q: "Does it work on group photos?", a: "Yes. Everyone in the photo is kept and the background behind all of them is replaced." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["remove-object-from-photo", "ai-headshot-generator", "photo-enhancer"],
    updated: "2026-11-05",
  },
  {
    slug: "remove-object-from-photo",
    tool: "remove-objects",
    action: "Remove it",
    icon: "🧽",
    name: "Remove objects and people from photos",
    title: "Remove object or person from photo, free with AI",
    description: "Remove people, photobombers, objects and text from a photo with AI. Free online, no app: the gap is filled to match the background.",
    h1: "Remove objects and people from a photo",
    accent: "people",
    lede: "Wipe out photobombers, strangers, bins, cables or text. AI fills the gap with background that matches, so nobody can tell.",
    optionLabel: "What to remove",
    options: [
      { id: "people", label: "People in the background", icon: "🚶" },
      { id: "clutter", label: "Clutter and objects", icon: "🗑️" },
      { id: "text", label: "Text, stickers and date stamps", icon: "🔤" },
    ],
    custom: { label: "Or say exactly what to remove", placeholder: "e.g. the red car on the left" },
    steps: [
      { name: "Add a photo", text: "Upload the photo you want to clean up." },
      { name: "Say what to remove", text: "Pick people, clutter or text, or type exactly what should go, like \"the man in the blue shirt\"." },
      { name: "Remove it", text: "AI removes it and fills the space with matching background in about 15 seconds." },
      { name: "Download", text: "Save the clean photo." },
    ],
    tips: [
      { title: "Be specific", text: "\"The woman in the yellow coat behind me\" works better than \"the people\" when you want to keep some of them." },
      { title: "One thing at a time", text: "For big clean-ups, remove one thing, download, then run the result again for the next." },
      { title: "Keep the subject", text: "The main person in the photo is always kept; the tool removes what's around them." },
    ],
    faq: [
      { q: "How do I remove a person from a photo for free?", a: `Upload the photo, choose "People in the background" or type who to remove, and tap Remove. ${COST}` },
      { q: "Can it remove a photobomber but keep my friends?", a: "Yes. Type who should go, for example \"the man in the cap on the right\", and everyone else stays." },
      { q: "Will it remove watermarks?", a: "No. Watermarks protect someone else's photo, so the tool won't remove them. It removes text and stickers added to your own photos." },
      { q: "Does it work on iPhone?", a: "Yes. It runs in Safari, so you can pick a photo straight from your library." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["ai-background-changer", "photo-enhancer", "restore-old-photos"],
    updated: "2026-11-05",
  },
  {
    slug: "restore-old-photos",
    tool: "restore",
    action: "Restore photo",
    icon: "🖼️",
    name: "Restore and colorize old photos",
    title: "Restore old photos online free: fix and colorize with AI",
    description: "Restore old photos with AI: remove scratches, tears and fading, sharpen faces, and colorize black and white photos. Free online, in seconds.",
    h1: "Restore old photos with AI",
    accent: "old photos",
    lede: "Scan or snap an old print. AI removes scratches, creases and fading, brings faces back into focus and can add natural colour to black and white.",
    optionLabel: "Restore",
    options: [
      { id: "restore", label: "Restore only", icon: "🧹" },
      { id: "colorize", label: "Restore and colorize", icon: "🎨" },
    ],
    steps: [
      { name: "Scan the photo", text: "Use a scanner, or take a straight-on photo of the print in even light without glare." },
      { name: "Choose restore or colorize", text: "Keep the original tones, or add natural colour to a black and white photo." },
      { name: "Restore it", text: "AI repairs the damage and sharpens faces in about 15 seconds." },
      { name: "Download", text: "Save the restored photo and share it with the family." },
    ],
    tips: [
      { title: "Photograph the print flat", text: "Lay it on a table near a window, hold the phone straight above it, and turn off the flash to avoid glare." },
      { title: "Crop the edges", text: "Crop away the table and the white border before uploading so the AI focuses on the picture." },
      { title: "Keep your original", text: "Restoration is a best guess at lost detail. Keep the scan of the original alongside it." },
    ],
    faq: [
      { q: "Can I restore old photos for free?", a: COST },
      { q: "How does colorizing work?", a: "The AI recognises skin, clothing, sky and plants and gives them natural, period-appropriate colours. It's an interpretation: the real colours of the day can't be known." },
      { q: "Will it change people's faces?", a: "It sharpens and repairs faces but is told to keep them exactly as they are. Badly damaged faces are rebuilt from what's left, so compare with the original." },
      { q: "What about torn or folded photos?", a: "Tears, creases, scratches, dust and stains are all repaired. Missing corners are filled to match." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["photo-enhancer", "remove-object-from-photo", "photo-to-cartoon"],
    updated: "2026-11-05",
  },
  {
    slug: "photo-enhancer",
    tool: "enhance",
    action: "Enhance photo",
    icon: "🔍",
    name: "AI photo enhancer and unblur",
    title: "AI photo enhancer: unblur image and make it HD, free",
    description: "Unblur a photo, fix camera shake and noise, upscale to HD or fix dark lighting with AI. Free online photo enhancer that keeps it looking real.",
    h1: "AI photo enhancer",
    accent: "enhancer",
    lede: "Rescue the blurry one. Unblur faces, clean up noise from night shots, sharpen to HD or fix dark lighting, and keep it looking like a real photo.",
    optionLabel: "Fix",
    options: [
      { id: "unblur", label: "Unblur", icon: "🫨" },
      { id: "hd", label: "Make it HD", icon: "✨" },
      { id: "light", label: "Fix the lighting", icon: "💡" },
    ],
    steps: [
      { name: "Add a photo", text: "A blurry, grainy, low-resolution or too-dark photo." },
      { name: "Choose the fix", text: "Unblur, make it HD, or fix the lighting." },
      { name: "Enhance", text: "AI sharpens and cleans the photo in about 15 seconds." },
      { name: "Download", text: "Save the enhanced photo." },
    ],
    tips: [
      { title: "Screenshots and old phones", text: "Make it HD works well on small, compressed photos from chats and old phones." },
      { title: "Night photos", text: "Fix the lighting lifts dark shadows and evens out colour casts from street lights." },
      { title: "Very blurry photos", text: "The AI rebuilds detail that's lost, so faces may differ slightly from the person. Check before you share." },
    ],
    faq: [
      { q: "Is the photo enhancer free?", a: COST },
      { q: "Can AI really unblur a photo?", a: "It removes motion blur and soft focus by rebuilding sharp detail. Slight blur fixes almost perfectly; heavy blur gets a convincing best guess." },
      { q: "Does it make skin look fake?", a: "No. The tool is told to keep real skin texture and not to beautify or smooth faces." },
      { q: "What resolution do I get?", a: "A sharp, full-size JPEG you can download and print." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["restore-old-photos", "ai-headshot-generator", "ai-background-changer"],
    updated: "2026-11-05",
  },
  {
    slug: "ai-headshot-generator",
    tool: "headshot",
    action: "Make my headshot",
    icon: "💼",
    name: "AI headshot generator",
    title: "AI headshot generator free: LinkedIn photo from a selfie",
    description: "Turn a selfie into a professional headshot for LinkedIn, a CV or a team page. Free AI headshot generator: studio, office or outdoor backdrop.",
    h1: "AI headshot generator",
    accent: "headshot",
    lede: "One selfie in, one professional headshot out: smart clothes, flattering light and a clean backdrop, still clearly you.",
    optionLabel: "Style",
    options: [
      { id: "studio", label: "Studio", icon: "📷" },
      { id: "office", label: "Office", icon: "🏢" },
      { id: "outdoor", label: "Outdoor", icon: "🌳" },
      { id: "dark", label: "Dark editorial", icon: "🖤" },
    ],
    steps: [
      { name: "Add a selfie", text: "Face the camera in soft daylight, with nothing covering your face." },
      { name: "Pick a style", text: "Studio grey, a bright office, outdoors, or a dark editorial look." },
      { name: "Generate", text: "AI dresses you smartly, fixes the light and frames a head-and-shoulders shot in about 15 seconds." },
      { name: "Download", text: "Save it for LinkedIn, your CV or your team page." },
    ],
    tips: [
      { title: "The best selfie to use", text: "Eye level, arm's length, facing a window. No sunglasses, hats or heavy filters." },
      { title: "Try two styles", text: "Studio works for most profiles; Office reads friendlier on team pages." },
      { title: "Check it's you", text: "Headshots should look like you on a video call. If one doesn't, try a clearer selfie." },
    ],
    faq: [
      { q: "Is the AI headshot generator free?", a: COST },
      { q: "How many selfies do I need?", a: "One. Unlike training-based headshot apps, there's no upload of 20 photos and no waiting an hour." },
      { q: "Can I use it on LinkedIn?", a: "Yes. Download the photo and upload it as your profile picture. It's your photo to use." },
      { q: "Will it look like me?", a: "The tool keeps your face, features and skin tone; it changes the clothes, light and backdrop." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["ai-background-changer", "photo-enhancer", "ai-outfit-changer"],
    updated: "2026-11-05",
  },
  {
    slug: "ai-hairstyle-changer",
    tool: "hairstyle",
    action: "Try it on",
    icon: "💇",
    name: "AI hairstyle and hair colour changer",
    title: "AI hairstyle changer: try on haircuts and hair colors free",
    description: "Try a new haircut or hair colour on your own photo before the salon: bob, curtain bangs, pixie, curls, blonde, pink and more. Free AI try-on.",
    h1: "Try a new hairstyle with AI",
    accent: "hairstyle",
    lede: "See yourself with a bob, curtain bangs or pink hair before you book. Only your hair changes; your face, makeup and outfit stay put.",
    optionLabel: "Hairstyle or colour",
    options: [
      { id: "curtain-bangs", label: "Curtain bangs", icon: "💁" },
      { id: "bob", label: "Bob", icon: "✂️" },
      { id: "pixie", label: "Pixie cut", icon: "🧚" },
      { id: "waves", label: "Beach waves", icon: "🌊" },
      { id: "curly", label: "Curls", icon: "➰" },
      { id: "braids", label: "Box braids", icon: "🪢" },
      { id: "buzz", label: "Buzz cut", icon: "🪒" },
      { id: "blonde", label: "Honey blonde", icon: "🍯" },
      { id: "pink", label: "Pastel pink", icon: "🩷" },
      { id: "red", label: "Copper red", icon: "🦊" },
      { id: "black", label: "Jet black", icon: "🖤" },
      { id: "silver", label: "Silver", icon: "🩶" },
    ],
    steps: [
      { name: "Add a selfie", text: "Face the camera with your hair visible, in good light." },
      { name: "Pick a cut or colour", text: "Twelve cuts and colours, from a pixie to silver." },
      { name: "Try it on", text: "AI changes only your hair in about 15 seconds." },
      { name: "Download", text: "Save it, or show it to your hairdresser." },
    ],
    tips: [
      { title: "Hair off your face", text: "Pull hair away from your face for the most accurate fit of a short cut." },
      { title: "Colour on your current cut", text: "The colours keep your current style and change only the shade." },
      { title: "Take it to the salon", text: "Save the result and show it at your appointment: it's easier than describing it." },
    ],
    faq: [
      { q: "Is the AI hairstyle changer free?", a: COST },
      { q: "Can I change just my hair colour?", a: "Yes. Pick Honey blonde, Pastel pink, Copper red, Jet black or Silver to keep your cut and change the colour." },
      { q: "Does it change my face?", a: "No. Only the hair changes; the tool keeps your face, makeup, clothes and background." },
      { q: "Does it work for men?", a: "Yes. Try the buzz cut, curls or a colour change on any selfie." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["ai-outfit-changer", "ai-yearbook-photos", "ai-headshot-generator"],
    updated: "2026-11-05",
  },
  {
    slug: "ai-outfit-changer",
    tool: "outfit",
    action: "Change outfit",
    icon: "👗",
    name: "AI outfit changer",
    title: "AI outfit changer: try on clothes in your photo, free",
    description: "Change your outfit in any photo with AI: a suit, streetwear, a Y2K look, an evening outfit and more. Your face and pose stay the same. Free online.",
    h1: "AI outfit changer",
    accent: "outfit",
    lede: "Try a new look without changing clothes: AI dresses you in a suit, streetwear or a Y2K outfit that fits your pose and the light in the photo.",
    optionLabel: "Outfit",
    options: [
      { id: "y2k", label: "Y2K", icon: "🦋" },
      { id: "streetwear", label: "Streetwear", icon: "🧢" },
      { id: "suit", label: "Tailored suit", icon: "🤵" },
      { id: "evening", label: "Evening black", icon: "🖤" },
      { id: "denim", label: "Double denim", icon: "👖" },
      { id: "winter", label: "Wool coat", icon: "🧥" },
      { id: "sporty", label: "Athletic set", icon: "🏃" },
      { id: "wedding-guest", label: "Wedding guest", icon: "💐" },
    ],
    steps: [
      { name: "Add a photo", text: "A half-body or full-body photo works best." },
      { name: "Pick an outfit", text: "Y2K, streetwear, a suit, evening black and more." },
      { name: "Change it", text: "AI dresses you in about 15 seconds, keeping your face, pose and background." },
      { name: "Download", text: "Save the new look." },
    ],
    tips: [
      { title: "Show the outfit", text: "Use a photo where your clothes are visible, not just a close-up of your face." },
      { title: "Planning an event", text: "Try Wedding guest or Evening black before you shop." },
      { title: "Stay in character", text: "Y2K pairs well with the free Y2K filter for a full 2000s look." },
    ],
    faq: [
      { q: "Is the AI outfit changer free?", a: COST },
      { q: "Will my face change?", a: "No. Only the clothes change; your face, body, pose and background stay the same." },
      { q: "Can I upload a specific item of clothing?", a: "Not yet. Pick one of the outfits; more are added over time." },
      { q: "Does it work on full-body photos?", a: "Yes, and those give the most complete outfits." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["ai-hairstyle-changer", "ai-background-changer", "ai-yearbook-photos"],
    updated: "2026-11-05",
  },
  {
    slug: "ai-yearbook-photos",
    tool: "yearbook",
    action: "Make my yearbook photo",
    icon: "🏫",
    name: "AI yearbook photos",
    title: "AI yearbook photo generator: 90s, 80s and 2000s trend",
    description: "The AI yearbook trend from one selfie: your 90s, 80s, 70s or 2000s school yearbook portrait, with the hair, clothes and mottled backdrop. Free.",
    h1: "AI yearbook photos",
    accent: "yearbook",
    lede: "The yearbook trend, from one selfie: pick a decade and get your school portrait with the hair, the outfit and that mottled blue backdrop.",
    optionLabel: "Decade",
    options: [
      { id: "90s", label: "90s", icon: "📼" },
      { id: "80s", label: "80s", icon: "🕺" },
      { id: "2000s", label: "2000s", icon: "📱" },
      { id: "70s", label: "70s", icon: "🌼" },
    ],
    steps: [
      { name: "Add a selfie", text: "Face the camera, head and shoulders, in good light." },
      { name: "Pick a decade", text: "70s, 80s, 90s or 2000s." },
      { name: "Generate", text: "AI makes your yearbook portrait in about 15 seconds." },
      { name: "Download", text: "Post all four decades as a carousel." },
    ],
    tips: [
      { title: "Make the carousel", text: "Run all four decades on the same selfie and post them side by side." },
      { title: "Smile", text: "Yearbook photos are posed. A selfie with a real smile gives the most believable portrait." },
      { title: "Go full nostalgia", text: "Add a date stamp with the free digicam tool for the 2000s one." },
    ],
    faq: [
      { q: "What is the AI yearbook trend?", a: "People turn a selfie into the school yearbook portrait they'd have had in another decade, usually the 90s, and post the results together." },
      { q: "Is it free?", a: COST },
      { q: "Will it look like me?", a: "Yes. The face stays yours; the hair, clothes, backdrop and photo colour change to the decade." },
      { q: "Can I do a group?", a: "Use one selfie per person for the cleanest portraits." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["ai-hairstyle-changer", "photo-to-cartoon", "ai-outfit-changer"],
    updated: "2026-11-05",
  },
  {
    slug: "photo-to-cartoon",
    tool: "cartoon",
    action: "Redraw it",
    icon: "🎨",
    name: "Photo to cartoon",
    title: "Turn photo into cartoon, anime, sketch or painting free",
    description: "Turn your photo into a 3D cartoon, anime, pencil sketch, watercolour or oil painting with AI. Free online, and you stay recognisable.",
    h1: "Turn a photo into a cartoon",
    accent: "cartoon",
    lede: "Redraw any photo as a 3D animated character, anime, a pencil sketch or a painting. Same people, same pose, a whole new medium.",
    optionLabel: "Style",
    options: [
      { id: "3d", label: "3D cartoon", icon: "🧸" },
      { id: "anime", label: "Anime", icon: "🌸" },
      { id: "sketch", label: "Pencil sketch", icon: "✏️" },
      { id: "watercolor", label: "Watercolour", icon: "💧" },
      { id: "oil", label: "Oil painting", icon: "🖼️" },
      { id: "comic", label: "Comic book", icon: "💥" },
    ],
    steps: [
      { name: "Add a photo", text: "A selfie, a couple photo, your pet or a group." },
      { name: "Pick a style", text: "3D cartoon, anime, sketch, watercolour, oil painting or comic." },
      { name: "Redraw it", text: "AI redraws the photo in about 15 seconds." },
      { name: "Download", text: "Use it as an avatar, a gift or a print." },
    ],
    tips: [
      { title: "For an avatar", text: "Use a close-up selfie and the 3D cartoon or anime style." },
      { title: "For a gift", text: "Watercolour and oil painting print beautifully for frames and cards." },
      { title: "Clear faces", text: "Faces that are big and sharp in the photo keep the likeness best." },
    ],
    faq: [
      { q: "Is the photo to cartoon tool free?", a: COST },
      { q: "Will it still look like me?", a: "Yes. The style changes, but face shape, hair and expression are kept so you're recognisable." },
      { q: "Can I cartoon a couple or group photo?", a: "Yes. Everyone in the photo is redrawn in the same style." },
      { q: "Can I use it as a profile picture?", a: "Yes, it's your picture to use." },
      { q: "Are my photos private?", a: PRIVACY },
    ],
    related: ["ai-yearbook-photos", "restore-old-photos", "ai-hairstyle-changer"],
    updated: "2026-11-05",
  },
];

export const aiToolBySlug = (slug: string) => AI_TOOLS.find((t) => t.slug === slug);
