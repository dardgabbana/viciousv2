import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import CartIcon from "@/components/CartIcon";
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
      category: true,
      variations: {
        include: { options: true },
        orderBy: { id: "asc" },
      },
    },
  });

  return (
    <main className="v-site-shell">
      <header className="sticky top-0 z-40 border-b border-[var(--v-border)] bg-black">
        <div className="relative h-[108px] px-3 md:px-4 flex items-center justify-between">
          <nav className="flex items-center gap-1.5">
            <Link href="/" className="v-chip">
              BACK
            </Link>
          </nav>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Image
              src="/images/logo-white.png"
              alt="Vicious"
              width={140}
              height={52}
              className="h-auto w-[84px] md:w-[130px]"
              priority
            />
          </div>

          <CartIcon variant="minimal" />
        </div>
      </header>

      <ShopClient products={products} />
    </main>
  );
}
