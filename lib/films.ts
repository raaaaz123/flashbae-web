// The booth's film looks, as the app ships them (Flashbie/Features/Booth/BoothKit.swift → BoothFilm.all).
// Descriptions are written from each film's recipe: its grade, grain, flash, glow, halation, leaks and dust.
// Keep in step with the app when films are added or renamed.

export type FilmGroup = "booth" | "flash" | "warm" | "dreamy" | "cool";

export type Film = { id: string; title: string; group: FilmGroup; free: boolean; text: string };

export const FILM_GROUPS: { id: FilmGroup; title: string; intro: string }[] = [
  { id: "booth", title: "Classic booth and black & white",
    intro: "Silvery mono, deep blacks and grain: the strip you'd get from a coin-op booth, from the 1930s on." },
  { id: "flash", title: "Flash and digicam",
    intro: "Direct flash, bright faces and crisp edges, like a compact digital camera or a disposable at a party." },
  { id: "warm", title: "Warm and vintage film",
    intro: "Golden tones, faded blacks, light leaks and dust, inspired by consumer film stocks and old prints." },
  { id: "dreamy", title: "Soft and dreamy",
    intro: "Glow, haze and pastel colour for a softer, romantic strip." },
  { id: "cool", title: "Cool and cinematic",
    intro: "Cooler tones, punchy contrast and the halation of cinema film." },
];

export const FILMS: Film[] = [
  // Classic booth and black & white
  { id: "photobooth", title: "Photobooth", group: "booth", free: true,
    text: "The classic booth strip: silvery black and white, flash-bright faces, deep blacks and soft dark corners." },
  { id: "booth30s", title: "1930s Booth", group: "booth", free: true,
    text: "An old booth strip with heavy grain, dust specks, faded blacks and dark corners." },
  { id: "bw", title: "B&W", group: "booth", free: true,
    text: "Clean, high-contrast black and white with visible grain." },
  { id: "sepia", title: "Sepia", group: "booth", free: true,
    text: "Warm brown monochrome with grain and a little dust, like a print from a family album." },
  { id: "boothsepia", title: "Booth Sepia", group: "booth", free: false,
    text: "A warm-toned booth strip: sepia mono, a flash on the faces, grain, dust and vignette." },
  { id: "tintype", title: "Tintype", group: "booth", free: false,
    text: "Cool, contrasty monochrome with heavy grain, dark edges and dust, after 19th-century metal plates." },
  { id: "noirflash", title: "Noir Flash", group: "booth", free: false,
    text: "Hard black and white lit by a strong direct flash: a night-out photo in mono." },
  { id: "silver", title: "Silver", group: "booth", free: false,
    text: "A bright, silvery black and white with plenty of grain." },
  // Flash and digicam
  { id: "flashglow", title: "Flash Glow", group: "flash", free: true,
    text: "The flash-in-the-dark booth look: a warm flash, glowing skin and a soft vignette." },
  { id: "ccd", title: "CCD Cam", group: "flash", free: true,
    text: "A compact digital camera from the 2000s: cool, crisp colour and a blown-out flash." },
  { id: "instax", title: "Instax", group: "flash", free: true,
    text: "Bright instant-camera colour with a gentle flash and a soft glow." },
  { id: "y2kdigi", title: "Y2K Digicam", group: "flash", free: false,
    text: "Punchy, saturated digicam colour with a strong flash and dark corners." },
  { id: "disposable", title: "Disposable", group: "flash", free: false,
    text: "A throwaway camera at a party: flash, grain and that slightly off colour." },
  // Warm and vintage film
  { id: "lightleak", title: "Light Leak", group: "warm", free: true,
    text: "Warm, faded colour with a light leak bleeding in from the corner, like an old camera back." },
  { id: "polaroid", title: "Polaroid", group: "warm", free: true,
    text: "Soft, low-contrast instant-film colour with bright highlights, a faint pink cast and a vignette." },
  { id: "faded70s", title: "Faded 70s", group: "warm", free: true,
    text: "Washed-out, warm colour with lifted blacks and grain, like a print that's been in a drawer for decades." },
  { id: "dusty90s", title: "Dusty 90s", group: "warm", free: false,
    text: "Warm 90s snapshot colour with dust, a faint light leak and grain." },
  { id: "expired", title: "Expired Film", group: "warm", free: false,
    text: "A roll past its date: a green shift, faded colour, a light leak, grain and dust." },
  { id: "kodachrome", title: "Kodachrome", group: "warm", free: false,
    text: "Rich, saturated colour with strong reds and deep blue skies." },
  { id: "portra", title: "Portra 400", group: "warm", free: false,
    text: "Gentle portrait-film colour: warm, soft highlights and natural skin." },
  { id: "gold", title: "Gold 200", group: "warm", free: false,
    text: "Golden, saturated everyday-film colour with grain." },
  { id: "honey", title: "Honey", group: "warm", free: false,
    text: "A honey-warm grade with grain." },
  { id: "cherrycola", title: "Cherry Cola", group: "warm", free: false,
    text: "Warm colour with boosted reds and a soft vignette." },
  // Soft and dreamy
  { id: "dreamy", title: "Dreamy", group: "dreamy", free: false,
    text: "A strong glow, soft highlights and warm, faded colour." },
  { id: "pinkhaze", title: "Pink Haze", group: "dreamy", free: false,
    text: "A rosy tint with a heavy glow." },
  { id: "rose", title: "Rosé", group: "dreamy", free: false,
    text: "A blush-pink grade with a light glow." },
  { id: "tumblr", title: "Tumblr 2014", group: "dreamy", free: false,
    text: "Faded, cool, slightly pink colour: the soft-grunge photo of the 2010s." },
  // Cool and cinematic
  { id: "cinestill", title: "800T", group: "cool", free: false,
    text: "Cool tungsten cinema film with a red halo around bright lights (halation). Made for night photos." },
  { id: "superia", title: "Superia", group: "cool", free: false,
    text: "Everyday film colour with green-leaning tones and grain." },
  { id: "cine", title: "Cine", group: "cool", free: false,
    text: "A cinematic teal grade with grain." },
  { id: "polar", title: "Polar", group: "cool", free: false,
    text: "A cold, clean blue grade." },
  { id: "bleach", title: "Bleach", group: "cool", free: false,
    text: "Bleach-bypass: low saturation and very high contrast." },
  { id: "lomo", title: "Lomo", group: "cool", free: false,
    text: "Saturated, contrasty colour with heavy dark corners, like a toy camera." },
];
