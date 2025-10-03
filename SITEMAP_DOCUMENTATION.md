# BRANA KIDS Website Sitemap Documentation

## Overview
This document provides a comprehensive overview of the BRANA KIDS website structure and sitemap implementation.

## Website Structure

### Main Pages (High Priority)
- **Homepage** (`/`) - Priority: 1.0, Change Frequency: Daily
- **All Products** (`/products`) - Priority: 0.9, Change Frequency: Daily
- **Deals** (`/deals`) - Priority: 0.8, Change Frequency: Daily

### Product Pages (High Priority)
- **Individual Product Pages** (`/product/[id]`) - Priority: 0.8, Change Frequency: Weekly
- **Category Pages** (`/category/[slug]`) - Priority: 0.7, Change Frequency: Weekly

### Support & Information Pages (Medium Priority)
- **Contact Us** (`/contact`) - Priority: 0.7, Change Frequency: Monthly
- **FAQ** (`/faq`) - Priority: 0.6, Change Frequency: Monthly
- **About Us** (`/about`) - Priority: 0.6, Change Frequency: Monthly
- **Blog** (`/blog`) - Priority: 0.6, Change Frequency: Weekly

### Service Pages (Medium Priority)
- **Shipping Information** (`/shipping`) - Priority: 0.5, Change Frequency: Monthly
- **Returns & Exchanges** (`/returns`) - Priority: 0.5, Change Frequency: Monthly
- **Warranty** (`/warranty`) - Priority: 0.5, Change Frequency: Monthly

### Company Pages (Lower Priority)
- **Careers** (`/careers`) - Priority: 0.4, Change Frequency: Monthly
- **Press** (`/press`) - Priority: 0.4, Change Frequency: Monthly
- **Affiliate Program** (`/affiliates`) - Priority: 0.4, Change Frequency: Monthly

### Legal Pages (Low Priority)
- **Terms of Service** (`/terms`) - Priority: 0.3, Change Frequency: Yearly
- **Privacy Policy** (`/privacy`) - Priority: 0.3, Change Frequency: Yearly
- **Cookie Policy** (`/cookies`) - Priority: 0.3, Change Frequency: Yearly
- **Compliance** (`/compliance`) - Priority: 0.3, Change Frequency: Yearly

## Admin Section (Not in Sitemap)
The admin section (`/admin/`) is excluded from the sitemap for security reasons and includes:
- Admin Dashboard
- Product Management
- Order Management
- Customer Management
- Inventory Management
- Category Management
- Banner Management
- User Management
- Settings

## API Routes (Not in Sitemap)
API routes (`/api/`) are excluded from the sitemap and include:
- `/api/products` - Product data
- `/api/categories` - Category data
- `/api/orders` - Order management
- `/api/admin` - Admin functionality
- `/api/banners` - Banner management
- `/api/upload` - File uploads

## Sitemap Implementation

### Files Created:
1. **`app/sitemap.ts`** - Dynamic sitemap generator using Next.js 13+ App Router
2. **`public/robots.txt`** - Search engine crawling instructions

### Features:
- **Dynamic Generation**: Automatically fetches categories and products from your API
- **SEO Optimized**: Proper priority and change frequency settings
- **Comprehensive Coverage**: Includes all public pages
- **Security Conscious**: Excludes admin and API routes

### Sitemap URL:
- **XML Sitemap**: `https://safirdynamics.co.ke/sitemap.xml`
- **Robots.txt**: `https://safirdynamics.co.ke/robots.txt`

## SEO Benefits

### Search Engine Optimization:
1. **Better Indexing**: Helps search engines discover all pages
2. **Priority Indication**: Tells search engines which pages are most important
3. **Update Frequency**: Indicates how often pages change
4. **Crawl Efficiency**: Optimizes search engine crawling

### Technical SEO:
- Proper XML format
- Last modified dates
- Change frequency indicators
- Priority levels
- Robots.txt integration

## Maintenance

### Automatic Updates:
- The sitemap automatically updates when you add/remove products or categories
- Static pages need manual updates in the sitemap.ts file

### Manual Updates Required:
- Adding new static pages
- Changing page priorities
- Modifying change frequencies
- Updating base URL

### Monitoring:
- Check sitemap at `/sitemap.xml` to ensure it's generating correctly
- Monitor search console for sitemap submission status
- Verify robots.txt is accessible at `/robots.txt`

## Next Steps

1. **Submit to Search Engines**:
   - Google Search Console: Submit sitemap URL
   - Bing Webmaster Tools: Submit sitemap URL
   - Other search engines as needed

2. **Monitor Performance**:
   - Track indexing status in search consoles
   - Monitor crawl errors
   - Check sitemap coverage

3. **Regular Maintenance**:
   - Review and update priorities quarterly
   - Add new pages as they're created
   - Remove outdated pages

## Contact Information
- **Email**: safirdynamics@gmail.com
- **Phone**: +254 722 490182
- **Address**: Pioneer house, kimathi street, 3rd floor, room 1, Nairobi, Kenya

---

*Last Updated: ${new Date().toLocaleDateString()}*
*Sitemap Version: 1.0* 