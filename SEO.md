# SEO setup

The three public pages are `/`, `/mosaic` and `/digital`, with `https://loobow.com` as the canonical origin. SEO metadata is present in the HTML source and does not depend on JavaScript.

## Implemented

- Unique page titles and descriptions, self-referencing canonical links, and index/follow directives with large image previews allowed.
- Open Graph and Twitter large-image cards with descriptive text and verified image dimensions.
- JSON-LD describing Loobow, its two divisions, the website and each page. Division pages include breadcrumbs; the homepage includes the two division links as an item list. Business information comes from the existing site content.
- `robots.txt` permits crawling and advertises `sitemap.xml`. The sitemap lists only the three canonical page URLs, without duplicate HTML aliases or section fragments.
- A semantic homepage H1 using the existing Loobow wordmark. Mosaic and Digital retain their existing H1s and content headings.
- Matching homepage panel typography across desktop, phone and short-window layouts.
- Digital images include their intrinsic width/height and asynchronous decoding. The two missing Imara video-thumbnail references now use the existing Imara campaign artwork; their video links are unchanged.
- Existing lazy loading, image alt text, fast-loading local fonts where already used, and the clean-route redirects are preserved. Empty alt text remains on decorative images and repeated client logos.

## Publishing checks

1. Upload the changed HTML/CSS and the new `robots.txt` and `sitemap.xml` alongside the current assets.
2. Check that all three canonical URLs return HTTP 200 on the production host. Confirm HTTPS is available at `loobow.com` and alternate hostnames/protocols redirect to that origin.
3. Check that `/robots.txt` and `/sitemap.xml` return the correct files, and that the production host applies the existing HTML-alias and trailing-slash redirects described in [ROUTING.md](ROUTING.md).
4. Verify the property in Google Search Console, submit `https://loobow.com/sitemap.xml`, and inspect the three page URLs.
5. Check the published structured data with Google's testing tools and review mobile performance using the deployed pages. Search engines determine indexing and search appearance; valid markup does not guarantee a particular result or ranking.

Search Console verification, sitemap submission and production-host checks have not been performed from this local workspace.

## Maintaining the pages

Update a page's title, description, social tags and JSON-LD together when its business details or content change. Add real new pages to the sitemap with their canonical URLs. Only add sitemap modification dates when they describe an actual content change. Keep structured data consistent with the business information shown on the site.

Guidance: [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization), and [building and submitting sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
