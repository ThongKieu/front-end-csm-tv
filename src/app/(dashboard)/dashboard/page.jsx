import DashboardClient from "./DashboardClient";
export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
}
export default function DashboardPage() {
  return (
    <div className="h-screen flex flex-col pt-16 bg-gradient-to-br from-blue-50 to-indigo-50">
     <div className="flex-1 overflow-hidden">
       <DashboardClient />
     </div>
    </div>
  )
} 