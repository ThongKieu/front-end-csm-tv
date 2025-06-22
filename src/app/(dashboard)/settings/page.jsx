import SettingClient from "./SettingClient";
export const metadata = {
  title: "Cài đặt" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Cài đặt",
}
export default function SettingsPage() {
  return (
    <div className="max-w-6xl px-4 pt-16 pb-4 mx-auto h-[calc(100vh-64px)]">
      <SettingClient />
    </div>
  )
} 