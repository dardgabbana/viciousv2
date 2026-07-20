"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  "main > section",
  "main article",
  ".v-panel",
  ".v-blog-content",
].join(",");

export default function PremiumMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const root = document.querySelector<HTMLElement>(".v-route-transition");
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (elements.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("v-motion-visible"));
      return;
    }

    elements.forEach((element, index) => {
      element.classList.add("v-motion-reveal");
      element.style.setProperty("--v-reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("v-motion-visible");
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );

    const frame = window.requestAnimationFrame(() => {
      elements.forEach((element) => observer.observe(element));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
