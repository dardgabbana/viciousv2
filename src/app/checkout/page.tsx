"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/lib/actions/orders";
import FormInput from "@/components/admin/FormInput";
import PageBackground from "@/components/PageBackground";
import BackButton from "@/components/BackButton";
import PageFooter from "@/components/PageFooter";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createOrder({
        email: formData.get("email") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zipCode") as string,
        country: formData.get("country") as string,
        phone: formData.get("phone") as string,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedVariations: item.selectedVariations,
        })),
      });

      clearCart();
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } catch {
      setError("Failed to place order. Please try again.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageBackground className="min-h-screen" fixed>
        <BackButton href="/shop" />
        <div className="pt-20 pb-32 px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="v-title mb-4">YOUR CART IS EMPTY</h1>
          <Link href="/shop" className="v-btn px-5 py-3">
            CONTINUE SHOPPING
          </Link>
        </div>
        <PageFooter />
      </PageBackground>
    );
  }

  return (
    <PageBackground className="min-h-screen" fixed>
      <BackButton href="/shop" />

      <div className="pt-20 pb-32 px-4 md:px-8">
        <h1 className="v-title text-center mb-8">CHECKOUT</h1>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-6 v-panel">
            <h2 className="v-title mb-6" style={{ fontSize: "20px" }}>
              YOUR CART
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item, index) => {
                const variationKey = item.selectedVariations
                  ? item.selectedVariations.map((v) => `${v.name}:${v.value}`).join("-")
                  : "";
                const itemKey = `${item.productId}-${variationKey}-${index}`;

                return (
                  <div key={itemKey} className="flex gap-4 p-3 border border-[var(--v-border)] bg-[#070707]">
                    <div className="relative w-16 h-16 overflow-hidden flex-shrink-0 border border-[var(--v-border)]">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="v-ui-11">{item.title.toUpperCase()}</p>
                      {item.selectedVariations && item.selectedVariations.length > 0 && (
                        <p className="v-ui-11 v-muted mt-1">
                          {item.selectedVariations.map((v) => `${v.name}: ${v.value}`).join(" / ")}
                        </p>
                      )}
                      <p className="v-ui-11 mt-1">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariations)}
                          className="w-6 h-6 flex items-center justify-center v-btn"
                        >
                          -
                        </button>
                        <span className="v-ui-11">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariations)}
                          className="w-6 h-6 flex items-center justify-center v-btn"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.productId, item.selectedVariations)}
                          className="ml-auto px-2 py-1 v-btn"
                          style={{ color: "#d16a6a", borderColor: "#704444" }}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[var(--v-border)] flex justify-between items-center">
              <span className="v-ui-11">TOTAL</span>
              <span className="v-ui-11">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-6 v-panel">
            <h2 className="v-title mb-6" style={{ fontSize: "20px" }}>
              SHIPPING DETAILS
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="First Name" name="firstName" required placeholder="John" />
                <FormInput label="Last Name" name="lastName" required placeholder="Doe" />
              </div>

              <FormInput label="Email" name="email" type="email" required placeholder="john@example.com" />

              <FormInput label="Phone (Optional)" name="phone" type="tel" placeholder="+1 234 567 8900" />

              <FormInput label="Address" name="address" required placeholder="123 Main St" />

              <div className="grid grid-cols-2 gap-4">
                <FormInput label="City" name="city" required placeholder="New York" />
                <FormInput label="State/Province" name="state" required placeholder="NY" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput label="ZIP/Postal Code" name="zipCode" required placeholder="10001" />
                <FormInput label="Country" name="country" required placeholder="United States" />
              </div>

              {error && (
                <div className="mb-4 p-3 text-center border border-[#704444] bg-[#1a0d0d] text-[#d16a6a] v-ui-11">
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting} className="w-full py-3 mt-4 v-btn">
                {submitting ? "PROCESSING..." : "PLACE ORDER"}
              </button>

              <p className="mt-4 text-center v-ui-11 v-muted">PAYMENT ON DELIVERY (CASH)</p>
            </form>
          </div>
        </div>
      </div>

      <PageFooter />
    </PageBackground>
  );
}
