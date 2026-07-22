import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import DeleteCollectionButton from "./DeleteCollectionButton";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    include: { products: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="admin-heading">Collections</h1>
        <Link href="/admin/collections/new" className="admin-btn">
          Add Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="admin-card text-center py-10">
          <p className="admin-subheading">No collections yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <div key={collection.id} className="admin-card overflow-hidden">
              {collection.image && (
                <div className="relative h-36 border-b border-[#242a34]">
                  <Image src={collection.image} alt={collection.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold">{collection.name}</h3>
                {collection.description && <p className="admin-subheading mt-1 line-clamp-2">{collection.description}</p>}
                <p className="admin-subheading mt-2">{collection.products.length} product{collection.products.length !== 1 ? "s" : ""}</p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/admin/collections/${collection.id}`} className="admin-btn admin-btn-secondary px-2.5 py-1.5">
                    Edit
                  </Link>
                  <DeleteCollectionButton id={collection.id} name={collection.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
