import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PageBackground from "@/components/PageBackground";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      variations: {
        include: { options: true },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const moreProducts = await db.product.findMany({
    where: { id: { not: productId } },
    include: {
      variations: {
        include: { options: true },
        orderBy: { id: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <PageBackground className="min-h-screen" fixed>
      <ProductClient product={product} moreProducts={moreProducts} />
    </PageBackground>
  );
}
