import { TextareaHTMLAttributes } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function FormTextarea({ label, error, ...props }: FormTextareaProps) {
  return (
    <div className="mb-4">
      <label className="admin-input-label">{label}</label>
      <textarea className="admin-input min-h-[100px] resize-y" style={error ? { borderColor: "#7b3a44" } : undefined} {...props} />
      {error && <p className="mt-1 text-xs text-[#e5a7b2]">{error}</p>}
    </div>
  );
}
