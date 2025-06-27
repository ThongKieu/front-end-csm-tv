import ServiceClient from "./ServiceClient";
export const metadata = {
  title: "Dịch vụ" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Dịch vụ",
}
export default function ServicesPage() {

  return (
    <div className="px-4 pb-4 mx-auto max-w-6xl">
        <ServiceClient />
    </div>
  );
} 