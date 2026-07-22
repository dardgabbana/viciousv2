"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MenuItem {
  id: string;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: "shop", label: "SHOP", href: "/shop" },
  { id: "blog", label: "BLOG", href: "/blog" },
  { id: "radio", label: "RADIO", href: "/radio" },
  { id: "options", label: "OPTIONS", href: "/options" },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState("shop");
  const router = useRouter();

  const navigateWithSound = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = menuItems.findIndex((item) => item.id === selectedId);

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const newIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        setSelectedId(menuItems[newIndex].id);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const newIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        setSelectedId(menuItems[newIndex].id);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const menuItem = menuItems.find((item) => item.id === selectedId);
        if (menuItem) {
          navigateWithSound(menuItem.href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, navigateWithSound]);

  return (
    <main className="v-site-shell overflow-hidden">
      <div
        className="absolute inset-0 v-home-hero-bg"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.44), rgba(0,0,0,0.56)), url('/images/home-main-bg-desktop.jpeg')",
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundBlendMode: "normal",
          opacity: 0.88,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <Image
          src="/images/logo-white.png"
          alt="Vicious"
          width={320}
          height={114}
          className="h-auto w-[180px] md:w-[320px]"
          priority
        />

        <nav className="mt-10 flex items-center gap-1.5">
          {menuItems.map((item) => {
            const active = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setSelectedId(item.id)}
                onClick={() => navigateWithSound(item.href)}
                className={`v-chip ${active ? "v-chip-active" : ""}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="v-ui-11 v-muted mt-4">LEFT / RIGHT + ENTER</div>
      </div>
    </main>
  );
}
