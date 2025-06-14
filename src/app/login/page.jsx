import LoginClient from "./LoginClient";
export const metadata = {
  title: "Đăng Nhập - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Login",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <LoginClient />
    </div>
  );
}
