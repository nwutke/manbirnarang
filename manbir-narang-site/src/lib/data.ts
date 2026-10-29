export const PHONE = "250-720-5509";
export const EMAIL = "manbirnarangrealestate@gmail.com";
export const OFFICE = "RE/MAX Mid-Island Realty, 4201 Johnston Road, Port Alberni";

export const HOODS: { cls: string; name: string; text: string; avg: string; life: string; photo?: string; alt?: string }[] = [
  // `avg` is a placeholder price and is not rendered. Put it back on the communities page when the figures are real.
  { cls: "h4 pf5", name: "Port Alberni", text: "Uptown and Harbour Quay living with shops, schools, and every convenience.", avg: "From $450K", life: "Town" },
  { cls: "h3", name: "Beaver Creek", text: "Quiet rural acreage with space, privacy, and mountain scenery close to town.", avg: "From $800K", life: "Acreage", photo: "/images/beaver-creek.jpg", alt: "Acreage home in Beaver Creek" },
  { cls: "h5", name: "Cherry Creek", text: "Open farmland and country estates with room to breathe.", avg: "From $850K", life: "Rural", photo: "/images/cherry-creek.jpg", alt: "Acreage home in Cherry Creek" },
  { cls: "h1 pf1", name: "Sproat Lake", text: "Warm, calm water, sandy shores, and some of the valley’s most sought-after lakefront homes.", avg: "From $900K", life: "Lakefront" },
];

/**
 * Not rendered. Home “Client feedback” used these cards.
 * About also had this pull quote, not rendered:
 * “From the first showing to the final signature, the experience was flawless.” — Client name, Port Alberni
 */
export const TESTIMONIALS = [
  { q: "Manbir made buying our lakefront home feel effortless. He answered every question and never rushed us.", who: "Client name", where: "Happy client · Sproat Lake" },
  { q: "Our home sold quickly and above our expectations. His marketing was beautiful and his advice was honest.", who: "Client name", where: "Happy client · Port Alberni" },
  { q: "We moved from out of town and he handled everything. We felt looked after the whole way.", who: "Client name", where: "Happy client · Beaver Creek" },
  { q: "Clear, calm, and always available. I would recommend Manbir to anyone buying or selling.", who: "Client name", where: "Happy client · Cherry Creek" },
];


/** Placeholder performance figures. Not rendered. Pass these to <Stats> when the numbers are real. */
export const STATS5: [string, string][] = [["$400M+", "In homes sold"], ["350+", "Families served"], ["12", "Years of experience"], ["5.0", "Client rating"], ["98%", "Of list price achieved"]];
export const STATS4: [string, string][] = STATS5.slice(0, 4);
export const STATS_SELL: [string, string][] = [["98%", "Of list price achieved"], ["24", "Average days on market"], ["12", "Years of experience"], ["5.0", "Client rating"]];
