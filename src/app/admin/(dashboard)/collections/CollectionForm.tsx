"use client";

import { Collection } from "@prisma/client";
import FormInput from "@/components/admin/FormInput";
import FormTextarea from "@/components/admin/FormTextarea";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface CollectionFormProps {
  collection?: Collection;
  action: (formData: FormData) => Promise<void>;
}

export default function CollectionForm({ collection, action }: CollectionFormProps) {
  const [imagePreview, setImagePreview] = useState(collection?.image || "");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImagePreview(data.url);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setUploading(false);
  };

  return (
    <form action={action}>
      <FormInput label="Name" name="name" defaultValue={collection?.name} required placeholder="Collection name" />

      <FormTextarea label="Description (Optional)" name="description" defaultValue={collection?.description || ""} placeholder="Collection description" />

      <div className="mb-4">
        <label className="admin-input-label">Image (Optional)</label>

        {imagePreview && (
          <div className="mb-3 w-32 h-32 relative rounded-md overflow-hidden border border-[#2d3646]">
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="admin-input" />
        <input type="hidden" name="image" value={imagePreview} />
        {uploading && <p className="mt-1 text-sm text-[#b9cbe8]">Uploading...</p>}
      </div>

      <div className="flex gap-3 mt-6">
        <button type="submit" className="admin-btn">
          {collection ? "Update" : "Create"} Collection
        </button>
        <Link href="/admin/collections" className="admin-btn admin-btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
