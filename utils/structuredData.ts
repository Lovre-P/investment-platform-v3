import { Investment } from '../types';

// Organization Schema for MegaInvest
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MegaInvest",
  "url": "https://www.mega-invest.hr",
  "logo": "https://www.mega-invest.hr/images/logo.svg",
  "description": "Croatia's leading investment platform for verified, high-return projects in real estate, technology, and renewable energy.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "HR",
    "addressLocality": "Zagreb"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+385-1-234-5678",
    "contactType": "customer service",
    "email": "info@mega-invest.hr"
  },
  "sameAs": [
    "https://www.linkedin.com/company/megainvest",
    "https://www.facebook.com/megainvest"
  ]
};

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MegaInvest",
  "url": "https://www.mega-invest.hr",
  "description": "Discover exclusive investment opportunities in real estate, technology, and renewable energy.",
  "publisher": {
    "@type": "Organization",
    "name": "MegaInvest"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.mega-invest.hr/investments?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Investment Opportunity Schema
export const createInvestmentSchema = (investment: Investment) => {
  return {
    "@context": "https://schema.org",
    "@type": "InvestmentOrOpportunity",
    "name": investment.title,
    "description": investment.description,
    "url": `https://www.mega-invest.hr/investments/${investment.id}`,
    "image": investment.images?.[0] || "https://www.mega-invest.hr/images/logo.svg",
    "category": investment.category,
    "investmentAmount": {
      "@type": "MonetaryAmount",
      "currency": investment.currency,
      "value": investment.amountGoal
    },
    "minimumInvestment": {
      "@type": "MonetaryAmount", 
      "currency": investment.currency,
      "value": investment.minInvestment || 1000
    },
    "expectedReturn": investment.apyRange,
    "investmentTerm": investment.term,
    "riskLevel": "Medium", // You can make this dynamic based on category
    "provider": {
      "@type": "Organization",
      "name": "MegaInvest"
    },
    "datePublished": investment.submissionDate,
    "status": investment.status
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
      "item": `https://www.mega-invest.hr${crumb.url}`
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
    "url": `https://www.mega-invest.hr${url}`,
    "image": image || "https://www.mega-invest.hr/images/logo.svg",
    "datePublished": datePublished || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "MegaInvest"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MegaInvest",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.mega-invest.hr/images/logo.svg"
      }
    }
  };
};
