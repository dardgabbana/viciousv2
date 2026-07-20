"use client";

import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const hasEntered = sessionStorage.getItem("siteEntered") === "true";
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const savedVolume = localStorage.getItem("musicVolume");
    if (savedVolume) {
      audioEl.volume = Number.parseFloat(savedVolume);
    }

    if (hasEntered) {
      audioEl
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }

    const handleStorageChange = () => {
      const newVolume = localStorage.getItem("musicVolume");
      if (newVolume) {
        audioEl.volume = Number.parseFloat(newVolume);
      }
    };

    const handlePlayTrigger = () => {
      const savedVol = localStorage.getItem("musicVolume");
      if (savedVol) {
        audioEl.volume = Number.parseFloat(savedVol);
      }
      audioEl.play().then(() => {
        setIsPlaying(true);
      });
    };

    const handlePlayState = () => setIsPlaying(true);
    const handlePauseState = () => setIsPlaying(false);

    audioEl.addEventListener("play", handlePlayState);
    audioEl.addEventListener("pause", handlePauseState);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("playBackgroundMusic", handlePlayTrigger);

    return () => {
      audioEl.removeEventListener("play", handlePlayState);
      audioEl.removeEventListener("pause", handlePauseState);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("playBackgroundMusic", handlePlayTrigger);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/background.mp3" loop preload="none" />

      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 w-9 h-9 flex items-center justify-center v-btn"
        style={{ opacity: 0.88 }}
        title={isPlaying ? "Mute" : "Play Music"}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </button>
    </>
  );
}
