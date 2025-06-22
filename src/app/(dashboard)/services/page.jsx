import ServiceClient from "./ServiceClient";
export const metadata = {
  title: "Dịch vụ" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Dịch vụ",
}
export default function ServicesPage() {

  return (
    <div className="max-w-6xl px-4 pt-16 pb-4 mx-auto">
        <ServiceClient />
    </div>
  );
} 