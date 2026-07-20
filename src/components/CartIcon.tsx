"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";

const MotionLink = motion.create(Link);

interface CartIconProps {
  variant?: "default" | "minimal";
  className?: string;
}

export default function CartIcon({ variant = "default", className = "" }: CartIconProps) {
  const { itemCount } = useCart();

  return (
    <MotionLink
      href="/checkout"
      whileTap={{ scale: 0.98 }}
      transition={{ type: "tween", duration: 0.08, ease: "easeOut" }}
      className={`${variant === "minimal" ? "v-chip" : "fixed top-4 right-4 z-50 v-btn px-3 py-2 inline-flex items-center gap-2"} ${className}`}
    >
      <span className="v-ui-11">CART</span>
      <span className="v-ui-11" style={{ minWidth: "14px", textAlign: "center" }}>
        {itemCount}
      </span>
    </MotionLink>
  );
}
