import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  UserPlus,
  Copy,
  UserCog,
  Settings,
  DollarSign,
  Phone,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedDate,
  fetchAssignedWorks,
  fetchUnassignedWorks,
  assignWorker,
} from "@/store/slices/workSlice";
import AssignWorkerModal from "./AssignWorkerModal";
import { copyWorkSchedule } from "@/utils/copyUtils";
import EditWorkModal from "./EditWorkModal";
import axios from "axios";
import { useWorkSocket } from '@/hooks/useWorkSocket';
import EditAssignedWorkModal from "./EditAssignedWorkModal";

// Export các function để sử dụng ở component khác
export const getWorkTypeColor = (kindWork) => {
  switch (kindWork) {
    case 1:
      return 'bg-blue-100 text-blue-800'; // Điện Nước
    case 2:
      return 'bg-green-100 text-green-800'; // Điện Lạnh
    case 3:
      return 'bg-yellow-100 text-yellow-800'; // Đồ gỗ
    case 4:
      return 'bg-orange-100 text-orange-800'; // Năng Lượng Mặt trời
    case 5:
      return 'bg-red-100 text-red-800'; // Xây Dựng
    case 6:
      return 'bg-purple-100 text-purple-800'; // Tài Xế
    case 7:
      return 'bg-indigo-100 text-indigo-800'; // Cơ Khí
    case 8:
      return 'bg-pink-100 text-pink-800'; // Điện - Điện Tử
    case 9:
      return 'bg-gray-100 text-gray-800'; // Văn Phòng
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getWorkTypeName = (kindWork) => {
  switch (kindWork) {
    case 1:
      return 'ĐN'; // Điện Nước
    case 2:
      return 'ĐL'; // Điện Lạnh
    case 3:
      return 'ĐG'; // Đồ gỗ
    case 4:
      return 'NLMT'; // Năng Lượng Mặt trời
    case 5:
      return 'XD'; // Xây Dựng
    case 6:
      return 'TX'; // Tài Xế
    case 7:
      return 'CK'; // Cơ Khí
    case 8:
      return 'ĐĐT'; // Điện - Điện Tử
    case 9:
      return 'VP'; // Văn Phòng
    default:
      return 'CPL'; // Chưa phân loại
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'bg-gray-100 text-gray-800 border border-gray-300'; // Chưa Phân
    case 1:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300'; // Thuê Bao / Không nghe
    case 2:
      return 'bg-orange-100 text-orange-800 border border-orange-300'; // Khách Nhắc 1 lần
    case 3:
      return 'bg-red-100 text-red-800 border border-red-300'; // Khách nhắc nhiều lần
    case 4:
      return 'bg-purple-100 text-purple-800 border border-purple-300 font-semibold'; // Lịch Gấp/Ưu tiên
    case 5:
      return 'bg-blue-100 text-blue-800 border border-blue-300'; // Đang xử lý
    case 6:
      return 'bg-green-100 text-green-800 border border-green-300'; // Lịch đã phân
    case 7:
      return 'bg-red-200 text-red-900 border border-red-400'; // Lịch Hủy
    case 8:
      return 'bg-gray-200 text-gray-900 border border-gray-400'; // KXL
    case 9:
      return 'bg-pink-100 text-pink-800 border border-pink-300 font-semibold'; // Khách quen
    case 10:
      return 'bg-indigo-100 text-indigo-800 border border-indigo-300 font-semibold'; // Lịch ưu tiên
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

export const getStatusName = (status) => {
  switch (status) {
    case 0:
      return '⏳ Chưa Phân';
    case 1:
      return '📞 Thuê Bao / Không nghe';
    case 2:
      return '⚠️ Khách Nhắc 1 lần';
    case 3:
      return '🚨 Khách nhắc nhiều lần';
    case 4:
      return '🔥 Lịch Gấp/Ưu tiên';
    case 5:
      return '⚡ Đang xử lý';
    case 6:
      return '✅ Lịch đã phân';
    case 7:
      return '❌ Lịch Hủy';
    case 8:
      return '⏸️ KXL';
    case 9:
      return '👥 Khách quen';
    case 10:
      return '⭐ Lịch ưu tiên';
    default:
      return '❓ Chưa xác định';
  }
};

const WorkTable = ({ works = [], workers = [] }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [copiedWorkId, setCopiedWorkId] = useState(null);
  const [selectedWorkerType, setSelectedWorkerType] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [isEditAssignedModalOpen, setIsEditAssignedModalOpen] = useState(false);
  const [selectedAssignedWork, setSelectedAssignedWork] = useState(null);

  // Use the work socket hook
  const { 
    emitTableUpdate, 
    emitWorkAssignment, 
    emitWorkDelete, 
    emitAssignedWorkDelete 
  } = useWorkSocket();
  
  const handleAssignWorker = (work) => {
    setSelectedWork(work);
    setIsChangingWorker(false);
    setIsModalOpen(true);
  };

  const handleChangeWorker = (work) => {
    setSelectedWork(work);
    setIsChangingWorker(true);
    setIsModalOpen(true);
  };

  const handleEditWork = (work) => {
    setSelectedWork(work);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
    setIsChangingWorker(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedWork(null);
  };

  const handleCopy = async (work) => {
    try {
      const success = await copyWorkSchedule(work);
      if (success) {
        setCopiedWorkId(work.id);
        setTimeout(() => setCopiedWorkId(null), 2000);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleAssign = async (work) => {
    try {
      // Call API to update server
      await dispatch(assignWorker({
        work,
        worker: work.id_worker,
        extraWorker: work.id_phu,
        dateCheck: selectedDate,
        authId: auth.user.id
      })).unwrap();

      // Emit socket event for table update
      emitTableUpdate({
        type: 'assign',
        workId: work.id,
        date: selectedDate,
        work: work,
        categoryId: work.kind_work,
        isLocalUpdate: true
      });

      // Refresh data after successful assignment
      await Promise.all([
        dispatch(fetchAssignedWorks(selectedDate)),
        dispatch(fetchUnassignedWorks(selectedDate))
      ]);

      handleCloseModal();
    } catch (error) {
      console.error("Error assigning work:", error);
    }
  };

  const handleEdit = async (editValue) => {
    try {
      const data = {
        ...editValue,
        auth_id: auth.user.id,
        date_book: selectedDate,
        from_cus: editValue.from_cus || 0,
        status_cus: editValue.status_cus || 0,
        kind_work: editValue.kind_work || 0,
      };      
      // Call API to update server
      await axios.post("https://csm.thoviet.net/api/web/update/work", data);
      
      // Emit socket event for table update
      emitTableUpdate({
        type: 'edit',
        workId: editValue.id,
        date: selectedDate,
        data: data,
        isAssigned: false,
        isLocalUpdate: true
      });

      // Refresh data after successful edit
      await Promise.all([
        dispatch(fetchAssignedWorks(selectedDate)),
        dispatch(fetchUnassignedWorks(selectedDate))
      ]);

      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };



  const getWorkTypeGradient = (kindWork) => {
    switch (kindWork) {
      case 1:
        return 'bg-gradient-to-r from-blue-500 to-blue-600'; // Điện Nước
      case 2:
        return 'bg-gradient-to-r from-green-500 to-green-600'; // Điện Lạnh
      case 3:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600'; // Đồ gỗ
      case 4:
        return 'bg-gradient-to-r from-orange-500 to-orange-600'; // Năng Lượng Mặt trời
      case 5:
        return 'bg-gradient-to-r from-red-500 to-red-600'; // Xây Dựng
      case 6:
        return 'bg-gradient-to-r from-purple-500 to-purple-600'; // Tài Xế
      case 7:
        return 'bg-gradient-to-r from-indigo-500 to-indigo-600'; // Cơ Khí
      case 8:
        return 'bg-gradient-to-r from-pink-500 to-pink-600'; // Điện - Điện Tử
      case 9:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'; // Văn Phòng
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const handleWorkerTypeChange = (type) => {
    setSelectedWorkerType(type);
  };

  const handleEditAssignedWork = (work) => {
    setSelectedAssignedWork(work);
    setIsEditAssignedModalOpen(true);
  };

  const handleCloseEditAssignedModal = () => {
    setIsEditAssignedModalOpen(false);
    setSelectedAssignedWork(null);
  };

  const handleSaveAssignedWork = async (formData) => {
    try {
      // Call API to update server
      await axios.post("https://csm.thoviet.net/api/web/update/work_ass", formData);
      
      // Emit socket event for work assignment update
      emitWorkAssignment({
        type: 'update_assigned',
        workId: formData.id,
        date: selectedDate,
        data: formData,
        isLocalUpdate: true
      });

      // Refresh data after successful save
      await dispatch(fetchAssignedWorks(selectedDate));

      handleCloseEditAssignedModal();
    } catch (error) {
      console.error("Error updating assigned work:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Nội Dung",
        accessorKey: "data",
        cell: (info) => {
          const category = info.row.original;
          const works = category.data || [];
          console.log(works);
          
          if (works.length === 0) {
            return (
              <div className="p-4 text-center text-gray-500">
                Không có công việc nào
              </div>
            );
          }

          return (
            <div className="space-y-2">
              {works.map((work, index) => {
                const assignedWorker = workers.find(
                  (w) => w.id === work.id_worker
                );
                  
                return (
                  <div
                    key={work.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:border-blue-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="grid grid-cols-6 items-center space-x-2">
                          <div className="flex col-span-1 items-center space-x-1">
                            <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full shadow-sm ${getWorkTypeGradient(
                              category.kind_worker.id
                            )}`}>
                              {index + 1}
                            </span>
                            <span
                              className={`px-2 py-1 text-center text-xs font-medium rounded-full ${getWorkTypeColor(
                                category.kind_worker.id
                              )}`}
                            >
                              {getWorkTypeName(category.kind_worker.id)}
                            </span>
                          </div>
                          <p className="col-span-5 font-medium text-gray-900 whitespace-pre-line break-words">
                            {work.work_content || "Không có nội dung"}
                          </p>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex flex-row justify-between items-center space-x-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <span className="font-medium text-gray-700">Khách hàng:</span>
                                <span className="text-gray-600 truncate">
                                  {work.name_cus || "Chưa có thông tin"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-gray-500" />
                                <span className="font-medium text-gray-700">SĐT:</span>
                                <span className="text-gray-600 truncate">
                                  {work.phone_number || "Chưa có thông tin"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                  work.status_work
                                )}`}
                              >
                                {getStatusName(work.status_work)}
                              </span>
                              <div className="flex items-center space-x-1">
                                <p className="p-1 text-xs text-green-400 truncate rounded-md border border-green-400">
                                  {work.date_book}
                                </p>
                                {work.time_book && (
                                  <p className="p-1 text-xs text-blue-400 truncate rounded-md border border-blue-400">
                                    {work.time_book}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 truncate whitespace-pre-line break-words">
                            <span className="font-medium text-gray-700">
                              Địa chỉ:
                            </span>{" "}
                            {work.street
                              ? `${work.street}${work.district ? `, ${work.district}` : ''}`
                              : "Chưa có thông tin"}
                          </p>

                          {work.work_note && (
                            <p className="font-medium text-gray-900 whitespace-pre-line break-words">
                              {work.work_note}
                            </p>
                          )}
                          
                          {work.job_code && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Mã công việc:</span> {work.job_code}
                            </p>
                          )}
                          
                          {work.images_count > 0 && (
                            <p className="text-xs text-blue-600">
                              <span className="font-medium">Hình ảnh:</span> {work.images_count} ảnh
                            </p>
                          )}
                        </div>
                        {assignedWorker && (
                          <div className="p-2 mt-2 bg-blue-50 rounded-md border border-blue-100">
                            <p className="mb-1 text-sm font-medium text-blue-700">
                              Thợ đã phân công:
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm text-blue-600 truncate">
                                {work.worker_full_name} ({work.worker_code})
                              </p>
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-blue-500" />
                                <span className="text-sm text-blue-600 truncate">
                                  SĐT: {work.worker_phone_company || "Chưa có thông tin"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center ml-4 space-x-2">
                        <button
                          onClick={() => handleCopy(work)}
                          className={`p-2 rounded-full transition-colors ${
                            copiedWorkId === work.id
                              ? "text-green-600 bg-green-50"
                              : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          title="Sao chép lịch"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        {assignedWorker ? (
                          <>
                            <button
                              onClick={() => handleChangeWorker(work)}
                              className="p-2 text-gray-500 rounded-full transition-colors cursor-pointer hover:text-blue-600 hover:bg-blue-50"
                              title="Đổi thợ"
                            >
                              <UserCog className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEditAssignedWork(work)}
                              className="p-2 text-gray-500 rounded-full transition-colors hover:text-blue-600 hover:bg-blue-50"
                              title="Nhập thu chi"
                            >
                              <DollarSign className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <div>
                            <button
                              onClick={() => handleAssignWorker(work)}
                              className="p-2 text-gray-500 rounded-full transition-colors hover:text-blue-600 hover:bg-blue-50"
                              title="Phân công thợ"
                            >
                              <UserPlus className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEditWork(work)}
                              className="p-2 text-gray-500 rounded-full transition-colors hover:text-blue-600 hover:bg-blue-50"
                              title="Chỉnh sửa"
                            >
                              <Settings className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    ],
    [copiedWorkId, workers]
  );

  const filteredData = useMemo(
    () =>
      selectedWorkerType === "all"
        ? works
        : works.filter(
            (item) => item.kind_worker?.id === parseInt(selectedWorkerType)
          ),
    [works, selectedWorkerType]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 justify-end items-center mb-2">
        <button
          onClick={() => handleWorkerTypeChange("all")}
          className={`px-1.5 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${
            selectedWorkerType === "all"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
        {works &&
          works.map((category) => (
            <button
              key={category.kind_worker?.id}
              onClick={() => handleWorkerTypeChange(category.kind_worker?.id)}
              className={`px-1.5 py-0.5 text-xs font-medium cursor-pointer rounded-full transition-all duration-200 ${
                selectedWorkerType === category.kind_worker?.id
                  ? "ring-1 ring-blue-500 shadow-sm"
                  : ""
              } ${getWorkTypeColor(category.kind_worker?.id)}`}
            >
              {getWorkTypeName(category.kind_worker?.id)}
              <span className="ml-0.5 text-xs opacity-75">
                ({category.kind_worker?.numberOfWork || 0})
              </span>
            </button>
          ))}
      </div>

      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() &&
                        (header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-2 py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AssignWorkerModal
          work={selectedWork}
          workers={workers}
          onClose={handleCloseModal}
          onAssign={handleAssign}
          isChanging={isChangingWorker}
        />
      )}

      {isEditModalOpen && (
        <EditWorkModal
          work={selectedWork}
          onClose={handleCloseEditModal}
          onSave={handleEdit}
        />
      )}

      {isEditAssignedModalOpen && (
        <EditAssignedWorkModal
          work={selectedAssignedWork}
          onClose={handleCloseEditAssignedModal}
          onSave={handleSaveAssignedWork}
        />
      )}
    </div>
  );
};

export default WorkTable;
