import Link from "next/link";
import type { ReactNode } from "react";

export function Btn({ href, children, solid = false }: { href: string; children: ReactNode; solid?: boolean }) {
  return (
    <Link href={href} className={"btn" + (solid ? "" : " o")}>
      {children}
    </Link>
  );
}

export function Orn() {
  return (
    <div className="orn">
      <i />
      <b />
      <i />
    </div>
  );
}

export function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="sh">
      <Orn />
      <h2>{title}</h2>
      {sub ? <p>{sub}</p> : null}
    </div>
  );
}

export function PageHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="ph">
      <h1 className="gt">{title}</h1>
      <Orn />
      <p>{sub}</p>
    </div>
  );
}

export function Cta({ title, text, button, href }: { title: string; text: string; button: string; href: string }) {
  return (
    <div className="cta">
      <div className="w">
        <Orn />
        <h2>{title}</h2>
        <p>{text}</p>
        <Btn href={href} solid>
          {button}
        </Btn>
      </div>
    </div>
  );
}

export function Steps({ items }: { items: [string, string, string][] }) {
  return (
    <div className="steps">
      {items.map(([n, t, p]) => (
        <div className="st" key={n}>
          <b className="gt">{n}</b>
          <h3>{t}</h3>
          <p>{p}</p>
        </div>
      ))}
    </div>
  );
}

export function Testimonials({ items }: { items: { q: string; who: string; where: string }[] }) {
  return (
    <div className="g2">
      {items.map((t) => (
        <div className="tm" key={t.q}>
          <div className="stars">★★★★★</div>
          <p>“{t.q}”</p>
          <b>{t.who}</b>
          <span>{t.where}</span>
        </div>
      ))}
    </div>
  );
}
