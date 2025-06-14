"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { ROUTES } from "@/config/routes";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import Image from "next/image";

export default function LoginClient() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Lưu token vào cookie
      Cookies.set("token", data.token, { expires: 7 }); // Hết hạn sau 7 ngày

      dispatch(login(data));

      // Tất cả các role đều vào dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Lưu token vào cookie
      Cookies.set("token", data.token, { expires: 7 }); // Hết hạn sau 7 ngày

      dispatch(login(data));

      // Tất cả các role đều vào dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <img
                  src="https://thoviet.com.vn/wp-content/uploads/2025/05/logo-thoviet.png"
                  alt="CSM TV Logo"
                />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Chào mừng trở lại
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Đăng nhập để tiếp tục quản lý hệ thống
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Đang đăng nhập...
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>
          </form>

          {/* Account List Section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Danh sách tài khoản mẫu</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <button
                  onClick={() => handleDemoLogin("admin@example.com", "admin123")}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-md shadow-sm hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-sm text-gray-500">admin@example.com / admin123</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">Admin</span>
                </button>
                <button
                  onClick={() => handleDemoLogin("accountant@example.com", "accountant123")}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-md shadow-sm hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">Kế toán</p>
                    <p className="text-sm text-gray-500">accountant@example.com / accountant123</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">Kế toán</span>
                </button>
                <button
                  onClick={() => handleDemoLogin("staff@example.com", "staff123")}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-md shadow-sm hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">Nhân viên</p>
                    <p className="text-sm text-gray-500">staff@example.com / staff123</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">Nhân viên</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right side - Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white space-y-6">
            <h2 className="text-4xl font-bold">CSM TV - Hệ thống quản lý</h2>
            <p className="text-lg text-blue-100">
              Quản lý công việc, nhân viên và khách hàng một cách hiệu quả
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Quản lý công việc</h3>
                <p className="text-sm text-blue-100">
                  Theo dõi và phân công công việc cho nhân viên
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Quản lý khách hàng</h3>
                <p className="text-sm text-blue-100">
                  Lưu trữ và quản lý thông tin khách hàng
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Báo cáo thống kê</h3>
                <p className="text-sm text-blue-100">
                  Theo dõi hiệu suất và tạo báo cáo
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tích hợp đa nền tảng</h3>
                <p className="text-sm text-blue-100">
                  Truy cập từ mọi thiết bị, mọi nơi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
