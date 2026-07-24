import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageBackground from "@/components/PageBackground";
import CartIcon from "@/components/CartIcon";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  const [product, moreProducts] = await Promise.all([
    db.product.findUnique({
      where: { id: productId },
      include: {
        variations: {
          include: { options: true },
          orderBy: { id: "asc" },
        },
      },
    }),
    db.product.findMany({
      where: { id: { not: productId } },
      include: {
        variations: {
          include: { options: true },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <PageBackground className="min-h-screen v-theme-light" fixed>
      <header className="sticky top-0 z-40 border-b border-[var(--v-border)] bg-white">
        <div className="relative h-[108px] px-3 md:px-4 flex items-center justify-between">
          <nav className="flex items-center gap-1.5">
            <Link href="/shop" className="v-chip">
              BACK
            </Link>
          </nav>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <Image
                src="/images/logo-black.png"
                alt="Vicious"
                width={140}
                height={52}
                className="h-auto w-[84px] md:w-[130px]"
                priority
              />
            </Link>
          </div>

          <CartIcon variant="minimal" />
        </div>
      </header>

      <ProductClient product={product} moreProducts={moreProducts} />
    </PageBackground>
  );
}
