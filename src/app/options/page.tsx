"use client";

import { useState } from "react";
import PageTitle from "@/components/PageTitle";
import PageFooter from "@/components/PageFooter";
import PageBackground from "@/components/PageBackground";

export default function Options() {
  const [volume, setVolume] = useState(() => {
    if (typeof window === "undefined") return 0.5;
    const savedVolume = window.localStorage.getItem("musicVolume");
    return savedVolume ? Number.parseFloat(savedVolume) : 0.5;
  });

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    window.localStorage.setItem("musicVolume", newVolume.toString());
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <PageBackground className="flex flex-col items-center justify-center px-4">
      <PageTitle className="mb-8">Options</PageTitle>

      <div className="v-panel w-full max-w-md p-6">
        <label className="v-input-label mb-3">MUSIC VOLUME</label>

        <div className="flex items-center gap-3 w-full">
          <span className="v-ui-11 v-muted">MIN</span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f2f2f2 0%, #f2f2f2 ${volume * 100}%, #2a2a2a ${volume * 100}%, #2a2a2a 100%)`,
            }}
          />

          <span className="v-ui-11 v-muted">MAX</span>
        </div>

        <div className="mt-3">
          <span className="v-ui-11 v-muted">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <PageFooter />

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #f2f2f2;
          border: 1px solid #6c6c6c;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #f2f2f2;
          border: 1px solid #6c6c6c;
          cursor: pointer;
          border-radius: 0;
        }
      `}</style>
    </PageBackground>
  );
}
