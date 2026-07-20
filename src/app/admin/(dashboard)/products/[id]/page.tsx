import { db } from "@/lib/db";
import { updateProduct } from "@/lib/actions/products";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  const [product, collections] = await Promise.all([
    db.product.findUnique({
      where: { id: productId },
      include: {
        collection: true,
        variations: {
          include: { options: true },
          orderBy: { id: "asc" },
        },
      },
    }),
    db.collection.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  const updateWithId = async (formData: FormData) => {
    "use server";
    await updateProduct(productId, formData);
  };

  return (
    <div>
      <h1 className="admin-heading mb-6">Edit Product</h1>

      <div className="admin-card max-w-3xl p-5">
        <ProductForm product={product} collections={collections} action={updateWithId} />
      </div>
    </div>
  );
}
