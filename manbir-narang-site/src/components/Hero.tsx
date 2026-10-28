"use client";

import { useEffect, useRef } from "react";
import { Btn } from "./ui";

// Deterministic pseudo-random so server and client render the same sparks
const sparks = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return { left: r(1) * 100, dur: 9 + r(2) * 12, delay: -r(3) * 20, scale: 0.6 + r(4) * 1.4 };
});

export default function Hero() {
  const v = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    el.muted = true;
    const go = () => {
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    };
    go();
    const evs = ["click", "touchstart", "scroll"] as const;
    evs.forEach((t) => document.addEventListener(t, go, { once: true, passive: true }));
    return () => evs.forEach((t) => document.removeEventListener(t, go));
  }, []);

  return (
    <div className="hero">
      <div className="vid">
        <div className="sky" />
        <div className="glow" />
        <div className="water" />
        <div className="sweep" />
        <video ref={v} className="hv" autoPlay muted loop playsInline preload="auto" poster="/hero-poster.jpg" src="/hero.mp4" />
        <div className="dust">
          {sparks.map((s, i) => (
            <i key={i} style={{ left: s.left + "%", animationDuration: s.dur + "s", animationDelay: s.delay + "s", transform: `scale(${s.scale})` }} />
          ))}
        </div>
        <div className="vig" />
      </div>
      <div className="hc">
        <div className="lw">
          <img className="hl" src="/logo.webp" alt="Manbir Narang, Realtor" />
        </div>
        <p className="tag">LUXURY REAL ESTATE · PORT ALBERNI &amp; THE ALBERNI VALLEY</p>
        <div className="hb">
          <Btn href="/properties" solid>View all listings</Btn>
          <Btn href="/sell">Home valuation</Btn>
        </div>
      </div>
      <div className="cue">SCROLL</div>
    </div>
  );
}
