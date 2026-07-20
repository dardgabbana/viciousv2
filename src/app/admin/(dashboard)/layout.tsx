import AdminNav from "@/components/admin/AdminNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="admin-main">{children}</main>
    </div>
  );
}
