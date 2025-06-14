import ServiceClient from "./ServiceClient";
export const metadata = {
  title: "Dịch vụ" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Dịch vụ",
}
export default function ServicesPage() {

  return (
    <div className="pt-16 pb-4 px-4 max-w-6xl mx-auto">
        <ServiceClient />
    </div>
  );
} 