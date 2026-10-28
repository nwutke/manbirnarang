"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const REVEAL =
  ".sh,.meet>div,.ab>div,.two>div,.row>div,.sb,.strip,.pt,.ptl,.tm,.bl,.lc,.hd,.st,.sr,.calc>div,.cta .w>*,.q h2,.ph>*,.svc2>div,.tri>div,.chips,.orn,.fok";

/** Page-wide polish: sticky nav state, progress bar, hero parallax, scroll reveals, synced shine. */
export default function Effects() {
  const path = usePathname();

  // Which page are we on (home hides the small nav logo over the hero)
  useIso(() => {
    document.body.classList.toggle("home", path === "/");
    window.scrollTo(0, 0);
  }, [path]);

  // Scroll: sticky nav, progress bar, hero parallax
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prog = document.querySelector<HTMLElement>(".prog");
    const hc = document.querySelector<HTMLElement>(".hc");
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      document.body.classList.toggle("sc", y > 40);
      if (prog) prog.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + "%";
      if (hc && !reduce && y < 900) {
        hc.style.transform = `translateY(${y * 0.22}px)`;
        hc.style.opacity = String(Math.max(0, 1 - y / 650));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  // Fade-up reveals
  useIso(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL));
    const timers: number[] = [];
    els.forEach((e) => {
      e.classList.add("rv");
      e.dataset.d = String((Array.prototype.indexOf.call(e.parentNode!.children, e) % 4) * 90);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (!x.isIntersecting) return;
          const e = x.target as HTMLElement;
          io.unobserve(e);
          const d = Number(e.dataset.d) || 0;
          e.style.transitionDelay = d + "ms";
          e.classList.add("in");
          if (!e.classList.contains("orn")) {
            timers.push(
              window.setTimeout(() => {
                e.classList.remove("rv", "in");
                e.style.transitionDelay = "";
              }, d + 1300)
            );
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      els.forEach((e) => {
        e.classList.remove("rv", "in");
        e.style.transitionDelay = "";
      });
    };
  }, [path]);

  // Keep every shine animation (logo, buttons, stats) on the same clock
  useEffect(() => {
    const sync = () => {
      if (!document.getAnimations) return;
      document.getAnimations().forEach((a) => {
        const n = (a as CSSAnimation).animationName;
        if (n === "sw1" || n === "sw2") a.startTime = 0;
      });
    };
    const t = window.setTimeout(sync, 80);
    const i = window.setInterval(sync, 2500);
    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, [path]);

  return null;
}
