import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

const menuItems = [
  { label: "BLOG", href: "/blog" },
  { label: "RADIO", href: "/radio" },
  { label: "OPTIONS", href: "/options" },
];

export default async function Home() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, title: true, price: true, image: true },
  });

  return (
    <main className="min-h-screen w-full bg-white text-black flex flex-col px-6 md:px-16 py-10 md:py-14">
      <div className="flex justify-center md:justify-start">
        <Image
          src="/images/logo-black.png"
          alt="Vicious"
          width={200}
          height={71}
          className="h-auto w-[130px] md:w-[170px]"
          priority
        />
      </div>

      <div className="flex flex-col">
        <div className="px-2 py-16 md:py-24">
          <ProductGrid products={products} />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between gap-12 md:gap-8 py-12">
          <Image
            src="/images/logo-black.png"
            alt="Vicious"
            width={520}
            height={185}
            className="h-auto w-[240px] md:w-[380px] opacity-90 order-2 md:order-1"
          />

          <div className="flex flex-col items-center md:items-end gap-10 text-center md:text-right order-1 md:order-2">
            <nav className="flex flex-col gap-1.5 v-ui-11 uppercase">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-black/70 hover:text-black transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {products.length > 0 && (
              <div className="flex flex-col items-center md:items-end gap-2">
                <span className="v-ui-11 uppercase text-black/40 tracking-widest">
                  Latest Products
                </span>
                <ul className="flex flex-col items-center md:items-end gap-1.5">
                  {products.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/shop/${product.id}`}
                        className="v-ui-11 text-black/70 hover:text-black transition-colors"
                      >
                        {product.title} — ${product.price.toFixed(0)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-start">
        <span className="v-ui-11 text-black/40">
          © 2026 VICIOUS. ALL RIGHTS RESERVED.
        </span>
      </div>
    </main>
  );
}
