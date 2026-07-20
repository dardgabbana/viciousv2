import ViciousOS from "@/components/vicious-os/ViciousOS";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, collections, posts] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        image: true,
        images: true,
        description: true,
        category: true,
        createdAt: true,
      },
    }),
    db.collection.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        createdAt: true,
      },
    }),
    db.blogPost.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        content: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
      },
      take: 8,
    }),
  ]);

  return <ViciousOS products={products} collections={collections} posts={posts} />;
}
