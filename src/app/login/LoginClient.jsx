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
  Check,
  Globe
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
      
      // Dispatch login action
      dispatch(login(loginData));
      
      // Kiểm tra xem token có được lưu vào localStorage không
      setTimeout(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');
        console.log('LoginClient: Kiểm tra sau khi dispatch - Token:', savedToken ? 'Có' : 'Không');
        console.log('LoginClient: Kiểm tra sau khi dispatch - User:', savedUser ? 'Có' : 'Không');
      }, 100);
      
      // Redirect sau khi đăng nhập thành công
      console.log('LoginClient: Redirecting to:', from);
      
      // Sử dụng setTimeout để đảm bảo Redux state đã được cập nhật
      setTimeout(() => {
        router.push(from);
      }, 200);
      
    } catch (error) {
      console.error('LoginClient: Error during login:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <div className="mb-6 text-center">
            <div className="inline-flex justify-center items-center mb-3 w-16 h-16 rounded-full bg-brand-green">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CSM TV</h1>
            <p className="text-base text-gray-600">Hệ thống quản lý dịch vụ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user_name" className="block mb-2 text-base font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={(e) => handleInputChange("user_name", e.target.value)}
                  required
                  className="py-3 pr-3 pl-12 w-full text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-base font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="py-3 pr-12 pl-12 w-full text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 p-1 text-gray-400 rounded transform -translate-y-1/2 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
              />
              <label htmlFor="remember" className="block ml-2 text-base text-gray-700 cursor-pointer select-none">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Chưa có tài khoản? Đăng ký ngay
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-md border border-red-200">
                <p className="text-base text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 w-full text-base font-semibold text-green-700 rounded-md border-2 border-green-700 shadow-sm transition-colors hover:text-white bg-brand-green hover:bg-green-700 focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 