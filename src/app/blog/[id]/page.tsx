import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import PageBackground from "@/components/PageBackground";
import PageFooter from "@/components/PageFooter";
import { isRenderableImageSrc } from "@/lib/image";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  const post = await db.blogPost.findFirst({
    where: { id: postId, published: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <PageBackground className="min-h-screen v-theme-light">
      <div className="pt-20 pb-24 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/blog" className="v-chip">
            BACK
          </Link>
        </div>

        {isRenderableImageSrc(post.coverImage) && (
          <div className="relative w-full aspect-[16/8] border border-[var(--v-border)] mb-6">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <h1 className="v-title mb-3">{post.title}</h1>
        <p className="v-ui-11 v-muted mb-6">{(post.publishedAt || post.createdAt).toLocaleDateString()}</p>

        <article className="v-blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <PageFooter light />
    </PageBackground>
  );
}
