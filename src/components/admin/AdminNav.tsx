"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-sidebar">
      <div className="mb-6">
        <Link href="/" className="admin-heading" style={{ fontSize: "18px" }}>
          VICIOUS
        </Link>
        <p className="admin-subheading mt-1">Admin</p>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm ${isActive ? "bg-[#1f2d46] text-[#eef4ff] border border-[#324865]" : "text-[#c0c8d5] border border-transparent hover:bg-[#181d27]"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <form action={logoutAction} className="mt-8">
        <button type="submit" className="admin-btn admin-btn-secondary w-full">
          Logout
        </button>
      </form>
    </nav>
  );
}
