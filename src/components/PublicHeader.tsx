"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartIcon from "@/components/CartIcon";

const menuItems = [
  { label: "SHOP", href: "/shop" },
  { label: "BLOG", href: "/blog" },
  { label: "RADIO", href: "/radio" },
  { label: "OPTIONS", href: "/options" },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const isHiddenRoute =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/coming-soon");

  if (isHiddenRoute) return null;

  return (
    <header className="v-public-header">
      <div className="v-public-header-main">
        <div className="w-[82px] md:w-[116px]" aria-hidden />

        <div className="v-public-logo-zone relative z-10 flex flex-col items-center gap-3">
          <span className="v-public-logo-blur" aria-hidden />
          <Link href="/shop" aria-label="Vicious shop home">
            <Image
              src="/images/logo-white.png"
              alt="Vicious"
              width={140}
              height={52}
              className="v-public-logo h-auto w-[84px] md:w-[130px]"
              priority
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-1.5">
            {menuItems.map((item) => {
              const active = item.href === "/shop" ? pathname.startsWith("/shop") : pathname.startsWith(item.href);

              return (
                <Link key={item.href} href={item.href} className={`v-chip ${active ? "v-chip-active" : ""}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <CartIcon variant="minimal" className="relative z-10" />
      </div>
    </header>
  );
}
