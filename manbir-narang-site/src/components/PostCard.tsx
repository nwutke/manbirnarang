import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

export default function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="bl bll">
      <div className="fr"><div className="im" style={p.cover ? { background: `url("${p.cover}") 50% 50%/cover no-repeat` } : undefined} /></div>
      <div className="dt">{formatDate(p.date).toUpperCase()}</div>
      <h3>{p.title}</h3>
      {p.summary ? <p>{p.summary}</p> : null}
      <span className="rm">Read more</span>
    </Link>
  );
}
