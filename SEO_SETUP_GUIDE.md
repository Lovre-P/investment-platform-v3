# SEO Setup Guide for MegaInvest Platform

## 🎯 Overview
This guide covers the complete SEO implementation for your investment platform at www.mega-invest.hr.

## ✅ What's Already Implemented

### 1. Technical SEO Foundation
- ✅ `robots.txt` with proper crawling rules
- ✅ Dynamic sitemap generation (`scripts/generate-sitemap.js`)
- ✅ Favicon set (complete with all sizes)
- ✅ Performance optimizations (preloading, DNS prefetch)
- ✅ Canonical URLs on all pages

### 2. Meta Tags & Open Graph
- ✅ Dynamic SEO component (`components/SEO/SEOHead.tsx`)
- ✅ Investment-specific meta titles and descriptions
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Breadcrumb navigation with structured data

### 3. Structured Data (Schema.org)
- ✅ Organization schema for MegaInvest
- ✅ Website schema with search functionality
- ✅ Investment opportunity schema for each investment
- ✅ Breadcrumb schema for navigation
- ✅ FAQ schema for contact page

### 4. Performance Optimizations
- ✅ Image optimization component (`components/OptimizedImage.tsx`)
- ✅ Lazy loading for images
- ✅ Resource preloading for critical assets
- ✅ Performance monitoring utilities

### 5. Analytics & Monitoring
- ✅ Google Analytics 4 integration
- ✅ Google Search Console verification
- ✅ SEO monitoring and validation tools
- ✅ Event tracking for investments and forms

## 🔧 Required Setup Steps

### 1. Environment Variables Configuration (CRITICAL)

**For Production Deployment**, you MUST set these environment variables:

```bash
# Google Analytics 4 Measurement ID
VITE_GA_MEASUREMENT_ID=G-YOUR-ACTUAL-ID

# Google Search Console Verification Code
VITE_SEARCH_CONSOLE_VERIFICATION=your-actual-verification-code

# Production Site URL (for sitemap generation)
VITE_SITE_URL=https://www.mega-invest.hr
```

#### How to Set Environment Variables:

**Railway Deployment:**
1. Go to your Railway project dashboard
2. Navigate to Variables tab
3. Add each variable with its value
4. Redeploy your application

**Local Development:**
1. Copy `.env.example` to `.env`
2. Update the values in `.env` file
3. Restart your development server

**Other Hosting Providers:**
- **Vercel**: Add in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Environment Variables
- **Render**: Add in Environment tab of your service

### 2. Google Analytics 4 Setup
1. Create a GA4 property at https://analytics.google.com
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Set the `VITE_GA_MEASUREMENT_ID` environment variable
4. **Important**: Analytics will NOT work without this environment variable!

### 3. Google Search Console Setup
1. Go to https://search.google.com/search-console
2. Add property for www.mega-invest.hr
3. Get verification code (long string of letters/numbers)
4. Set the `VITE_SEARCH_CONSOLE_VERIFICATION` environment variable
5. **Important**: Search Console verification will NOT work without this!

### 4. Sitemap Submission
1. Build and deploy your site to generate sitemap
2. Submit https://www.mega-invest.hr/sitemap.xml to:
   - Google Search Console
   - Bing Webmaster Tools (optional)

### 5. Social Media Setup
Update `utils/structuredData.ts` with your actual social media profiles:
```typescript
"sameAs": [
  "https://www.linkedin.com/company/your-actual-linkedin",
  "https://www.facebook.com/your-actual-facebook"
]
```

## 📊 SEO Monitoring

### Development Mode
- SEO analysis runs automatically in development
- Check browser console for SEO reports
- Validates meta tags, structured data, and performance

### Production Monitoring
1. Set up Google Search Console alerts
2. Monitor Core Web Vitals in GA4
3. Track keyword rankings with tools like:
   - Google Search Console
   - SEMrush
   - Ahrefs

## 🎯 Key SEO Features by Page

### Homepage (/)
- Optimized for "investment opportunities Croatia"
- Organization and Website structured data
- Hero image preloading for performance

### Investments List (/investments)
- Optimized for "verified investment projects"
- Breadcrumb navigation
- Filter and search functionality

### Investment Details (/investments/:id)
- Dynamic meta tags from investment data
- Investment opportunity structured data
- Social sharing optimization

### About Page (/about)
- Company information and values
- Organization structured data
- Local business optimization (Šibenik location)

### Contact Page (/contact)
- FAQ structured data for better search features
- Local business contact information
- Office location with map integration

## 🚀 Performance Optimizations

### Images
- Use `OptimizedImage` component for all images
- Automatic lazy loading (except priority images)
- WebP format support
- Proper alt text for accessibility

### Loading Speed
- Critical resource preloading
- DNS prefetch for external domains
- Optimized font loading
- Minimal JavaScript bundles

## 📈 Expected SEO Benefits

### Search Visibility
- Better rankings for investment-related keywords
- Rich snippets in search results
- Enhanced social media sharing

### User Experience
- Faster page load times
- Better mobile experience
- Clear navigation with breadcrumbs

### Analytics Insights
- Track user behavior and conversions
- Monitor investment page performance
- Identify popular content and features

## ⚠️ Troubleshooting Environment Variables

### How to Check if Environment Variables are Set

**In Browser Console (Production):**
```javascript
// Check if GA is working
console.log('GA ID:', window.gtag ? 'Loaded' : 'Not loaded');

// Check for warnings
// Look for: "⚠️ Google Analytics ID not configured for production"
// Look for: "⚠️ Search Console verification not configured for production"
```

**Common Issues:**
- **Analytics not tracking**: `VITE_GA_MEASUREMENT_ID` not set or still placeholder
- **Search Console not verified**: `VITE_SEARCH_CONSOLE_VERIFICATION` not set
- **Sitemap generation fails**: `VITE_SITE_URL` not set correctly

### Environment Variable Format Examples:
```bash
# ✅ Correct format
VITE_GA_MEASUREMENT_ID=G-ABC123DEF4
VITE_SEARCH_CONSOLE_VERIFICATION=abc123def456ghi789jkl012mno345pqr678stu
VITE_SITE_URL=https://www.mega-invest.hr

# ❌ Wrong - still placeholders
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SEARCH_CONSOLE_VERIFICATION=your-google-search-console-verification-code
```

## 🔍 Next Steps

1. **Set environment variables** (CRITICAL - see above)
2. **Set up analytics accounts** (GA4 & Search Console)
3. **Deploy to production** and verify environment variables work
4. **Submit sitemap** to search engines
5. **Monitor performance** and rankings

## 📞 Support

For SEO-related questions or issues:
- Check browser console for SEO analysis reports
- Review Google Search Console for crawling issues
- Monitor GA4 for performance metrics

---

**Note**: All SEO implementations are production-ready and follow current best practices for 2024. The system is designed to be minimal and safe for your existing production deployment.
