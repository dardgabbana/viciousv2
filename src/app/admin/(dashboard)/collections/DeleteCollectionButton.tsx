"use client";

import { deleteCollection } from "@/lib/actions/collections";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteCollectionButtonProps {
  id: number;
  name: string;
}

export default function DeleteCollectionButton({ id }: DeleteCollectionButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    await deleteCollection(id);
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
