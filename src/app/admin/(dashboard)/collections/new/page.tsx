import { createCollection } from "@/lib/actions/collections";
import CollectionForm from "../CollectionForm";

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="admin-heading mb-6">Add Collection</h1>

      <div className="admin-card max-w-3xl p-5">
        <CollectionForm action={createCollection} />
      </div>
    </div>
  );
}
