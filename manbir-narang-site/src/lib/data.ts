import { slugify, type Listing } from "./types";

/**
 * Sample listings. These show until your Supabase project is connected and
 * contains at least one published listing. Replace them from /admin.
 */
const SEEDS: Omit<Listing, "slug" | "features">[] = [
  { id: "seed-1", title: "Sproat Lake Waterfront Estate", location: "Sproat Lake", price: 2150000, status: "New listing", category: "Lakefront", beds: 5, baths: 4, sqft: 4200, description: "Welcome to this stunning lakefront estate with a private dock, sweeping water views, and generous living space for family and guests ...", photos: ["/images/listing-1.jpg"], photoCount: 41, featured: true, published: true, sort: 1 },
  { id: "seed-2", title: "Alberni Inlet View Residence", location: "Port Alberni", price: 1295000, status: "Open house Sat", category: "Waterfront", beds: 4, baths: 3, sqft: 3300, description: "Elevated living with deep-water views of Alberni Inlet, a bright open layout, and a kitchen made for entertaining ...", photos: ["/images/listing-2.jpg"], photoCount: 28, featured: true, published: true, sort: 2 },
  { id: "seed-3", title: "Beaver Creek Acreage Home", location: "Beaver Creek", price: 1085000, status: "New listing", category: "Acreage", beds: 4, baths: 3, sqft: 3000, description: "Space and privacy on five level acres, with a custom-built home and mountain views in every direction ...", photos: ["/images/listing-3.jpg"], photoCount: 36, featured: true, published: true, sort: 3 },
  { id: "seed-4", title: "Lakeshore Retreat", location: "Sproat Lake", price: 1690000, status: "Price improved", category: "Lakefront", beds: 3, baths: 3, sqft: 2800, description: "A refined retreat steps from the water, with a private dock, vaulted ceilings, and warm natural finishes ...", photos: ["/images/listing-4.jpg"], photoCount: 24, featured: true, published: true, sort: 4 },
  { id: "seed-5", title: "Mountain View Custom Home", location: "Uptown, Port Alberni", price: 895000, status: "Just listed", category: "Estates", beds: 4, baths: 3, sqft: 2900, description: "A beautifully crafted custom home in Uptown with bright main living areas and views of the surrounding peaks ...", photos: ["/images/listing-5.jpg"], photoCount: 52, featured: true, published: true, sort: 5 },
  { id: "seed-6", title: "Cherry Creek Country Estate", location: "Cherry Creek", price: 1150000, status: "Sold", category: "Acreage", beds: 4, baths: 3, sqft: 3400, description: "An exceptional country estate on eight acres with a spacious home, outbuildings, and room to roam ...", photos: ["/images/listing-6.jpg"], photoCount: 18, featured: true, published: true, sort: 6 },
];
export const SEED_LISTINGS: Listing[] = SEEDS.map((l) => ({ ...l, slug: slugify(l.title), features: [] }));

export const PHONE = "250-720-5509";
export const EMAIL = "manbirnarangrealestate@gmail.com";
export const OFFICE = "RE/MAX Mid-Island Realty, 4201 Johnston Road, Port Alberni";

export const HOODS = [
  { cls: "h1 pf1", name: "Sproat Lake", text: "Warm, calm water, sandy shores, and some of the valley’s most sought-after lakefront homes.", avg: "From $900K", life: "Lakefront", count: "4 homes" },
  { cls: "h2 pf2", name: "Alberni Inlet", text: "Working-harbour character with deep-water views and a gateway to the open Pacific.", avg: "From $650K", life: "Waterfront", count: "3 homes" },
  { cls: "h3 pf3", name: "Beaver Creek", text: "Quiet rural acreage with space, privacy, and mountain scenery close to town.", avg: "From $800K", life: "Acreage", count: "5 homes" },
  { cls: "h4 pf5", name: "Port Alberni City", text: "Uptown and Harbour Quay living with shops, schools, and every convenience.", avg: "From $450K", life: "Town", count: "12 homes" },
  { cls: "h5 pf6", name: "Cherry Creek", text: "Open farmland and country estates with room to breathe.", avg: "From $850K", life: "Rural", count: "2 homes" },
  { cls: "h6 pf4", name: "Bamfield", text: "A remote seaside village on Barkley Sound, reached by road or by boat.", avg: "From $400K", life: "Remote coastal", count: "1 home" },
];

export const TESTIMONIALS = [
  { q: "Manbir made buying our lakefront home feel effortless. He answered every question and never rushed us.", who: "Client name", where: "Happy client · Sproat Lake" },
  { q: "Our home sold quickly and above our expectations. His marketing was beautiful and his advice was honest.", who: "Client name", where: "Happy client · Port Alberni" },
  { q: "We moved from out of town and he handled everything. We felt looked after the whole way.", who: "Client name", where: "Happy client · Beaver Creek" },
  { q: "Clear, calm, and always available. I would recommend Manbir to anyone buying or selling.", who: "Client name", where: "Happy client · Cherry Creek" },
];

export const POSTS = [
  { cls: "pf4", date: "OCTOBER 2026", title: "Sproat Lake or Alberni Inlet: which waterfront suits you?", text: "A look at lifestyle, access, and what each shoreline offers." },
  { cls: "pf3", date: "OCTOBER 2026", title: "What to know before buying acreage in the valley", text: "Wells, septic, access, and other points worth checking early." },
  { cls: "pf6", date: "SEPTEMBER 2026", title: "How to price your Port Alberni home to sell", text: "Why the right price at launch matters most." },
  { cls: "pf7", date: "SEPTEMBER 2026", title: "Preparing your home for a winter sale", text: "Simple steps that help a home show well in any season." },
];

export const STATS5: [string, string][] = [["$400M+", "In homes sold"], ["350+", "Families served"], ["12", "Years of experience"], ["5.0", "Client rating"], ["98%", "Of list price achieved"]];
export const STATS4: [string, string][] = STATS5.slice(0, 4);
export const STATS_SELL: [string, string][] = [["98%", "Of list price achieved"], ["24", "Average days on market"], ["12", "Years of experience"], ["5.0", "Client rating"]];
