"use client";

import { useState, useEffect } from "react";
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
  Sparkles,
  Zap,
  Star,
  Check
} from "lucide-react";
import { getBackendUrl } from '@/config/constants';

export default function LoginClient() {
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  // Load saved login info when component mounts
  useEffect(() => {
    try {
      const savedLoginInfo = localStorage.getItem('savedLoginInfo');
      if (savedLoginInfo) {
        const { user_name, password, rememberMe: savedRememberMe } = JSON.parse(savedLoginInfo);
        setFormData({ user_name, password });
        setRememberMe(savedRememberMe);
      }
    } catch (error) {
      console.error('Error loading saved login info:', error);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const clearSavedLoginInfo = () => {
    localStorage.removeItem('savedLoginInfo');
    setFormData({ user_name: "", password: "" });
    setRememberMe(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: formData.user_name,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log('LoginClient: Response data từ API:', data);
      
      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }
      
      // Xử lý các format response khác nhau từ backend
      let loginData = data;
      
      // Nếu backend trả về format { success: true, data: { token, user } }
      if (data.success && data.data) {
        loginData = data.data;
      }
      // Nếu backend trả về format { success: true, token, user }
      else if (data.success && data.token && data.user) {
        loginData = { token: data.token, user: data.user };
      }
      // Nếu backend trả về trực tiếp { token, user }
      else if (data.token && data.user) {
        loginData = data;
      }
      else {
        console.error('LoginClient: Response không chứa token hoặc user:', data);
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }
      
      console.log('LoginClient: Login data đã xử lý:', loginData);
      
      // Save login info if remember me is checked
      if (rememberMe) {
        try {
          localStorage.setItem('savedLoginInfo', JSON.stringify({
            user_name: formData.user_name,
            password: formData.password,
            rememberMe: true
          }));
        } catch (error) {
          console.error('Error saving login info:', error);
        }
      } else {
        // Remove saved login info if remember me is unchecked
        localStorage.removeItem('savedLoginInfo');
      }
      
      console.log('LoginClient: Dispatching login với data:', loginData);
      console.log('LoginClient: Token sẽ được lưu:', loginData.token);
      console.log('LoginClient: User sẽ được lưu:', loginData.user);
      
      dispatch(login(loginData));
      
      // Kiểm tra xem token có được lưu vào localStorage không
      setTimeout(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');
        console.log('LoginClient: Kiểm tra sau khi dispatch - Token:', savedToken ? 'Có' : 'Không');
        console.log('LoginClient: Kiểm tra sau khi dispatch - User:', savedUser ? 'Có' : 'Không');
      }, 100);
      
      router.push(from);
    } catch (error) {
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
            
            {/* Backend Info */}
            <div className="p-2 mt-2 rounded-lg bg-white/10">
              <p className="text-xs text-white/80">
                Kết nối đến: <strong>{getBackendUrl()}</strong>
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="overflow-hidden relative p-5 rounded-2xl border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20">
            {/* Form Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br rounded-2xl from-white/5 to-white/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-3">
              {/* User Name */}
              <div className="space-y-1.5">
                <label htmlFor="user_name" className="block text-xs font-semibold text-white/90">Tên đăng nhập</label>
                <div className="relative group">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Mail className="w-4 h-4 transition-colors text-white/60 group-focus-within:text-purple-400" />
                  </div>
                  <input
                    type="text"
                    id="user_name"
                    value={formData.user_name}
                    onChange={(e) => handleInputChange("user_name", e.target.value)}
                    className="py-2.5 pr-3 pl-10 w-full text-sm text-white rounded-xl border backdrop-blur-sm transition-all duration-300 bg-white/10 border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/50"
                    placeholder="Nhập tên đăng nhập"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 blur-xl transition-opacity duration-300 from-purple-500/20 to-pink-500/20 group-focus-within:opacity-100 -z-10"></div>
                </div>
              </div>
              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-white/90">Mật khẩu</label>
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
              
              {/* Remember Me Checkbox */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`flex items-center justify-center w-4 h-4 rounded border transition-all duration-200 ${
                      rememberMe 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500' 
                        : 'bg-white/10 border-white/30 hover:border-purple-400'
                    }`}
                  >
                    {rememberMe && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <label 
                    htmlFor="remember-me" 
                    className="text-xs font-medium cursor-pointer select-none text-white/90"
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                
                {/* Clear saved info button (only show if there's saved info) */}
                {localStorage.getItem('savedLoginInfo') && (
                  <button
                    type="button"
                    onClick={clearSavedLoginInfo}
                    className="text-xs underline transition-colors text-white/60 hover:text-white/90"
                    title="Xóa thông tin đã lưu"
                  >
                    Xóa thông tin đã lưu
                  </button>
                )}
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
              
              {/* Register Link */}
              <div className="text-center">
                <p className="mb-2 text-xs text-white/70">Chưa có tài khoản?</p>
                <a
                  href="/register"
                  className="inline-flex items-center px-4 py-2 text-xs font-medium text-purple-300 rounded-lg border transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/20 hover:border-purple-400/50"
                >
                  <Users className="mr-2 w-3 h-3" />
                  Tạo tài khoản mới
                </a>
              </div>
            </form>
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