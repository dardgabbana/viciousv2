"use client";

import { useEffect, useRef } from "react";

const COLS = 150;
const RAMP = " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

export default function AsciiLogoFooter() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !img || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = COLS;
    let rows = 0;
    let grid: number[][] = [];
    let charW = 8;
    let charH = 14;
    let fontSize = 13;
    let t = 0;
    let glitchBurst = 0;
    let rowOffsets: number[] = [];
    let corruptUntilClick = 0;
    let rafId = 0;
    let destroyed = false;

    function buildGrid() {
      const iw = img!.naturalWidth;
      const ih = img!.naturalHeight;
      const aspectCorrect = 0.52;
      rows = Math.max(1, Math.round(cols * (ih / iw) * aspectCorrect));

      const off = document.createElement("canvas");
      off.width = iw;
      off.height = ih;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img!, 0, 0);
      const data = octx.getImageData(0, 0, iw, ih).data;

      grid = new Array(rows);
      const cellW = iw / cols;
      const cellH = ih / rows;

      for (let r = 0; r < rows; r++) {
        grid[r] = new Array(cols);
        for (let c = 0; c < cols; c++) {
          const x0 = Math.floor(c * cellW);
          const x1 = Math.floor((c + 1) * cellW);
          const y0 = Math.floor(r * cellH);
          const y1 = Math.floor((r + 1) * cellH);
          let sum = 0;
          let count = 0;
          const stepX = Math.max(1, Math.floor((x1 - x0) / 4));
          const stepY = Math.max(1, Math.floor((y1 - y0) / 4));
          for (let y = y0; y < y1; y += stepY) {
            for (let x = x0; x < x1; x += stepX) {
              const idx = (y * iw + x) * 4;
              const alpha = data[idx + 3];
              sum += alpha / 255;
              count++;
            }
          }
          grid[r][c] = count ? sum / count : 0;
        }
      }
    }

    function sizeCanvas() {
      const maxW = wrap!.clientWidth;
      fontSize = Math.max(6, Math.floor(maxW / cols / 0.62));
      charW = fontSize * 0.62;
      charH = fontSize * 1.05;
      canvas!.width = Math.ceil(cols * charW);
      canvas!.height = Math.ceil(rows * charH);
      canvas!.style.width = "100%";
      canvas!.style.height = canvas!.height + "px";
    }

    function charFor(density: number) {
      const idx = Math.min(RAMP.length - 1, Math.max(0, Math.round(density * (RAMP.length - 1))));
      return RAMP[idx];
    }

    function draw() {
      if (destroyed) return;
      t++;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      if (glitchBurst <= 0 && Math.random() < 0.012) {
        glitchBurst = 6 + Math.floor(Math.random() * 10);
        rowOffsets = new Array(rows).fill(0).map(() =>
          Math.random() < 0.35 ? Math.random() * 30 - 15 : 0
        );
      }
      if (glitchBurst > 0) glitchBurst--;
      else rowOffsets = new Array(rows).fill(0);

      const chaos = corruptUntilClick > 0 ? 1 : 0;
      if (corruptUntilClick > 0) corruptUntilClick--;

      ctx!.font = fontSize + "px monospace";
      ctx!.textBaseline = "top";

      const pulse = 0.55 + 0.45 * Math.sin(t * 0.05);

      for (let r = 0; r < rows; r++) {
        const rowShift = rowOffsets[r] || 0;
        for (let c = 0; c < cols; c++) {
          let density = grid[r][c];
          if (density < 0.04 && Math.random() > 0.985) {
            density = Math.random() * 0.25;
          }
          if (density <= 0.02 && chaos === 0) continue;

          let d = density;
          if (Math.random() < 0.02 + chaos * 0.15) {
            d = Math.random();
          }

          const ch = charFor(d);
          const x = c * charW + rowShift;
          const y = r * charH;

          let color: string;
          const glitchPixel = glitchBurst > 0 && Math.random() < 0.08;
          if (glitchPixel) {
            color = Math.random() < 0.5 ? "#c0143c" : "#1560c4";
          } else if (d > 0.7) {
            const shade = Math.floor(10 + 10 * pulse);
            color = `rgb(${shade},${shade},${shade})`;
          } else if (d > 0.35) {
            color = "rgba(30,30,30,0.85)";
          } else {
            color = "rgba(80,80,80,0.5)";
          }
          ctx!.fillStyle = color;
          ctx!.fillText(ch, x, y);
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    function handleClick() {
      corruptUntilClick = 14;
      glitchBurst = 20;
      rowOffsets = new Array(rows).fill(0).map(() =>
        Math.random() < 0.5 ? Math.random() * 40 - 20 : 0
      );
    }

    function handleResize() {
      sizeCanvas();
    }

    function init() {
      buildGrid();
      sizeCanvas();
      rafId = requestAnimationFrame(draw);
    }

    if (img.complete && img.naturalWidth > 0) {
      init();
    } else {
      img.onload = init;
    }

    canvas.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full bg-white py-10 md:py-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src="/images/vicious-ascii-source.png" alt="" style={{ display: "none" }} />
      <canvas ref={canvasRef} className="block w-full cursor-pointer" />
    </div>
  );
}
