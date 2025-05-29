import { X } from "lucide-react";

export default function WorkerAddModal({ onClose, onSubmit, formData, setFormData }) {
  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSubmit} className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Thêm thợ mới</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.worker_full_name}
                  onChange={(e) => setFormData({...formData, worker_full_name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã thợ <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.worker_code}
                  onChange={(e) => setFormData({...formData, worker_code: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập mã thợ"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại công ty <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  value={formData.worker_phone_company}
                  onChange={(e) => setFormData({...formData, worker_phone_company: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại công ty"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại cá nhân</label>
                <input
                  type="tel"
                  value={formData.worker_phone_personal}
                  onChange={(e) => setFormData({...formData, worker_phone_personal: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại cá nhân"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <input
                type="text"
                value={formData.worker_address}
                onChange={(e) => setFormData({...formData, worker_address: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Work Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Doanh số/ngày <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  value={formData.worker_daily_sales}
                  onChange={(e) => setFormData({...formData, worker_daily_sales: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập doanh số/ngày"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lương theo giờ <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  value={formData.worker_daily_o_t_by_hour}
                  onChange={(e) => setFormData({...formData, worker_daily_o_t_by_hour: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập lương theo giờ"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Trạng thái <span className="text-red-500">*</span></label>
              <select
                required
                value={formData.worker_status}
                onChange={(e) => setFormData({...formData, worker_status: parseInt(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={1}>Đang hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>

            {/* Account Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">Thông tin tài khoản</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Thêm thợ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 