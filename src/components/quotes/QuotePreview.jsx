"use client";

import { FileText, Eye } from "lucide-react";

export default function QuotePreview({ formData }) {
  // Calculate VAT for an item based on manual selection
  const calculateItemVat = (item) => {
    if (!formData.vatEnabled) {
      return { rate: 0, amount: 0 };
    }

    // If item has manual VAT selection, use that
    if (item.vatRate && item.vatRate > 0) {
      return {
        rate: item.vatRate,
        amount: Math.round((item.price * item.vatRate) / 100),
      };
    }

    // Default to 10% if no manual selection
    return {
      rate: 10,
      amount: Math.round((item.price * 10) / 100),
    };
  };

  // Calculate item total with VAT included
  const calculateItemTotalWithVat = (item) => {
    const vatInfo = calculateItemVat(item);
    const vatAmount = vatInfo.amount * item.quantity; // VAT for the quantity
    return item.total + vatAmount;
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const vatDetails = {};
    let totalVat = 0;

    // Calculate VAT for each item and group by rate
    formData.items.forEach((item) => {
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
      total,
    };
  };

  const totals = calculateTotals();

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

  return (
    <div className="p-3">
      <div className="flex gap-2 items-center mb-3">
        <div className="p-1 bg-purple-500 rounded-lg">
          <Eye className="w-3 h-3 text-white" />
        </div>
        <h3 className="text-xs font-semibold text-gray-900">Bản xem trước</h3>
      </div>

      <div className="p-3 space-y-3 text-xs bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Company Header */}
        <div className="pb-3 border-b border-gray-200">
          <div className="flex gap-3 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex justify-center items-center w-12 h-12 rounded-lg shadow-lg">
                <img
                  src="https://thoviet.com.vn/wp-content/uploads/2025/05/logo-thoviet.png"
                  alt="CSM TV Logo"
                  className="w-auto h-6"
                />
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 text-center">
              <h1 className="mb-1 text-sm font-bold text-gray-900">
                CÔNG TY TNHH DỊCH VỤ KỸ THUẬT THỢ VIỆT
              </h1>
              <p className="mb-0.5 text-xs text-gray-700">
                ĐC: 25/6 Phùng Văn Cung, Phường 2, Quận Phú Nhuận., TP. HCM
              </p>
              <p className="mb-2 text-xs text-gray-700">
                Tel: 1800 8122 - 0903532938 ; Website: www.thoviet.com.vn
              </p>

              <h2 className="mb-1 text-sm font-bold text-gray-900">
                BẢNG BÁO GIÁ
              </h2>
              <p className="text-xs text-gray-600">
                (V/v : {formData.subject || "Bảo Trì M-E"})
              </p>
            </div>
          </div>
        </div>{" "}
        {/* Company Representative Information */}
        <div className="pb-3 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="pb-3 border-b border-gray-200">
                <h4 className="mb-1 text-xs font-semibold text-gray-900">
                  Đến: {formData.customerName || "Quý Khách Hàng"}
                </h4>
                <div className="space-y-0.5 text-xs text-gray-700">
                  <p>
                    <span className="font-medium">ĐT:</span>{" "}
                    {formData.customerPhone || ""}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {formData.customerEmail || ""}
                  </p>
                  <p>
                    <span className="font-medium">Địa chỉ:</span>{" "}
                    {formData.customerAddress || ""}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-1 text-xs font-semibold text-gray-900">
                Từ: {formData.representativeName || "Chưa nhập"}
              </h4>
              <div className="space-y-0.5 text-xs text-gray-700">
                <p>
                  <span className="font-medium">Chức vụ:</span>{" "}
                  {formData.representativePosition || ""}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {formData.representativeEmail || "lienhe@thoviet.com.vn"}
                </p>
                <p>
                  <span className="font-medium">ĐT:</span>{" "}
                  {formData.representativePhone || "0912 847 218"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Company Slogan and Services */}
        <div className="pb-3 border-b border-gray-200">
          <p className="mb-1 text-xs font-bold text-center text-gray-900">
            {formData.companySlogan}
          </p>
          <p className="mb-2 text-xs text-center text-gray-700">
            {formData.companyServices}
          </p>
          <p className="text-xs text-gray-700">{formData.introduction}</p>
        </div>
        {/* Quote Header */}
        <div className="pb-3 text-center border-b border-gray-200">
          <p className="text-xs text-gray-600">
            Số: BG-{new Date().getFullYear()}-
            {String(Math.floor(Math.random() * 1000)).padStart(3, "0")}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            Ngày: {new Date().toLocaleDateString("vi-VN")} | Hiệu lực:{" "}
            {formData.validUntil
              ? new Date(formData.validUntil).toLocaleDateString("vi-VN")
              : "Chưa chọn"}
          </p>
        </div>
        {/* Items Table */}
        {formData.items.some((item) => item.name) && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-900">
              Danh sách dịch vụ:
            </h4>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-1 py-0.5 text-left border-r border-gray-200 w-8">
                      STT
                    </th>
                    <th className="px-1 py-0.5 text-left border-r border-gray-200">
                      Tên sản phẩm và dịch vụ
                    </th>
                    <th className="px-1 py-0.5 text-left border-r border-gray-200 w-12">
                      ĐVT
                    </th>
                    <th className="px-1 py-0.5 text-left border-r border-gray-200 w-12">
                      SL
                    </th>
                    <th className="px-1 py-0.5 text-left border-r border-gray-200 w-20">
                      Đơn giá
                    </th>
                    <th className="px-1 py-0.5 text-left border-r border-gray-200 w-20">
                      Thành Tiền
                    </th>
                    <th className="px-1 py-0.5 text-left border-r border-gray-200 w-12">
                      VAT
                    </th>
                    <th className="px-1 py-0.5 text-left w-20">Ghi Chú</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => {
                    const vatInfo = calculateItemVat(item);
                    return item.name ? (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-1 py-1 text-center border-r border-gray-200">
                          {index + 1}
                        </td>
                        <td className="px-1 py-1 font-medium align-top border-r border-gray-200">
                          <div className="leading-tight">
                            {formatServiceName(item.name)}
                          </div>
                        </td>
                        <td className="px-1 py-1 text-center border-r border-gray-200">
                          {item.unit || "Cái"}
                        </td>
                        <td className="px-1 py-1 text-center border-r border-gray-200">
                          {item.quantity}
                        </td>
                        <td className="px-1 py-1 text-right border-r border-gray-200">
                          {item.price.toLocaleString("vi-VN")}
                        </td>
                        <td className="px-1 py-1 font-semibold text-right border-r border-gray-200">
                          {item.total.toLocaleString("vi-VN")}
                        </td>
                        <td className="px-1 py-1 text-center border-r border-gray-200">
                          {vatInfo.rate > 0 ? `${vatInfo.rate}%` : "0%"}
                        </td>
                        <td className="px-1 py-1 align-top">
                          <div className="text-xs leading-tight">
                            {item.notes}
                          </div>
                        </td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Total and VAT */}
        {totals.subtotal > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-900">Cộng:</span>
              <span className="text-xs font-semibold text-gray-900">
                {totals.subtotal.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>

            {/* VAT Details */}
            {formData.vatEnabled &&
              Object.keys(totals.vatDetails).length > 0 && (
                <div className="space-y-1">
                  {Object.entries(totals.vatDetails).map(([rate, amount]) => (
                    <div
                      key={rate}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xs font-semibold text-gray-900">
                        Thuế VAT {rate}%:
                      </span>
                      <span className="text-xs font-semibold text-gray-900">
                        {amount.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  ))}
                </div>
              )}

            {/* Total VAT */}
            {formData.vatEnabled && totals.totalVat > 0 && (
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-900">
                  Tổng VAT:
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  {totals.totalVat.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            )}

            {/* Grand Total - Only show when VAT is enabled */}
            {formData.vatEnabled && (
              <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                <span className="text-xs font-semibold text-gray-900">
                  Tổng Cộng Sau Thuế:
                </span>
                <span className="text-sm font-bold text-green-600">
                  {totals.total.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            )}
          </div>
        )}
        {/* Terms and Closing */}
        <div className="pt-3 border-t border-gray-200">
          {/* Notes */}
          {formData.notes &&
            formData.notes.length > 0 &&
            formData.notes.some((note) => note.trim()) && (
              <div className="mb-3 space-y-1">
                <h4 className="text-xs font-semibold text-gray-900">
                  Ghi chú:
                </h4>
                <ul className="space-y-0.5 text-xs text-gray-700">
                  {formData.notes.map(
                    (note, index) =>
                      note.trim() && (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          {note}
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}

          <div className="mb-3 space-y-1">
            <h4 className="text-xs font-semibold text-gray-900">Ghi chú:</h4>
            <ul className="space-y-0.5 text-xs text-gray-700">
              {formData.terms.map((term, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">_</span>
                  {term}
                </li>
              ))}
            </ul>
          </div>

          <p className="mb-3 text-xs text-gray-700">{formData.closing}</p>

          <div className="flex justify-between items-end">
            <div className="text-xs text-gray-700">
              <p>TP. Hồ Chí Minh, ngày {formData.date}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-900">
                Đại diện công ty Thợ Việt
              </p>
              <p className="text-xs text-gray-700">Duyệt bởi</p>
            </div>
          </div>
        </div>
        {/* Placeholder when empty */}
        {!formData.customerName &&
          !formData.items.some((item) => item.name) && (
            <div className="py-6 text-center text-gray-500">
              <FileText className="mx-auto mb-2 w-8 h-8 text-gray-300" />
              <p className="text-xs">Nhập thông tin để xem bản xem trước</p>
            </div>
          )}
      </div>
    </div>
  );
}
