import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, collectionCount, blogCount, subscriberCount, orderCount, pendingOrders, recentOrders] = await Promise.all([
    db.product.count(),
    db.collection.count(),
    db.blogPost.count(),
    db.waitlistSubscriber.count(),
    db.order.count(),
    db.order.count({ where: { status: "pending" } }),
    db.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { items: true } }),
  ]);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Collections", value: collectionCount, href: "/admin/collections" },
    { label: "Blog Posts", value: blogCount, href: "/admin/blog" },
    { label: "Subscribers", value: subscriberCount, href: "/admin/subscribers" },
    { label: "Orders", value: orderCount, href: "/admin/orders" },
    { label: "Pending", value: pendingOrders, href: "/admin/orders?status=pending" },
  ];

  return (
    <div>
      <h1 className="admin-heading mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="admin-card p-4 hover:border-[#3b475b] transition-colors">
            <p className="admin-subheading">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="admin-card p-5">
        <h2 className="admin-heading mb-4" style={{ fontSize: "18px" }}>
          Recent Orders
        </h2>

        {recentOrders.length === 0 ? (
          <p className="admin-subheading">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-md border border-[#242a34] hover:bg-[#151a22]"
              >
                <div>
                  <p className="text-sm font-medium">
                    {order.firstName} {order.lastName}
                  </p>
                  <p className="admin-subheading">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
                  <p className="admin-subheading uppercase">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
