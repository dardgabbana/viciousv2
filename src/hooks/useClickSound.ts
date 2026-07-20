"use client";

import { useCallback, useEffect, useRef } from "react";

export function useClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/12.mp3");
    audioRef.current.preload = "auto";
  }, []);

  const playClickSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return playClickSound;
}
