"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type VariationInput = {
  id?: number;
  name: string;
  options: { id?: number; value: string; stock: number }[];
};

export async function getProducts() {
  return db.product.findMany({
    include: { collection: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProduct(id: number) {
  return db.product.findUnique({
    where: { id },
    include: {
      collection: true,
      variations: {
        include: { options: true },
        orderBy: { id: "asc" },
      },
    },
  });
}

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const image = formData.get("image") as string;
  const images = formData.get("images") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const collectionId = formData.get("collectionId") as string;
  const variationsJson = formData.get("variations") as string;
  const variations: VariationInput[] = variationsJson
    ? JSON.parse(variationsJson)
    : [];

  await db.product.create({
    data: {
      title,
      price,
      image: image || "/images/vicious4.jpg",
      images: images || "[]",
      description,
      category,
      collectionId: collectionId ? parseInt(collectionId) : null,
      variations: {
        create: variations.map((v) => ({
          name: v.name,
          options: {
            create: v.options.map((o) => ({
              value: o.value,
              stock: o.stock,
            })),
          },
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProduct(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const image = formData.get("image") as string;
  const images = formData.get("images") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const collectionId = formData.get("collectionId") as string;
  const variationsJson = formData.get("variations") as string;
  const variations: VariationInput[] = variationsJson
    ? JSON.parse(variationsJson)
    : [];

  // Delete existing variations (cascade deletes options)
  await db.productVariation.deleteMany({ where: { productId: id } });

  await db.product.update({
    where: { id },
    data: {
      title,
      price,
      image,
      images: images || "[]",
      description,
      category,
      collectionId: collectionId ? parseInt(collectionId) : null,
      variations: {
        create: variations.map((v) => ({
          name: v.name,
          options: {
            create: v.options.map((o) => ({
              value: o.value,
              stock: o.stock,
            })),
          },
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/shop/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  // Delete related order items first
  await db.orderItem.deleteMany({ where: { productId: id } });
  // Then delete the product
  await db.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/", "layout");
  revalidatePath("/shop", "layout");
}
