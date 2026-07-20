"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrderStatusSelectProps {
  orderId: number;
  currentStatus: string;
}

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSaving(true);
    setError("");

    try {
      await updateOrderStatus(orderId, newStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to update");
      setStatus(currentStatus);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select value={status} onChange={handleChange} disabled={saving} className="admin-input max-w-[180px]">
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {saving && <span className="admin-subheading">Saving...</span>}
      {saved && <span className="text-sm text-[#9de2ad]">Saved</span>}
      {error && <span className="text-sm text-[#f3b3bc]">{error}</span>}
    </div>
  );
}
