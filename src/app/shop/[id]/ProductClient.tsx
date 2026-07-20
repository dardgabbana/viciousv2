"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GlowButton from "@/components/GlowButton";
import { useCart } from "@/hooks/useCart";

interface VariationOption {
  id: number;
  value: string;
  stock: number;
}

interface ProductVariation {
  id: number;
  name: string;
  options: VariationOption[];
}

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  images: string;
  description: string;
  variations?: ProductVariation[];
}

interface ProductClientProps {
  product: Product;
  moreProducts: Product[];
}

function colorValueToCss(value: string): string {
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
}

export default function ProductClient({ product, moreProducts }: ProductClientProps) {
  const router = useRouter();
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showCartChoice, setShowCartChoice] = useState(false);
  const { addItem } = useCart();

  const additionalImages = product.images ? JSON.parse(product.images) : [];
  const allImages = [product.image, ...additionalImages].filter(Boolean);

  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  const validVariations = (product.variations || []).filter(
    (v) => v.name && v.name.trim() !== "" && v.options && v.options.length > 0
  );
  const hasVariations = validVariations.length > 0;

  const allVariationsSelected = hasVariations
    ? validVariations.every((v) => !!selectedVariations[v.name])
    : true;

  const getSelectedStock = (): number | null => {
    if (!hasVariations || !allVariationsSelected) return null;

    let minStock = Infinity;
    for (const variation of validVariations) {
      const selectedValue = selectedVariations[variation.name];
      const option = variation.options.find((o) => o.value === selectedValue);
      if (option) {
        minStock = Math.min(minStock, option.stock);
      }
    }
    return minStock === Infinity ? null : minStock;
  };

  const selectedStock = getSelectedStock();
  const isOutOfStock = hasVariations && allVariationsSelected && selectedStock === 0;
  const canAddToCart = !hasVariations || (allVariationsSelected && !isOutOfStock);

  const handleVariationSelect = (variationName: string, value: string) => {
    setSelectedVariations((prev) => ({ ...prev, [variationName]: value }));
  };

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    const variationsArray = hasVariations
      ? Object.entries(selectedVariations).map(([name, value]) => ({ name, value }))
      : undefined;

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      selectedVariations: variationsArray,
    });

    setAddedToCart(true);
    setShowCartChoice(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="px-0 md:px-0">
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,36%)] border-b border-[var(--v-border)]">
          <div className="lg:border-r border-[var(--v-border)]">
            {allImages.map((img, index) => (
              <button
                type="button"
                key={`${img}-${index}`}
                className="block w-full border-b border-[var(--v-border)] bg-[#111]"
                onClick={() => openLightbox(index)}
              >
                <div className="relative w-full aspect-[4/5] md:aspect-square lg:min-h-[calc(100vh-130px)]">
                  <Image
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="relative lg:min-h-[calc(100vh-123px)]">
            <div className="lg:sticky lg:top-[123px]">
              <div className="p-5 md:p-8 lg:max-h-[calc(100vh-123px)] lg:overflow-y-auto lg:p-10">
              <h1 className="v-title" style={{ fontSize: "clamp(22px, 3vw, 30px)" }}>
                {product.title}
              </h1>

              <p className="v-ui-11 mt-5" style={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {product.description || "- EMBROIDERED PATCH\n- PIQUE (95% COTTON, 5% ELASTANE)\n- MADE IN ENGLAND"}
              </p>

              <p className="v-ui-11 mt-7">${product.price.toFixed(2)}</p>

              {hasVariations && (
                <div className="mt-5 space-y-4">
                  {validVariations.map((variation) => {
                    const isColor = ["color", "colour", "colors", "colours"].includes(
                      variation.name.trim().toLowerCase()
                    );
                    return (
                      <div key={variation.id}>
                        <label className="block mb-2 v-ui-11 v-muted">{variation.name.toUpperCase()}</label>
                        <div className="flex flex-wrap gap-2">
                          {variation.options.map((option) => {
                            const isSelected = selectedVariations[variation.name] === option.value;
                            const isOutOfStockOption = option.stock === 0;

                            if (isColor) {
                              const swatchColor = colorValueToCss(option.value);
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() =>
                                    !isOutOfStockOption && handleVariationSelect(variation.name, option.value)
                                  }
                                  disabled={isOutOfStockOption}
                                  className="border"
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    borderColor: isSelected ? "#f2f2f2" : "var(--v-border-strong)",
                                    background: swatchColor,
                                    opacity: isOutOfStockOption ? 0.35 : 1,
                                  }}
                                  title={option.value}
                                />
                              );
                            }

                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() =>
                                  !isOutOfStockOption && handleVariationSelect(variation.name, option.value)
                                }
                                disabled={isOutOfStockOption}
                                className="v-btn px-3 py-1.5"
                                style={{
                                  background: isSelected ? "#1a1a1a" : "#0f0f0f",
                                  borderColor: isSelected ? "#9d9d9d" : "var(--v-border-strong)",
                                  textDecoration: isOutOfStockOption ? "line-through" : "none",
                                }}
                              >
                                {option.value.toUpperCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!hasVariations && <button className="v-btn px-3 py-1.5 mt-5">SIZE +</button>}

              <div className="mt-4 flex items-center gap-2">
                <GlowButton
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  style={{
                    minWidth: "150px",
                    background: addedToCart ? "#173117" : undefined,
                    borderColor: addedToCart ? "#3d8244" : undefined,
                  }}
                >
                  {addedToCart ? "+ ADDED" : "+ ADD TO CART"}
                </GlowButton>
              </div>

              {allVariationsSelected && (
                <p className="v-ui-11 mt-4" style={{ color: isOutOfStock ? "#d16a6a" : "var(--v-muted)" }}>
                  {isOutOfStock ? "OUT OF STOCK" : `${selectedStock} IN STOCK`}
                </p>
              )}

              {!allVariationsSelected && (
                <p className="v-ui-11 v-muted mt-4">PLEASE SELECT ALL OPTIONS</p>
              )}

              </div>
            </div>
          </div>
        </section>

        {false && moreProducts.length > 0 && (
          <section className="-mt-px grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 border-b border-[var(--v-border)]">
            {moreProducts.map((item) => {
              const sizeVariation = (item.variations || []).find((variation) =>
                ["size", "sizes"].includes(variation.name.trim().toLowerCase())
              );
              const sizeValues = (sizeVariation?.options || []).map((option) => option.value.toUpperCase());

              return (
                <article
                  key={item.id}
                  className="group relative v-grid-cell cursor-pointer min-h-[50vh] md:min-h-[62vh]"
                  onClick={() => {
                    router.push(`/shop/${item.id}`);
                  }}
                  onMouseEnter={() => router.prefetch(`/shop/${item.id}`)}
                >
                  <div className="absolute inset-0 flex items-center justify-center px-4 pt-8 pb-20 md:px-8 md:pt-10 md:pb-24">
                    <div className="relative w-full h-full max-w-[360px] max-h-[420px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 45vw, (max-width: 1280px) 30vw, 22vw"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                    <h3 className="v-ui-11 text-[#f2f2f2]">{item.title.toUpperCase()}</h3>
                    <p className="v-ui-11 text-[#f2f2f2] mt-1">£{item.price.toFixed(2)}</p>
                    {sizeValues.length > 0 && (
                      <div className="hidden group-hover:block">
                        <p className="v-ui-11 v-muted mt-3">SIZE</p>
                        <p className="v-ui-11 text-[#f2f2f2] mt-1">{sizeValues.join(" ")}</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {showCartChoice && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/45 px-4">
          <div className="v-cart-popoff w-full max-w-[320px] border border-[var(--v-border-strong)] bg-black p-5 text-center shadow-2xl">
            <p className="v-ui-11 text-white">ADDED TO CART</p>
            <p className="v-ui-11 v-muted mt-2">{product.title.toUpperCase()}</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="v-btn px-3 py-2"
                onClick={() => {
                  setShowCartChoice(false);
                  router.push("/checkout");
                }}
              >
                CHECK OUT
              </button>
              <button
                type="button"
                className="v-btn px-3 py-2"
                onClick={() => {
                  setShowCartChoice(false);
                  router.push("/shop");
                }}
              >
                SEE MORE
              </button>
            </div>
          </div>
        </div>
      )}

      {showLightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          <button className="absolute top-4 right-4 z-10 px-3 py-2 v-btn" onClick={closeLightbox}>
            ✕
          </button>

          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 px-3 md:px-4 py-2 z-10 v-btn"
                onClick={handlePrevImage}
              >
                ←
              </button>
              <button
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 px-3 md:px-4 py-2 z-10 v-btn"
                onClick={handleNextImage}
              >
                →
              </button>
            </>
          )}

          <div className="relative w-[90vw] h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={allImages[lightboxIndex] || product.image} alt={product.title} fill className="object-contain" priority />
          </div>

          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 border border-[var(--v-border)] bg-black/85">
              <span className="v-ui-11">{lightboxIndex + 1} / {allImages.length}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
