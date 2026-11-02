import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path: string;
}

const SITE_URL = "https://go-trip.co.in";

export function SEO({ title, description, path }: SEOProps) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`;

    // Browser title
    document.title = title;

    // Create or update meta tags
    const setMeta = (attribute: string, key: string, content: string) => {
      let element = document.head.querySelector(
        `meta[${attribute}="${key}"]`,
      ) as HTMLMetaElement | null;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.content = content;
    };

    // Standard SEO
    setMeta("name", "description", description);
    setMeta("name", "robots", "index, follow");

    // Open Graph
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Go Trip");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    // Canonical URL
    let canonical = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;
  }, [title, description, path]);

  return null;
}
