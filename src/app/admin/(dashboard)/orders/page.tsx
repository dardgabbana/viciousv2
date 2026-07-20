import { db } from "@/lib/db";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="admin-heading mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="admin-card text-center py-10">
          <p className="admin-subheading">No orders yet</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className="text-[#cfe1ff] hover:underline">
                      #{order.id}
                    </Link>
                  </td>
                  <td>
                    <div>
                      <p>{order.firstName} {order.lastName}</p>
                      <p className="admin-subheading">{order.email}</p>
                    </div>
                  </td>
                  <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td className="admin-subheading">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className="admin-btn admin-btn-secondary px-2.5 py-1.5">
                      View
                    </Link>
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
