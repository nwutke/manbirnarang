import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostBody from "@/components/PostBody";
import PostCard from "@/components/PostCard";
import ShareButton from "@/components/ShareButton";
import { Cta } from "@/components/ui";
import { formatDate, getPostBySlug, getPosts, readingMinutes } from "@/lib/posts";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPostBySlug((await params).slug);
  if (!p) return { title: "Article not found" };
  return {
    title: p.title,
    description: p.summary || p.body.slice(0, 160),
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.summary, publishedTime: p.date, images: p.cover ? [p.cover] : undefined },
  };
}

export default async function PostPage({ params }: Props) {
  const p = await getPostBySlug((await params).slug);
  if (!p) notFound();
  const more = (await getPosts()).filter((x) => x.slug !== p.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    datePublished: p.date,
    description: p.summary,
    image: p.cover ? [p.cover] : undefined,
    author: { "@type": "Person", name: "Manbir Narang" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="phero" style={p.cover ? { backgroundImage: `url("${p.cover}")` } : undefined}>
        <div className="pin">
          <Link href="/blog" className="lback">‹ All articles</Link>
          <h1>{p.title}</h1>
          <p className="pmeta">{formatDate(p.date)} &nbsp;·&nbsp; {readingMinutes(p.body)} min read &nbsp;·&nbsp; By Manbir Narang</p>
        </div>
      </section>

      <section className="iv">
        <article className="w pwrap">
          {p.summary ? <p className="plead">{p.summary}</p> : null}
          <PostBody body={p.body} />
          <div className="pfoot">
            <div className="lagent">
              <img src="/images/manbir.jpg" alt="" />
              <div><b>Manbir Narang</b><span>REALTOR® · RE/MAX Mid-Island Realty</span></div>
            </div>
            <ShareButton path={`/blog/${p.slug}`} title={p.title} text={p.summary} />
          </div>
          <p className="pdisc">This article is general information, not legal or financial advice.</p>
        </article>
      </section>

      {more.length > 0 ? (
        <section className="iv pmore">
          <div className="w">
            <h2>More articles</h2>
            <div className="bgrid">{more.map((x) => <PostCard p={x} key={x.id} />)}</div>
          </div>
        </section>
      ) : null}

      <Cta title="Thinking about a move?" text="Let’s talk about your plans." button="Contact Manbir" href="/contact" />
    </>
  );
}
