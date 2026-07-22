import Link from "next/link";
import Image from "next/image";

interface GridProduct {
  id: number;
  title: string;
  image: string;
}

interface ProductGridProps {
  products: GridProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="v-grid-photos">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/shop/${product.id}`}
          title={product.title}
          className="v-grid-photo"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="140px"
            className="object-cover"
          />
        </Link>
      ))}
    </div>
  );
}
