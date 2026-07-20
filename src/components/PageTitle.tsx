import { CSSProperties } from "react";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function PageTitle({ children, className = "", style }: PageTitleProps) {
  return (
    <h1 className={`v-title ${className}`} style={style}>
      {children}
    </h1>
  );
}
