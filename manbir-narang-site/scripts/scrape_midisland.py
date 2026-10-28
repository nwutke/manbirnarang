#!/usr/bin/env python3
"""Regenerate brokerage-listings.json from https://midislandrealty.com/all-listings/

Read-only. Fetches every results page (/all-listings/page/N/ -- note: ?page=N is
ignored by the site and returns page 1), parses the listing cards, then fetches
each listing's detail page for MLS(R) number and property type (not on cards).
Usage: python3 scrape_midisland.py [output.json]   (stdlib only)
"""
import html, json, re, sys, time, urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

BASE = "https://midislandrealty.com/all-listings/"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/130.0 Safari/537.36")
DELAY = 0.8
OUT = sys.argv[1] if len(sys.argv) > 1 else "brokerage-listings.json"


def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:
            if i == tries - 1:
                raise
            time.sleep(3 * (i + 1))


def clean(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def num(s):
    m = re.search(r"[\d,]+(?:\.\d+)?", s or "")
    if not m:
        return None
    v = float(m.group(0).replace(",", ""))
    return int(v) if v.is_integer() else v


def parse_cards(page):
    cards = []
    for sec in re.findall(r'<section\s+class="[^"]*listing-container[^"]*">(.*?)</section>', page, re.S):
        c = {}
        m = re.search(r'<h4>(.*?)</h4>', sec, re.S)
        if m: c["address"] = clean(m.group(1))
        m = re.search(r'class="city-province-postalcode">(.*?)</p>', sec, re.S)
        if m:
            cp = clean(m.group(1))
            c["city"] = cp.split(",")[0].strip()
            c["_cityProvince"] = cp
        m = re.search(r'class="rps-price[^"]*">(.*?)</span>', sec, re.S)
        if m:
            c["priceText"] = clean(m.group(1))
            p = num(c["priceText"])
            if p is not None: c["price"] = p
        for f in re.findall(r'rps-result-feature-label-sm"[^>]*>(.*?)</span>', sec, re.S):
            t = clean(f)
            if re.search(r"Bedroom", t, re.I): c["beds"] = num(t)
            elif re.search(r"Bathroom", t, re.I): c["baths"] = num(t)
            elif re.search(r"ft|sq", t, re.I): c["sqft"] = num(t); c["_sqftText"] = t
        m = re.search(r'background:url\(([^)]+)\)', sec)
        if m: c["photo"] = html.unescape(m.group(1).strip("'\""))
        m = re.search(r'href="(https://midislandrealty\.com/listing/[^"]+)"', sec)
        if m: c["url"] = html.unescape(m.group(1))
        m = re.search(r'top-ribbon">(.*?)</span>', sec, re.S)
        if m: c["_status"] = clean(m.group(1))
        cards.append(c)
    return cards


def parse_detail(page):
    d = {}
    rows = {clean(k): clean(v) for k, v in re.findall(
        r'<td>\s*<strong>(.*?)</strong>\s*</td>\s*<td[^>]*>(.*?)</td>', page, re.S)}
    if rows.get("MLS® Number"): d["mlsNumber"] = rows["MLS® Number"]
    if rows.get("Property Type"): d["propertyType"] = rows["Property Type"]
    m = re.search(r'<meta property="og:image" content="([^"]+)"', page)
    if m: d["_ogImage"] = html.unescape(m.group(1))
    return d


def main():
    first = get(BASE)
    m = re.search(r'rps-result-count[^>]*>\s*([\d,]+)\s*results\s*\|\s*Page\s*\d+\s*of\s*(\d+)', first)
    total, pages = int(m.group(1).replace(",", "")), int(m.group(2))
    print(f"site says {total} results over {pages} pages", file=sys.stderr)
    seen, out = set(), []
    for n in range(1, pages + 1):
        page = first if n == 1 else get(f"{BASE}page/{n}/")
        if n > 1: time.sleep(DELAY)
        cards = parse_cards(page)
        print(f"page {n}: {len(cards)} cards", file=sys.stderr)
        for c in cards:
            if c.get("url") and c["url"] not in seen:
                seen.add(c["url"]); out.append(c)
    missing = []
    for i, c in enumerate(out):
        try:
            d = parse_detail(get(c["url"]))
            c.update({k: v for k, v in d.items() if not k.startswith("_")})
            if "photo" not in c and d.get("_ogImage"): c["photo"] = d["_ogImage"]
        except Exception as e:
            missing.append((c["url"], str(e)))
        time.sleep(DELAY)
        if i % 25 == 0: print(f"detail {i+1}/{len(out)}", file=sys.stderr)
    order = ["address", "city", "price", "priceText", "beds", "baths", "sqft",
             "propertyType", "mlsNumber", "photo", "url"]
    final = [{k: c[k] for k in order if c.get(k) not in (None, "")} for c in out]
    with open(OUT, "w") as f:
        json.dump(final, f, indent=2, ensure_ascii=False)
    meta = {"siteTotal": total, "pages": pages, "count": len(final),
            "detailFailures": missing,
            "scrapedAt": datetime.now(ZoneInfo("America/Vancouver")).isoformat(timespec="seconds")}
    with open(OUT.replace(".json", "-meta.json"), "w") as f:
        json.dump(meta, f, indent=2)
    print(json.dumps(meta, indent=2), file=sys.stderr)


if __name__ == "__main__":
    main()
