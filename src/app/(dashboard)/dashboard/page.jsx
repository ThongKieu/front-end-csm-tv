import DashboardClient from "./DashboardClient";
export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
}
export default function DashboardPage() {
  return (
    <div className="h-[calc(100vh-65px)] bg-gradient-to-br from-blue-50 to-indigo-50">
     <DashboardClient />
    </div>
  )
} 