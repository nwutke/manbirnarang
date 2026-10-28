import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Effects from "@/components/Effects";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Effects />
      <main>{children}</main>
      <Footer />
    </>
  );
}
