import type { Metadata, Viewport } from "next";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/hanken-grotesk/300.css";
import "@fontsource/hanken-grotesk/400.css";
import "@fontsource/hanken-grotesk/500.css";
import "@fontsource/hanken-grotesk/600.css";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
