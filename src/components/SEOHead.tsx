/**
 * SEOHead — helper that builds the head() metadata array for a TanStack route.
 *
 * TanStack Start renders <HeadContent /> in the SSR shell; per-route head()
 * config is the correct, SSR-safe way to set title/description/canonical
 * (react-helmet-async is client-only and would leave crawlers with blank tags).
 *
 * Usage inside a route file:
 *
 *   export const Route = createFileRoute("/")({
 *     head: () => seoHead({
 *       title: "XTREME CLOTHING — Premium SA Streetwear",
 *       description: "...",
 *       canonical: "/",
 *       image: heroImg,
 *     }),
 *     component: Page,
 *   });
 */
export interface SEOHeadInput {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: "website" | "article" | "product";
}

export function seoHead({
  title,
  description,
  canonical,
  image,
  type = "website",
}: SEOHeadInput) {
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: canonical },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push(
      { property: "og:image", content: image },
      { name: "twitter:image", content: image },
    );
  }
  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}
