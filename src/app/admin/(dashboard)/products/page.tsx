import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import DeleteProductButton from "./DeleteProductButton";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: { collection: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="admin-heading">Products</h1>
        <Link href="/admin/products/new" className="admin-btn">
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="admin-card text-center py-10">
          <p className="admin-subheading">No products yet. Add your first product.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="w-14 h-14 relative rounded-md overflow-hidden border border-[#2b3341]">
                      <Image src={product.image} alt={product.title} fill className="object-cover" />
                    </div>
                  </td>
                  <td>{product.title}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td className="capitalize">{product.category}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}`} className="admin-btn admin-btn-secondary px-2.5 py-1.5">
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} title={product.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
