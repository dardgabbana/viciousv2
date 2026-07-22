import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderStatusSelect from "./OrderStatusSelect";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const orderId = Number.parseInt(id, 10);

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="admin-btn admin-btn-secondary px-2.5 py-1.5">
          Back
        </Link>
        <h1 className="admin-heading">Order #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="admin-card p-5">
          <h2 className="admin-heading mb-3" style={{ fontSize: "18px" }}>
            Customer
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="admin-subheading">Name</p>
              <p>{order.firstName} {order.lastName}</p>
            </div>
            <div>
              <p className="admin-subheading">Email</p>
              <p>{order.email}</p>
            </div>
            {order.phone && (
              <div>
                <p className="admin-subheading">Phone</p>
                <p>{order.phone}</p>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card p-5">
          <h2 className="admin-heading mb-3" style={{ fontSize: "18px" }}>
            Shipping Address
          </h2>
          <div className="text-sm leading-6">
            <p>{order.address}</p>
            <p>
              {order.city}, {order.state} {order.zipCode}
            </p>
            <p>{order.country}</p>
          </div>
        </div>

        <div className="admin-card p-5 md:col-span-2">
          <h2 className="admin-heading mb-4" style={{ fontSize: "18px" }}>
            Items
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => {
              const selectedVariations = item.selectedVariations
                ? (JSON.parse(item.selectedVariations as string) as { name: string; value: string }[])
                : null;

              return (
                <div key={item.id} className="flex gap-3 p-3 rounded-md border border-[#242a34] bg-[#0f1318]">
                  <div className="relative w-14 h-14 rounded overflow-hidden border border-[#2b3341] flex-shrink-0">
                    <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{item.product.title}</p>
                    {selectedVariations && selectedVariations.length > 0 && (
                      <p className="admin-subheading mt-1">
                        {selectedVariations.map((v) => `${v.name}: ${v.value}`).join(" / ")}
                      </p>
                    )}
                    <p className="admin-subheading mt-1">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-sm font-semibold">${(item.quantity * item.price).toFixed(2)}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-[#242a34] flex justify-between items-center">
            <span className="admin-subheading">Total</span>
            <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="admin-card p-5 md:col-span-2">
          <h2 className="admin-heading mb-3" style={{ fontSize: "18px" }}>
            Update Status
          </h2>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}
