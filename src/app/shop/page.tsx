import { db } from "@/lib/db";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function Shop() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      image: true,
      images: true,
      description: true,
      category: true,
      variations: {
        include: { options: true },
        orderBy: { id: "asc" },
      },
    },
  });

  return (
    <main className="v-site-shell">
      <ShopClient products={products} />
    </main>
  );
}
