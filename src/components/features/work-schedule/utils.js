// Utility functions for work schedule components

export const getWorkTypeColor = (kindWork) => {
  const workTypeColors = {
    "sua_chua": "bg-blue-100 text-blue-800 border-blue-200",
    "lap_dat": "bg-green-100 text-green-800 border-green-200", 
    "bao_tri": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "khao_sat": "bg-purple-100 text-purple-800 border-purple-200",
    "tu_van": "bg-orange-100 text-orange-800 border-orange-200",
    "khac": "bg-gray-100 text-gray-800 border-gray-200"
  };
  
  return workTypeColors[kindWork] || workTypeColors["khac"];
};

export const getWorkTypeName = (kindWork) => {
  const workTypeNames = {
    "sua_chua": "Sửa chữa",
    "lap_dat": "Lắp đặt", 
    "bao_tri": "Bảo trì",
    "khao_sat": "Khảo sát",
    "tu_van": "Tư vấn",
    "khac": "Khác"
  };
  
  return workTypeNames[kindWork] || "Khác";
};

export const getStatusColor = (status) => {
  const statusColors = {
    "pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "in_progress": "bg-blue-100 text-blue-800 border-blue-200",
    "completed": "bg-green-100 text-green-800 border-green-200",
    "cancelled": "bg-red-100 text-red-800 border-red-200",
    "unassigned": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "assigned": "bg-green-100 text-green-800 border-green-200"
  };
  
  return statusColors[status] || statusColors["pending"];
};

export const getStatusName = (status) => {
  const statusNames = {
    "pending": "Chờ xử lý",
    "in_progress": "Đang thực hiện", 
    "completed": "Hoàn thành",
    "cancelled": "Đã hủy",
    "unassigned": "Chưa phân công",
    "assigned": "Đã phân công"
  };
  
  return statusNames[status] || "Chờ xử lý";
};
