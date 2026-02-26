# SEO Setup Guide — MediaWave Israel

## 1. Google Search Console

### Registration
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add property"**
4. Choose **"URL prefix"** and enter: `https://mediawaveisrael.com`

### Verification (HTML File Method)
1. Download the verification HTML file from Google
2. Replace `public/google-verification.html` with the downloaded file
3. Deploy the site
4. Click **"Verify"** in Google Search Console

### Submit Sitemap
1. In Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `https://mediawaveisrael.com/sitemap.xml`
3. Click **Submit**
4. Verify status shows "Success"

### Monitor Weekly
- Check **Coverage** for indexing errors
- Review **Performance** for search queries and clicks
- Check **Core Web Vitals** for performance issues
- Review **Mobile Usability** for mobile issues

---

## 2. Google Business Profile

### Setup
1. Go to [Google Business Profile](https://business.google.com)
2. Search for "MediaWave Israel" or create a new listing
3. Fill in all details:
   - **Business name**: MediaWave Israel
   - **Category**: Web Designer / Web Developer
   - **Phone**: 052-8731808
   - **Website**: https://mediawaveisrael.com
   - **Email**: mediawaveisrael@gmail.com
   - **Hours**: Sun-Thu 09:00-18:00
   - **Service area**: Israel

### Verification
- Choose phone or email verification
- Complete the verification process
- Add photos and service descriptions

---

## 3. Entity Consistency Checklist

Ensure these values are IDENTICAL everywhere:

| Field | Value |
|-------|-------|
| Business Name | MediaWave Israel |
| Phone | +972-52-873-1808 |
| Email | mediawaveisrael@gmail.com |
| Website | https://mediawaveisrael.com |
| Instagram | https://www.instagram.com/mediawaveisrael |
| WhatsApp | https://wa.me/972528731808 |

Check consistency across:
- [x] Website structured data (index.html)
- [x] Google Business Profile
- [ ] Instagram profile
- [ ] WhatsApp Business profile
- [ ] Any directory listings

---

## 4. Technical SEO Checklist

- [x] **Sitemap**: `https://mediawaveisrael.com/sitemap.xml` — auto-generated
- [x] **RSS Feed**: `https://mediawaveisrael.com/feed.xml` — auto-generated
- [x] **robots.txt**: AI bots allowed, /studio/ blocked
- [x] **OG Image**: PNG 1200x630 (not SVG)
- [x] **Pre-rendering**: All pages have static HTML
- [x] **Structured Data**: LocalBusiness, Organization, WebSite, FAQPage, BreadcrumbList, BlogPosting, Service
- [x] **HTTPS**: SSL certificate active
- [x] **Mobile**: Responsive design
- [x] **Hebrew RTL**: Proper direction and language tags
