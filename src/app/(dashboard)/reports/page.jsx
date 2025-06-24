import ReportsClient from "./ReportClient";
export const metadata = {
  title: "Báo cáo" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Báo cáo",
};
export default function ReportsPage() {


  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
     <ReportsClient />
    </div>
  );
} 