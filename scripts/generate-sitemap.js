#!/usr/bin/env node

/**
 * Sitemap Generator for MegaInvest Platform
 * Generates XML sitemap with static pages and dynamic investment pages
 */

import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://www.mega-invest.hr';
const OUTPUT_PATH = 'public/sitemap.xml';

// Static pages configuration
const staticPages = [
  {
    url: '/',
    changefreq: 'daily',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/investments',
    changefreq: 'daily',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/submit-investment',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/terms',
    changefreq: 'yearly',
    priority: '0.3',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/privacy',
    changefreq: 'yearly',
    priority: '0.3',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Function to fetch investments from API (for dynamic sitemap generation)
async function fetchInvestments() {
  try {
    // In production, this would make an API call
    // For now, we'll return sample investment IDs
    // You can modify this to fetch from your actual API
    return [
      { id: '1', lastmod: new Date().toISOString().split('T')[0] },
      { id: '2', lastmod: new Date().toISOString().split('T')[0] }
    ];
  } catch (error) {
    console.warn('Could not fetch investments for sitemap:', error.message);
    return [];
  }
}

// Generate XML sitemap
async function generateSitemap() {
  console.log('🗺️  Generating sitemap...');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add dynamic investment pages
  const investments = await fetchInvestments();
  investments.forEach(investment => {
    xml += `  <url>
    <loc>${DOMAIN}/investments/${investment.id}</loc>
    <lastmod>${investment.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  xml += '</urlset>';

  // Write sitemap to file
  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  
  console.log(`✅ Sitemap generated successfully at ${OUTPUT_PATH}`);
  console.log(`📊 Total URLs: ${staticPages.length + investments.length}`);
  console.log(`🔗 Static pages: ${staticPages.length}`);
  console.log(`💼 Investment pages: ${investments.length}`);
}

// Run the generator
generateSitemap().catch(console.error);
