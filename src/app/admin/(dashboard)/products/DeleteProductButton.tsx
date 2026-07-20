"use client";

import { deleteProduct } from "@/lib/actions/products";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
  id: number;
  title: string;
}

export default function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    await deleteProduct(id);
    router.refresh();
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button onClick={handleDelete} disabled={deleting} className="admin-btn admin-btn-danger px-2.5 py-1.5">
          {deleting ? "..." : "Yes"}
        </button>
        <button onClick={() => setShowConfirm(false)} className="admin-btn admin-btn-secondary px-2.5 py-1.5">
          No
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setShowConfirm(true)} className="admin-btn admin-btn-danger px-2.5 py-1.5">
      Delete
    </button>
  );
}
