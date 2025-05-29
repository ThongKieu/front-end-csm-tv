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

  const getWorkTypeColor = (kindWork) => {
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

  const getWorkTypeName = (kindWork) => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return 'bg-gray-100 text-gray-800'; // Chưa Phân
      case 1:
        return 'bg-yellow-100 text-yellow-800'; // Thuê Bao / Không nghe
      case 2:
        return 'bg-orange-100 text-orange-800'; // Khách Nhắc 1 lần
      case 3:
        return 'bg-red-100 text-red-800'; // Khách nhắc nhiều lần
      case 4:
        return 'bg-purple-100 text-purple-800'; // Lịch Gấp/Ưu tiên
      case 5:
        return 'bg-blue-100 text-blue-800'; // 
      case 6:
        return 'bg-green-100 text-green-800'; // Lịch đã phân
      case 7:
        return 'bg-red-200 text-red-900'; // Lịch Hủy
      case 8:
        return 'bg-gray-200 text-gray-900'; // KXL
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 0:
        return 'Chưa Phân';
      case 1:
        return 'Thuê Bao / Không nghe';
      case 2:
        return 'Khách Nhắc 1 lần';
      case 3:
        return 'Khách nhắc nhiều lần';
      case 4:
        return 'Lịch Gấp/Ưu tiên';
      case 5:
        return 'Đang xử lý';
      case 6:
        return 'Lịch đã phân';
      case 7:
        return 'Lịch Hủy';
      case 8:
        return 'KXL';
      default:
        return 'Chưa xác định';
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
              {works.map((work) => {
                const assignedWorker = workers.find(
                  (w) => w.id === work.id_worker
                );
                  
                return (
                  <div
                    key={work.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="grid grid-cols-6 items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-center col-span-1 text-xs font-medium rounded-full ${getWorkTypeColor(
                              category.kind_worker.id
                            )}`}
                          >
                            {getWorkTypeName(category.kind_worker.id)}
                          </span>
                          <p className="font-medium col-span-5 text-gray-900 break-words whitespace-pre-line">
                            {work.work_content || "Không có nội dung"}
                          </p>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex flex-row justify-between items-center space-x-2">
                            <div className="flex items-center space-x-2">
                              <p className="text-gray-600 truncate">
                                <span className="font-medium text-gray-700">
                                  Khách hàng:
                                </span>{" "}
                                {work.name_cus || "Chưa có thông tin"}
                              </p>
                              <p className="text-gray-600 truncate">
                                <span className="font-medium text-gray-700">
                                  SĐT:
                                </span>{" "}
                                {work.phone_number || "Chưa có thông tin"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                  work.status_work
                                )}`}
                              >
                                {getStatusName(work.status_work)}
                              </span>
                              <p className="truncate border border-green-400 p-1 rounded-md text-green-400">
                                {work.date_book}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600 truncate break-words whitespace-pre-line">
                            <span className="font-medium text-gray-700">
                              Địa chỉ:
                            </span>{" "}
                            {work.street
                              ? `${work.street}, ${work.district}`
                              : "Chưa có thông tin"}
                          </p>

                          {work.work_note && (
                            <p className="font-medium text-gray-900 break-words whitespace-pre-line">
                              {work.work_note}
                            </p>
                          )}
                        </div>
                        {assignedWorker && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                            <p className="text-sm font-medium text-blue-700">
                              Thợ đã phân công:
                            </p>
                            <p className="text-sm text-blue-600 truncate">
                              {work.worker_full_name} ({work.worker_code})
                            </p>
                            <p className="text-sm text-blue-600 truncate">
                              SĐT: {work.worker_phone_company || "Chưa có thông tin"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
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
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer rounded-full transition-colors"
                              title="Đổi thợ"
                            >
                              <UserCog className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEditAssignedWork(work)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Nhập thu chi"
                            >
                              <DollarSign className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <div>
                            <button
                              onClick={() => handleAssignWorker(work)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Phân công thợ"
                            >
                              <UserPlus className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEditWork(work)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
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
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 justify-end mb-4">
        <button
          onClick={() => handleWorkerTypeChange("all")}
          className={`p-1 text-sm font-medium rounded-full transition-all duration-200 ${
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
              className={`p-1 text-sm font-medium cursor-pointer rounded-full transition-all duration-200 ${
                selectedWorkerType === category.kind_worker?.id
                  ? "ring-2 ring-offset-2 ring-blue-500 shadow-md"
                  : ""
              } ${getWorkTypeColor(category.kind_worker?.id)}`}
            >
              {getWorkTypeName(category.kind_worker?.id)}
              <span className="ml-1 text-xs opacity-75">
                ({category.kind_worker?.numberOfWork || 0})
              </span>
            </button>
          ))}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() &&
                        (header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
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
