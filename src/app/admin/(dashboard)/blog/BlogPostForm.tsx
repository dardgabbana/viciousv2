"use client";

import type { BlogPost } from "@prisma/client";
import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import FormInput from "@/components/admin/FormInput";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { isRenderableImageSrc } from "@/lib/image";

interface BlogPostFormProps {
  post?: BlogPost;
  action: (formData: FormData) => Promise<void>;
}

export default function BlogPostForm({ post, action }: BlogPostFormProps) {
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data?.error || "Upload failed.");
        return;
      }
      if (data.url) setCoverImage(data.url);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <form action={action}>
      <FormInput label="Title" name="title" defaultValue={post?.title} required placeholder="Post title" />
      <div className="mb-4">
        <label className="admin-input-label">Cover Image</label>

        {isRenderableImageSrc(coverImage) ? (
          <div className="mb-3">
            <div className="relative w-full max-w-md h-44 rounded-md border border-[#2d3646] overflow-hidden">
              <Image src={coverImage} alt="Cover preview" fill className="object-cover" />
            </div>
            <div className="mt-2 flex gap-2">
              <button type="button" className="admin-btn admin-btn-secondary px-3 py-1.5" onClick={() => setCoverImage("")}>
                Remove
              </button>
            </div>
          </div>
        ) : null}

        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="admin-input mb-2" />
        <input
          type="text"
          className="admin-input"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="/images/your-image.jpg or https://..."
        />
        <input type="hidden" name="coverImage" value={coverImage} />
        <p className="admin-subheading mt-1">{uploading ? "Uploading..." : "Upload an image or paste a URL/path."}</p>
        {uploadError ? <p className="mt-1 text-xs text-[#e5a7b2]">{uploadError}</p> : null}
      </div>
      <RichTextEditor label="Content" name="content" initialValue={post?.content || ""} />

      <label className="inline-flex items-center gap-2 mb-6">
        <input type="checkbox" name="published" defaultChecked={post?.published || false} />
        <span className="admin-subheading">Published</span>
      </label>

      <div className="flex gap-3">
        <button type="submit" className="admin-btn">
          {post ? "Update" : "Create"} Post
        </button>
        <Link href="/admin/blog" className="admin-btn admin-btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
