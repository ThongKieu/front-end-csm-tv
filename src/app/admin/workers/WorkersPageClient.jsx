"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import WorkerDetailModal from "@/components/workers/WorkerDetailModal";
import WorkerEditModal from "@/components/workers/WorkerEditModal";
import WorkerAddModal from "@/components/workers/WorkerAddModal";
import WorkersHeader from "@/components/workers/WorkersHeader";
import WorkerCard from "@/components/workers/WorkerCard";
import { getClientApiUrl, CONFIG } from "@/config/constants";
import { useSchedule } from "@/contexts/ScheduleContext";

export default function WorkersPageClient() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    worker_full_name: "",
    worker_code: "",
    worker_phone_company: "",
    worker_phone_personal: "",
    worker_address: "",
    worker_daily_sales: "",
    worker_daily_o_t_by_hour: "",
    worker_status: 1
  });
  const [addForm, setAddForm] = useState({
    worker_full_name: "",
    worker_code: "",
    worker_phone_company: "",
    worker_phone_personal: "",
    worker_address: "",
    worker_daily_sales: "",
    worker_daily_o_t_by_hour: "",
    worker_status: 1,
    email: "",
    password: ""
  });

  // Sử dụng workers từ ScheduleContext thay vì gọi API riêng
  const { workers: contextWorkers } = useSchedule();
  
  useEffect(() => {
    if (contextWorkers && contextWorkers.length > 0) {
      setWorkers(contextWorkers);
      setLoading(false);
    }
  }, [contextWorkers]);

  const handleViewDetails = (worker) => {
    setSelectedWorker(worker);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (worker) => {
    setSelectedWorker(worker);
    setEditForm({
      worker_full_name: worker.worker_full_name,
      worker_code: worker.worker_code,
      worker_phone_company: worker.worker_phone_company,
      worker_phone_personal: worker.worker_phone_personal || "",
      worker_address: worker.worker_address || "",
      worker_daily_sales: worker.worker_daily_sales,
      worker_daily_o_t_by_hour: worker.worker_daily_o_t_by_hour,
      worker_status: worker.worker_status
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (worker) => {
    // TODO: Implement delete functionality

  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to update worker
  
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to add worker
  
      setIsAddModalOpen(false);
      // Reset form
      setAddForm({
        worker_full_name: "",
        worker_code: "",
        worker_phone_company: "",
        worker_phone_personal: "",
        worker_address: "",
        worker_daily_sales: "",
        worker_daily_o_t_by_hour: "",
        worker_status: 1,
        email: "",
        password: ""
      });
    } catch (error) {
      console.error("Error adding worker:", error);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = 
      worker.worker_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.worker_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.worker_phone_company.includes(searchTerm);

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "active") return matchesSearch && worker.worker_status === 1;
    if (selectedFilter === "inactive") return matchesSearch && worker.worker_status === 0;
    return matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col bg-gray-50">
      <WorkersHeader
        totalWorkers={workers.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      {/* Worker List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredWorkers.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy thợ</h3>
              <p className="text-gray-500">
                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Chưa có thợ nào trong hệ thống"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isDetailModalOpen && selectedWorker && (
        <WorkerDetailModal
          worker={selectedWorker}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={handleEdit}
        />
      )}

      {isEditModalOpen && selectedWorker && (
        <WorkerEditModal
          worker={selectedWorker}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          formData={editForm}
          setFormData={setEditForm}
        />
      )}

      {isAddModalOpen && (
        <WorkerAddModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          formData={addForm}
          setFormData={setAddForm}
        />
      )}
    </div>
  );
}
