"use client";

import { useState, useEffect } from "react";
import { Search, Phone, MapPin, Mail } from "lucide-react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const CustomerSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search term changes
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

        // Assuming the API returns { data: [], total: number }
        setCustomers(response.data.data || response.data);
        setTotalPages(
          Math.ceil(
            (response.data.total || response.data.length) / ITEMS_PER_PAGE
          )
        );
      } catch (err) {
        setError("Không thể tải dữ liệu khách hàng. Vui lòng thử lại.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [debouncedSearchTerm, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full mx-auto p-4 text-black">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên, số điện thoại hoặc địa chỉ khách hàng..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : customers.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          {searchTerm
            ? "Không tìm thấy khách hàng nào"
            : "Không có dữ liệu khách hàng"}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto m-2">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Nội dung CV
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Đặt ngày
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    BH
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Tên KH
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Địa chỉ
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Người làm 
                  </th>
                 <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Ghi chú
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Tổng chi
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Tổng thu
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Seri
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.work_content}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.date_book}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.warranty_period}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.name_cus}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.add_cus + " - " + customer.des_cus }
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.phone_cus || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.sort_name + " - " + customer.worker_name || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.note_cus || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.income_total || 0}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.spending_total || 0}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.seri_number_check || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerSearch;
