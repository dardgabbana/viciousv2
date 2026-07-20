"use client";

import { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: ReactNode;
  isSelected?: boolean;
  size?: "sm" | "md" | "lg";
  spiky?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function GlowButton({
  children,
  isSelected = false,
  size = "md",
  className = "",
  style,
  onClick,
  disabled,
  type = "button",
}: GlowButtonProps) {
  const sizeStyles = {
    sm: { fontSize: "11.2896px", padding: "8px 12px" },
    md: { fontSize: "11.2896px", padding: "10px 14px" },
    lg: { fontSize: "13px", padding: "12px 16px" },
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1, scale: 1.01 }}
      whileTap={disabled ? undefined : { y: 0, scale: 0.99 }}
      transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={`v-btn ${className}`}
      style={{
        fontSize: sizeStyles[size].fontSize,
        padding: sizeStyles[size].padding,
        background: isSelected ? "#1a1a1a" : "#101010",
        borderColor: isSelected ? "#8a8a8a" : "#5f5f5f",
        minHeight: "36px",
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}
