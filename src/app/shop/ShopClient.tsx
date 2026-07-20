"use client";

import { useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProductInspectionOverlay from "@/components/ProductInspectionOverlay";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  images?: string | null;
  description: string;
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

function parseProductImages(images?: string | null) {
  if (!images) return [];

  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed)
      ? parsed.filter((src): src is string => typeof src === "string" && src.length > 0)
      : [];
  } catch {
    return [];
  }
}

function getInspectionType(category?: string | null) {
  return category?.trim().toLowerCase() === "collections" ? "COLLECTION" : "1 OF 1";
}

function getInspectionDetails(product: Product) {
  const descriptionDetails = (product.description || "")
    .split(/\r?\n|\u2022/)
    .map((detail) => detail.replace(/^[-*+\s]+/, "").trim().toUpperCase())
    .filter((detail) => detail.length >= 3 && detail.length <= 42)
    .slice(0, 2);

  if (descriptionDetails.length > 0) return descriptionDetails;

  const variationDetails = (product.variations || [])
    .map((variation) => variation.name.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 2);

  return variationDetails.length > 0 ? variationDetails : ["ARCHIVE GARMENT"];
}

export default function ShopClient({ products }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState<"singles" | "collections">("singles");
  const [inspectedProductId, setInspectedProductId] = useState<number | null>(null);
  const router = useRouter();

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const category = (product.category || "singles").trim().toLowerCase();
        return activeCategory === "collections" ? category === "collections" : category === "singles";
      }),
    [products, activeCategory]
  );

  const isInspectionTap = () =>
    window.matchMedia("(hover: none), (pointer: coarse), (max-width: 1024px)").matches;

  const handleProductClick = (event: MouseEvent<HTMLElement>, productId: number) => {
    event.stopPropagation();

    if (isInspectionTap()) {
      setInspectedProductId(productId);
      return;
    }

    router.push(`/shop/${productId}`);
  };

  const handleProductKeyDown = (event: KeyboardEvent<HTMLElement>, productId: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(`/shop/${productId}`);
    }
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
      <section className="v-shop-category-bar -mt-px border-b px-3 md:px-4 py-2.5 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setActiveCategory("singles");
            setInspectedProductId(null);
          }}
          className={`v-chip v-shop-category-chip ${activeCategory === "singles" ? "v-shop-category-chip-active" : ""}`}
        >
          SINGLES
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory("collections");
            setInspectedProductId(null);
          }}
          className={`v-chip v-shop-category-chip ${activeCategory === "collections" ? "v-shop-category-chip-active" : ""}`}
        >
          COLLECTIONS
        </button>
      </section>

      {filteredProducts.length === 0 ? (
        <section className="px-4 py-20 text-center border-b border-[var(--v-border)]">
          <p className="v-ui-11 v-muted">NO PRODUCTS IN THIS CATEGORY</p>
        </section>
      ) : (
        <section
          className="-mt-px grid grid-cols-3 md:grid-cols-3 xl:grid-cols-4 bg-white"
          onClick={() => setInspectedProductId(null)}
        >
          {filteredProducts.map((product) => {
            const hoverImage = parseProductImages(product.images)[0];
            const isInspected = inspectedProductId === product.id;
            const details = getInspectionDetails(product);
            const type = getInspectionType(product.category);

            return (
              <article
                key={product.id}
                role="link"
                tabIndex={0}
                aria-label={`Inspect ${product.title}, $${product.price.toFixed(2)}`}
                className={`group relative v-grid-cell v-shop-product-card cursor-pointer min-h-[185px] md:min-h-[62vh] ${isInspected ? "v-shop-product-inspected" : ""}`}
                onClick={(event) => handleProductClick(event, product.id)}
                onKeyDown={(event) => handleProductKeyDown(event, product.id)}
                onMouseEnter={() => router.prefetch(`/shop/${product.id}`)}
              >
                <div className="absolute inset-0 flex items-center justify-center px-2 pt-4 pb-12 md:px-8 md:pt-10 md:pb-24">
                  <div className="group/product-image v-shop-product-image-area relative w-full h-full max-w-[360px] max-h-[420px]">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className={`object-contain transition-opacity duration-300 ${hoverImage ? "group-hover/product-image:opacity-0 group-focus-within:opacity-0" : ""} ${isInspected && hoverImage ? "opacity-0" : ""}`}
                      sizes="(max-width: 768px) 31vw, (max-width: 1280px) 30vw, 22vw"
                    />
                    {hoverImage && (
                      <Image
                        src={hoverImage}
                        alt={`${product.title} alternate`}
                        fill
                        className={`object-contain opacity-0 transition-opacity duration-300 group-hover/product-image:opacity-100 group-focus-within:opacity-100 ${isInspected ? "opacity-100" : ""}`}
                        sizes="(max-width: 768px) 31vw, (max-width: 1280px) 30vw, 22vw"
                      />
                    )}
                  </div>
                </div>

                <ProductInspectionOverlay
                  active={isInspected}
                  details={details}
                  name={product.title}
                  price={`$${product.price.toFixed(2)}`}
                  type={type}
                  onViewItem={() => router.push(`/shop/${product.id}`)}
                />

                <div className="absolute bottom-2 left-2 right-2 md:right-auto md:bottom-4 md:left-4">
                  <h3 className="v-ui-11 v-shop-product-title text-[#111]">{product.title.toUpperCase()}</h3>
                  <p className="v-ui-11 v-shop-product-price text-[#111] mt-1">${product.price.toFixed(2)}</p>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}
