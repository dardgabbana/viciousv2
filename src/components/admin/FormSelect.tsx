import { SelectHTMLAttributes } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormSelect({ label, error, children, ...props }: FormSelectProps) {
  return (
    <div className="mb-4">
      <label className="admin-input-label">{label}</label>
      <select className="admin-input cursor-pointer" style={error ? { borderColor: "#7b3a44" } : undefined} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-[#e5a7b2]">{error}</p>}
    </div>
  );
}
