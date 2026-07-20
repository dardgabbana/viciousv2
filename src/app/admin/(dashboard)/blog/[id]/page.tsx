import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateBlogPost } from "@/lib/actions/blog";
import BlogPostForm from "../BlogPostForm";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isFinite(numericId)) {
    notFound();
  }

  const post = await db.blogPost.findUnique({ where: { id: numericId } });
  if (!post) {
    notFound();
  }

  const updateWithId = updateBlogPost.bind(null, numericId);

  return (
    <div>
      <h1 className="admin-heading mb-6">Edit Blog Post</h1>
      <div className="admin-card p-5 max-w-3xl">
        <BlogPostForm post={post} action={updateWithId} />
      </div>
    </div>
  );
}
