import { db } from "@/lib/db";
import { updateCollection } from "@/lib/actions/collections";
import { notFound } from "next/navigation";
import CollectionForm from "../CollectionForm";

interface EditCollectionPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id } = await params;
  const collectionId = Number.parseInt(id, 10);

  const collection = await db.collection.findUnique({ where: { id: collectionId } });

  if (!collection) {
    notFound();
  }

  const updateWithId = async (formData: FormData) => {
    "use server";
    await updateCollection(collectionId, formData);
  };

  return (
    <div>
      <h1 className="admin-heading mb-6">Edit Collection</h1>

      <div className="admin-card max-w-3xl p-5">
        <CollectionForm collection={collection} action={updateWithId} />
      </div>
    </div>
  );
}
