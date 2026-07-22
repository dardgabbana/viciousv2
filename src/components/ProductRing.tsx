import Link from "next/link";
import Image from "next/image";

interface RingProduct {
  id: number;
  title: string;
  image: string;
}

interface ProductRingProps {
  products: RingProduct[];
}

export default function ProductRing({ products }: ProductRingProps) {
  if (products.length === 0) return null;

  const count = products.length;

  return (
    <div className="v-ring-wrap">
      <div className="v-ring">
        {products.map((product, index) => {
          const angle = (360 / count) * index;
          return (
            <div
              key={product.id}
              className="v-ring-item"
              style={{
                transform: `rotate(${angle}deg) translate(var(--v-ring-radius)) rotate(${-angle}deg)`,
              }}
            >
              <div className="v-ring-item-inner">
                <Link
                  href={`/shop/${product.id}`}
                  className="v-ring-photo"
                  title={product.title}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
