"use client";

/**
 * Animated stat strip. Not mounted on any page right now.
 * The figures in STATS5, STATS4, and STATS_SELL (src/lib/data.ts) are placeholders.
 * Render <Stats items={...} /> again when the numbers are real.
 */

import { useEffect, useRef } from "react";

export default function Stats({ items }: { items: [string, string][] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = Array.from(root.current?.querySelectorAll<HTMLElement>(".cn") ?? []);
    const parse = (e: HTMLElement) => {
      const m = /^(\D*)([\d.]+)(.*)$/.exec(e.dataset.v || "");
      return m ? { p: m[1], n: parseFloat(m[2]), d: (m[2].split(".")[1] || "").length, s: m[3] } : null;
    };
    const set = (e: HTMLElement, v: number) => {
      const x = parse(e);
      if (x) e.textContent = x.p + (x.d ? v.toFixed(x.d) : Math.round(v)) + x.s;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    nodes.forEach((e) => set(e, 0));
    const frames: number[] = [];
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          const e = en.target as HTMLElement;
          const x = parse(e);
          if (!x) return;
          let t0 = 0;
          const step = (t: number) => {
            if (!t0) t0 = t;
            const k = Math.min((t - t0) / 1500, 1);
            set(e, x.n * (1 - Math.pow(1 - k, 3)));
            if (k < 1) frames.push(requestAnimationFrame(step));
          };
          timers.push(window.setTimeout(() => frames.push(requestAnimationFrame(step)), (Number(e.dataset.i) || 0) * 150));
        });
      },
      { threshold: 0.7 }
    );
    nodes.forEach((e) => io.observe(e));
    return () => {
      io.disconnect();
      frames.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
      nodes.forEach((e) => (e.textContent = e.dataset.v || ""));
    };
  }, []);

  return (
    <div className="stats" ref={root}>
      <div className="w sl">
        {items.map(([v, label], i) => (
          <div className="sr" key={label}>
            <b className="gt cn" data-v={v} data-i={i}>
              {v}
            </b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
