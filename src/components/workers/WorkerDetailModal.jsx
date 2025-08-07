import { Phone, MapPin, User, Clock, DollarSign, Briefcase, X } from "lucide-react";

export default function WorkerDetailModal({ worker, onClose, onEdit }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getWorkerStatus = (status) => {
    switch (status) {
      case 1:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-green/10 text-brand-green">Đang hoạt động</span>;
      case 0:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-yellow/10 text-brand-yellow">Không hoạt động</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Không xác định</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết thợ</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-green to-brand-yellow flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {worker.worker_full_name}
                </h3>
                <p className="text-sm text-gray-500">Mã thợ: {worker.worker_code}</p>
                {getWorkerStatus(worker.worker_status)}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Thông tin liên hệ</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Số điện thoại công ty</p>
                      <p className="text-sm text-gray-500">{worker.worker_phone_company}</p>
                    </div>
                  </div>
                  {worker.worker_phone_personal && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Số điện thoại cá nhân</p>
                        <p className="text-sm text-gray-500">{worker.worker_phone_personal}</p>
                      </div>
                    </div>
                  )}
                  {worker.worker_address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Địa chỉ</p>
                        <p className="text-sm text-gray-500">{worker.worker_address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Thông tin công việc</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Doanh số/ngày</p>
                      <p className="text-sm text-gray-500">{formatCurrency(worker.worker_daily_sales)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Lương theo giờ</p>
                      <p className="text-sm text-gray-500">{formatCurrency(worker.worker_daily_o_t_by_hour)}/giờ</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Số công việc</p>
                      <p className="text-sm text-gray-500">{worker.work_count} công việc</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            {worker.account && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Trạng thái tài khoản</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      worker.account.is_online 
                        ? "bg-brand-green/10 text-brand-green" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {worker.account.is_online ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      worker.account.ready_to_work 
                        ? "bg-brand-green/10 text-brand-green" 
                        : "bg-brand-yellow/10 text-brand-yellow"
                    }`}>
                      {worker.account.ready_to_work ? "Sẵn sàng" : "Bận"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  onClose();
                  onEdit(worker);
                }}
                className="px-4 py-2 text-sm font-medium text-brand-green hover:text-brand-green/80"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 