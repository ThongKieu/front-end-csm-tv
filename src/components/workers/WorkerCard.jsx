import { Phone, MapPin, User, Briefcase, Edit, Trash2 } from "lucide-react";
import WorkerStatusBadge from "./WorkerStatusBadge";

export default function WorkerCard({ worker, onViewDetails, onEdit, onDelete, formatCurrency }) {
  return (
    <div className="p-5 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-green to-brand-yellow flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900">
                {worker.worker_full_name}
              </h3>
              <WorkerStatusBadge status={worker.worker_status} />
            </div>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">#</span>
                {worker.worker_code}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {worker.worker_phone_company}
              </div>
              {worker.worker_address && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {worker.worker_address}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium text-gray-900">
              {formatCurrency(worker.worker_daily_sales)}
            </div>
            <div className="text-sm text-gray-500">
              {formatCurrency(worker.worker_daily_o_t_by_hour)}/giờ
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onViewDetails(worker)}
              className="text-sm text-brand-green hover:text-brand-green/80 font-medium"
            >
              Xem chi tiết
            </button>
            <button
              onClick={() => onEdit(worker)}
              className="p-2 text-brand-green hover:text-brand-green/80 rounded-full hover:bg-brand-green/10"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onDelete(worker)}
              className="p-2 text-brand-yellow hover:text-brand-yellow/80 rounded-full hover:bg-brand-yellow/10"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <Briefcase className="mr-1.5 h-5 w-5 text-gray-400" />
            {worker.work_count} công việc
          </div>
          {worker.account && (
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                worker.account.is_online 
                  ? "bg-brand-green/10 text-brand-green" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {worker.account.is_online ? "Online" : "Offline"}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                worker.account.ready_to_work 
                  ? "bg-brand-green/10 text-brand-green" 
                  : "bg-brand-yellow/10 text-brand-yellow"
              }`}>
                {worker.account.ready_to_work ? "Sẵn sàng" : "Bận"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 