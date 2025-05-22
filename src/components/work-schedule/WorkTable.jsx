import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Filter, UserPlus, Copy } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSelectedWorkerType } from "@/store/slices/workSlice";
import AssignWorkerModal from "./AssignWorkerModal";
import { copyWorkSchedule } from "@/utils/copyUtils";

const WorkTable = ({ works = [] }) => {
  const dispatch = useDispatch();
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedWorkId, setCopiedWorkId] = useState(null);
  const [selectedWorkerType, setSelectedWorkerType] = useState("all");

  const handleAssignWorker = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  const handleCopy = (work) => {
    copyWorkSchedule(work);
    setCopiedWorkId(work.id);
    setTimeout(() => setCopiedWorkId(null), 2000);
  };

  const handleAssign = async (work) => {
    // TODO: Implement worker assignment logic
    console.log("Assigning worker to work:", work);
    handleCloseModal();
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
  const columns = useMemo(
    () => [
      {
        header: "Nội Dung",
        accessorKey: "data",
        cell: (info) => {
          const works = info.getValue();
          console.log(works);
          
          return (
            <div className="space-y-2">
              {works.map((work) => {
                return (
                  <div
                    key={work.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {work.kind_worker && (
                            <>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getWorkTypeColor(
                                  work.kind_worker
                                )}`}
                              >
                                {work.kind_worker.nameKind || "Chưa phân loại"}
                              </span>
                              <span className="text-sm text-gray-500">
                                Số lượng: {work.kind_worker.numberOfWork || 0}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="font-medium text-gray-900 truncate">
                          {work.work_content || "Không có nội dung"}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600 truncate">
                            <span className="font-medium text-gray-700">
                              Khách hàng:
                            </span>{" "}
                            {work.name_cus || "Chưa có thông tin"}
                          </p>
                          <p className="text-gray-600 truncate">
                            <span className="font-medium text-gray-700">
                              Địa chỉ:
                            </span>{" "}
                            {work.street
                              ? `${work.street}, ${work.district}`
                              : "Chưa có thông tin"}
                          </p>
                          <p className="text-gray-600 truncate">
                            <span className="font-medium text-gray-700">
                              SĐT:
                            </span>{" "}
                            {work.phone_number || "Chưa có thông tin"}
                          </p>
                          <div className="flex flex-row justify-between">
                            {" "}
                            <p className="text-gray-600 truncate">
                              <span className="font-medium text-gray-700">
                                Ghi chú:
                              </span>{" "}
                              {work.work_note || "Không có ghi chú"}
                            </p>
                            <p className="truncate border border-green-400 p-1 rounded-md text-green-400">
                              <span className="font-medium">
                                Ngày đặt:
                              </span>{" "}
                              {work.date_book}
                            </p>
                          </div>
                        </div>
                        {work.worker_full_name && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                            <p className="text-sm font-medium text-blue-700">
                              Thợ đã phân công:
                            </p>
                            <p className="text-sm text-blue-600 truncate">
                              {work.worker_full_name} (
                              {work.worker_code || "Không có mã"})
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
                        {!work.worker_full_name && (
                          <button
                            onClick={() => handleAssignWorker(work)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Phân công thợ"
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
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
    [copiedWorkId]
  );

  const workerTypes = useMemo(
    () => [
      { id: "all", name: "Tất cả" },
      ...works.map((item) => ({
        id: item.kind_worker?.id || "unknown",
        name: item.kind_worker?.nameKind || "Chưa phân loại",
      })),
    ],
    [works]
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
  console.log(workerTypes);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1.5">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedWorkerType}
            onChange={(e) => {
              setSelectedWorkerType(e.target.value);
              dispatch(setSelectedWorkerType(e.target.value));
            }}
            className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 font-medium"
          >
            {workerTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
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

      <AssignWorkerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        work={selectedWork}
        onAssign={handleAssign}
      />
    </div>
  );
};

export default WorkTable;
