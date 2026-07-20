const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "#3a2f12", text: "#f5d37a", border: "#695526" },
  processing: { bg: "#12263d", text: "#9cc6ff", border: "#294468" },
  shipped: { bg: "#2e2043", text: "#c7a9ff", border: "#544170" },
  delivered: { bg: "#173321", text: "#8fe0a5", border: "#2f5d3d" },
  cancelled: { bg: "#3a1d23", text: "#f4b8c2", border: "#6a343e" },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span
      className="px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wide border"
      style={{ background: style.bg, color: style.text, borderColor: style.border }}
    >
      {status}
    </span>
  );
}
