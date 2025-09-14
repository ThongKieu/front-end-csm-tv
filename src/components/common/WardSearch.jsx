"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Building2, Grid3X3, List, X } from "lucide-react";
import wardsData from '../../data/tphcm-wards-complete.json';
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

  // Filter wards based on search term
  const filteredWards = useMemo(() => {
    if (!searchTerm) return wardsData.wards;
    
    const searchLower = searchTerm.toLowerCase();
    
    return wardsData.wards.filter(ward => {
      const wardName = ward.name?.toLowerCase() || '';
      const formedFrom = ward.formed_from?.toLowerCase() || '';
      
      return wardName.includes(searchLower) || 
             formedFrom.includes(searchLower);
    });
  }, [searchTerm]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-70px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-full bg-white border-r lg:w-80 lg:border-r-0 lg:border-b">
        {/* Search Section */}
        <div className="p-4 text-white bg-blue-600">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <h1 className="text-lg font-bold">Tìm kiếm Phường/Xã</h1>
          </div>
          <p className="mt-1 text-sm text-blue-100">
            Tìm kiếm các đơn vị hành chính TP.HCM
          </p>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm phường, xã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex mt-4 space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Lưới</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Danh sách</span>
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>Tìm thấy <span className="font-semibold">{filteredWards.length}</span> kết quả</p>
          </div>
        </div>

        {/* Ward Details Section */}
        {selectedWard && (
          <div className="bg-gray-50 border-t">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết</h3>
                <button
                  onClick={() => setSelectedWard(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Thông tin cơ bản */}
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                  <h4 className="flex items-center mb-3 text-sm font-semibold text-gray-700">
                    <MapPin className="mr-2 w-4 h-4" />
                    Thông tin cơ bản
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Tên:</span>
                      <p className="font-semibold text-gray-900">{selectedWard.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Mã:</span>
                      <p className="font-semibold text-gray-900">{selectedWard.code}</p>
                    </div>
                  </div>
                </div>

                {/* Thông tin sáp nhập */}
                {selectedWard.formed_from && (
                  <div className="p-4 bg-white rounded-lg border shadow-sm">
                    <h4 className="flex items-center mb-3 text-sm font-semibold text-gray-700">
                      <Building2 className="mr-2 w-4 h-4" />
                      Thông tin sáp nhập
                    </h4>
                    <div className="text-sm">
                      <p className="mb-3 leading-relaxed text-gray-700">{selectedWard.formed_from}</p>
                      <div className="pt-3 border-t">
                        <MergeInfo ward={selectedWard} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Thông tin bổ sung */}
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                  <h4 className="flex items-center mb-3 text-sm font-semibold text-gray-700">
                    <MapPin className="mr-2 w-4 h-4" />
                    Thông tin bổ sung
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Thuộc TP. Hồ Chí Minh</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Đơn vị hành chính cấp phường</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <div className="p-4 bg-white border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchTerm ? `Kết quả cho "${searchTerm}"` : 'Tất cả Phường/Xã'}
            </h2>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          {filteredWards.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <Building2 className="mb-4 w-12 h-12" />
              <p className="text-lg font-medium">Không tìm thấy kết quả</p>
              <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className={`p-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}`}>
              {filteredWards.map((ward, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedWard(ward)}
                  className={`p-3 bg-white rounded border transition-shadow cursor-pointer hover:shadow-md ${
                    selectedWard?.name === ward.name ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  } ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <h3 className="text-sm font-bold text-gray-900 truncate">{ward.name}</h3>
                      <p className="mb-2 text-xs text-gray-500 truncate">Mã: {ward.code}</p>
                      <MergeInfo ward={ward} />
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{ward.name}</h3>
                        <p className="text-xs text-gray-500">Mã: {ward.code}</p>
                        <MergeInfo ward={ward} />
                      </div>
                      <div className="text-right">
                        <Badge type="county">Phường/Xã</Badge>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardSearch;