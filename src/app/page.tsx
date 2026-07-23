import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import ProductGrid from "@/components/ProductGrid";
import ImageSlider from "@/components/ImageSlider";
import AsciiLogoFooter from "@/components/AsciiLogoFooter";

export const dynamic = "force-dynamic";

const menuItems = [
  { label: "SHOP", href: "/shop" },
  { label: "BLOG", href: "/blog" },
  { label: "RADIO", href: "/radio" },
  { label: "OPTIONS", href: "/options" },
];

export default async function Home() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, title: true, price: true, image: true, images: true },
  });

  return (
    <main className="min-h-screen w-full bg-white text-black flex flex-col px-6 md:px-16 py-10 md:py-14">
      <div className="flex justify-center">
        <Link href="/">
          <Image
            src="/images/logo-black.png"
            alt="Vicious"
            width={200}
            height={71}
            className="h-auto w-[130px] md:w-[170px]"
            priority
          />
        </Link>
      </div>

      <nav className="flex justify-between items-center w-full pt-8 md:pt-10 v-ui-11 uppercase tracking-widest">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-bold text-black/70 hover:text-black transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-10 md:pt-14 -mx-6 md:-mx-16">
        <ImageSlider />
      </div>

      <div className="flex flex-col">
        <div className="py-16 md:py-24">
          <ProductGrid products={products} />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-end gap-12 md:gap-8 py-12">
          <div className="flex flex-col items-center md:items-end gap-10 text-center md:text-right">
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

      <div className="-mx-6 md:-mx-16">
        <AsciiLogoFooter />
      </div>

      <div className="flex justify-center md:justify-start pt-8">
        <span className="v-ui-11 text-black/40">
          © 2026 VICIOUS. ALL RIGHTS RESERVED.
        </span>
      </div>
    </main>
  );
}
