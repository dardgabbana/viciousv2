"use client";

import { useTransition } from "react";
import { deleteBlogPost } from "@/lib/actions/blog";

interface DeleteBlogPostButtonProps {
  id: number;
  title: string;
}

export default function DeleteBlogPostButton({ id, title }: DeleteBlogPostButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    startTransition(async () => {
      await deleteBlogPost(id);
    });
  };

  return (
    <button type="button" onClick={handleDelete} disabled={isPending} className="admin-btn admin-btn-danger px-2.5 py-1.5">
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
