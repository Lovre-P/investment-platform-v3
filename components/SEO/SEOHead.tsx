import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: object;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'MegaInvest - Premium Investment Opportunities Platform',
  description = 'Discover exclusive investment opportunities in real estate, technology, and renewable energy. Join Croatia\'s leading investment platform for verified, high-return projects.',
  keywords = ['investment', 'Croatia', 'real estate', 'technology', 'renewable energy', 'funding', 'opportunities'],
  image = 'https://www.mega-invest.hr/images/logo.svg',
  url = 'https://www.mega-invest.hr',
  type = 'website',
  structuredData,
  noIndex = false
}) => {
  const fullTitle = title.includes('MegaInvest') ? title : `${title} | MegaInvest`;
  const canonicalUrl = url.startsWith('http') ? url : `https://www.mega-invest.hr${url}`;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Helper function to set link tags
    const setLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Basic Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords.join(', '));
    setMetaTag('author', 'MegaInvest');
    setMetaTag('language', (document.documentElement.getAttribute('lang') || 'en') === 'en' ? 'English' : document.documentElement.getAttribute('lang') || 'en');
    setMetaTag('revisit-after', '7 days');

    // Robots
    setMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Canonical URL
    setLinkTag('canonical', canonicalUrl);

    // Open Graph Tags
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', 'MegaInvest', true);
    // Derive locale for OG from current <html lang>
    const lang = document.documentElement.getAttribute('lang') || 'en';
    const ogLocale = lang === 'hr' ? 'hr_HR' :
                     lang === 'de' ? 'de_DE' :
                     lang === 'fr' ? 'fr_FR' :
                     lang === 'it' ? 'it_IT' : 'en_US';
    setMetaTag('og:locale', ogLocale, true);

    // Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Structured Data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // Note: We don't remove meta tags on unmount as they should persist
      // This is different from react-helmet behavior but more appropriate for SEO
    };
  }, [fullTitle, description, keywords, image, canonicalUrl, type, structuredData, noIndex]);

  return null; // This component doesn't render anything visible
};

export default SEOHead;
