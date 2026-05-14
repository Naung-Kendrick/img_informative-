import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  pathname?: string;
  image?: string;
  type?: string;
  lang?: "en" | "my";
  noindex?: boolean;
}

const siteConfig = {
  siteName: "Ta'ang Land Immigration",
  defaultTitle: "Ta'ang Land Government of Immigration Department | Official Portal",
  defaultDescription: "Official website of Ta'ang Land Government Immigration Department | တီုင်စေတ်မေန်းတိုအီး အဆိုးယကပီုန်တအာင်း | တအာင်းပြည်အစိုးရ လူဝင်မှုကြီးကြပ်‌ရေး ဌာန",
  defaultKeywords: "Ta'ang Land, Immigration Department, Palaung, Myanmar Immigration, Passport, Visa, Citizenship, Ta'ang, ပလောင်ပြည်, ရှေ့နေပြည်ထောင်, ပလောင်, ပလောင်းပြည်, မြန်မာ, taang immigration, taang land immigration, taang img, taang IDTL, idtl, IDTL, NOH Portal, taangland, ta'ang government, ta'ang state",
  siteUrl: "https://www.taanglandimmigration.org",
  defaultImage: "/images/web_logo.jpg",
  twitterHandle: "@TaangImmigration",
};

export function SEO({
  title,
  description,
  keywords,
  pathname = "",
  image,
  type = "website",
  lang = "en",
  noindex = false,
}: SEOProps) {
  const seoTitle = title ? `${title} | ${siteConfig.siteName}` : siteConfig.defaultTitle;
  const seoDescription = description || siteConfig.defaultDescription;
  const seoKeywords = keywords || siteConfig.defaultKeywords;
  const seoImage = image ? (image.startsWith("http") ? image : `${siteConfig.siteUrl}${image}`) : `${siteConfig.siteUrl}${siteConfig.defaultImage}`;
  const canonicalUrl = pathname ? `${siteConfig.siteUrl}${pathname}` : siteConfig.siteUrl;
  const langAttribute = lang === "my" ? "my" : "en";

  useEffect(() => {
    // Update document language
    document.documentElement.lang = langAttribute;

    // Update title
    document.title = seoTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.head.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        if (property) {
          meta.setAttribute("property", name);
        } else {
          meta.name = name;
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic Meta Tags
    updateMetaTag("description", seoDescription);
    updateMetaTag("keywords", seoKeywords);
    updateMetaTag("author", siteConfig.siteName);
    updateMetaTag("language", "English, Burmese");
    updateMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Open Graph
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:title", title || siteConfig.defaultTitle, true);
    updateMetaTag("og:description", seoDescription, true);
    updateMetaTag("og:image", seoImage, true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:site_name", siteConfig.siteName, true);
    updateMetaTag("og:locale", lang === "my" ? "my_MM" : "en_US", true);

    // Twitter Card
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title || siteConfig.defaultTitle);
    updateMetaTag("twitter:description", seoDescription);
    updateMetaTag("twitter:image", seoImage);
    updateMetaTag("twitter:site", siteConfig.twitterHandle);

    // Canonical URL
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Language Alternates
    const hrefLangs = ["en", "my", "x-default"];
    hrefLangs.forEach((hreflang) => {
      const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
      let link = document.head.querySelector(selector) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    });

    // Cleanup function to reset to defaults when component unmounts
    return () => {
      document.title = siteConfig.defaultTitle;
    };
  }, [seoTitle, seoDescription, seoKeywords, seoImage, canonicalUrl, langAttribute, lang, type, title, noindex]);

  // This component doesn't render anything visible
  return null;
}

export default SEO;
