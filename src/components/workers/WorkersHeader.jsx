import { Search, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@headlessui/react";

export default function WorkersHeader({ 
  totalWorkers, 
  searchTerm, 
  onSearchChange, 
  activeTab, 
  onTabChange,
  onAddClick 
}) {
  return (
    <div className="flex-none p-6 pt-2 bg-white border-b border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thợ</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng số thợ: {totalWorkers} người
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-72 rounded-lg border border-gray-300 focus:ring-brand-green focus:border-brand-green"
            />
          </div>
          <button 
            onClick={onAddClick}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-brand-green to-brand-yellow hover:from-green-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
          >
            <Plus className="h-5 w-5 mr-2" />
            Thêm thợ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-1 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onTabChange("all")}
            className={`${
              activeTab === "all"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onTabChange("active")}
            className={`${
              activeTab === "active"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Đang hoạt động
          </button>
          <button
            onClick={() => onTabChange("inactive")}
            className={`${
              activeTab === "inactive"
                ? "border-brand-yellow text-brand-yellow"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Không hoạt động
          </button>
        </nav>
      </div>
    </div>
  );
} 