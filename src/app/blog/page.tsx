import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import PageFooter from "@/components/PageFooter";
import PageBackground from "@/components/PageBackground";
import { isRenderableImageSrc } from "@/lib/image";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <PageBackground className="min-h-screen">
      <div className="pt-14 pb-24 px-4 md:px-8 max-w-5xl mx-auto">
        <h1 className="v-title mb-6">Blog</h1>

        {posts.length === 0 ? (
          <div className="admin-card p-6">
            <p className="v-ui-11 v-muted">NO POSTS YET</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block border border-[var(--v-border)] bg-black/40 hover:bg-black/60 transition-colors"
              >
                <article className="grid md:grid-cols-[220px_1fr] gap-0">
                  {isRenderableImageSrc(post.coverImage) ? (
                    <div className="relative h-[180px] md:h-full min-h-[180px] border-b md:border-b-0 md:border-r border-[var(--v-border)]">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="hidden md:block border-r border-[var(--v-border)]" />
                  )}

                  <div className="p-5">
                    <h2 className="v-ui-11 text-white text-[18px] leading-tight">{post.title}</h2>
                    <p className="v-ui-11 v-muted mt-2">
                      {(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <PageFooter />
    </PageBackground>
  );
}
