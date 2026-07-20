"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface SelectedVariation {
  name: string;
  value: string;
}

interface CheckoutItem {
  productId: number;
  quantity: number;
  price: number;
  selectedVariations?: SelectedVariation[];
}

interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  items: CheckoutItem[];
}

export async function createOrder(data: CheckoutData) {
  const total = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Create the order with items
  const order = await db.order.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      phone: data.phone || null,
      total,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedVariations: item.selectedVariations
            ? JSON.stringify(item.selectedVariations)
            : null,
        })),
      },
    },
  });

  // Decrement stock for each item's selected variations
  for (const item of data.items) {
    if (item.selectedVariations && item.selectedVariations.length > 0) {
      // Get the product's variations
      const product = await db.product.findUnique({
        where: { id: item.productId },
        include: {
          variations: {
            include: { options: true },
          },
        },
      });

      if (product) {
        // Decrement stock for each selected variation option
        for (const selectedVar of item.selectedVariations) {
          const variation = product.variations.find((v) => v.name === selectedVar.name);
          if (variation) {
            const option = variation.options.find((o) => o.value === selectedVar.value);
            if (option && option.stock > 0) {
              await db.variationOption.update({
                where: { id: option.id },
                data: { stock: { decrement: item.quantity } },
              });
            }
          }
        }
      }
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/shop");

  return { orderId: order.id };
}

export async function getOrders() {
  return db.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrder(id: number) {
  return db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}

export async function updateOrderStatus(id: number, status: string) {
  await db.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
