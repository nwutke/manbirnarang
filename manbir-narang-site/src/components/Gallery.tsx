"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Photo grid with a full-screen viewer. Other components can open it with openGallery(index). */
export function openGallery(index = 0) {
  window.dispatchEvent(new CustomEvent("open-gallery", { detail: index }));
}

export function GalleryButton({ count, className, children }: { count: number; className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" className={className ?? "btn o"} onClick={() => openGallery(0)}>
      {children ?? `View all ${count} photos`}
    </button>
  );
}

export default function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const n = photos.length;
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    const onOpen = (e: Event) => setOpen((e as CustomEvent<number>).detail ?? 0);
    window.addEventListener("open-gallery", onOpen);
    return () => window.removeEventListener("open-gallery", onOpen);
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, go]);

  if (n === 0) return null;

  return (
    <>
      <div className="lgal">
        {photos.map((src, i) => (
          <button type="button" key={src} className={"lgi" + (i === 0 ? " big" : "")} onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${n}`}>
            <img src={src} alt={`${title}, photo ${i + 1}`} loading={i < 5 ? "eager" : "lazy"} decoding="async" />
          </button>
        ))}
      </div>

      {open !== null ? (
        <div
          className="lbx"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photos`}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div className="lbxbar">
            <span>{open + 1} / {n}</span>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close photos">×</button>
          </div>
          <img className="lbximg" src={photos[open]} alt={`${title}, photo ${open + 1}`} />
          {n > 1 ? (
            <>
              <button type="button" className="lbxnav prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
              <button type="button" className="lbxnav next" onClick={() => go(1)} aria-label="Next photo">›</button>
            </>
          ) : null}
          {n > 1 ? <link rel="preload" as="image" href={photos[(open + 1) % n]} /> : null}
        </div>
      ) : null}
    </>
  );
}
