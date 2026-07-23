"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface GridProduct {
  id: number;
  title: string;
  image: string;
  images?: string;
}

interface ProductGridProps {
  products: GridProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: GridProduct }) {
  const images = [product.image, ...(product.images ? JSON.parse(product.images) : [])].filter(
    Boolean
  ) as string[];
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const goTo = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(i);
  };

  return (
    <Link
      href={`/shop/${product.id}`}
      title={product.title}
      className="group relative p-3 md:p-5"
      onMouseEnter={() => hasMultiple && setIndex(1)}
      onMouseLeave={() => setIndex(0)}
    >
      <div className="relative aspect-square overflow-hidden bg-black/5">
        <Image
          src={images[index]}
          alt={product.title}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover transition-[filter] duration-200 ease-out group-hover:brightness-[0.65]"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => goTo(e, (index - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center bg-white/80 text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => goTo(e, (index + 1) % images.length)}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center bg-white/80 text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              ›
            </button>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-1 rounded-full ${i === index ? "bg-black" : "bg-black/30"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pt-3 md:pt-4">
        <span className="v-ui-11 font-bold uppercase text-black tracking-wide">{product.title}</span>
      </div>
    </Link>
  );
}
