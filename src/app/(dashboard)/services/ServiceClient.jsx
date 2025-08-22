"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Percent, Search, Star, Users, Clock, Filter, Grid, List } from "lucide-react";
import Image from "next/image";
import { getClientApiUrl, getBackendUrl, CONFIG } from "@/config/constants";

export default function ServiceClient() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, servicesRes] = await Promise.all([
          fetch(getClientApiUrl('/api/web/hot-ser/cat')),
          fetch(getClientApiUrl('/api/web/hot-ser'))
        ]);
        
        const categoriesData = await categoriesRes.json();
        const servicesData = await servicesRes.json();
        
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0]);
          }
        } else {
          console.error('Categories data is not an array:', categoriesData);
          setCategories([]);
        }

        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else {
          console.error('Services data is not an array:', servicesData);
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const getCurrentCategoryServices = () => {
    if (!selectedCategory || !services.length) return [];
    
    const categoryServices = services.find(cat => cat.id === selectedCategory.id);
    
    if (!categoryServices || !categoryServices.hotser) return [];
    
    return categoryServices.hotser.filter(service => 
      service.title_hot.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredServices = getCurrentCategoryServices();
  
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col gap-3 items-center">
          <div className="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
          <p className="text-sm text-gray-500">Đang tải dịch vụ...</p>
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="py-16 text-center">
        <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">Không có dữ liệu dịch vụ</h3>
        <p className="text-gray-500">Vui lòng thử lại sau</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex flex-row gap-1 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dịch vụ</h1>/
            <p className="mt-1 text-sm text-gray-600">
              {selectedCategory ? selectedCategory.title_cate_hot : 'Chọn danh mục để xem dịch vụ'}
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-9 w-64 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex overflow-hidden flex-1">
        {/* Sidebar - Categories */}
        <div className="overflow-y-auto flex-shrink-0 w-64 bg-gray-50 border-r border-gray-200">
          <div className="p-4">
            <div className="flex gap-2 items-center mb-4 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              Danh mục
            </div>
            
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory?.id === category.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {category.title_cate_hot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex overflow-hidden flex-col flex-1 bg-white">
          {filteredServices.length === 0 ? (
            <div className="flex flex-1 justify-center items-center">
              <div className="text-center">
                <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Không tìm thấy dịch vụ</h3>
                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable Services Area */}
              <div className="overflow-y-auto flex-1">
                <div className="p-6">
                  {/* Services Grid/List */}
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                      : 'space-y-3'
                  }`}>
                    {currentServices.map((service) => (
                      <div
                        key={service.id}
                        className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 group overflow-hidden ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                      >
                        {/* Image */}
                        <div className={`relative bg-gray-100 overflow-hidden ${
                          viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'h-40'
                        }`}>
                          <Image
                            src={`${getBackendUrl()}/${service.image_hot}`}
                            alt={service.title_hot}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          {selectedCategory?.id === 1 && (
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                              <Percent className="w-2.5 h-2.5 inline mr-0.5" />
                              KM
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <h3 className={`font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors ${
                            viewMode === 'list' ? 'text-sm' : 'text-base'
                          }`}>
                            {service.title_hot}
                          </h3>
                          
                          {/* Service Stats */}
                          <div className="flex gap-3 items-center mb-3 text-xs text-gray-500">
                            <div className="flex gap-1 items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>4.8</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Users className="w-3 h-3" />
                              <span>1.2k</span>
                            </div>
                            <div className="flex gap-1 items-center">
                              <Clock className="w-3 h-3" />
                              <span>24h</span>
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex justify-between items-center">
                            <a
                              href={service.url_hot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex gap-1 items-center text-sm font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 group-hover:gap-2"
                            >
                              <span>Xem chi tiết</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                            {selectedCategory?.id === 1 && (
                              <div className="flex gap-1 items-center text-red-500">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs font-medium">Giảm giá</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fixed Pagination */}
              {totalPages > 1 && (
                <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredServices.length)} trong tổng số {filteredServices.length} dịch vụ
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm rounded-lg border border-gray-200 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      
                      <div className="flex gap-1 items-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm rounded-lg border border-gray-200 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 