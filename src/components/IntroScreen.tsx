"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function IntroScreen() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return sessionStorage.getItem("siteEntered") !== "true";
    } catch {
      return true;
    }
  });
  const [fadeOut, setFadeOut] = useState(false);
  const isLoaded = true;
  const clickSoundRef = useRef<HTMLAudioElement>(null);

  const handleEnter = () => {
    try {
      if (clickSoundRef.current) {
        clickSoundRef.current.currentTime = 0;
        void clickSoundRef.current.play().catch(() => {});
      }
    } catch {
      // Ignore audio failures
    }

    setFadeOut(true);
    try {
      sessionStorage.setItem("siteEntered", "true");
    } catch {
      // Ignore storage failures
    }
    window.dispatchEvent(new CustomEvent("playBackgroundMusic"));

    setTimeout(() => {
      setShow(false);
    }, 500);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black ${isLoaded ? "cursor-pointer" : ""}`}
      onClick={handleEnter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleEnter();
        }
      }}
      role="button"
      tabIndex={0}
      style={{ opacity: fadeOut ? 0 : 1, transition: "opacity 0.5s ease-out" }}
    >
      <audio ref={clickSoundRef} src="/12.mp3" preload="metadata" />

      <div className="mb-8">
        <Image
          src="/images/logo-white.png"
          alt="Vicious"
          width={350}
          height={130}
          className="w-[200px] md:w-[350px] h-auto"
          priority
        />
      </div>

      <p
        className="animate-pulse v-ui-11"
        style={{ color: "#8f8f8f", opacity: isLoaded ? 1 : 0.9, transition: "opacity 0.3s ease-in" }}
      >
        CLICK TO ENTER
      </p>
    </div>
  );
}
