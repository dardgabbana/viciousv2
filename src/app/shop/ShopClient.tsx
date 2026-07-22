"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category?: string | null;
  variations?: {
    id: number;
    name: string;
    options: {
      id: number;
      value: string;
      stock: number;
    }[];
  }[];
}

interface ShopClientProps {
  products: Product[];
}

export default function ShopClient({ products }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState<"singles" | "collections">("singles");
  const router = useRouter();
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const category = (product.category || "singles").trim().toLowerCase();
        return activeCategory === "collections"
          ? category === "collections"
          : category === "singles";
      }),
    [products, activeCategory]
  );

  const handleProductClick = (productId: number) => {
    router.push(`/shop/${productId}`);
  };

  const getVariation = (product: Product, names: string[]) =>
    (product.variations || []).find((variation) =>
      names.includes(variation.name.trim().toLowerCase())
    );

  const colorValueToCss = (value: string): string => {
    const normalized = value.trim().toLowerCase();
    if (normalized.startsWith("#")) return normalized;

    const colorMap: Record<string, string> = {
      black: "#111111",
      white: "#f1f1f1",
      gray: "#9a9a9a",
      grey: "#9a9a9a",
      silver: "#bfbfbf",
      red: "#c63e3e",
      blue: "#3f66cf",
      navy: "#22324f",
      green: "#3f8f53",
      olive: "#556b2f",
      yellow: "#d6c74c",
      orange: "#db8a3d",
      purple: "#7f5aa9",
      pink: "#cf6f97",
      brown: "#7a5641",
      beige: "#c8b591",
      cream: "#e6dcc5",
    };

    return colorMap[normalized] ?? "#6c6c6c";
  };

  if (products.length === 0) {
    return (
      <section className="px-4 py-20 text-center">
        <p className="v-ui-11 v-muted">NO PRODUCTS AVAILABLE</p>
      </section>
    );
  }

  return (
    <>
      <section className="-mt-px border-b border-[var(--v-border)] px-3 md:px-4 py-2.5 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setActiveCategory("singles")}
          className={`v-chip ${activeCategory === "singles" ? "v-chip-active" : ""}`}
        >
          SINGLES
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory("collections")}
          className={`v-chip ${activeCategory === "collections" ? "v-chip-active" : ""}`}
        >
          COLLECTIONS
        </button>
      </section>

      {filteredProducts.length === 0 ? (
        <section className="px-4 py-20 text-center border-b border-[var(--v-border)]">
          <p className="v-ui-11 v-muted">NO PRODUCTS IN THIS CATEGORY</p>
        </section>
      ) : (
        <section className="-mt-px grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 border-b border-[var(--v-border)]">
          {filteredProducts.map((product) => {
        const sizeVariation = getVariation(product, ["size", "sizes"]);
        const colorVariation = getVariation(product, ["color", "colour", "colors", "colours"]);
        const sizeValues = (sizeVariation?.options || []).map((option) => option.value.toUpperCase());
        const colorValues = (colorVariation?.options || []).map((option) => option.value);

        return (
          <article
            key={product.id}
            className="group relative v-grid-cell cursor-pointer min-h-[50vh] md:min-h-[62vh]"
            onClick={() => handleProductClick(product.id)}
            onMouseEnter={() => router.prefetch(`/shop/${product.id}`)}
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 pt-8 pb-20 md:px-8 md:pt-10 md:pb-24">
              <div className="relative w-full h-full max-w-[360px] max-h-[420px]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 45vw, (max-width: 1280px) 30vw, 22vw"
                />
              </div>
            </div>

            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
              <h3 className="v-ui-11 text-[#111111]">{product.title.toUpperCase()}</h3>
              <p className="v-ui-11 text-[#111111] mt-1">${product.price.toFixed(2)}</p>

              {(sizeValues.length > 0 || colorValues.length > 0) && (
                <div className="mt-3 hidden group-hover:block">
                  {sizeValues.length > 0 && (
                    <div className="mb-2">
                      <p className="v-ui-11 v-muted">SIZE</p>
                      <p className="v-ui-11 text-[#111111] mt-1">{sizeValues.join(" ")}</p>
                    </div>
                  )}

                  {colorValues.length > 0 && (
                    <div>
                      <p className="v-ui-11 v-muted">COLOR</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {colorValues.map((value, index) => {
                          const swatchColor = colorValueToCss(value);
                          const isDark = swatchColor === "#111111";
                          return (
                            <span
                              key={`${product.id}-${value}-${index}`}
                              className="inline-flex items-center justify-center border border-[var(--v-border-strong)]"
                              style={{
                                width: "13px",
                                height: "13px",
                                backgroundColor: swatchColor,
                                color: isDark ? "#ffffff" : "#111111",
                                fontSize: "8px",
                                lineHeight: 1,
                              }}
                              title={value}
                            >
                              {isDark ? "×" : ""}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <span
              className="absolute top-1/2 left-2 -translate-y-1/2 v-ui-11 text-[#8a8a8a] hidden group-hover:block"
              aria-hidden
            >
              &lt;
            </span>
            <span
              className="absolute top-1/2 right-2 -translate-y-1/2 v-ui-11 text-[#8a8a8a] hidden group-hover:block"
              aria-hidden
            >
              &gt;
            </span>
          </article>
        );
          })}
        </section>
      )}
    </>
  );
}
