import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { Cta, PageHead } from "@/components/ui";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Local real estate advice for buyers and sellers in Port Alberni and the Alberni Valley, from Manbir Narang, REALTOR®.",
  alternates: { canonical: "/blog" },
};
export const revalidate = 60;

export default async function Blog() {
  const posts = await getPosts();
  return (
    <>
      <PageHead title="Blog" sub="Local advice for buyers and sellers in the Alberni Valley." />
      <section className="iv">
        <div className="w blogw">
          {posts.length === 0 ? (
            <p className="c">New articles are on the way. Check back soon.</p>
          ) : (
            <div className="bgrid">
              {posts.map((p) => <PostCard p={p} key={p.id} />)}
            </div>
          )}
        </div>
      </section>
      <Cta title="Have a question about buying or selling?" text="Ask me anything. I am always happy to help." button="Contact Manbir" href="/contact" />
    </>
  );
}
