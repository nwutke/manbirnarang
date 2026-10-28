import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site";
import localFont from "next/font/local";
import "./globals.css";

const cinzel = localFont({
  src: [
    { path: "../fonts/cinzel-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cinzel-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-cinzel",
  display: "block",
});
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "block",
});
const hanken = localFont({
  src: [
    { path: "../fonts/hanken-grotesk-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/hanken-grotesk-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/hanken-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/hanken-grotesk-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-hanken",
  display: "block",
});

const site = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Manbir Narang | Port Alberni Realtor | RE/MAX Mid-Island Realty", template: "%s | Manbir Narang, Realtor" },
  description:
    "Manbir Narang is a licensed realtor with RE/MAX Mid-Island Realty serving Port Alberni, Sproat Lake, and the Alberni Valley. Lakefront, waterfront, and acreage homes.",
  openGraph: {
    title: "Manbir Narang | Port Alberni Realtor",
    description: "Luxury real estate in Port Alberni and the Alberni Valley.",
    type: "website",
    images: ["/hero-poster.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#05288A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
