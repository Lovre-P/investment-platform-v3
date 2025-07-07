import { Investment } from '../types';
import { SITE_CONFIG } from '../config/siteConfig';

// Organization Schema for MegaInvest
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SITE_CONFIG.name,
  "url": SITE_CONFIG.url,
  "logo": SITE_CONFIG.logo,
  "description": SITE_CONFIG.description,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": SITE_CONFIG.contact.address.country,
    "addressLocality": SITE_CONFIG.contact.address.locality,
    "addressRegion": SITE_CONFIG.contact.address.region
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": SITE_CONFIG.contact.phone,
    "contactType": "customer service",
    "email": SITE_CONFIG.contact.email
  },
  "sameAs": SITE_CONFIG.socialLinks
};

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_CONFIG.name,
  "url": SITE_CONFIG.url,
  "description": SITE_CONFIG.seo.defaultDescription,
  "publisher": {
    "@type": "Organization",
    "name": SITE_CONFIG.name
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_CONFIG.url}/investments?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

// Investment Opportunity Schema
export const createInvestmentSchema = (investment: Investment) => {
  if (!investment || !investment.title || !investment.description) {
    console.warn('Invalid investment data: title and description are required');
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://www.mega-invest.hr/investments/${investment.id}`,
    "name": investment.title,
    "description": investment.description,
    "url": `${SITE_CONFIG.url}/investments/${investment.id}`,
    "image": investment.images?.[0] || SITE_CONFIG.logo,
    "category": investment.category,
    "serviceType": "Investment Opportunity",
    "offers": {
      "@type": "Offer",
      "price": investment.amountGoal,
      "priceCurrency": investment.currency,
      "availability": investment.status === 'Open' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Minimum Investment",
        "value": investment.minInvestment || 1000,
        "unitCode": investment.currency
      },
      {
        "@type": "PropertyValue",
        "name": "Expected Return",
        "value": investment.apyRange || "Contact for details"
      },
      {
        "@type": "PropertyValue",
        "name": "Investment Term",
        "value": investment.term || "Contact for details"
      }
    ],
    "provider": {
      "@type": "Organization",
      "name": SITE_CONFIG.name
    },
    "datePublished": investment.submissionDate
  };
};

// Breadcrumb Schema
export const createBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${SITE_CONFIG.url}${crumb.url}`
    }))
  };
};

// FAQ Schema (for pages with FAQs)
export const createFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Article Schema (for blog posts or detailed content)
export const createArticleSchema = (title: string, description: string, url: string, image?: string, datePublished?: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": `${SITE_CONFIG.url}${url}`,
    "image": image || SITE_CONFIG.logo,
    "datePublished": datePublished || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": SITE_CONFIG.name
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "logo": {
        "@type": "ImageObject",
        "url": SITE_CONFIG.logo
      }
    }
  };
};
