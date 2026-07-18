"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import Gallery from "./components/Gallery";
import IntroSplash from "./components/IntroSplash";

const INTRO_SEEN_KEY = "khuushi-intro-seen";

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Runs before paint on every mount (including navigating back to "/" from
  // another page) — if the intro already played this browser session, skip
  // it and jump straight to revealed with no visible flash of the splash.
  useLayoutEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === "true") {
      setShowSplash(false);
      setRevealed(true);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    setRevealed(true);
    sessionStorage.setItem(INTRO_SEEN_KEY, "true");
  }, []);

  return (
    <main
      className="w-full h-dvh overflow-hidden overscroll-none touch-none"
      style={{ touchAction: "none" }}
    >
      <Gallery revealed={revealed} />
      {showSplash && <IntroSplash onComplete={handleIntroComplete} />}
    </main>
  );
}
