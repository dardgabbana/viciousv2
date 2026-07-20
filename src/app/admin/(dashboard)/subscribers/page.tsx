import { db } from "@/lib/db";

export default async function SubscribersPage() {
  const subscribers = await db.waitlistSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="admin-heading">Subscribers</h1>
        <p className="admin-subheading">{subscribers.length} shown</p>
      </div>

      {subscribers.length === 0 ? (
        <div className="admin-card text-center py-10">
          <p className="admin-subheading">No subscribers yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{subscriber.email}</td>
                  <td>{new Date(subscriber.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
