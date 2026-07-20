"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface BackButtonProps {
  href?: string;
}

export default function BackButton({ href = "/" }: BackButtonProps) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  const handleBackClick = () => {
    router.push(href);
  };

  return (
    <motion.button
      onClick={handleBackClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "tween", duration: 0.08, ease: "easeOut" }}
      className="fixed top-4 left-4 z-50 px-3 py-2 flex items-center gap-2 v-btn"
      style={{ minWidth: "44px", minHeight: "36px" }}
    >
      <span className="v-ui-11" style={{ lineHeight: 1 }}>
        ←
      </span>
      <span className="v-ui-11">BACK</span>
    </motion.button>
  );
}
