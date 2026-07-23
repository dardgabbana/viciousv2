import { CSSProperties } from "react";

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "11.2896px",
  md: "14px",
  lg: "18px",
};

export default function GlowText({ children, className = "", style, size = "md" }: GlowTextProps) {
  return (
    <p
      className={`v-muted ${className}`}
      style={{
        fontFamily: "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: sizeStyles[size],
        letterSpacing: "0.05em",
        ...style,
      }}
    >
      {children}
    </p>
  );
}
