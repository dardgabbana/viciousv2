"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface SelectedVariation {
  name: string;
  value: string;
}

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariations?: SelectedVariation[];
}

const CART_KEY = "vicious_cart";
const CART_UPDATED_EVENT = "vicious-cart-updated";

// Helper to check if two variation arrays are equal
function variationsMatch(a?: SelectedVariation[], b?: SelectedVariation[]): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x.name.localeCompare(y.name));
  const sortedB = [...b].sort((x, y) => x.name.localeCompare(y.name));
  return sortedA.every((v, i) => v.name === sortedB[i].name && v.value === sortedB[i].value);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const hydratedRef = useRef(false);

  const persistAndBroadcast = useCallback((nextItems: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    return nextItems;
  }, []);

  useEffect(() => {
    const readItems = () => {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
          return;
        } catch {
          setItems([]);
          return;
        }
      }
      setItems([]);
    };

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === CART_KEY) {
        readItems();
      }
    };

    const handleLocalCartUpdate = () => {
      readItems();
    };

    readItems();
    hydratedRef.current = true;

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CART_UPDATED_EVENT, handleLocalCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CART_UPDATED_EVENT, handleLocalCartUpdate);
    };
  }, []);

  const addItem = useCallback(
    (product: Omit<CartItem, "quantity">) => {
      const existing = items.find(
        (i) =>
          i.productId === product.productId &&
          variationsMatch(i.selectedVariations, product.selectedVariations)
      );
      const next = existing
        ? items.map((i) =>
            i.productId === product.productId &&
            variationsMatch(i.selectedVariations, product.selectedVariations)
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...items, { ...product, quantity: 1 }];

      setItems(next);
      if (hydratedRef.current) persistAndBroadcast(next);
    },
    [items, persistAndBroadcast]
  );

  const removeItem = useCallback(
    (productId: number, selectedVariations?: SelectedVariation[]) => {
      const next = items.filter(
        (i) =>
          !(
            i.productId === productId &&
            variationsMatch(i.selectedVariations, selectedVariations)
          )
      );
      setItems(next);
      if (hydratedRef.current) persistAndBroadcast(next);
    },
    [items, persistAndBroadcast]
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number, selectedVariations?: SelectedVariation[]) => {
      const next =
        quantity <= 0
          ? items.filter(
              (i) =>
                !(
                  i.productId === productId &&
                  variationsMatch(i.selectedVariations, selectedVariations)
                )
            )
          : items.map((i) =>
              i.productId === productId &&
              variationsMatch(i.selectedVariations, selectedVariations)
                ? { ...i, quantity }
                : i
            );

      setItems(next);
      if (hydratedRef.current) persistAndBroadcast(next);
    },
    [items, persistAndBroadcast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (hydratedRef.current) persistAndBroadcast([]);
  }, [persistAndBroadcast]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };
}
