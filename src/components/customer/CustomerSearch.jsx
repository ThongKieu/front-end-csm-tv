"use client";

import { useState, useEffect } from "react";
import { Search, Phone, MapPin, Calendar, FileText, DollarSign, Clock, User, Copy, MoreVertical, Check } from "lucide-react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

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
          "https://csm.thoviet.net/api/web/old-cus-search",
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
    <div className="p-3">
      <div className="relative mb-3">
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
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-xs text-red-600">{error}</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-4 text-xs text-gray-500">
          Không tìm thấy khách hàng nào
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Thông tin khách hàng
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Nội dung công việc
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Thông tin thanh toán
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Thông tin khác
                    </th>
                    <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-20">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center">
                            <User className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name_cus}
                              </div>
                              <div className="text-xs text-gray-500">
                                Mã: {customer.sort_name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                            {customer.phone_cus}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-xs">
                              {customer.add_cus}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="space-y-1.5">
                          <div className="flex items-start">
                            <FileText className="w-3.5 h-3.5 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-900">
                              {customer.work_content.length > 150 
                                ? `${customer.work_content.substring(0, 150)}...` 
                                : customer.work_content}
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                            Ngày đặt: {customer.date_book}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                            Bảo hành: {customer.warranty_period || 'Không BH'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="space-y-1.5">
                          <div className="flex items-center text-sm text-gray-900">
                            <DollarSign className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                            Thu nhập: {customer.income_total}
                          </div>
                          <div className="flex items-center text-sm text-gray-900">
                            <DollarSign className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                            Tiền chi: {customer.expense_total || '0'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Ghi chú: {customer.note_cus}
                          </div>
                          <div className="text-xs text-gray-500">
                            Số seri: {customer.seri_number || 'KPT'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="space-y-1.5">
                          <div className="text-xs text-gray-500">
                            Mô tả: {customer.des_cus}
                          </div>
                          <div className="text-xs text-gray-500">
                            Thợ: {customer.worker_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Ngày tạo: {new Date(customer.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleCopy(customer.work_content, customer.id)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 relative"
                            title="Copy nội dung công việc"
                          >
                            {copiedId === customer.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                            title="Thêm tùy chọn"
                          >
                            <MoreVertical className="w-4 h-4" />
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
              <div className="flex justify-center space-x-1 mt-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 text-xs rounded-md font-medium ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;
