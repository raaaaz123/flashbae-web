// Photo booth pose ideas: the pose generator game deals from these, and the page lists them all as text.

export type Crowd = "solo" | "couple" | "friends";

export type Pose = { emoji: string; name: string; tip: string };

export const CROWDS: { id: Crowd; label: string; title: string }[] = [
  { id: "solo", label: "Just me", title: "Solo photo booth poses" },
  { id: "couple", label: "Two of us", title: "Couple photo booth poses" },
  { id: "friends", label: "Friends", title: "Group photo booth poses" },
];

export const POSES: Record<Crowd, Pose[]> = {
  solo: [
    { emoji: "😗", name: "The pout", tip: "Lips forward, eyes to the lens, chin slightly down." },
    { emoji: "🤭", name: "Caught laughing", tip: "Hand over your mouth, eyes closed, mid-giggle." },
    { emoji: "✌️", name: "Peace by the eye", tip: "A peace sign next to one eye, head tilted the other way." },
    { emoji: "😱", name: "Home Alone", tip: "Both hands on your cheeks, mouth wide open." },
    { emoji: "🙈", name: "Peekaboo", tip: "Cover your face with both hands and peek through your fingers." },
    { emoji: "😎", name: "Too cool", tip: "Look past the camera, chin up, no smile at all." },
    { emoji: "💋", name: "Blow a kiss", tip: "Kiss your palm and blow it straight at the lens." },
    { emoji: "🫶", name: "Heart hands", tip: "Make a heart with your hands right in front of the camera." },
    { emoji: "🤔", name: "Deep thinker", tip: "Fist under your chin, eyes up at the ceiling." },
    { emoji: "🐟", name: "Fish face", tip: "Suck your cheeks in and go wide-eyed." },
    { emoji: "💇", name: "Hair flip", tip: "Flip your hair mid-shot so it's caught in the air." },
    { emoji: "😴", name: "Fake nap", tip: "Head on your hands, eyes shut, totally asleep." },
    { emoji: "🤳", name: "Over the shoulder", tip: "Turn away, then look back at the lens over your shoulder." },
    { emoji: "😤", name: "Mad face", tip: "Cross your arms and give the camera your best glare." },
  ],
  couple: [
    { emoji: "😘", name: "Cheek kiss", tip: "One kisses the other's cheek while they grin at the camera." },
    { emoji: "👃", name: "Nose to nose", tip: "Touch noses and look at each other, not the lens." },
    { emoji: "🫶", name: "Shared heart", tip: "Each make half a heart with one hand and join them in the middle." },
    { emoji: "🙄", name: "Over it", tip: "One smiles sweetly, the other rolls their eyes." },
    { emoji: "🤫", name: "The secret", tip: "One whispers in the other's ear; the listener looks shocked." },
    { emoji: "💏", name: "The real kiss", tip: "Save it for the last frame." },
    { emoji: "🤗", name: "Bear hug", tip: "Squeeze each other tight and both look at the camera." },
    { emoji: "🫣", name: "Hide and seek", tip: "One hides behind the other, peeking out over a shoulder." },
    { emoji: "😝", name: "Silly faces", tip: "Both pull the weirdest face you can, at the same time." },
    { emoji: "🥰", name: "Forehead touch", tip: "Foreheads together, eyes closed, soft smiles." },
    { emoji: "😮", name: "Shocked together", tip: "Both mouths open, both hands up, like you just heard gossip." },
    { emoji: "👀", name: "Side eye", tip: "Face the camera but look at each other out of the corner of your eyes." },
    { emoji: "💍", name: "The proposal", tip: "One shows off a pretend ring; the other acts amazed." },
    { emoji: "🍿", name: "Back to back", tip: "Stand back to back, arms crossed, like a movie poster." },
  ],
  friends: [
    { emoji: "🏃", name: "Squeeze in", tip: "Everyone crams into the frame; faces at all different heights." },
    { emoji: "😱", name: "Group scream", tip: "Everyone screams at the camera at once." },
    { emoji: "👉", name: "Point at one", tip: "Everyone points at the same person; they act innocent." },
    { emoji: "🙏", name: "Prayer circle", tip: "Hands together, eyes closed, very serious." },
    { emoji: "🧍", name: "Totem pole", tip: "Stack your faces one above the other." },
    { emoji: "🙈", name: "See, hear, speak no evil", tip: "Cover eyes, ears and mouth; extra friends cover someone else's." },
    { emoji: "📸", name: "Paparazzi", tip: "Everyone takes a picture of one friend posing like a star." },
    { emoji: "💪", name: "Flex", tip: "Everyone flexes their arms, the stronger-looking the better." },
    { emoji: "🌊", name: "The wave", tip: "Lean in a line from one side to the other, like a stadium wave." },
    { emoji: "🤪", name: "Ugliest face wins", tip: "Everyone pulls their worst face. Vote after." },
    { emoji: "😇", name: "Angels", tip: "Halo fingers over your heads, sweet innocent smiles." },
    { emoji: "🤫", name: "Gossip line", tip: "Everyone whispers to the person next to them." },
    { emoji: "💃", name: "Dance break", tip: "Everyone freezes mid-dance move." },
    { emoji: "🎤", name: "Album cover", tip: "Stand tall, stare past the camera, like the band's first record." },
  ],
};
