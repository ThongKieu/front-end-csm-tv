import RegisterClient from './RegisterClient';
export const metadata = {
  title: "Tạo Tài Khoản" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Tạo Tài Khoản",
}
export default function RegisterPage() {
  return <RegisterClient />;
} 