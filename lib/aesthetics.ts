// The "What's your photo aesthetic?" quiz: each result is one of the booth's film groups, so it leads straight to
// real films and AI looks.

import type { FilmGroup } from "./films";

export type Aesthetic = { id: FilmGroup; emoji: string; name: string; text: string; look: string; vibe: string[] };

export const AESTHETICS: Record<FilmGroup, Aesthetic> = {
  booth: {
    id: "booth", emoji: "🎞️", name: "Classic Booth", look: "midnight-flash",
    text: "Timeless and a little mysterious. You like silvery black and white, deep blacks and grain: the strip from a coin-op booth that looks just as good in fifty years.",
    vibe: ["black and white", "grain", "old Hollywood", "vintage photo strips"],
  },
  flash: {
    id: "flash", emoji: "📸", name: "Digicam Flash", look: "disposable-flash",
    text: "The life of the party. Direct flash, bright faces, crisp edges and a date stamp in the corner: a 2000s point-and-shoot at 1 a.m.",
    vibe: ["Y2K", "digicam", "disposable camera", "night out"],
  },
  warm: {
    id: "warm", emoji: "🌅", name: "Golden Film", look: "sun-kissed",
    text: "Nostalgic and sun-soaked. Golden tones, faded blacks, light leaks and dust, like a roll of film found in a drawer from a summer you'll never forget.",
    vibe: ["golden hour", "35mm film", "vintage", "summer"],
  },
  dreamy: {
    id: "dreamy", emoji: "🌸", name: "Soft Dreamy", look: "dreamlight",
    text: "Romantic and gentle. Glow, haze and pastel colour: your photos look like a memory, or the cover of a love song.",
    vibe: ["soft glow", "pastel", "coquette", "romantic"],
  },
  cool: {
    id: "cool", emoji: "🌃", name: "Cool Cinematic", look: "subway-still",
    text: "Moody and effortless. Cooler tones, punchy contrast and the red glow of cinema film: every photo looks like a still from a film.",
    vibe: ["cinematic", "moody", "city at night", "film still"],
  },
};

type Answer = { text: string; to: FilmGroup };

export const QUESTIONS: { q: string; answers: Answer[] }[] = [
  { q: "Pick a Friday night.", answers: [
    { text: "Jazz bar, dressed up", to: "booth" },
    { text: "Club, then a 2 a.m. snack", to: "flash" },
    { text: "Rooftop at sunset", to: "warm" },
    { text: "Candles, a movie and a face mask", to: "dreamy" },
    { text: "A long walk through the city lights", to: "cool" },
  ] },
  { q: "Which colour do you wear the most?", answers: [
    { text: "Black, always", to: "booth" },
    { text: "Silver and anything shiny", to: "flash" },
    { text: "Brown, cream and mustard", to: "warm" },
    { text: "Baby pink and lilac", to: "dreamy" },
    { text: "Navy and grey", to: "cool" },
  ] },
  { q: "Your phone's camera roll is mostly…", answers: [
    { text: "Mirror selfies with flash", to: "flash" },
    { text: "Sunsets and coffee", to: "warm" },
    { text: "Flowers and soft light", to: "dreamy" },
    { text: "Street corners and rainy windows", to: "cool" },
    { text: "Old family photos you scanned", to: "booth" },
  ] },
  { q: "Pick a decade.", answers: [
    { text: "1950s", to: "booth" },
    { text: "1970s", to: "warm" },
    { text: "1990s", to: "cool" },
    { text: "2000s", to: "flash" },
    { text: "A decade that never existed", to: "dreamy" },
  ] },
  { q: "Which song would score your life?", answers: [
    { text: "A crackly old jazz record", to: "booth" },
    { text: "Early-2000s pop", to: "flash" },
    { text: "Soft rock on a road trip", to: "warm" },
    { text: "Dreamy indie with a lot of reverb", to: "dreamy" },
    { text: "A synth movie soundtrack", to: "cool" },
  ] },
  { q: "Your friends would call you…", answers: [
    { text: "Classic", to: "booth" },
    { text: "Chaotic", to: "flash" },
    { text: "Cozy", to: "warm" },
    { text: "A hopeless romantic", to: "dreamy" },
    { text: "Mysterious", to: "cool" },
  ] },
];
