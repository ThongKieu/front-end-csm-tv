import ConfigManager from '@/components/ConfigManager';

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cấu hình hệ thống</h1>
          <p className="text-gray-600">
            Quản lý cấu hình backend và API endpoints
          </p>
        </div>
        
        <ConfigManager />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn sử dụng:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Chỉ cần thay đổi <strong>Base URL</strong> để cập nhật địa chỉ IP backend</li>
            <li>• Thêm <strong>Port</strong> nếu backend chạy trên port khác</li>
            <li>• Sau khi thay đổi, click <strong>Lưu</strong> để áp dụng</li>
            <li>• Tất cả API calls sẽ tự động sử dụng cấu hình mới</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 