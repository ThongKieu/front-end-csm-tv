import { X } from "lucide-react";

export default function WorkerEditModal({ worker, onClose, onSubmit, formData, setFormData }) {
  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"  onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSubmit} className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin thợ</h2>
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
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  value={formData.worker_full_name}
                  onChange={(e) => setFormData({...formData, worker_full_name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã thợ</label>
                <input
                  type="text"
                  value={formData.worker_code}
                  onChange={(e) => setFormData({...formData, worker_code: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại công ty</label>
                <input
                  type="tel"
                  value={formData.worker_phone_company}
                  onChange={(e) => setFormData({...formData, worker_phone_company: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại cá nhân</label>
                <input
                  type="tel"
                  value={formData.worker_phone_personal}
                  onChange={(e) => setFormData({...formData, worker_phone_personal: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              />
            </div>

            {/* Work Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Doanh số/ngày</label>
                <input
                  type="number"
                  value={formData.worker_daily_sales}
                  onChange={(e) => setFormData({...formData, worker_daily_sales: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lương theo giờ</label>
                <input
                  type="number"
                  value={formData.worker_daily_o_t_by_hour}
                  onChange={(e) => setFormData({...formData, worker_daily_o_t_by_hour: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select
                value={formData.worker_status}
                onChange={(e) => setFormData({...formData, worker_status: parseInt(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={1}>Đang hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
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
                Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 