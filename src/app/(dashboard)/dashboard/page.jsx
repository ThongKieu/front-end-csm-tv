import DashboardClient from "./DashboardClient";
export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};
export default function DashboardPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="overflow-hidden flex-1">
        <DashboardClient />
      </div>
    </div>
  );
}
