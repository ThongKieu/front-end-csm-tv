import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSchedule } from "@/contexts/ScheduleContext";
import { clearCacheForDate } from "@/store/slices/workSlice";
import axios from "axios";
import { API_URLS } from "@/config/constants";

export const useJobOperations = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(state => state.work.selectedDate);
  const { refreshData: scheduleRefreshData } = useSchedule();
  const auth = useSelector((state) => state.auth);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedWorkId, setCopiedWorkId] = useState(null);

  // Copy job to clipboard
  const handleCopy = useCallback(async (job) => {
    try {
      if (!job) {
        console.error("No job data provided to copy");
        return;
      }

      const copyContent = `Công việc: ${
        job.work_content || job.job_content || "Không có nội dung"
      }
Khách hàng: ${job.name_cus || job.job_customer_name || "Chưa có thông tin"}
SĐT: ${job.phone_number || job.job_customer_phone || "Chưa có thông tin"}
Địa chỉ: ${job.street || job.job_customer_address || "Chưa có thông tin"}
Ngày: ${job.date_book || job.job_appointment_date || "Chưa có thông tin"}
Ghi chú: ${job.work_note || job.job_customer_note || "Không có"}`;

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(copyContent);
        setCopiedWorkId(job.id);
        setTimeout(() => setCopiedWorkId(null), 2000);
      } else {
        console.error("Clipboard API not available");
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, []);

  // Refresh data after operations
  const refreshData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      if (selectedDate) {
        await scheduleRefreshData(selectedDate);
        dispatch(clearCacheForDate(selectedDate));
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDate, scheduleRefreshData, dispatch]);

  // Update job
  const updateJob = useCallback(async (jobData) => {
    try {
      setIsRefreshing(true);
      const data = {
        ...jobData,
        auth_id: auth.user.id,
        date_book: selectedDate,
        from_cus: jobData.from_cus || 0,
        status_cus: jobData.status_cus || 0,
        kind_work: jobData.kind_work || 0,
      };
      
      await axios.post(API_URLS.JOB_UPDATE, data);
      await refreshData();
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [auth.user.id, selectedDate, refreshData]);

  return {
    isRefreshing,
    copiedWorkId,
    handleCopy,
    refreshData,
    updateJob,
  };
};
