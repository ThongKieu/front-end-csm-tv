"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Building2, Grid3X3, List, X } from "lucide-react";
import './WardSearch.css';

// Badge component for administrative units
const Badge = ({ type, children, className = '' }) => {
  const colors = {
    district: 'bg-blue-100 text-blue-800',
    province: 'bg-purple-100 text-purple-800',
    city: 'bg-green-100 text-green-800',
    county: 'bg-orange-100 text-orange-800',
    special: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-block px-1 py-0.5 text-xs rounded ${colors[type]} ${className}`}>
      {children}
    </span>
  );
};

// Merge information component
const MergeInfo = ({ ward }) => {
  const isFromOtherProvince = ward.formed_from && 
    (ward.formed_from.includes('Tỉnh') || ward.formed_from.includes('Thành phố'));

  const oldAreas = useMemo(() => {
    if (!ward.formed_from) return [];
    
    const areas = [];
    const patterns = [
      { regex: /(?:Tỉnh|Thành phố)\s+([^,\n]+)/g, type: 'province' },
      { regex: /(?:Quận|Huyện)\s+([^,\n]+)/g, type: 'district' },
      { regex: /(?:Thị xã)\s+([^,\n]+)/g, type: 'city' },
      { regex: /(?:Xã|Phường|Thị trấn)\s+([^,\n]+)/g, type: 'county' }
    ];

    patterns.forEach(({ regex, type }) => {
      let match;
      while ((match = regex.exec(ward.formed_from)) !== null) {
        areas.push({ name: match[1].trim(), type });
      }
    });

    return areas;
  }, [ward.formed_from]);

  if (!ward.formed_from) return null;    
  return (
    <div className={`text-xs ${isFromOtherProvince ? 'p-1 bg-orange-50 rounded' : ''}`}>
      {oldAreas.length > 0 && (
        <div className="flex flex-wrap gap-0.5">
          {oldAreas.map((area, index) => (
            <Badge key={index} type={area.type}>
              {area.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

const WardSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedWard, setSelectedWard] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const wards = useMemo(() => {
    try {
      const data = require('../../data/tphcm-wards-complete.json');
      return data.wards || [];
    } catch (error) {
      console.error('Error loading ward data:', error);
      return [];
    }
  }, []);

  const filteredWards = useMemo(() => {
    return wards.filter(ward => {
      const matchesSearch = ward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (ward.formed_from && ward.formed_from.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [wards, searchTerm]);

  const getWardTypeColor = (type) => {
    switch (type) {
      case 'district':
        return 'bg-brand-green/20 text-brand-green';
      case 'ward':
        return 'bg-brand-yellow/20 text-brand-yellow';
      case 'city':
        return 'bg-brand-green/10 text-brand-green';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-70px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white border-r lg:border-r-0 lg:border-b">
        <div className="p-4 text-white bg-blue-600">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <div>
              <h2 className="font-bold">TP.HCM Wards</h2>
              <p className="text-xs text-blue-100">Cấu trúc hành chính mới</p>
            </div>
          </div>
        </div>

        <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
          {/* Search */}
          <div>
            <label className="block mb-1 text-xs font-semibold">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 w-3 h-3 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nhập tên phường/xã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-3 pl-8 w-full text-sm lg:text-xs rounded border focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* View Mode */}
          <div>
            <label className="block mb-1 text-xs font-semibold">Chế độ xem</label>
            <div className="flex rounded border">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-2 lg:px-3 py-2 text-xs font-medium ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-transparent'
                }`}
              >
                <Grid3X3 className="inline mr-1 w-3 h-3" />
                <span className="hidden sm:inline">Lưới</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-2 lg:px-3 py-2 text-xs font-medium ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-transparent'
                }`}
              >
                <List className="inline mr-1 w-3 h-3" />
                <span className="hidden sm:inline">Danh sách</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="pt-3 lg:pt-4 border-t">
            <h3 className="flex items-center mb-2 text-xs font-semibold">
              <Building2 className="mr-1 w-3 h-3" />
              Thống kê
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between p-2 rounded bg-brand-green/10">
                <span className="text-xs lg:text-sm font-medium text-brand-green">Tổng số phường/xã:</span>
                <span className="text-xs lg:text-sm font-bold text-brand-green">{filteredWards.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-3 lg:p-4 bg-white border-b">
          <h1 className="text-lg lg:text-xl font-bold text-blue-600">Tìm kiếm Phường/Xã TP.HCM</h1>
          <p className="text-xs text-gray-600">Thông tin các phường/xã sau khi sáp nhập hành chính</p>
        </div>

        <div className="overflow-y-auto flex-1 p-3 lg:p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredWards.map((ward) => (
                <div
                  key={ward.code}
                  onClick={() => setSelectedWard(ward) || setShowModal(true)}
                  className="p-2 sm:p-3 bg-white rounded border transition-shadow cursor-pointer hover:shadow-md"
                >
                  <h3 className="text-sm font-bold text-gray-900 truncate">{ward.name}</h3>
                  <p className="mb-2 text-xs text-gray-500">Mã: {ward.code}</p>
                  <MergeInfo ward={ward} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded border overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-xs font-bold text-left">Phường/Xã</th>
                    <th className="px-2 sm:px-4 py-3 text-xs font-bold text-left">Mã</th>
                    <th className="px-2 sm:px-4 py-3 text-xs font-bold text-left">Thông tin sáp nhập</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredWards.map((ward) => (
                    <tr
                      key={ward.code}
                      onClick={() => setSelectedWard(ward) || setShowModal(true)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-2 sm:px-4 py-3">
                        <div className="text-sm font-semibold truncate">{ward.name}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <div className="text-sm text-gray-600">{ward.code}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <MergeInfo ward={ward} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedWard && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-2 sm:p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 sm:p-4 text-white bg-blue-600">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-bold truncate">{selectedWard.name}</h2>
                    <p className="text-xs sm:text-sm text-blue-100">Mã: {selectedWard.code}</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-white/20 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-100px)]">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-2 sm:p-3 bg-gray-50 rounded border">
                  <h3 className="flex items-center mb-2 text-sm sm:text-base font-semibold">
                    <Building2 className="mr-2 w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    Thông tin chi tiết
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
                    <div>Mã: {selectedWard.code}</div>
                    <div>Loại: {selectedWard.name.includes('Phường') ? 'Phường' : 'Xã'}</div>
                  </div>
                </div>

                <div className="p-2 sm:p-3 rounded border bg-brand-green/10">
                  <h3 className="mb-2 text-sm sm:text-base font-semibold">Thông tin sáp nhập</h3>
                  <MergeInfo ward={selectedWard} />
                </div>

                {selectedWard.formed_from && (
                  <div className="p-2 sm:p-3 bg-purple-50 rounded border">
                    <h3 className="mb-2 text-sm sm:text-base font-semibold">Mô tả chi tiết</h3>
                    <p className="text-xs text-gray-700">{selectedWard.formed_from}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardSearch; 