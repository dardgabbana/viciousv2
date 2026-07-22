import Link from "next/link";
import { db } from "@/lib/db";
import DeleteBlogPostButton from "./DeleteBlogPostButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="admin-heading">Blog</h1>
        <Link href="/admin/blog/new" className="admin-btn">
          Add Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-card text-center py-10">
          <p className="admin-subheading">No blog posts yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.published ? "Published" : "Draft"}</td>
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/blog/${post.id}`} className="admin-btn admin-btn-secondary px-2.5 py-1.5">
                        View
                      </Link>
                      <Link href={`/admin/blog/${post.id}`} className="admin-btn admin-btn-secondary px-2.5 py-1.5">
                        Edit
                      </Link>
                      <DeleteBlogPostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
