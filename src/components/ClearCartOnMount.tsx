"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";

/**
 * Empties the cart once the order confirmation has actually rendered.
 *
 * Clearing it back on the checkout page instead made that page re-render with an
 * empty cart while `router.push` was still waiting on the server component, which
 * flashed "YOUR CART IS EMPTY" before the confirmation appeared.
 */
export default function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // Run once on mount; clearCart is recreated per render but is idempotent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
