import ProfileClient from './ProfileClient'
export const metadata = {
  title: "Thông Tin Tài Khoản" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Thông Tin Tài Khoản",
}
export default function ProfilePage() {
  return <ProfileClient />
} 