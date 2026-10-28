# brokerage-listings.json: source notes

- **Source of truth:** https://midislandrealty.com/all-listings/ (RE/MAX Mid-Island Realty, a RealtyPress/WordPress site). The page filters to the brokerage's own offices (`input_office_id=130996,131009,131002`), sorts by `LastUpdated DESC`, and shows 12 cards per page.
- **Scraped:** 2026-10-28, 12:01–12:06 PDT (America/Vancouver).
- **Site's own total:** "243 results | Page 1 of 21". **JSON count: 243** (all unique by url, in site order).
- **Pagination:** `/all-listings/page/N/` for N = 1–21. `?page=N` is ignored by the site and returns page 1 again, so it is not used.
- **Card fields** (from the results HTML): address (`<h4>`), city (first part of `.city-province-postalcode`), priceText and price (`.rps-price`), beds, baths and sqft (`.rps-result-feature-label-sm`; sqft is the interior "ft²" figure), photo (the card's CSS `background:url(...)`), and url (the card link to `/listing/...`).
- **Detail-page fields:** each listing's own page, fetched once, supplied `mlsNumber` ("MLS® Number" row) and `propertyType` ("Property Type" row).
- **REST API:** `/wp-json/wp/v2/rps_listing` exists, but it lists 2,640 listings (it includes other brokerages) and returns only the title, link and slug. It has no price, beds or photos, so the scraper doesn't use it.
- **Cross-check:** the same page with `posts_per_page=48` (6 pages) gave the identical set of 243 URLs. All 243 detail pages loaded without errors.
- **Field coverage:** address, city, price, priceText, propertyType, mlsNumber, photo and url are present on 243/243. sqft is on 150, baths on 148 and beds on 143. Missing values were absent on the site, mostly for vacant land and commercial listings, and none were guessed.
- **Photos:** all are hosted on `ddfcdn.realtor.ca` (the CREA DDF CDN).
- **Regenerate:** `python3 scrape_midisland.py brokerage-listings.json` (Python 3 standard library only, about 0.8 s between requests, about 5 minutes). It also writes `brokerage-listings-meta.json` (site total, count, failures, timestamp).
- The site sorts by last-updated and listings change daily, so expect the set to drift over time.
