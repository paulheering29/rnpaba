import { AdminSidebar } from "./AdminSidebar";

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-white flex items-center px-6 shrink-0">
          <span className="text-sm text-gray-500">Platform Admin</span>
          <div className="ml-auto">
            <span className="text-xs bg-amber-100 text-amber-700 rounded px-2 py-1 font-medium">
              Auth not yet configured — protect before going live
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
