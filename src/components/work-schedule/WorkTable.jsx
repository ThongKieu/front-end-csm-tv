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
  Filter,
  UserPlus,
  Copy,
  UserCog,
  Edit2,
  Settings,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedWorkerType,
  selectSelectedDate,
  fetchAssignedWorks,
  fetchUnassignedWorks,
} from "@/store/slices/workSlice";
import AssignWorkerModal from "./AssignWorkerModal";
import { copyWorkSchedule } from "@/utils/copyUtils";
import EditWorkModal from "./EditWorkModal";
import axios from "axios";
import { useSocket } from '@/hooks/useSocket';

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

  // Add socket connection for real-time updates
  const { emit } = useSocket('workUpdate', (data) => {
    // Refresh data when receiving updates
    dispatch(fetchAssignedWorks(selectedDate));
    dispatch(fetchUnassignedWorks(selectedDate));
  });

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
    // Emit socket event after successful assignment
    emit('workUpdated', {
      type: 'assign',
      workId: work.id,
      date: selectedDate
    });

    // Refresh data after assignment
    dispatch(fetchAssignedWorks(selectedDate));
    dispatch(fetchUnassignedWorks(selectedDate));
    handleCloseModal();
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
      
      await axios.post("https://csm.thoviet.net/api/web/update/work", data);
      
      // Emit socket event after successful update
      emit('workUpdated', {
        type: 'edit',
        workId: editValue.id,
        date: selectedDate
      });

      // Refresh data after edit
      dispatch(fetchAssignedWorks(selectedDate));
      dispatch(fetchUnassignedWorks(selectedDate));
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };

  const getWorkTypeColor = (kindWorker) => {
    const typeColors = {
      1: "bg-blue-100 text-blue-800", // Điện nước
      2: "bg-green-100 text-green-800", // Điện lạnh
      3: "bg-yellow-100 text-yellow-800", // Điện
      4: "bg-purple-100 text-purple-800", // Nước
      5: "bg-red-100 text-red-800", // Sửa chữa
      6: "bg-indigo-100 text-indigo-800", // Bảo trì
      7: "bg-pink-100 text-pink-800", // Lắp đặt
      default: "bg-gray-100 text-gray-800", // Khác
    };

    return typeColors[kindWorker?.id] || typeColors["default"];
  };

  const handleWorkerTypeChange = (type) => {
    setSelectedWorkerType(type);
  };

  const columns = useMemo(
    () => [
      {
        header: "Nội Dung",
        accessorKey: "data",
        cell: (info) => {
          const category = info.row.original;
          const works = category.data || [];

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
                          {category.kind_worker && (
                            <span
                              className={`px-2 py-1 text-center col-span-1 text-xs font-medium rounded-full ${getWorkTypeColor(
                                category.kind_worker
                              )}`}
                            >
                              {category.kind_worker.nameKind == "Năng Lượng Mặt Trời" ? "NLMT" : category.kind_worker.nameKind ||
                                "Chưa phân loại"}
                            </span>
                          )}{" "}
                          <p className="font-medium  col-span-5 text-gray-900 break-words whitespace-pre-line">
                            {work.work_content || "Không có nội dung"}
                          </p>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex flex-row justify-between items-center space-x-2">
                            {" "}
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
                            </p>{" "}
                            <p className="truncate border border-green-400 p-1 rounded-md text-green-400">
                              {work.date_book}
                            </p>
                          </div>
                          <p className="text-gray-600 truncate break-words whitespace-pre-line">
                            <span className="font-medium text-gray-700">
                              Địa chỉ:
                            </span>{" "}
                            {work.street
                              ? `${work.street}, ${work.district}`
                              : "Chưa có thông tin"}
                          </p>

                          <p className="font-medium text-gray-900 break-words whitespace-pre-line">
                            {work.work_note || "Không có nội dung"}
                          </p>
                        </div>
                        {assignedWorker && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                            <p className="text-sm font-medium text-blue-700">
                              Thợ đã phân công:
                            </p>
                            <p className="text-sm text-blue-600 truncate">
                              {assignedWorker.worker_full_name} (
                              {assignedWorker.worker_code || "Không có mã"})
                            </p>
                            <p className="text-sm text-blue-600 truncate">
                              SĐT: {assignedWorker.worker_phone_company}
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
                          <button
                            onClick={() => handleChangeWorker(work)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer rounded-full transition-colors"
                            title="Đổi thợ"
                          >
                            <UserCog className="w-5 h-5" />
                          </button>
                        ) : (
                          <div>
                            {" "}
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
                              title="Phân công thợ"
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
          className={`px-3 cursor-pointer py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
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
              className={`px-3 py-1.5 text-sm font-medium cursor-pointer rounded-full transition-all duration-200 ${
                selectedWorkerType === category.kind_worker?.id
                  ? "ring-2 ring-offset-2 ring-blue-500 shadow-md"
                  : ""
              } ${getWorkTypeColor(category.kind_worker)}`}
            >
              {category.kind_worker?.nameKind || "Chưa phân loại"}
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
    </div>
  );
};

export default WorkTable;
