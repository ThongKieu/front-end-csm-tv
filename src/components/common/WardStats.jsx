"use client";

import React from 'react';
import { BarChart3, Filter, Download, Building2, Trees, MapPin, Building } from 'lucide-react';

const WardStats = ({ wards, onFilterChange, filters }) => {
  const totalWards = wards.length;
  const phuongCount = wards.filter(ward => ward.name.startsWith('Phường')).length;
  const xaCount = wards.filter(ward => ward.name.startsWith('Xã')).length;

  const handleExportData = () => {
    const csvContent = [
      ['Tên', 'Mã', 'Loại', 'Được thành lập từ'],
      ...wards.map(ward => [
        ward.name,
        ward.code,
        ward.name.startsWith('Phường') ? 'Phường' : 'Xã',
        ward.formed_from
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tphcm-wards.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 mb-6 rounded-2xl border shadow-sm backdrop-blur-sm bg-white/80 border-gray-200/50">
      <div className="flex flex-col gap-4 justify-between items-start mb-6 sm:flex-row sm:items-center">
        <div className="flex items-center">
          <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-r from-brand-green to-brand-yellow rounded-xl">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Bộ lọc & Thống kê</h2>
        </div>
        <button
          onClick={handleExportData}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-green to-brand-yellow rounded-xl shadow-lg transition-all duration-200 hover:from-green-700 hover:to-yellow-600 hover:shadow-xl"
        >
          <Download className="mr-2 w-4 h-4" />
          Xuất CSV
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <div className="flex justify-center items-center mr-3 w-10 h-10 bg-blue-600 rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{totalWards}</p>
              <p className="text-sm font-medium text-blue-700">Tổng cộng</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <div className="flex justify-center items-center mr-3 w-10 h-10 bg-blue-600 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{phuongCount}</p>
              <p className="text-sm font-medium text-blue-700">
                Phường ({((phuongCount / totalWards) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-brand-green/10 to-brand-yellow/10 rounded-xl border border-brand-green/20">
          <div className="flex items-center">
            <div className="flex justify-center items-center mr-3 w-10 h-10 bg-brand-green rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-green">{xaCount}</p>
              <p className="text-sm font-medium text-brand-green">
                Phường/Xã
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="flex justify-center items-center mr-3 w-8 h-8 bg-gray-100 rounded-lg">
            <Filter className="w-4 h-4 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Loại đơn vị
            </label>
            <select
              className="block px-4 py-3 w-full rounded-xl border border-gray-300 backdrop-blur-sm transition-all duration-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.type || ''}
              onChange={(e) => onFilterChange('type', e.target.value)}
            >
              <option value="">Tất cả phường/xã</option>
              <option value="phuong">Chỉ Phường</option>
              <option value="xa">Chỉ Xã</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Sắp xếp theo
            </label>
            <select
              className="block px-4 py-3 w-full rounded-xl border border-gray-300 backdrop-blur-sm transition-all duration-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.sort || ''}
              onChange={(e) => onFilterChange('sort', e.target.value)}
            >
              <option value="">Mặc định</option>
              <option value="name-asc">Tên A → Z</option>
              <option value="name-desc">Tên Z → A</option>
              <option value="code-asc">Mã tăng dần</option>
              <option value="code-desc">Mã giảm dần</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Tìm theo từ khóa
            </label>
            <input
              type="text"
              className="block px-4 py-3 w-full rounded-xl border border-gray-300 backdrop-blur-sm transition-all duration-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập từ khóa tìm kiếm..."
              value={filters.keyword || ''}
              onChange={(e) => onFilterChange('keyword', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardStats; 