"use client";

import { useState, useEffect } from "react";
import { Search, Phone, MapPin, Calendar, FileText, DollarSign, Clock, User, Copy, MoreVertical, Check, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { getClientApiUrl, CONFIG } from '@/config/constants';
import { useApiLoading } from '@/hooks/useApiLoading';

const ITEMS_PER_PAGE = 10;

// Component để hiển thị text có thể thu gọn/mở rộng
const ExpandableText = ({ text, maxLength = 100, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className={`${className} relative`}>
      <span className="pr-8 break-words whitespace-pre-wrap">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-0 right-0 p-1 text-blue-600 transition-all duration-200 border border-blue-200 rounded-md shadow-sm bg-blue-50 hover:text-white hover:border-blue-600 hover:bg-blue-600 hover:shadow-md"
        title={isExpanded ? "Thu gọn" : "Đọc thêm"}
      >
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>
    </div>
  );
};

const CustomerSearch = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          getClientApiUrl("/api/web/old-cus-search"),
          {
            params: {
              search_key: debouncedSearchTerm || "",
              page: currentPage,
              per_page: ITEMS_PER_PAGE,
            },
          }
        );

        const data = response.data.data || response.data;
        setCustomers(data);
        const total = response.data.total || data.length;
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
        
        onSearchResults?.(data.length);
      } catch (err) {
        setError("Không thể tải dữ liệu khách hàng. Vui lòng thử lại.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [debouncedSearchTerm, currentPage, onSearchResults]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopy = (text, id) => {
    try {
      // Tạo một textarea tạm thời
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Đặt textarea ngoài viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Chọn và copy text
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      
      // Xóa textarea tạm thời
      document.body.removeChild(textArea);
      
      // Hiển thị trạng thái copy thành công
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="p-2">
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm khách hàng..."
          className="block w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-200 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-2">
          <div className="w-4 h-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="py-2 text-xs text-center text-red-600">{error}</div>
      ) : customers.length === 0 ? (
        <div className="py-2 text-xs text-center text-gray-500">
          Không tìm thấy khách hàng nào
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="min-w-0 overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr>
                    <th scope="col" className="w-1/5 px-2 py-1.5 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      Thông tin khách hàng
                    </th>
                    <th scope="col" className="w-1/4 px-2 py-1.5 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      Nội dung công việc
                    </th>
                    <th scope="col" className="w-1/5 px-2 py-1.5 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      Thông tin thanh toán
                    </th>
                    <th scope="col" className="w-1/5 px-2 py-1.5 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                      Thông tin khác
                    </th>
                    <th scope="col" className="w-16 px-2 py-1.5 text-xs font-medium tracking-wider text-center text-gray-500 uppercase bg-gray-50">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer, index) => (
                    <tr key={customer.id} className="transition-colors duration-200 hover:bg-gray-50">
                      <td className="px-2 py-1.5">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center min-w-0">
                            <User className="flex-shrink-0 w-3 h-3 mr-1 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1">
                                <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm">
                                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                </span>
                                <ExpandableText 
                                  text={customer.name_cus} 
                                  maxLength={30}
                                  className="text-xs font-medium text-gray-900"
                                />
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                Mã: {customer.sort_name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="flex-shrink-0 w-3 h-3 mr-1 text-gray-400" />
                            <span className="truncate">{customer.phone_cus}</span>
                          </div>
                          <div className="flex items-start text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <ExpandableText 
                                text={customer.add_cus} 
                                maxLength={40}
                                className="truncate"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-start min-w-0">
                            <FileText className="w-3 h-3 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0 text-xs text-gray-900">
                              <ExpandableText text={customer.work_content} maxLength={80} />
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="flex-shrink-0 w-3 h-3 mr-1 text-gray-400" />
                            <span className="truncate">{customer.date_book}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="flex-shrink-0 w-3 h-3 mr-1 text-gray-400" />
                            <span className="truncate">BH: {customer.warranty_period || 'Không'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center text-xs text-gray-900">
                            <DollarSign className="flex-shrink-0 w-3 h-3 mr-1 text-gray-400" />
                            <span className="truncate">Thu: {customer.income_total}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-900">
                            <DollarSign className="flex-shrink-0 w-3 h-3 mr-1 text-gray-400" />
                            <span className="truncate">Chi: {customer.expense_total || '0'}</span>
                          </div>
                          <div className="min-w-0 text-xs text-gray-500">
                            <ExpandableText 
                              text={customer.note_cus} 
                              maxLength={30}
                            />
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Seri: {customer.seri_number || 'KPT'}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="min-w-0 space-y-1">
                          <div className="min-w-0 text-xs text-gray-500">
                            <ExpandableText 
                              text={customer.des_cus} 
                              maxLength={30}
                            />
                          </div>
                          <div className="min-w-0 text-xs text-gray-500">
                            <ExpandableText 
                              text={customer.worker_name} 
                              maxLength={25}
                            />
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleCopy(customer.work_content, customer.id)}
                            className="relative p-1 text-gray-500 transition-colors duration-200 rounded hover:text-blue-600 hover:bg-blue-50"
                            title="Copy nội dung công việc"
                          >
                            {copiedId === customer.id ? (
                              <Check className="w-3.5 h-3.5 text-brand-green" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            className="p-1 text-gray-500 transition-colors duration-200 rounded hover:text-blue-600 hover:bg-blue-50"
                            title="Thêm tùy chọn"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-600">
                  Trang {currentPage} / {totalPages} • Tổng {customers.length} kết quả
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    title="Trang trước"
                  >
                    ←
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Hiển thị tối đa 5 trang, ưu tiên trang hiện tại và các trang xung quanh
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!shouldShow) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-1 text-xs text-gray-400">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2.5 py-1.5 text-xs rounded-md font-medium transition-all duration-200 ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    title="Trang sau"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;