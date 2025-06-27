export const metadata = {
  title: "Quản lý thợ" + " - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Quản lý thợ",
};

export default function WorkersLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
} 