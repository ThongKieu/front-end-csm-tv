"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Building2,
  Trees,
  Filter,
  X,
  ChevronRight,
  Settings,
  Grid3X3,
  List,
  History,
} from "lucide-react";
import './WardSearch.css';

// Component hiển thị badge đơn vị hành chính
const AdministrativeBadge = ({ type, children, className = '' }) => {
  const colors = {
    district: 'bg-blue-100 text-blue-800 border-blue-200',
    province: 'bg-purple-100 text-purple-800 border-purple-200',
    city: 'bg-green-100 text-green-800 border-green-200',
    county: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  return (
    <span className={`inline-block px-1 py-0.5 text-xs font-medium rounded border ${colors[type]} ${className}`}>
      {children}
    </span>
  );
};

// Component hiển thị thông tin khu vực cũ
const OldAreaInfo = ({ oldAreas, isFromOtherProvince }) => {
  if (!oldAreas || oldAreas.length === 0) return null;

  const categories = {
    district: oldAreas.filter(area => area.type === 'district'),
    province: oldAreas.filter(area => area.type === 'province'),
    city: oldAreas.filter(area => area.type === 'city'),
    county: oldAreas.filter(area => area.type === 'county')
  };

  return (
    <div className="space-y-0.5">
      {Object.entries(categories).map(([type, areas]) => 
        areas.length > 0 && (
          <div key={type} className="flex flex-wrap gap-0.5">
            {areas.map((area, index) => (
              <AdministrativeBadge 
                key={index} 
                type={type}
                className={isFromOtherProvince ? 'text-orange-900 bg-orange-200 border-orange-300' : ''}
              >
                {area.name}
              </AdministrativeBadge>
            ))}
          </div>
        )
      )}
    </div>
  );
};

// Component hiển thị thông tin sáp nhập
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

  const extractParenthesesInfo = useMemo(() => {
    if (!ward.formed_from) return [];
    
    const parenthesesPattern = /\(([^)]+)\)/g;
    const matches = [];
    let match;
    
    while ((match = parenthesesPattern.exec(ward.formed_from)) !== null) {
      const content = match[1].trim();
      if (content && !matches.includes(content)) {
        matches.push(content);
      }
    }
    
    return matches;
  }, [ward.formed_from]);

  if (!ward.formed_from && extractParenthesesInfo.length === 0) return null;

  return (
    <div className={`text-xs space-y-0.5 ${isFromOtherProvince ? 'bg-orange-50 p-1 rounded border-l-2 border-orange-400' : ''}`}>
      {isFromOtherProvince && (
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-xs font-medium text-orange-600">🔗 Sáp nhập từ tỉnh/thành khác</span>
        </div>
      )}
      
      {oldAreas.length > 0 && (
        <div>
          <div className="text-gray-600 font-medium mb-0.5 text-xs">Đơn vị hành chính cũ:</div>
          <OldAreaInfo oldAreas={oldAreas} isFromOtherProvince={isFromOtherProvince} />
        </div>
      )}
      
      {extractParenthesesInfo.length > 0 && (
        <div className="mt-1">
          <div className="text-gray-600 font-medium mb-0.5 text-xs">Khu vực cũ:</div>
          <div className="flex flex-wrap gap-0.5">
            {extractParenthesesInfo.map((info, index) => (
              <span key={index} className="inline-block px-1 py-0.5 text-xs bg-gray-100 text-gray-700 rounded border">
                {info}
              </span>
            ))}
          </div>
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
      const data = require('../data/tphcm-wards-complete.json');
      return data.wards || [];
    } catch (error) {
      console.error('Error loading ward data:', error);
      return [];
    }
  }, []);

  const districts = useMemo(() => {
    const adminSet = new Set();
    wards.forEach(ward => {
      if (ward.formed_from) {
        // Extract all administrative unit names from formed_from field
        const patterns = [
          /(?:Tỉnh|Thành phố)\s+([^,\n()]+)/g,
          /(?:Quận|Huyện)\s+([^,\n()]+)/g,
          /(?:Thị xã)\s+([^,\n()]+)/g,
          /(?:Xã|Phường|Thị trấn)\s+([^,\n()]+)/g
        ];
        
        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(ward.formed_from)) !== null) {
            const unitName = match[1].trim();
            if (unitName && unitName.length > 0) {
              adminSet.add(unitName);
            }
          }
        });
        
        // Also extract content from parentheses
        const parenthesesPattern = /\(([^)]+)\)/g;
        let parenthesesMatch;
        while ((parenthesesMatch = parenthesesPattern.exec(ward.formed_from)) !== null) {
          const content = parenthesesMatch[1].trim();
          if (content && content.length > 0) {
            adminSet.add(content);
          }
        }
      }
    });
    return Array.from(adminSet).sort();
  }, [wards]);

  const filteredWards = useMemo(() => {
    return wards.filter(ward => {
      const matchesSearch = ward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (ward.formed_from && ward.formed_from.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [wards, searchTerm]);

  const openModal = (ward) => {
    setSelectedWard(ward);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWard(null);
  };

  return (
    <div className="flex overflow-hidden h-[calc(100vh-70px)] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar */}
      <div className="flex flex-col flex-shrink-0 w-80 border-r shadow-lg backdrop-blur-sm bg-white/80 border-gray-200/50">
        {/* Sidebar Header */}
        <div className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-gray-200/50">
          <div className="flex items-center space-x-2">
            <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-white/20">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">TP.HCM Wards</h2>
              <p className="text-xs text-blue-100">Cấu trúc hành chính mới</p>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Search */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">🔍 Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 w-3 h-3 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nhập tên phường/xã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-3 pl-8 w-full text-xs rounded-lg border border-gray-300 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white/50"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">📊 Chế độ xem</label>
            <div className="flex overflow-hidden rounded-lg border border-gray-300 backdrop-blur-sm bg-white/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="inline mr-1 w-3 h-3" />
                Lưới
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="inline mr-1 w-3 h-3" />
                Danh sách
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="pt-4 border-t border-gray-200/50">
            <h3 className="flex items-center mb-2 text-xs font-semibold text-gray-700">
              <Building2 className="mr-1 w-3 h-3" />
              Thống kê
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                <span className="text-xs text-gray-600">Tổng cộng</span>
                <span className="text-sm font-bold text-blue-600">{wards.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                <span className="text-xs text-gray-600">Tìm thấy</span>
                <span className="text-sm font-bold text-green-600">{filteredWards.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 border-b shadow-sm backdrop-blur-sm bg-white/80 border-gray-200/50">
          <div className="max-w-4xl">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Tìm kiếm Phường/Xã TP.HCM
            </h1>
            <p className="mt-1 text-xs text-gray-600">Tìm kiếm và xem thông tin chi tiết về các phường/xã sau khi sáp nhập hành chính</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-auto flex-1">
          <div className="p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredWards.map((ward) => (
                <div
                  key={ward.code}
                  onClick={() => openModal(ward)}
                  className="p-3 rounded-lg border shadow-sm backdrop-blur-sm transition-all duration-300 cursor-pointer group bg-white/80 border-gray-200/50 hover:shadow-lg hover:border-blue-300 hover:bg-white hover:scale-102"
                >
                  <div className="mb-2">
                    <h3 className="text-sm font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-600">{ward.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">Mã: {ward.code}</p>
                  </div>
                  
                  <MergeInfo ward={ward} />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border shadow-lg backdrop-blur-sm bg-white/80 border-gray-200/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Phường/Xã</th>
                      <th className="px-4 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Mã</th>
                      <th className="px-4 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Thông tin sáp nhập</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredWards.map((ward) => (
                      <tr
                        key={ward.code}
                        onClick={() => openModal(ward)}
                        className="transition-all duration-200 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                      >
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-gray-900">{ward.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600">Mã: {ward.code}</div>
                        </td>
                        <td className="px-4 py-3">
                          <MergeInfo ward={ward} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedWard && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/60">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200/50">
            {/* Modal Header */}
            <div className="p-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-white/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{selectedWard.name}</h2>
                    <p className="text-sm text-blue-100">Mã: {selectedWard.code}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="flex justify-center items-center w-7 h-7 rounded-lg transition-colors bg-white/20 hover:bg-white/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200/50">
                  <h3 className="flex items-center mb-2 text-base font-semibold text-gray-900">
                    <Building2 className="mr-2 w-4 h-4 text-blue-600" />
                    Thông tin chi tiết
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-700">Mã:</span>
                      <span className="px-2 py-1 text-gray-900 bg-white rounded border">{selectedWard.code}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-700">Loại:</span>
                      <span className="px-2 py-1 text-gray-900 bg-white rounded border">
                        {selectedWard.name.includes('Phường') ? 'Phường' : selectedWard.name.includes('Xã') ? 'Xã' : 'Đặc khu'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Merge Info */}
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                  <h3 className="flex items-center mb-2 text-base font-semibold text-gray-900">
                    <History className="mr-2 w-4 h-4 text-green-600" />
                    Thông tin sáp nhập
                  </h3>
                  <MergeInfo ward={selectedWard} />
                </div>

                {/* Detailed Description */}
                {selectedWard.formed_from && (
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50">
                    <h3 className="flex items-center mb-2 text-base font-semibold text-gray-900">
                      <Trees className="mr-2 w-4 h-4 text-purple-600" />
                      Mô tả chi tiết
                    </h3>
                    <div className="p-3 rounded-lg border backdrop-blur-sm bg-white/80 border-purple-200/50">
                      <p className="text-xs leading-relaxed text-gray-700">{selectedWard.formed_from}</p>
                    </div>
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