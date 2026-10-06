// The site's languages and the few words the shared chrome (header, footer, download button) needs in each.
// English is the full site; Japanese and Korean each have a home page built from the App Store listings' copy.

export type Locale = "en" | "ja" | "ko";

export const LOCALES: { id: Locale; label: string; home: string }[] = [
  { id: "en", label: "English", home: "/" },
  { id: "ja", label: "日本語", home: "/ja/" },
  { id: "ko", label: "한국어", home: "/ko/" },
];

/** hreflang alternates for the home pages, the only pages that exist in every language. */
export const HOME_ALTERNATES = { en: "/", ja: "/ja/", ko: "/ko/", "x-default": "/" };

type Chrome = {
  nav: { href: string; label: string }[];
  getApp: string;
  download: string;
  tagline: string;
  skip: string;
  homeLabel: string;
  footer: { explore: string; help: string; language: string; faq: string; support: string; privacy: string; terms: string };
};

export const CHROME: Record<Locale, Chrome> = {
  en: {
    nav: [
      { href: "/looks/", label: "Looks" },
      { href: "/photo-booth-app/", label: "Photo booth" },
      { href: "/online-photo-booth/", label: "Try it online" },
      { href: "/films/", label: "Films" },
      { href: "/guides/", label: "Guides" },
    ],
    getApp: "Get the app",
    download: "Download on the App Store",
    tagline: "The photo booth in your pocket, for iPhone and iPad.",
    skip: "Skip to content",
    homeLabel: "Flashbae home",
    footer: { explore: "Explore", help: "Help", language: "Language", faq: "Questions", support: "Support", privacy: "Privacy", terms: "Terms" },
  },
  ja: {
    nav: [
      { href: "/ja/#looks", label: "AIルック" },
      { href: "/ja/#booth", label: "フォトブース" },
      { href: "/ja/#together", label: "ふたりで" },
      { href: "/ja/#faq", label: "よくある質問" },
    ],
    getApp: "アプリを入手",
    download: "App Storeからダウンロード",
    tagline: "ポケットの中のフォトブース。iPhone・iPad対応。",
    skip: "本文へスキップ",
    homeLabel: "Flashbae ホーム",
    footer: { explore: "見る", help: "ヘルプ", language: "言語", faq: "よくある質問", support: "サポート", privacy: "プライバシー", terms: "利用規約" },
  },
  ko: {
    nav: [
      { href: "/ko/#looks", label: "AI 룩" },
      { href: "/ko/#booth", label: "포토부스" },
      { href: "/ko/#together", label: "함께 찍기" },
      { href: "/ko/#faq", label: "자주 묻는 질문" },
    ],
    getApp: "앱 받기",
    download: "App Store에서 다운로드",
    tagline: "주머니 속 포토부스. iPhone·iPad용.",
    skip: "본문으로 건너뛰기",
    homeLabel: "Flashbae 홈",
    footer: { explore: "둘러보기", help: "도움말", language: "언어", faq: "자주 묻는 질문", support: "지원", privacy: "개인정보", terms: "이용약관" },
  },
};
