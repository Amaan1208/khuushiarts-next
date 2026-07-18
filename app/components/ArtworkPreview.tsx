"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Artwork } from "../data/artworks";

const WHATSAPP_NUMBER = "919871926784";
const EASE = [0.32, 0.72, 0, 1] as const;

const CATEGORY_LABELS: Record<Artwork["category"], string> = {
  tanjore: "Tanjore Painting",
  miniature: "Miniature Painting",
  pichwai: "Pichwai Painting",
  canvas: "Canvas Work",
};

function whatsappOrderUrl(art: Artwork) {
  const message = `Hi, I'm interested in ordering "${art.title}" (${art.year}).`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ArtworkPreview({
  art,
  onClose,
}: {
  art: Artwork;
  onClose: () => void;
}) {
  // Escape closes; page behind the sheet must not scroll while it's open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/55 backdrop-blur-xl p-0 md:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${art.title} preview`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative w-full min-w-0 max-w-full md:max-w-5xl max-h-[92dvh] md:max-h-[85dvh] overflow-y-auto overflow-x-hidden md:overflow-hidden bg-[#f9f6ef] rounded-t-[1.75rem] md:rounded-[1.75rem] shadow-[0_40px_120px_rgba(0,0,0,0.55)] grid grid-cols-1 md:grid-cols-[1.15fr_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close — quiet circular control, Apple-sheet style */}
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#2c2520]/[0.07] hover:bg-[#2c2520]/[0.14] active:scale-95 flex items-center justify-center cursor-pointer border-none outline-none transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="#2c2520" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Artwork — sits in a recessed well so the piece reads as framed */}
        <div className="bg-[#eee7d4] flex items-center justify-center p-8 md:p-12 min-h-[46dvh] md:min-h-0">
          <div className="relative w-full h-[38dvh] md:h-[62dvh]">
            <Image
              src={art.src}
              alt={`${art.title}, ${art.year}`}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-contain drop-shadow-[0_18px_40px_rgba(44,37,32,0.25)]"
              priority
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center gap-5 px-7 py-9 md:px-12 md:py-14">
          <p
            className="text-[11px] uppercase tracking-[0.18em] text-[#2c2520]/60 m-0"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {CATEGORY_LABELS[art.category]}
          </p>

          <h2
            className="text-3xl md:text-[2.5rem] leading-[1.1] font-bold text-[#2c2520] m-0"
            style={{ fontFamily: "var(--font-playfair)", textWrap: "balance" }}
          >
            {art.title}
          </h2>

          <div className="h-px w-full bg-[#2c2520]/10" />

          <p
            className="text-[0.9rem] leading-[1.75] text-[#2c2520]/75 m-0 max-w-[42ch]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            {art.description}
          </p>

          <p
            className="text-xs text-[#2c2520]/60 m-0"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Original hand-painted work · {art.year}
          </p>

          <a
            href={whatsappOrderUrl(art)}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-3 self-start inline-flex items-center gap-3 bg-[#2c2520] text-[#f9f6ef] rounded-full pl-6 pr-2 py-2 no-underline active:scale-[0.98] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span className="text-[0.82rem] tracking-wide">Order via WhatsApp</span>
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f9f6ef" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
