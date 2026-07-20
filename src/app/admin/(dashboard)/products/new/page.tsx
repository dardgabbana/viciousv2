import { db } from "@/lib/db";
import { createProduct } from "@/lib/actions/products";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const collections = await db.collection.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="admin-heading mb-6">Add Product</h1>

      <div className="admin-card max-w-3xl p-5">
        <ProductForm collections={collections} action={createProduct} />
      </div>
    </div>
  );
}
