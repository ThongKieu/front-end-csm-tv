"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const jobTypes = [
  { value: '1', label: 'Điện Nước' },
  { value: '2', label: 'Điện Lạnh' },
  { value: '3', label: 'Đồ gỗ' },
  { value: '4', label: 'Năng Lượng Mặt trời' },
  { value: '5', label: 'Xây Dựng' },
  { value: '6', label: 'Tài Xế' },
  { value: '7', label: 'Cơ Khí' },
  { value: '8', label: 'Điện - Điện Tử' },
  { value: '9', label: 'Văn Phòng' }
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
  const [connectionStatus, setConnectionStatus] = useState('');
  const router = useRouter();

  const testConnection = async () => {
    setConnectionStatus('Đang kiểm tra...');
    try {
      const res = await fetch('/api/test-connection');
      const data = await res.json();
      setConnectionStatus(data.message);
      if (data.status === 'error') {
        setError('Lỗi kết nối: ' + data.message);
      }
    } catch (err) {
      setConnectionStatus('Lỗi khi test kết nối');
      setError(err.message);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.user_name.trim()) return 'Vui lòng nhập tên đăng nhập';
    if (!form.password.trim() || form.password.length < 4) return 'Mật khẩu tối thiểu 4 ký tự';
    if (!form.type) return 'Vui lòng chọn loại công việc';
    if (!form.code || isNaN(form.code) || +form.code < 0 || +form.code > 999) return 'Code phải là số từ 0-999';
    if (!form.full_name.trim()) return 'Vui lòng nhập họ tên';
    if (!form.phone_business.trim() || !/^\d{8,15}$/.test(form.phone_business)) return 'Số công ty phải là số 8-15 chữ số';
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
      const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          code: +form.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      setSuccess('Tạo tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleSubmit} className="p-8 space-y-5 w-full max-w-md bg-white rounded-xl shadow-lg">
        <h2 className="mb-2 text-2xl font-bold text-center">Tạo tài khoản mới</h2>
        
        {/* Test Connection Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={testConnection}
            className="px-4 py-2 text-sm text-white bg-gray-500 rounded transition hover:bg-gray-600"
          >
            Test Kết Nối Backend
          </button>
          {connectionStatus && (
            <p className="mt-2 text-xs text-gray-600">{connectionStatus}</p>
          )}
        </div>
        
        {error && <div className="p-2 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        {success && <div className="p-2 text-sm text-green-700 bg-green-100 rounded">{success}</div>}
        <div>
          <label className="block mb-1 text-sm font-medium">Tên đăng nhập *</label>
          <input type="text" className="px-3 py-2 w-full rounded border" value={form.user_name} onChange={e => handleChange('user_name', e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Mật khẩu *</label>
          <input type="password" className="px-3 py-2 w-full rounded border" value={form.password} onChange={e => handleChange('password', e.target.value)} required minLength={4} />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Loại công việc *</label>
          <select className="px-3 py-2 w-full rounded border" value={form.type} onChange={e => handleChange('type', e.target.value)} required>
            <option value="">Chọn loại công việc</option>
            {jobTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Code (0-999) *</label>
          <input type="number" className="px-3 py-2 w-full rounded border" value={form.code} onChange={e => handleChange('code', e.target.value)} min={0} max={999} required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Họ tên *</label>
          <input type="text" className="px-3 py-2 w-full rounded border" value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Số công ty *</label>
          <input type="text" className="px-3 py-2 w-full rounded border" value={form.phone_business} onChange={e => handleChange('phone_business', e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Vai trò *</label>
          <select className="px-3 py-2 w-full rounded border" value={form.role} onChange={e => handleChange('role', e.target.value)} required>
            <option value="">Chọn vai trò</option>
            {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="py-2 mt-2 w-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded transition hover:from-blue-600 hover:to-purple-600 disabled:opacity-50">
          {isLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
        <div className="mt-2 text-sm text-center">
          Đã có tài khoản? <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>
        </div>
      </form>
    </div>
  );
} 