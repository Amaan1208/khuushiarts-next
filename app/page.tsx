"use client";

import { useCallback, useState } from "react";
import Gallery from "./components/Gallery";
import IntroSplash from "./components/IntroSplash";

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const handleIntroComplete = useCallback(() => setRevealed(true), []);

  return (
    <main
      className="w-full h-dvh overflow-hidden overscroll-none touch-none"
      style={{ touchAction: "none" }}
    >
      <Gallery revealed={revealed} />
      <IntroSplash onComplete={handleIntroComplete} />
    </main>
  );
}
