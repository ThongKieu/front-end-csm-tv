import { CheckCircle2, XCircle } from "lucide-react";

export default function WorkerStatusBadge({ status, showIcon = false }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 1:
        return {
          text: "Đang hoạt động",
          bgColor: "bg-brand-green/10",
          textColor: "text-brand-green",
          icon: showIcon ? <CheckCircle2 className="mr-1 w-4 h-4" /> : null
        };
      case 0:
        return {
          text: "Không hoạt động",
          bgColor: "bg-brand-yellow/10",
          textColor: "text-brand-yellow",
          icon: showIcon ? <XCircle className="mr-1 w-4 h-4" /> : null
        };
      default:
        return {
          text: "Không xác định",
          bgColor: "bg-brand-yellow/10",
          textColor: "text-brand-yellow",
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