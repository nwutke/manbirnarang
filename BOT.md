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

Include **every** current listing on https://midislandrealty.com/all-listings/ where RE/MAX Mid-Island Realty (including the Ucluelet office) is the listing brokerage: about 240 listings across Port Alberni, Sproat Lake, Beaver Creek, Cherry Creek, Ucluelet, Tofino and Bamfield, for sale and for rent. Leave out other brokerages.

These listings appear as **cards only**. They do not get their own pages on manbirnarang.ca. Clicking a card, or its "Contact agent" button, opens `listingUrl` on **midislandrealty.com** (that listing's own page, in a new tab). Copy only what that page shows. Leave a field out when it is missing. Do not invent a photo, agent, price, bed or bath count, category, or status.

Cloudflare blocks midislandrealty.com from this repo's machines and from Vercel. Refresh the JSON from a computer that can open the all-listings page, including every later page or "load more" result, then run `npm run check:brokerage` inside `manbir-narang-site/`.

On the Properties page, Manbir's own listings always show first, followed by these listings in the order they appear in the file. Put the newest listings first.

## File format

```json
{
  "enabled": true,
  "updated": "2026-10-29",
  "listings": [
    {
      "address": "5453 Woodland Crescent",
      "city": "Port Alberni",
      "price": 389900,
      "beds": 2,
      "baths": 2,
      "sqft": 1111,
      "photo": "https://photos.prod.cirrussystem.net/example.jpeg",
      "listingUrl": "https://midislandrealty.com/example-listing/",
      "mls": "1053099"
    }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `listingUrl` | **yes** | That listing's own `https://` page on **midislandrealty.com**. The card and its "Contact agent" button open this link in a new tab. Must be unique. |
| `address` | no | Street address, as shown. Leave out if the page has none. |
| `city` | no | City or area as shown, e.g. `Port Alberni`, `Ucluelet`. `area` is still accepted. |
| `price` | no | Number, no `$` or commas. If the page's price is not a plain amount (`$2,500 Monthly`), store that text instead. |
| `beds`, `baths`, `sqft` | no | Numbers, only when the page shows them. Leave the field out when it does not. Do not write `0` as a guess. |
| `photo` | no | One `https://` cover image. `photos` (a list) is still accepted; only the first is shown. |
| `mls` | no | MLS® number as text, when the page shows one. Must be unique. |
| `listingAgent` | no | Only when the page names the agent. Shown as "Listed by …". |
| `status` | no | Only the words the page uses, e.g. `For sale`, `For rent`, `Open house`. Do not default this. |
| `category` | no | Only if it is one of `Homes`, `Lakefront`, `Waterfront`, `Acreage`, `Estates`, `Condos`, `Commercial`. |
