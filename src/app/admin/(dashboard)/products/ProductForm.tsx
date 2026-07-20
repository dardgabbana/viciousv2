"use client";

import { Collection, Product, ProductVariation, VariationOption } from "@prisma/client";
import FormInput from "@/components/admin/FormInput";
import FormTextarea from "@/components/admin/FormTextarea";
import FormSelect from "@/components/admin/FormSelect";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

type ProductWithRelations = Product & {
  collection?: Collection | null;
  variations?: (ProductVariation & { options: VariationOption[] })[];
};

type VariationState = {
  id?: number;
  name: string;
  options: { id?: number; value: string; stock: number }[];
};

interface ProductFormProps {
  product?: ProductWithRelations;
  collections: Collection[];
  action: (formData: FormData) => Promise<void>;
}

export default function ProductForm({ product, collections, action }: ProductFormProps) {
  const existingImages = product?.images ? JSON.parse(product.images) : [];
  const allExistingImages = product?.image ? [product.image, ...existingImages] : existingImages;

  const [images, setImages] = useState<string[]>(allExistingImages);
  const [uploading, setUploading] = useState(false);

  const initialVariations: VariationState[] =
    product?.variations?.map((v) => ({
      id: v.id,
      name: v.name,
      options: v.options.map((o) => ({ id: o.id, value: o.value, stock: o.stock })),
    })) || [];
  const [variations, setVariations] = useState<VariationState[]>(initialVariations);

  const addVariation = () => setVariations([...variations, { name: "", options: [] }]);
  const removeVariation = (index: number) => setVariations(variations.filter((_, i) => i !== index));

  const updateVariationName = (index: number, name: string) => {
    const updated = [...variations];
    updated[index].name = name;
    setVariations(updated);
  };

  const addOption = (variationIndex: number) => {
    const updated = [...variations];
    updated[variationIndex].options.push({ value: "", stock: 0 });
    setVariations(updated);
  };

  const removeOption = (variationIndex: number, optionIndex: number) => {
    const updated = [...variations];
    updated[variationIndex].options = updated[variationIndex].options.filter((_, i) => i !== optionIndex);
    setVariations(updated);
  };

  const updateOption = (
    variationIndex: number,
    optionIndex: number,
    field: "value" | "stock",
    value: string | number
  ) => {
    const updated = [...variations];
    if (field === "value") {
      updated[variationIndex].options[optionIndex].value = value as string;
    } else {
      updated[variationIndex].options[optionIndex].stock = value as number;
    }
    setVariations(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          setImages((prev) => [...prev, data.url]);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  return (
    <form action={action}>
      <FormInput label="Title" name="title" defaultValue={product?.title} required placeholder="Product title" />

      <FormInput
        label="Price ($)"
        name="price"
        type="number"
        step="0.01"
        min="0"
        defaultValue={product?.price}
        required
        placeholder="0.00"
      />

      <div className="mb-4">
        <label className="admin-input-label">Images {images.length > 0 && `(${images.length})`}</label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {images.map((img, index) => (
              <div key={index} className="relative group rounded-md overflow-hidden border border-[#2d3646]">
                <div className="w-24 h-24 relative">
                  <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                </div>
                {index === 0 && (
                  <div className="absolute top-0 left-0 px-1.5 py-0.5 text-[10px] bg-[#27364f] text-[#dce8ff]">
                    Main
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {index > 0 && (
                    <button type="button" onClick={() => moveImage(index, "up")} className="admin-btn admin-btn-secondary w-7 h-7 p-0">
                      ←
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(index)} className="admin-btn admin-btn-danger w-7 h-7 p-0">
                    ×
                  </button>
                  {index < images.length - 1 && (
                    <button type="button" onClick={() => moveImage(index, "down")} className="admin-btn admin-btn-secondary w-7 h-7 p-0">
                      →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} className="admin-input" />
        <p className="admin-subheading mt-1">Select multiple files. The first image is used as thumbnail.</p>

        <input type="hidden" name="image" value={images[0] || ""} />
        <input type="hidden" name="images" value={JSON.stringify(images.slice(1))} />

        {uploading && <p className="text-sm text-[#b9cbe8] mt-1">Uploading...</p>}
      </div>

      <FormTextarea label="Description" name="description" defaultValue={product?.description} required placeholder="Product description" />

      <FormSelect label="Category" name="category" defaultValue={product?.category || "singles"} required>
        <option value="singles">Singles</option>
        <option value="collections">Collections</option>
      </FormSelect>

      <FormSelect label="Collection (Optional)" name="collectionId" defaultValue={product?.collectionId?.toString() || ""}>
        <option value="">No Collection</option>
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id.toString()}>
            {collection.name}
          </option>
        ))}
      </FormSelect>

      <div className="mb-4 mt-6">
        <label className="admin-input-label">Variations (Optional)</label>

        {variations.map((variation, vIndex) => (
          <div key={vIndex} className="mb-4 p-4 rounded-md border border-[#2a313d] bg-[#0f1318]">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={variation.name}
                onChange={(e) => updateVariationName(vIndex, e.target.value)}
                placeholder="Variation name (e.g., Size, Color)"
                className="admin-input"
              />
              <button type="button" onClick={() => removeVariation(vIndex)} className="admin-btn admin-btn-danger">
                Remove
              </button>
            </div>

            <div className="pl-1">
              <p className="admin-subheading mb-2">Options</p>
              {variation.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => updateOption(vIndex, oIndex, "value", e.target.value)}
                    placeholder="Value"
                    className="admin-input"
                  />
                  <input
                    type="number"
                    value={option.stock}
                    onChange={(e) => updateOption(vIndex, oIndex, "stock", Number.parseInt(e.target.value, 10) || 0)}
                    placeholder="Stock"
                    min="0"
                    className="admin-input w-24"
                  />
                  <button type="button" onClick={() => removeOption(vIndex, oIndex)} className="admin-btn admin-btn-danger px-2 py-2">
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addOption(vIndex)} className="admin-btn admin-btn-secondary px-3 py-2 mt-1">
                + Add Option
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={addVariation} className="admin-btn admin-btn-secondary">
          + Add Variation
        </button>

        <input
          type="hidden"
          name="variations"
          value={JSON.stringify(variations.filter((v) => v.name && v.name.trim() !== "" && v.options.length > 0))}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button type="submit" disabled={images.length === 0} className="admin-btn" style={images.length === 0 ? { opacity: 0.5 } : undefined}>
          {product ? "Update" : "Create"} Product
        </button>
        <Link href="/admin/products" className="admin-btn admin-btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
