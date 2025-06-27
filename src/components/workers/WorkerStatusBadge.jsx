import { CheckCircle2, XCircle } from "lucide-react";

export default function WorkerStatusBadge({ status, showIcon = false }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 1:
        return {
          text: "Đang hoạt động",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: showIcon ? <CheckCircle2 className="mr-1 w-4 h-4" /> : null
        };
      case 0:
        return {
          text: "Không hoạt động",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: showIcon ? <XCircle className="mr-1 w-4 h-4" /> : null
        };
      default:
        return {
          text: "Không xác định",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: null
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.icon}
      {config.text}
    </span>
  );
} 