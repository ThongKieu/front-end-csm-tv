"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DateNavigator from "@/components/ui/DateNavigator";
import QuoteDetailModal from "@/components/features/quotes/QuoteDetailModal";

export default function QuotesClient() {
  const [date, setDate] = useState(new Date());
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data cho báo giá
  const mockQuotes = [
    {
      id: 1,
      quoteNumber: "BG-2024-001",
      customerName: "Nguyễn Văn A",
      customerPhone: "0123456789",
      customerEmail: "nguyenvana@email.com",
      customerAddress: "123 Đường ABC, Quận 1, TP.HCM",
      totalAmount: 2500000,
      status: "pending",
      createdAt: "2024-01-15",
      validUntil: "2024-01-30",
      vatEnabled: true,
      representativeName: "Kiều Nhất Thống",
      representativePosition: "Nhân Viên Kinh Doanh",
      representativeEmail: "lienhe@thoviet.com.vn",
      representativePhone: "0912 847 218",
      items: [
        { 
          name: "Sửa chữa máy lạnh", 
          quantity: 1, 
          price: 1500000, 
          total: 1500000,
          vatRate: 0 // Tự động
        },
        { 
          name: "Thay linh kiện", 
          quantity: 2, 
          price: 500000, 
          total: 1000000,
          vatRate: 8 // Chọn thủ công
        },
      ]
    },
    {
      id: 2,
      quoteNumber: "BG-2024-002",
      customerName: "Trần Thị B",
      customerPhone: "0987654321",
      customerEmail: "tranthib@email.com",
      customerAddress: "456 Đường XYZ, Quận 2, TP.HCM",
      totalAmount: 1800000,
      status: "approved",
      createdAt: "2024-01-14",
      validUntil: "2024-01-29",
      vatEnabled: true,
      representativeName: "Kiều Nhất Thống",
      representativePosition: "Nhân Viên Kinh Doanh",
      representativeEmail: "lienhe@thoviet.com.vn",
      representativePhone: "0912 847 218",
      items: [
        { 
          name: "Bảo trì hệ thống điện", 
          quantity: 1, 
          price: 1800000, 
          total: 1800000,
          vatRate: 0 // Tự động
        },
      ]
    },
    {
      id: 3,
      quoteNumber: "BG-2024-003",
      customerName: "Lê Văn C",
      customerPhone: "0555666777",
      customerEmail: "levanc@email.com",
      customerAddress: "789 Đường DEF, Quận 3, TP.HCM",
      totalAmount: 3200000,
      status: "rejected",
      createdAt: "2024-01-13",
      validUntil: "2024-01-28",
      vatEnabled: false,
      representativeName: "Kiều Nhất Thống",
      representativePosition: "Nhân Viên Kinh Doanh",
      representativeEmail: "lienhe@thoviet.com.vn",
      representativePhone: "0912 847 218",
      items: [
        { 
          name: "Lắp đặt camera", 
          quantity: 4, 
          price: 800000, 
          total: 3200000,
          vatRate: 0
        },
      ]
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setQuotes(mockQuotes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  const handlePreviousDay = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setDate(new Date());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20";
      case "approved":
        return "bg-brand-green/10 text-brand-green border-brand-green/20";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "approved":
        return <CheckCircle className="w-3 h-3" />;
      case "rejected":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === "pending").length,
    approved: quotes.filter(q => q.status === "approved").length,
    totalValue: quotes.reduce((sum, q) => sum + q.totalAmount, 0),
  };

  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-70px)] bg-gray-50">
      <div className="p-4 mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Left Sidebar */}
          <div className="space-y-4 w-full lg:w-80 lg:flex-shrink-0">
            {/* Date Navigation */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100 shadow-sm">
              <h3 className="flex gap-2 items-center mb-3 text-sm font-semibold text-green-900">
                <Calendar className="w-4 h-4" />
                Chọn ngày
              </h3>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <DateNavigator
                  selectedDate={format(date, "yyyy-MM-dd")}
                  onDateChange={handleDateChange}
                  onPreviousDay={handlePreviousDay}
                  onNextDay={handleNextDay}
                  onToday={handleToday}
                  className="bg-transparent border-0"
                  showStatus={false}
                  compact={true}
                />
              </div>
              <div className="p-2 mt-3 text-center bg-white rounded-lg">
                <p className="text-sm font-medium text-green-900">
                  {format(date, "EEEE, dd/MM/yyyy")}
                </p>
                <p className="mt-1 text-xs text-green-600">
                  {format(date, "dd 'tháng' MM, yyyy")}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Tổng báo giá</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Chờ duyệt</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Đã duyệt</p>
                    <p className="text-xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Tổng giá trị</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatCurrency(stats.totalValue)}
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Tìm kiếm & Lọc</h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 pl-10 h-10 text-sm"
                  />
                </div>
                
                <button className="flex gap-2 justify-center items-center px-3 py-2 w-full text-gray-600 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Lọc nâng cao</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 h-[calc(100vh-140px)]">
            <Card className="flex flex-col h-full bg-white border border-gray-100 shadow-sm">
              <div className="flex-shrink-0 p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Báo giá</h3>
                    <p className="mt-1 text-sm text-gray-500">{quotes.length} báo giá</p>
                  </div>
                  <a 
                    href="/quotes/create" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex gap-2 items-center px-3 py-2 text-sm text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo báo giá
                  </a>
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 rounded-full border-2 border-green-200 animate-spin border-t-green-600"></div>
                      <p className="text-sm text-gray-600">Đang tải...</p>
                    </div>
                  </div>
                ) : quotes.length === 0 ? (
                  <div className="flex flex-col justify-center items-center py-12 text-center">
                    <FileText className="mb-3 w-12 h-12 text-gray-300" />
                    <h3 className="mb-1 text-base font-medium text-gray-800">
                      Không có báo giá nào
                    </h3>
                    <p className="max-w-sm text-sm text-gray-600">
                      Tạo báo giá mới để bắt đầu
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {quotes.map((quote) => (
                      <div key={quote.id} className="p-4 transition-colors hover:bg-gray-50">
                        <div className="flex gap-4 items-start">
                          {/* Quote Icon */}
                          <div className="flex-shrink-0">
                            <div className="flex justify-center items-center w-10 h-10 bg-brand-green/10 rounded-full">
                              <FileText className="w-5 h-5 text-brand-green" />
                            </div>
                          </div>
                          
                          {/* Quote Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex gap-3 justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <div className="flex gap-2 items-center mb-1">
                                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                                    {quote.quoteNumber}
                                  </h3>
                                  <span className="text-xs text-gray-500">#{quote.id}</span>
                                </div>
                                
                                <div className="flex gap-2 items-center mb-2 text-xs text-gray-500">
                                  <User className="w-3 h-3" />
                                  <span>{quote.customerName}</span>
                                  <span>•</span>
                                  <span>{quote.customerPhone}</span>
                                </div>
                                
                                <div className="flex gap-4 items-center mb-2 text-xs text-gray-500">
                                  <div className="flex gap-1 items-center">
                                    <Calendar className="w-3 h-3" />
                                    <span>Tạo: {format(new Date(quote.createdAt), "dd/MM/yyyy")}</span>
                                  </div>
                                  <div className="flex gap-1 items-center">
                                    <span>•</span>
                                    <span>Hiệu lực: {format(new Date(quote.validUntil), "dd/MM/yyyy")}</span>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 items-center text-sm">
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(quote.totalAmount)}
                                  </span>
                                  <span className="text-gray-500">
                                    ({quote.items.length} mục)
                                  </span>
                                </div>
                              </div>
                              
                              {/* Status & Actions */}
                              <div className="flex flex-col gap-2 items-end">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(quote.status)}`}>
                                  {getStatusIcon(quote.status)}
                                  {getStatusText(quote.status)}
                                </span>
                                
                                <div className="flex gap-1 items-center">
                                  <button 
                                    onClick={() => handleViewQuote(quote)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Quote Detail Modal */}
      <QuoteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedQuote(null);
        }}
        quote={selectedQuote}
      />
    </div>
  );
} 