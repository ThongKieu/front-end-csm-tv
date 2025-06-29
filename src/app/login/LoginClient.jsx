"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Lock, 
  Building2, 
  Users, 
  BarChart3, 
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Star
} from "lucide-react";

export default function LoginClient() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log('Attempting login with:', formData);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      console.log('Login successful, dispatching to Redux');
      // Dispatch login action (sẽ tự động lưu vào localStorage)
      dispatch(login(data));

      console.log('Redirecting to:', from);
      // Redirect to the original page or dashboard
      router.push(from);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setFormData({ email, password });
    setError("");
    setIsLoading(true);

    console.log('Attempting demo login with:', { email, password });

    try {
      // Test 1: Kiểm tra xem có thể gọi API không
      console.log('Making API call to /api/auth/login');
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Demo login response status:', response.status);
      console.log('Demo login response headers:', response.headers);
      
      const data = await response.json();
      console.log('Demo login response data:', data);

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      console.log('Demo login successful, dispatching to Redux');
      
      // Test 2: Kiểm tra Redux dispatch
      try {
        dispatch(login(data));
        console.log('Redux dispatch successful');
      } catch (reduxError) {
        console.error('Redux dispatch error:', reduxError);
        throw new Error('Lỗi khi lưu thông tin đăng nhập');
      }
      
      console.log('Demo login redirecting to:', from);
      
      // Test 3: Kiểm tra router
      try {
        router.push(from);
        console.log('Router push successful');
      } catch (routerError) {
        console.error('Router push error:', routerError);
        // Fallback: reload page
        window.location.href = from;
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex overflow-hidden relative h-[calc(100vh-0px)] w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,119,198,0.3),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="overflow-hidden absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse bg-purple-500/20"></div>
        <div className="absolute right-10 top-40 w-96 h-96 rounded-full blur-3xl delay-1000 animate-pulse bg-pink-500/20"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 rounded-full blur-3xl animate-pulse bg-blue-500/20 delay-2000"></div>
        <div className="absolute right-20 bottom-40 w-64 h-64 rounded-full blur-3xl animate-pulse bg-indigo-500/20 delay-3000"></div>
      </div>

      {/* Left Side - Login Form */}
      <div className="flex relative z-10 flex-1 justify-center items-center p-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-4 text-center">
            <div className="inline-block relative mb-3">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-75 blur-xl animate-pulse"></div>
              <div className="inline-flex relative justify-center items-center w-14 h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110">
                <Building2 className="w-7 h-7 text-white" />
                <div className="flex absolute -top-1 -right-1 justify-center items-center w-3 h-3 bg-yellow-400 rounded-full">
                  <Sparkles className="w-1.5 h-1.5 text-yellow-900" />
                </div>
              </div>
            </div>
            <h1 className="mb-1 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              CSM TV
            </h1>
            <p className="mb-0.5 text-xs font-medium text-white/90">Hệ thống quản lý dịch vụ</p>
            <p className="text-xs text-white/70">Đăng nhập để tiếp tục</p>
          </div>

          {/* Login Form */}
          <div className="overflow-hidden relative p-5 rounded-2xl border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20">
            {/* Form Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br rounded-2xl from-white/5 to-white/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-3">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-white/90"
                >
                  Email
                </label>
                <div className="relative group">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Mail className="w-4 h-4 transition-colors text-white/60 group-focus-within:text-purple-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="py-2.5 pr-3 pl-10 w-full text-sm text-white rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/10 border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/50"
                    placeholder="Nhập email của bạn"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 blur-xl transition-opacity duration-300 from-purple-500/20 to-pink-500/20 group-focus-within:opacity-100 -z-10"></div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-white/90"
                >
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Lock className="w-4 h-4 transition-colors text-white/60 group-focus-within:text-purple-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="py-2.5 pr-10 pl-10 w-full text-sm text-white rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/10 border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/50"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 p-1.5 rounded-lg transition-colors transform -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 blur-xl transition-opacity duration-300 from-purple-500/20 to-pink-500/20 group-focus-within:opacity-100 -z-10"></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2.5 rounded-xl border backdrop-blur-sm animate-pulse bg-red-500/20 border-red-500/30">
                  <p className="text-xs font-medium text-red-200">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden group text-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <div className="flex relative z-10 justify-center items-center">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Đang đăng nhập...
                  </div>
                ) : (
                  <div className="flex relative z-10 justify-center items-center">
                    <Zap className="mr-2 w-4 h-4" />
                    Đăng nhập
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="overflow-hidden relative p-3 mt-3 rounded-xl border backdrop-blur-xl bg-white/5 border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br rounded-xl from-purple-500/10 to-pink-500/10"></div>
              <div className="relative z-10">
                <h3 className="flex items-center mb-2 text-xs font-semibold text-white/90">
                  <CheckCircle className="mr-2 w-3 h-3 text-green-400" />
                  Tài khoản demo:
                </h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleDemoLogin("admin@example.com", "admin123")}
                    disabled={isLoading}
                    className="flex justify-between items-center p-2 w-full rounded-lg border shadow-sm backdrop-blur-sm transition-all duration-300 bg-white/10 hover:shadow-lg border-white/20 hover:border-purple-400/50 disabled:opacity-50 group"
                  >
                    <div className="flex items-center">
                      <div className="flex justify-center items-center mr-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-lg">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-white">Admin</p>
                        <p className="text-xs text-white/60">admin@example.com</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium text-red-200 rounded-full border bg-red-500/20 border-red-500/30">
                      Admin
                    </span>
                  </button>

                  <button
                    onClick={() => handleDemoLogin("user@example.com", "user123")}
                    disabled={isLoading}
                    className="flex justify-between items-center p-2 w-full rounded-lg border shadow-sm backdrop-blur-sm transition-all duration-300 bg-white/10 hover:shadow-lg border-white/20 hover:border-blue-400/50 disabled:opacity-50 group"
                  >
                    <div className="flex items-center">
                      <div className="flex justify-center items-center mr-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-white">User</p>
                        <p className="text-xs text-white/60">user@example.com</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium text-blue-200 rounded-full border bg-blue-500/20 border-blue-500/30">
                      User
                    </span>
                  </button>

                  <button
                    onClick={() => handleDemoLogin("accountant@example.com", "accountant123")}
                    disabled={isLoading}
                    className="flex justify-between items-center p-2 w-full rounded-lg border shadow-sm backdrop-blur-sm transition-all duration-300 bg-white/10 hover:shadow-lg border-white/20 hover:border-green-400/50 disabled:opacity-50 group"
                  >
                    <div className="flex items-center">
                      <div className="flex justify-center items-center mr-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                        <BarChart3 className="w-3 h-3 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-white">Kế toán</p>
                        <p className="text-xs text-white/60">accountant@example.com</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium text-green-200 rounded-full border bg-green-500/20 border-green-500/30">
                      Kế toán
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Background & Info */}
      <div className="hidden overflow-hidden relative lg:block lg:w-1/2">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl animate-pulse bg-purple-500/20"></div>
          <div className="absolute right-20 top-40 w-24 h-24 rounded-full blur-xl delay-1000 animate-pulse bg-pink-500/20"></div>
          <div className="absolute bottom-20 left-32 w-40 h-40 rounded-full blur-xl animate-pulse bg-blue-500/20 delay-2000"></div>
          <div className="absolute right-32 bottom-40 w-28 h-28 rounded-full blur-xl animate-pulse bg-indigo-500/20 delay-3000"></div>
        </div>

        {/* Content */}
        <div className="flex relative z-10 justify-center items-center p-6 h-full">
          <div className="max-w-sm text-center text-white">
            <div className="mb-6">
              <div className="inline-block relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-50 blur-2xl animate-pulse"></div>
                <div className="inline-flex relative justify-center items-center w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full shadow-2xl">
                  <Building2 className="w-10 h-10" />
                  <div className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 bg-yellow-400 rounded-full animate-bounce">
                    <Star className="w-2.5 h-2.5 text-yellow-900" />
                  </div>
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                CSM TV
              </h2>
              <p className="mb-2 text-sm font-medium text-white/90">Hệ thống quản lý dịch vụ</p>
              <p className="text-xs text-white/70">Quản lý công việc, nhân viên và khách hàng một cách hiệu quả</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 rounded-xl border backdrop-blur-xl transition-all duration-300 bg-white/10 border-white/20 hover:border-purple-400/50 group hover:scale-105">
                <div className="flex justify-center items-center mx-auto mb-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg transition-shadow group-hover:shadow-purple-500/25">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="mb-1 text-xs font-semibold">Quản lý nhân viên</h3>
                <p className="text-xs text-white/80">Theo dõi và phân công công việc hiệu quả</p>
              </div>

              <div className="p-3 rounded-xl border backdrop-blur-xl transition-all duration-300 bg-white/10 border-white/20 hover:border-blue-400/50 group hover:scale-105">
                <div className="flex justify-center items-center mx-auto mb-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg transition-shadow group-hover:shadow-blue-500/25">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="mb-1 text-xs font-semibold">Báo cáo thống kê</h3>
                <p className="text-xs text-white/80">Theo dõi hiệu suất và tạo báo cáo chi tiết</p>
              </div>

              <div className="p-3 rounded-xl border backdrop-blur-xl transition-all duration-300 bg-white/10 border-white/20 hover:border-green-400/50 group hover:scale-105">
                <div className="flex justify-center items-center mx-auto mb-2 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg transition-shadow group-hover:shadow-green-500/25">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="mb-1 text-xs font-semibold">Bảo mật cao</h3>
                <p className="text-xs text-white/80">Hệ thống bảo mật đa lớp, an toàn tuyệt đối</p>
              </div>

              <div className="p-3 rounded-xl border backdrop-blur-xl transition-all duration-300 bg-white/10 border-white/20 hover:border-purple-400/50 group hover:scale-105">
                <div className="flex justify-center items-center mx-auto mb-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg transition-shadow group-hover:shadow-purple-500/25">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="mb-1 text-xs font-semibold">Tích hợp đa nền tảng</h3>
                <p className="text-xs text-white/80">Truy cập từ mọi thiết bị, mọi nơi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 