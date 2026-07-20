"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCollections() {
  return db.collection.findMany({
    include: { products: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCollection(id: number) {
  return db.collection.findUnique({
    where: { id },
    include: { products: true },
  });
}

export async function createCollection(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  await db.collection.create({
    data: {
      name,
      description: description || null,
      image: image || null,
    },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/shop");
  redirect("/admin/collections");
}

export async function updateCollection(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  await db.collection.update({
    where: { id },
    data: {
      name,
      description: description || null,
      image: image || null,
    },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/shop");
  redirect("/admin/collections");
}

export async function deleteCollection(id: number) {
  await db.collection.delete({ where: { id } });

  revalidatePath("/admin/collections");
  revalidatePath("/shop");
}
