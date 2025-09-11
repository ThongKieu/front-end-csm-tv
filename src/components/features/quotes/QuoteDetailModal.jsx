"use client";

import { X, Download, Send, Edit, Printer } from "lucide-react";

export default function QuoteDetailModal({ isOpen, onClose, quote }) {
  if (!isOpen || !quote) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Function to format service name with line breaks for better readability
  const formatServiceName = (name) => {
    if (!name) return "";
    
    // Split by common delimiters and format
    const lines = name.split(/[,\n]/).map(line => line.trim()).filter(line => line);
    
    if (lines.length === 1) {
      return name;
    }
    
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  // Calculate VAT for an item based on manual selection
  const calculateItemVat = (item) => {
    if (!quote.vatEnabled) {
      return { rate: 0, amount: 0 };
    }

    // If item has manual VAT selection, use that
    if (item.vatRate && item.vatRate > 0) {
      return {
        rate: item.vatRate,
        amount: Math.round(item.price * item.vatRate / 100)
      };
    }

    // Default to 10% if no manual selection
    return {
      rate: 10,
      amount: Math.round(item.price * 10 / 100)
    };
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0);
    const vatDetails = {};
    let totalVat = 0;

    // Calculate VAT for each item and group by rate
    quote.items.forEach(item => {
      const vatInfo = calculateItemVat(item);
      if (vatInfo.rate > 0) {
        const itemVatAmount = vatInfo.amount * item.quantity; // VAT for the quantity
        if (!vatDetails[vatInfo.rate]) {
          vatDetails[vatInfo.rate] = 0;
        }
        vatDetails[vatInfo.rate] += itemVatAmount;
        totalVat += itemVatAmount;
      }
    });

    const total = subtotal + totalVat;

    return {
      subtotal,
      vatDetails,
      totalVat,
      total
    };
  };

  const totals = calculateTotals();

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return "bg-brand-green/20 text-brand-green border-brand-green/30";
      case 'pending':
        return "bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30";
      case 'rejected':
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Chi tiết báo giá</h2>
            <p className="mt-1 text-sm text-gray-500">{quote.quoteNumber}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button className="p-2 text-gray-400 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-50">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 rounded-lg transition-colors hover:text-purple-600 hover:bg-purple-50">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 rounded-lg transition-colors hover:text-orange-600 hover:bg-orange-50">
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Quote Header */}
            <div className="p-4 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 rounded-lg">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Thông tin báo giá</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Số báo giá:</span> {quote.quoteNumber}</p>
                    <p><span className="font-medium">Ngày tạo:</span> {quote.createdAt}</p>
                    <p><span className="font-medium">Hiệu lực đến:</span> {quote.validUntil}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(quote.status)}`}>
                    {getStatusText(quote.status)}
                  </span>
                  <div className="mt-2 text-right">
                    <p className="text-sm text-gray-600">Tổng cộng</p>
                    <p className="text-2xl font-bold text-brand-green">
                      {formatCurrency(quote.vatEnabled ? totals.total : totals.subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Thông tin khách hàng</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Tên khách hàng</p>
                  <p className="font-medium text-gray-900">{quote.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium text-gray-900">{quote.customerPhone}</p>
                </div>
                {quote.customerEmail && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{quote.customerEmail}</p>
                  </div>
                )}
                {quote.customerAddress && (
                  <div>
                    <p className="text-sm text-gray-600">Địa chỉ</p>
                    <p className="font-medium text-gray-900">{quote.customerAddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Company Representative Information */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Thông tin người làm báo giá</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-md font-medium text-gray-900">Đại diện công ty</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Tên đại diện</p>
                      <p className="font-medium text-gray-900">{quote.representativeName || "Chưa nhập"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Chức vụ</p>
                      <p className="font-medium text-gray-900">{quote.representativePosition || "Chưa nhập"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{quote.representativeEmail || "lienhe@thoviet.com.vn"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Số điện thoại</p>
                      <p className="font-medium text-gray-900">{quote.representativePhone || "0912 847 218"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-md font-medium text-gray-900">Thông tin công ty</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Tên công ty</p>
                      <p className="font-medium text-gray-900">CÔNG TY TNHH DỊCH VỤ KỸ THUẬT THỢ VIỆT</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Địa chỉ</p>
                      <p className="font-medium text-gray-900">25/6 Phùng Văn Cung, Phường 2, Quận Phú Nhuận, TP.HCM</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Website</p>
                      <p className="font-medium text-gray-900">www.thoviet.com.vn</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hotline</p>
                      <p className="font-medium text-gray-900">1800 8122 - 0903532938</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Danh sách dịch vụ</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-2 py-2 font-medium text-left text-gray-700 w-12">STT</th>
                      <th className="px-2 py-2 font-medium text-left text-gray-700">Tên dịch vụ</th>
                      <th className="px-2 py-2 font-medium text-center text-gray-700 w-20">ĐVT</th>
                      <th className="px-2 py-2 font-medium text-center text-gray-700 w-20">SL</th>
                      <th className="px-2 py-2 font-medium text-right text-gray-700 w-24">Đơn giá</th>
                      <th className="px-2 py-2 font-medium text-center text-gray-700 w-16">VAT</th>
                      <th className="px-2 py-2 font-medium text-right text-gray-700 w-24">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map((item, index) => {
                      const vatInfo = calculateItemVat(item);
                      return (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-2 py-3 text-sm text-center text-gray-600">{index + 1}</td>
                          <td className="px-2 py-3 text-sm font-medium text-gray-900 align-top">
                            <div className="leading-tight">
                              {formatServiceName(item.name)}
                            </div>
                          </td>
                          <td className="px-2 py-3 text-sm text-center text-gray-600">
                            {item.unit || "Cái"}
                          </td>
                          <td className="px-2 py-3 text-sm text-center text-gray-600">{item.quantity}</td>
                          <td className="px-2 py-3 text-sm text-right text-gray-600">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-2 py-3 text-sm text-center text-gray-600">
                            {vatInfo.rate > 0 ? `${vatInfo.rate}%` : "0%"}
                          </td>
                          <td className="px-2 py-3 text-sm font-medium text-right text-gray-900">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-2 py-3 font-semibold text-right text-gray-900">
                        Tổng tiền hàng:
                      </td>
                      <td className="px-2 py-3 font-bold text-right text-gray-900">
                        {formatCurrency(totals.subtotal)}
                      </td>
                    </tr>
                    {quote.vatEnabled && Object.keys(totals.vatDetails).length > 0 && (
                      Object.entries(totals.vatDetails).map(([rate, amount]) => (
                        <tr key={rate} className="bg-gray-50">
                          <td colSpan={6} className="px-2 py-2 text-sm text-right text-gray-700">
                            Thuế VAT {rate}%:
                          </td>
                          <td className="px-2 py-2 text-sm font-medium text-right text-brand-green">
                            {formatCurrency(amount)}
                          </td>
                        </tr>
                      ))
                    )}
                    {quote.vatEnabled && totals.totalVat > 0 && (
                      <tr className="bg-brand-green/10">
                        <td colSpan={6} className="px-2 py-3 font-semibold text-right text-gray-900">
                          Tổng thuế VAT:
                        </td>
                        <td className="px-2 py-3 font-bold text-right text-brand-green">
                          {formatCurrency(totals.totalVat)}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-brand-yellow/10">
                      <td colSpan={6} className="px-2 py-3 font-semibold text-right text-gray-900">
                        Tổng cộng:
                      </td>
                      <td className="px-2 py-3 font-bold text-right text-brand-yellow">
                        {formatCurrency(quote.vatEnabled ? totals.total : totals.subtotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            {quote.notes && (
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Ghi chú</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Điều khoản và điều kiện</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Báo giá này có hiệu lực trong 15 ngày kể từ ngày phát hành</p>
                <p>• Giá trên đã bao gồm thuế VAT</p>
                <p>• Thanh toán 50% trước khi thực hiện công việc</p>
                <p>• Thời gian thực hiện sẽ được thông báo sau khi xác nhận</p>
                <p>• Bảo hành theo tiêu chuẩn của nhà sản xuất</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end items-center p-6 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
          >
            Đóng
          </button>
          <button className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
            <Send className="w-4 h-4" />
            Gửi cho khách
          </button>
        </div>
      </div>
    </div>
  );
} 