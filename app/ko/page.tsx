import type { Metadata } from "next";
import LocalHome from "@/components/LocalHome";
import { HOME_ALTERNATES } from "@/lib/i18n";

export const metadata: Metadata = { alternates: { canonical: "/ko/", languages: HOME_ALTERNATES } };

export default function Home() {
  return <LocalHome locale="ko" />;
}
