"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-height horizontal scroll track. Mouse wheel / trackpad vertical
 * scroll is remapped to horizontal movement (the standard pattern for
 * horizontal-scroll sites) — native horizontal swipe/drag still works
 * untouched. A thin progress bar at the bottom shows scroll position
 * since horizontal-only pages give no other wayfinding cue.
 */
export default function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // let pinch-zoom through
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      el.scrollLeft += delta;
      e.preventDefault();
    };

    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        className="flex h-full w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-black/10 z-40 pointer-events-none">
        <div
          className="h-full bg-black/60"
          style={{
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            transition: "width 100ms linear",
          }}
        />
      </div>
    </>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`shrink-0 w-screen h-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </section>
  );
}
