export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Đang kiểm tra đăng nhập...
        </h2>
        <p className="text-sm text-gray-600">
          Vui lòng chờ trong giây lát
        </p>
      </div>
    </div>
  );
} 