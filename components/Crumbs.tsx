import { NAME, SITE_URL } from "@/lib/site";

type Crumb = { name: string; path: string };

/** The visible trail; `crumbSchema` gives search engines the same trail. The last crumb is the current page. */
export default function Crumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <a href="/">{NAME}</a>
      {trail.map((c, i) => (
        <span key={c.path}>
          {" "}<span aria-hidden="true">/</span>{" "}
          {i === trail.length - 1 ? <span aria-current="page">{c.name}</span> : <a href={c.path}>{c.name}</a>}
        </span>
      ))}
    </nav>
  );
}

export const crumbSchema = (trail: Crumb[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: NAME, path: "/" }, ...trail].map((c, i) => ({
    "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.path}`,
  })),
});
