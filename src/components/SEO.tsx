import { Helmet } from "react-helmet-async";

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
  defaultDescription: "Official website of Ta'ang Land Government Immigration Department. ပလောင်းပြည် ရှေ့နေပြည်ထောင်အဖွဲ့မှ ကြိုဆိုပါသည်။ Passport, visa, citizenship services and official announcements.",
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

  return (
    <Helmet htmlAttributes={{ lang: langAttribute }}>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || siteConfig.defaultTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:locale" content={lang === "my" ? "my_MM" : "en_US"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteConfig.defaultTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content={siteConfig.twitterHandle} />

      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="my" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  );
}

export default SEO;
