"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import SiteNav from "../components/SiteNav";
import { useCircleNav } from "../components/CircleTransition";
import { artworks } from "../data/artworks";
import { CATEGORIES } from "./categories";

function CategoryGateway() {
  const navigate = useCircleNav();
  const reduce = useReducedMotion();

  return (
    <section className="h-full w-full bg-black flex flex-col items-center justify-center gap-14 md:gap-20 px-4 md:px-16 overflow-y-auto py-10 md:py-0">
      <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-12 md:flex md:flex-wrap md:items-start md:justify-center md:gap-x-24 md:gap-y-20">
        {CATEGORIES.map((cat, i) => {
          const count = artworks.filter((a) => a.category === cat.slug).length;
          return (
            <a
              key={cat.slug}
              href={`/collection/${cat.slug}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                navigate(`/collection/${cat.slug}`, e.currentTarget);
              }}
              className="group flex flex-col items-center text-center no-underline [perspective:1200px] w-[134px] sm:w-44 md:w-auto"
            >
              <div
                className={`relative w-[134px] sm:w-44 md:w-56 aspect-[3/4] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] ${
                  reduce ? "" : "animate-float-rotate"
                }`}
                style={{ animationDelay: `${i * -1.7}s` }}
              >
                <Image
                  src={cat.preview}
                  alt={`Preview of ${cat.name}`}
                  fill
                  sizes="(max-width: 768px) 45vw, 220px"
                  className="object-cover"
                />
              </div>
              <span
                className="mt-7 text-[11px] md:text-sm uppercase tracking-[0.2em] text-[#ede0c4] group-hover:text-white transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {cat.name}
              </span>
              <span
                className="mt-1.5 text-[9px] md:text-[10px] uppercase tracking-widest text-[#ede0c4]/50"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {count} works
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default function CollectionPage() {
  return (
    <div
      className="relative h-[100dvh] overflow-hidden flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url(/images/hero-img.png)" }}
    >
      <SiteNav variant="dark" />
      <div className="flex-1 min-h-0">
        <CategoryGateway />
      </div>
    </div>
  );
}
