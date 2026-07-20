interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
  fixed?: boolean;
}

export default function PageBackground({ children, className = "", fixed = false }: PageBackgroundProps) {
  return (
    <div className={`v-site-shell ${className}`}>
      <div
        className={`absolute inset-0 ${fixed ? "fixed" : ""} v-site-overlay-grid`}
        style={{ zIndex: 0, pointerEvents: "none" }}
      />
      <div
        className={`absolute inset-0 ${fixed ? "fixed" : ""} v-site-overlay-noise`}
        style={{ zIndex: 0, pointerEvents: "none" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
