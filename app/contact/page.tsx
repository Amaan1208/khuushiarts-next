"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import SiteNav from "../components/SiteNav";

const STYLES = ["Tanjore", "Miniature", "Pichwai", "Canvas"] as const;

const inputClass =
  "w-full bg-transparent border-0 border-b border-stone-400 focus:border-stone-900 outline-none rounded-none px-0 py-1 md:py-1.5 text-sm text-[#000000] placeholder:text-[#000000]/60 transition-colors duration-300";

export default function ContactPage() {
  const [style, setStyle] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, 6));
  };

  return (
    <div
      className="relative h-[100dvh] overflow-hidden flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url(/images/contact-img.png)" }}
    >
      <SiteNav />

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2">
        {/* Left: photo + description */}
        <div className="hidden md:flex flex-col justify-center px-8 lg:px-16 py-10 h-full">
          <div className="max-w-md mx-auto w-full">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[#000000]/50 mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              KhuushiArts · Bespoke Commission
            </p>
            <h1
              className="text-3xl lg:text-4xl font-black leading-[1.05] text-[#000000] mb-6"
              style={{ fontFamily: "var(--font-playfair)", textWrap: "balance" }}
            >
              Commission a piece
            </h1>

            {/* Ornate double-border frame, echoing the gilt frames in the gallery */}
            <div className="p-2 bg-[#000000]/90">
              <div className="p-1 border border-[#ede0c4]/40">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/photos/download-7.jpg"
                    alt="Close detail of raised gold leaf on a Tanjore panel"
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Ornamental divider */}
            <div className="flex items-center gap-3 mt-7" aria-hidden>
              <span className="h-px flex-1 bg-[#000000]/20" />
              <span className="w-1.5 h-1.5 rotate-45 bg-[#000000]/40" />
              <span className="h-px flex-1 bg-[#000000]/20" />
            </div>
          </div>
        </div>

        {/* Right: the form — fixed box, no internal scroll */}
        <div className="h-full px-0 py-3 md:p-4 flex items-center justify-center md:justify-start">
          <div className="w-full max-w-sm md:max-w-lg md:h-full flex flex-col justify-center bg-[#ede0c4] border border-[#000000]/15 shadow-[0_20px_60px_rgba(0,0,0,0.12)] px-6 py-7 md:px-10 md:py-0 lg:px-14 max-h-[88dvh] overflow-y-auto md:overflow-visible md:max-h-none">
            {submitted ? (
              <div className="max-w-lg w-full mx-auto border-t border-[#000000]/25 pt-8">
                <h2
                  className="text-2xl font-black text-[#000000] mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Request received
                </h2>
                <p
                  className="text-sm leading-relaxed text-[#000000]/80"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Thank you. Khuushi reads every commission brief personally and will
                  reply within a few days with first thoughts and a timeline.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="max-w-sm w-full mx-auto space-y-1.5 md:space-y-7 text-left"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <h2
                  className="md:hidden text-2xl font-black text-[#000000] mb-1"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Commission a piece
                </h2>

                <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-1.5 md:gap-y-5">
                  <label className="block col-span-2">
                    <span className="block text-xs uppercase tracking-widest text-[#000000]/80 mb-0.5 md:mb-1">
                      Full name
                    </span>
                    <input required name="name" type="text" autoComplete="name" placeholder="Aditi Sharma" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="block text-xs uppercase tracking-widest text-[#000000]/80 mb-0.5 md:mb-1">
                      Email
                    </span>
                    <input required name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="block text-xs uppercase tracking-widest text-[#000000]/80 mb-0.5 md:mb-1">
                      Phone
                    </span>
                    <input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" className={inputClass} />
                  </label>
                </div>

                <div>
                  <span className="block text-xs uppercase tracking-widest text-[#000000]/80 mb-1 md:mb-1.5">
                    Style
                  </span>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {STYLES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStyle(s)}
                        aria-pressed={style === s}
                        className={`cursor-pointer rounded-full border px-3 py-0.5 md:px-3.5 md:py-1 text-xs uppercase tracking-widest transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                          style === s
                            ? "bg-[#000000] text-[#ede0c4] border-[#000000]"
                            : "bg-transparent text-[#000000] border-stone-400 hover:border-stone-900"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <label className="block">
                    <span className="block text-xs uppercase tracking-widest text-[#000000]/80 mb-0.5 md:mb-1">
                      Width (cm)
                    </span>
                    <input name="width" type="number" min="10" max="400" placeholder="60" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="block text-xs uppercase tracking-widest text-[#000000]/80 mb-0.5 md:mb-1">
                      Height (cm)
                    </span>
                    <input name="height" type="number" min="10" max="400" placeholder="90" className={inputClass} />
                  </label>
                </div>

                <label className="block">
                  <span className="block text-xs uppercase tracking-widest text-[#000000]/80 mb-0.5 md:mb-1">
                    Describe your vision
                  </span>
                  <textarea
                    required
                    name="vision"
                    rows={2}
                    placeholder="The deity or subject, colors you love, where the piece will hang."
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </label>

                <div>
                  <span className="block text-xs uppercase tracking-widest text-[#000000]/80 mb-1 md:mb-1.5">
                    Reference images
                  </span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      addFiles(e.dataTransfer.files);
                    }}
                    className={`cursor-pointer border border-dashed px-4 py-1.5 md:px-5 md:py-4 text-center transition-colors duration-300 ${
                      dragging
                        ? "border-stone-900 bg-[#000000]/5"
                        : "border-stone-400 hover:border-stone-900"
                    }`}
                  >
                    <p className="m-0 text-xs text-[#000000]/80" style={{ fontWeight: 300 }}>
                      Drop images here, or click to browse (up to 6).
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => addFiles(e.target.files)}
                    />
                  </div>
                  {files.length > 0 && (
                    <ul className="m-0 mt-2 p-0 list-none space-y-1">
                      {files.map((f, i) => (
                        <li
                          key={`${f.name}-${i}`}
                          className="flex items-center justify-between text-xs text-[#000000]/80"
                        >
                          <span className="truncate">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                            className="cursor-pointer bg-transparent border-none text-[#000000]/70 hover:text-[#000000] px-2"
                            aria-label={`Remove ${f.name}`}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-center md:block">
                  <button
                    type="submit"
                    className="group cursor-pointer inline-flex items-center gap-3 bg-[#000000] text-[#ede0c4] border-none rounded-full pl-6 pr-2 py-1.5 md:py-2 text-xs uppercase tracking-widest transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
                  >
                    Send commission request
                    <span className="w-7 h-7 rounded-full bg-[#ede0c4]/15 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
