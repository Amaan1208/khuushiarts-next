"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";

const DURATION = 550;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

type Phase = "idle" | "cover" | "reveal";

interface CircleTransitionContextValue {
  /** Navigate to `href`, growing a circle from `originEl`'s top-center. */
  navigate: (href: string, originEl: HTMLElement) => void;
}

const CircleTransitionContext = createContext<CircleTransitionContextValue | null>(null);

export function useCircleNav() {
  const ctx = useContext(CircleTransitionContext);
  if (!ctx) {
    throw new Error("useCircleNav must be used inside <CircleTransitionProvider>");
  }
  return ctx.navigate;
}

export default function CircleTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [origin, setOrigin] = useState({ x: 0, y: 0, r: 0 });
  const pendingHref = useRef<string | null>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const navigate = useCallback(
    (href: string, originEl: HTMLElement) => {
      if (phase !== "idle" || href === pathname) return;

      if (reduceMotion.current) {
        router.push(href);
        return;
      }

      const rect = originEl.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));

      setOrigin({ x, y, r });
      pendingHref.current = href;
      requestAnimationFrame(() => setPhase("cover"));
    },
    [phase, pathname, router]
  );

  // Once fully covered, actually change route.
  useEffect(() => {
    if (phase !== "cover") return;
    const t = setTimeout(() => {
      if (pendingHref.current) router.push(pendingHref.current);
    }, DURATION);
    return () => clearTimeout(t);
  }, [phase, router]);

  // Once the new route has mounted, reverse the circle to reveal it.
  useEffect(() => {
    if (phase === "cover" && pendingHref.current && pathname === pendingHref.current) {
      pendingHref.current = null;
      requestAnimationFrame(() => setPhase("reveal"));
    }
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => setPhase("idle"), DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  const radius = phase === "cover" ? origin.r : 0;
  const noTransition = phase === "idle" && radius === 0;

  return (
    <CircleTransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[9999] bg-black"
        style={{
          clipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          WebkitClipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          transition: noTransition ? "none" : `clip-path ${DURATION}ms ${EASE}`,
        }}
      />
    </CircleTransitionContext.Provider>
  );
}
