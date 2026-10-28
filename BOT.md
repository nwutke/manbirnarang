# Brokerage listings: instructions for the update bot

This repo powers manbirnarang.ca. The bot keeps **other agents' RE/MAX Mid-Island Realty listings** up to date by editing one file:

```
manbir-narang-site/content/brokerage-listings.json
```

Each commit to `main` triggers a Vercel deploy. Before building, `scripts/check-brokerage.mjs` validates the file. If the file is invalid the build fails and **the live site stays on the last good version**, so a bad commit cannot break the site. Run `npm run check:brokerage` inside `manbir-narang-site/` to test before committing.

## Rules

1. **Do not change `"enabled"`.** It is `true` (Manbir's managing broker approved on 2026-10-28). Only a person changes it.
2. **Only include listings where RE/MAX Mid-Island Realty is the listing brokerage.** Never include listings from other brokerages.
3. **Skip Manbir Narang's own listings.** He manages those in the site admin. (The site also filters them out by MLS number and agent name as a safety net.)
4. **Remove a listing** when it is sold, expired, cancelled or no longer shown on the brokerage site. Do not keep sold listings.
5. **Copy facts accurately.** Use the listing's own price, specs and description. Do not invent or embellish details.
6. **Only edit this one file.** Do not touch any other file in the repo.
7. **One commit per run**, only if something changed, with a message like:
   `Brokerage listings: +2 new, 1 price change, -1 sold (2026-10-29)`
8. Update `"updated"` to today's date (YYYY-MM-DD) whenever you commit.

## Coverage

Include **every** active for-sale listing where RE/MAX Mid-Island Realty (including the Ucluelet office) is the listing brokerage: about 240 homes across Port Alberni, Sproat Lake, Beaver Creek, Cherry Creek, Ucluelet, Tofino and Bamfield. Leave out rentals. Include all photos and the full description when available. The site's listing pages show a gallery, so a single photo makes a thin page.

On the Properties page, Manbir's own listings always show first, followed by these brokerage listings in the order they appear in the file. Put the newest listings first.

## File format

```json
{
  "enabled": true,
  "updated": "2026-10-29",
  "listings": [
    {
      "mls": "1053099",
      "address": "5453 Woodland Crescent",
      "area": "Port Alberni",
      "price": 389900,
      "status": "For sale",
      "category": "Homes",
      "beds": 2,
      "baths": 2,
      "sqft": 1111,
      "lotSize": "0.12 acres",
      "yearBuilt": 1978,
      "taxes": 2450,
      "description": "Full listing description...",
      "features": ["Heat pump", "Fenced yard"],
      "photos": ["https://.../1053099-1.jpg", "https://.../1053099-2.jpg"],
      "listingAgent": "Kelly Malone",
      "listingUrl": "https://www.remax.ca/bc/port-alberni-real-estate/5453-woodland-cres-w-wp_idm73000004-30446369-lst",
      "listedOn": "2026-10-27"
    }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `mls` | yes | MLS® number as text. Must be unique. |
| `address` | yes | Street address without city. Also becomes the web address, e.g. `manbirnarang.ca/5453-woodland-crescent`. |
| `slug` | no | Override the web address only if two listings would clash. |
| `area` | yes | e.g. `Port Alberni`, `Sproat Lake`, `Beaver Creek`, `Cherry Creek`. |
| `price` | yes | Number, no `$` or commas. |
| `status` | no | `For sale` (default), `New listing`, `Price improved`, `Open house Sat`. |
| `category` | no | One of `Homes` (default), `Lakefront`, `Waterfront`, `Acreage`, `Estates`, `Condos`, `Commercial`. |
| `beds`, `baths`, `sqft`, `yearBuilt`, `taxes` | no | Numbers. Use `0` or leave out if unknown. |
| `lotSize` | no | Text, e.g. `0.23 acres`. |
| `description` | no | Plain text. Blank lines separate paragraphs. |
| `features` | no | List of short text items. |
| `photos` | yes | 1 to 80 `https://` image URLs. The first one is the cover photo. |
| `listingAgent` | yes | The listing agent's name. Shown as "Listed by …" on the site. |
| `listingUrl` | **yes** | The listing's page on **remax.ca**. The "Contact agent" button opens this link. |
| `listedOn` | no | Date the listing went on the market (YYYY-MM-DD). Powers the "New (last 10 days)" filter. |
