"use client";

import { useState, useEffect } from 'react';
import { CONFIG, getBackendUrl } from '@/config/constants';

export default function ConfigManager() {
  const [currentConfig, setCurrentConfig] = useState(CONFIG);
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(CONFIG);

  useEffect(() => {
    setCurrentConfig(CONFIG);
    setTempConfig(CONFIG);
  }, []);

  const handleSave = () => {
    // Trong thực tế, bạn có thể lưu config vào localStorage hoặc gửi lên server
    setCurrentConfig(tempConfig);
    setIsEditing(false);
    
    // Reload page để áp dụng config mới
    window.location.reload();
  };

  const handleCancel = () => {
    setTempConfig(currentConfig);
    setIsEditing(false);
  };

  return (
    <div className="p-6 mx-auto max-w-2xl bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Cấu hình hệ thống</h2>
        <div className="space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white rounded bg-brand-green hover:bg-green-600"
              >
                Lưu
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Backend Configuration */}
        <div className="p-4 rounded border">
          <h3 className="mb-3 font-semibold">Cấu hình Backend</h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">Base URL</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempConfig.BACKEND.BASE_URL}
                  onChange={(e) => setTempConfig(prev => ({
                    ...prev,
                    BACKEND: { ...prev.BACKEND, BASE_URL: e.target.value }
                  }))}
                  className="px-3 py-2 w-full rounded border"
                  // placeholder="http://192.168.1.27"
                />
              ) : (
                <div className="px-3 py-2 font-mono text-sm bg-gray-100 rounded">
                  {currentConfig.BACKEND.BASE_URL}
                </div>
              )}
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Port (tùy chọn)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempConfig.BACKEND.PORT}
                  onChange={(e) => setTempConfig(prev => ({
                    ...prev,
                    BACKEND: { ...prev.BACKEND, PORT: e.target.value }
                  }))}
                  className="px-3 py-2 w-full rounded border"
                  placeholder="3000"
                />
              ) : (
                <div className="px-3 py-2 font-mono text-sm bg-gray-100 rounded">
                  {currentConfig.BACKEND.PORT || 'Không có'}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <label className="block mb-1 text-sm font-medium">URL hoàn chỉnh</label>
            <div className="px-3 py-2 font-mono text-sm bg-blue-50 rounded border">
              {getBackendUrl()}
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="p-4 rounded border">
          <h3 className="mb-3 font-semibold">API Endpoints</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>User Create:</span>
              <span className="font-mono">{currentConfig.API.USER.CREATE}</span>
            </div>
            <div className="flex justify-between">
              <span>User Login:</span>
              <span className="font-mono">{currentConfig.API.USER.LOGIN}</span>
            </div>
            <div className="flex justify-between">
              <span>User Change Password:</span>
              <span className="font-mono">{currentConfig.API.USER.CHANGE_PASSWORD}</span>
            </div>
            <div className="flex justify-between">
              <span>Job Get by Date:</span>
              <span className="font-mono">{currentConfig.API.JOB.GET_BY_DATE}</span>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="p-4 rounded border">
          <h3 className="mb-3 font-semibold">Thông tin ứng dụng</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tên ứng dụng:</span>
              <span>{currentConfig.APP.NAME}</span>
            </div>
            <div className="flex justify-between">
              <span>Phiên bản:</span>
              <span>{currentConfig.APP.VERSION}</span>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="p-3 mt-4 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Sau khi thay đổi config, trang sẽ được reload để áp dụng cấu hình mới.
          </p>
        </div>
      )}
    </div>
  );
} 