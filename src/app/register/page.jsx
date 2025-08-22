"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getBackendUrl } from '@/config/constants';
import { ROUTES, getRoleBasedRoute } from '@/config/routes';
import AuthLoading from '@/components/AuthLoading';

const jobTypes = [
  { value: 'VP', label: 'VP' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'H', label: 'H' },
  { value: 'I', label: 'I' },
  { value: 'J', label: 'J' },
  { value: 'K', label: 'K' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'N', label: 'N' },
  { value: 'O', label: 'O' },
  { value: 'P', label: 'P' },
  { value: 'Q', label: 'Q' },
  { value: 'R', label: 'R' },
  { value: 'S', label: 'S' },
  { value: 'T', label: 'T' },
  { value: 'U', label: 'U' },
  { value: 'V', label: 'V' },
  { value: 'W', label: 'W' },
  { value: 'X', label: 'X' },
  { value: 'Y', label: 'Y' },
  { value: 'Z', label: 'Z' },
];

const roleOptions = [
  { value: 'worker', label: 'Thợ' },
  { value: 'office', label: 'Văn phòng' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    user_name: '',
    password: '',
    type: '',
    code: '',
    full_name: '',
    phone_business: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Chỉ redirect khi đã hoàn tất quá trình loading và đã đăng nhập
    if (!authLoading && isAuthenticated && user) {
      const roleBasedRoute = getRoleBasedRoute(user.role);
      router.push(roleBasedRoute);
    }
  }, [isAuthenticated, authLoading, user, router]);

  // Hiển thị loading khi đang khôi phục authentication
  if (authLoading) {
    return <AuthLoading />;
  }

  // Nếu đã đăng nhập, không hiển thị gì (sẽ redirect)
  if (isAuthenticated && user) {
    return null;
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.user_name.trim()) return 'Vui lòng nhập tên đăng nhập';
    if (form.user_name.trim().length < 3) return 'Tên đăng nhập tối thiểu 3 ký tự';
    if (!form.password.trim() || form.password.length < 4) return 'Mật khẩu tối thiểu 4 ký tự';
    if (!form.type) return 'Vui lòng chọn loại công việc';
    if (!form.code || isNaN(form.code) || +form.code < 0 || +form.code > 999) return 'Code phải là số từ 0-999';
    if (!form.full_name.trim()) return 'Vui lòng nhập họ tên';
    if (form.full_name.trim().length < 2) return 'Họ tên tối thiểu 2 ký tự';
    if (!form.phone_business.trim()) return 'Vui lòng nhập số công ty';
    if (!/^\d{8,15}$/.test(form.phone_business.trim())) return 'Số công ty phải là số 8-15 chữ số';
    if (!form.role) return 'Vui lòng chọn vai trò';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Chuẩn bị dữ liệu theo đúng format backend yêu cầu
      const requestData = {
        user_name: form.user_name.trim(),
        password: form.password,
        type: form.type,
        code: parseInt(form.code),
        full_name: form.full_name.trim(),
        phone_business: form.phone_business.trim(),
        role: form.role,
      };

      const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await res.json();
      
      
      if (!res.ok) {
        // Hiển thị lỗi chi tiết từ backend
        if (res.status === 422) {
          const errorMessage = data.message || data.error || 'Dữ liệu không hợp lệ';
          throw new Error(`Lỗi validation: ${errorMessage}`);
        }
        throw new Error(data.message || `Lỗi server: ${res.status}`);
      }
      
      setSuccess('Tạo tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleSubmit} className="p-8 space-y-5 w-full max-w-md bg-white rounded-xl shadow-lg">
        <h2 className="mb-2 text-2xl font-bold text-center">Tạo tài khoản mới</h2>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-center text-blue-700">
            Kết nối đến: <strong>{getBackendUrl()}</strong>
          </p>
        </div>
        
        {error && <div className="p-2 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        {success && <div className="p-2 text-sm rounded text-brand-green bg-brand-green/10">{success}</div>}
        
        <div>
          <label className="block mb-1 text-sm font-medium">Tên đăng nhập *</label>
          <input 
            type="text" 
            className="px-3 py-2 w-full rounded border" 
            value={form.user_name} 
            onChange={e => handleChange('user_name', e.target.value)} 
            placeholder="Tối thiểu 3 ký tự"
            required 
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Mật khẩu *</label>
          <input 
            type="password" 
            className="px-3 py-2 w-full rounded border" 
            value={form.password} 
            onChange={e => handleChange('password', e.target.value)} 
            placeholder="Tối thiểu 4 ký tự"
            required 
            minLength={4} 
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Loại công việc *</label>
          <select 
            className="px-3 py-2 w-full rounded border" 
            value={form.type} 
            onChange={e => handleChange('type', e.target.value)} 
            required
          >
            <option value="">Chọn loại công việc</option>
            {jobTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Code (0-999) *</label>
          <input 
            type="number" 
            className="px-3 py-2 w-full rounded border" 
            value={form.code} 
            onChange={e => handleChange('code', e.target.value)} 
            min={0} 
            max={999} 
            placeholder="Nhập số từ 0-999"
            required 
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Họ tên *</label>
          <input 
            type="text" 
            className="px-3 py-2 w-full rounded border" 
            value={form.full_name} 
            onChange={e => handleChange('full_name', e.target.value)} 
            placeholder="Tối thiểu 2 ký tự"
            required 
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Số công ty *</label>
          <input 
            type="text" 
            className="px-3 py-2 w-full rounded border" 
            value={form.phone_business} 
            onChange={e => handleChange('phone_business', e.target.value)} 
            placeholder="8-15 chữ số"
            required 
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Vai trò *</label>
          <select 
            className="px-3 py-2 w-full rounded border" 
            value={form.role} 
            onChange={e => handleChange('role', e.target.value)} 
            required
          >
            <option value="">Chọn vai trò</option>
            {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <button 
          type="submit" 
          disabled={isLoading} 
          className="py-2 mt-2 w-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded transition hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
        <div className="mt-2 text-sm text-center">
          Đã có tài khoản? <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>
        </div>
      </form>
    </div>
  );
} 