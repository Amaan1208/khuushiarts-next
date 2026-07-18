"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PETAL_COUNT = 8;
const PETAL_STAGGER = 0.4;
const PETAL_DURATION = 0.8;
const FLOWER_START_DELAY = 0.5;
const POST_BLOOM_PAUSE = 0.5;
const EXIT_DURATION = 0.9;
const BEIGE = "#E7D8BC";

const TOTAL_BLOOM_TIME = (PETAL_COUNT - 1) * PETAL_STAGGER + PETAL_DURATION;
const EXIT_TRIGGER_MS = (FLOWER_START_DELAY + TOTAL_BLOOM_TIME + POST_BLOOM_PAUSE) * 1000;

function Flower() {
  return (
    <svg width="110" height="110" viewBox="0 0 200 200" className="overflow-visible">
      {Array.from({ length: PETAL_COUNT }).map((_, i) => (
        <g key={i} transform={`rotate(${i * (360 / PETAL_COUNT)} 100 100)`}>
          <motion.ellipse
            cx="100"
            cy="55"
            rx="17"
            ry="44"
            fill={BEIGE}
            style={{ transformOrigin: "100px 100px" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: FLOWER_START_DELAY + i * PETAL_STAGGER,
              duration: PETAL_DURATION,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />
        </g>
      ))}
      <circle cx="100" cy="100" r="13" fill={BEIGE} />
    </svg>
  );
}

export default function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      onComplete();
    }, EXIT_TRIGGER_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black"
      initial={{ y: 0 }}
      animate={{ y: exiting ? "-100%" : 0 }}
      transition={{ duration: EXIT_DURATION, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => {
        if (exiting) setGone(true);
      }}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 md:gap-12">
        <motion.h1
          className="text-2xl md:text-4xl font-black tracking-tight text-center px-6"
          style={{ fontFamily: "var(--font-playfair)", color: BEIGE }}
          initial={{ opacity: 0, y: -46 }}
          animate={{ opacity: 1, y: -70 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Khuushi Art Studio
        </motion.h1>
        <Flower />
      </div>
    </motion.div>
  );
}
