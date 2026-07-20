import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="mb-4">
      <label className="admin-input-label">{label}</label>
      <input className="admin-input" style={error ? { borderColor: "#7b3a44" } : undefined} {...props} />
      {error && <p className="mt-1 text-xs text-[#e5a7b2]">{error}</p>}
    </div>
  );
}
