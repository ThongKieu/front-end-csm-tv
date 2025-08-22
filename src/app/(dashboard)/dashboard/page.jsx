import DashboardClient from "./DashboardClient";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="overflow-hidden flex-1">
          <DashboardClient />
        </div>
      </div>
    </AuthGuard>
  );
}
