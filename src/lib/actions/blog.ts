"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBlogPost(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const published = formData.get("published") === "on";

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  await db.blogPost.create({
    data: {
      title,
      content,
      coverImage: coverImage || null,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const published = formData.get("published") === "on";

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Post not found");
  }

  await db.blogPost.update({
    where: { id },
    data: {
      title,
      content,
      coverImage: coverImage || null,
      published,
      publishedAt: published ? existing.publishedAt || new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: number) {
  await db.blogPost.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${id}`);
}
