import QuotesClient from "./QuotesClient";

export const metadata = {
  title: "Báo giá" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Quản lý báo giá",
}

export default function QuotesPage() {
  return <QuotesClient />;
} 