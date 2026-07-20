import { createBlogPost } from "@/lib/actions/blog";
import BlogPostForm from "../BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="admin-heading mb-6">New Blog Post</h1>
      <div className="admin-card p-5 max-w-3xl">
        <BlogPostForm action={createBlogPost} />
      </div>
    </div>
  );
}
