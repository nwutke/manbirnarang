# Brokerage listings: instructions for the update bot

This repo powers manbirnarang.ca. The bot keeps **other agents' RE/MAX Mid-Island Realty listings** up to date by editing one file:

```
manbir-narang-site/content/brokerage-listings.json
```

Each commit to `main` triggers a Vercel deploy. Before building, `scripts/check-brokerage.mjs` validates the file. If the file is invalid the build fails and **the live site stays on the last good version**, so a bad commit cannot break the site. Run `npm run check:brokerage` inside `manbir-narang-site/` to test before committing.

## Rules

1. **Do not hide the cards.** The file is a JSON array and is shown as-is. Only a person sets `"enabled": false` by wrapping it.
2. **Only include listings where RE/MAX Mid-Island Realty is the listing brokerage.** Never include listings from other brokerages.
3. **Skip Manbir Narang's own listings.** He manages those in the site admin. (The site also filters them out by MLS number and agent name as a safety net.)
4. **Remove a listing** when it is sold, expired, cancelled or no longer shown on the brokerage site. Do not keep sold listings.
5. **Copy facts accurately.** Use the listing's own price, specs and description. Do not invent or embellish details.
6. **Only edit this one file.** Do not touch any other file in the repo.
7. **One commit per run**, only if something changed, with a message like:
   `Brokerage listings: +2 new, 1 price change, -1 sold (2026-10-29)`
8. Prefer regenerating the whole file with `python3 scripts/scrape_midisland.py content/brokerage-listings.json` from an unblocked machine (see `scripts/brokerage-listings-SOURCE.md`). Cloudflare blocks cloud VMs. Do not commit the meta file the script writes beside the JSON.

## Coverage

Include **every** current listing on https://midislandrealty.com/all-listings/ where RE/MAX Mid-Island Realty (including the Ucluelet office) is the listing brokerage: about 240 listings across Port Alberni, Sproat Lake, Beaver Creek, Cherry Creek, Ucluelet, Tofino and Bamfield, for sale and for rent. Leave out other brokerages.

These listings appear as **cards only**. They do not get their own pages on manbirnarang.ca. Clicking a card, or its "Contact agent" button, opens `url` on **midislandrealty.com** (that listing's own page, in a new tab). Copy only what that page shows. Leave a field out when it is missing. Do not invent a photo, price, bed or bath count, or property type.

Cloudflare blocks midislandrealty.com from this repo's machines and from Vercel. Refresh the JSON from a computer that can open the all-listings page, including every later page or "load more" result, then run `npm run check:brokerage` inside `manbir-narang-site/`.

On the Properties page, Manbir's own listings always show first, followed by these listings in the order they appear in the file. Put the newest listings first.

## File format

The scraper writes a JSON array. `url` is that listing's own page on midislandrealty.com. The card and its "Contact agent" button open it in a new tab.

```json
[
  {
    "address": "1174 Front St",
    "city": "Ucluelet",
    "price": 329000,
    "priceText": "$329,000",
    "propertyType": "Vacant Land",
    "mlsNumber": "1033596",
    "photo": "https://ddfcdn.realtor.ca/listings/example/1033596_1.jpg",
    "url": "https://midislandrealty.com/listing/1174-front-st-ucluelet-british-columbia-v0r-3a0-29697392/"
  }
]
```

| Field | Required | Notes |
|---|---|---|
| `url` | **yes** | That listing's own `https://` page on **midislandrealty.com**. Must be unique. |
| `address`, `city` | no | As shown. Leave out if the page has none. |
| `price` | no | Number, no `$` or commas. |
| `priceText` | no | The price as the page writes it, including `$2,500 Monthly`. The card shows this text. |
| `propertyType` | no | The detail page's property type, shown on the card. Do not remap it. |
| `beds`, `baths`, `sqft` | no | Numbers, only when the results card shows them. Leave the field out when it does not. Do not write `0` as a guess. |
| `photo` | no | One `https://` cover image. Current photos are on `ddfcdn.realtor.ca`. |
| `mlsNumber` | no | MLS® number as text. Must be unique. Used to skip a listing Manbir already publishes. |
