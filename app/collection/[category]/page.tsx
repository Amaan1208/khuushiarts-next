"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useCircleNav } from "../../components/CircleTransition";
import ArtworkPreview from "../../components/ArtworkPreview";
import { artworks, Artwork } from "../../data/artworks";
import { CATEGORIES } from "../categories";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Grid parallax-zoom cell: on open/scroll-into-view the frame fades and
 * scales in; once visible, the image itself keeps drifting/zooming very
 * slightly against its own frame as the page scrolls, so the grid feels
 * alive rather than static.
 */
function GalleryCell({
  art,
  index,
  onOpen,
}: {
  art: Artwork;
  index: number;
  onOpen: (art: Artwork) => void;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cellRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.22, 1.1, 1.22]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <motion.figure
      ref={cellRef}
      initial={reduce ? false : { opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3, margin: "-40px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.1, ease: EASE }}
      className="m-0"
    >
      <button
        onClick={() => onOpen(art)}
        aria-label={`Preview ${art.title}`}
        className="block w-full text-left cursor-pointer bg-transparent border-none p-0 outline-none"
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={reduce ? undefined : { scale: imageScale, y: imageY }}
          >
            <Image
              src={art.src}
              alt={`${art.title}, ${art.year}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        </div>
        <figcaption className="mt-4 flex items-baseline justify-between gap-4">
          <span
            className="text-base md:text-lg font-bold text-[#ede0c4]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {art.title}
          </span>
          <span
            className="shrink-0 text-xs uppercase tracking-widest text-[#ede0c4]/60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {art.year}
          </span>
        </figcaption>
      </button>
    </motion.figure>
  );
}

export default function CategoryGalleryPage() {
  const params = useParams<{ category: string }>();
  const navigate = useCircleNav();
  const [preview, setPreview] = useState<Artwork | null>(null);

  const category = CATEGORIES.find((c) => c.slug === params.category);
  const pieces = artworks.filter((a) => a.category === params.category);

  if (!category) {
    return (
      <div className="h-dvh flex items-center justify-center bg-black text-[#ede0c4]">
        <p style={{ fontFamily: "var(--font-inter)" }}>Unknown category.</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black text-[#ede0c4]">
      <header className="flex items-center justify-between px-5 md:px-8 py-6">
        <Link
          href="/collection"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            navigate("/collection", e.currentTarget);
          }}
          className="text-xs uppercase tracking-widest text-[#ede0c4]/80 hover:text-[#ede0c4] no-underline transition-colors duration-300"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ← Collection
        </Link>
        <h1
          className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#ede0c4]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {category.name}
        </h1>
      </header>

      <main className="px-5 md:px-8 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pt-6 md:pt-10">
          {pieces.map((art, i) => (
            <GalleryCell key={art.id} art={art} index={i} onOpen={setPreview} />
          ))}
        </div>
      </main>

      <AnimatePresence>
        {preview && <ArtworkPreview art={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}
