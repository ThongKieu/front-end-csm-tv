import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAssignedWorksAPI, fetchUnassignedWorksAPI, fetchWorkersAPI, assignWorkerAPI, changeWorkerAPI } from '../../utils/api';

// Helper function để kiểm tra cache
const isCacheValid = (cacheData, expiryTime) => {
  if (!cacheData || !cacheData.timestamp) return false;
  const age = Date.now() - cacheData.timestamp;
  const isValid = age < expiryTime;
  return isValid;
};

// Helper function để kiểm tra cache

// Async thunks với Redux Toolkit's built-in deduplication
export const fetchAssignedWorks = createAsyncThunk(
  'work/fetchAssignedWorks',
  async (date, { getState, signal }) => {
    const state = getState();
    const cacheData = state.work.cache.assignedWorks[date];
    const expiryTime = state.work.cache.cacheExpiry;
    
    // Kiểm tra cache trước khi gọi API
    if (isCacheValid(cacheData, expiryTime)) {
      return cacheData.data;
    }

    const response = await fetchAssignedWorksAPI(date);
    return response.data;
  },
  {
    // Redux Toolkit's built-in deduplication
    condition: (date, { getState }) => {
      const state = getState();
      const cacheData = state.work.cache.assignedWorks[date];
      const expiryTime = state.work.cache.cacheExpiry;
      const currentSelectedDate = state.work.selectedDate;
      // Nếu ngày hiện tại khác với ngày được yêu cầu, luôn fetch
      if (date !== currentSelectedDate) {
        return true;
      }
      
      // Chỉ check cache nếu ngày trùng khớp
      if (isCacheValid(cacheData, expiryTime)) {
        return false;
      }
      return true;
    }
  }
);

export const fetchUnassignedWorks = createAsyncThunk(
  'work/fetchUnassignedWorks',
  async (date, { getState, signal }) => {
    const state = getState();
    const cacheData = state.work.cache.unassignedWorks[date];
    const expiryTime = state.work.cache.cacheExpiry;
    
    // Kiểm tra cache trước khi gọi API
    if (isCacheValid(cacheData, expiryTime)) {
      return cacheData.data;
    }
    const response = await fetchUnassignedWorksAPI(date);
    return response.data;
  },
  {
    // Redux Toolkit's built-in deduplication
    condition: (date, { getState }) => {
      const state = getState();
      const cacheData = state.work.cache.unassignedWorks[date];
      const expiryTime = state.work.cache.cacheExpiry;
      const currentSelectedDate = state.work.selectedDate;
      
      // Nếu ngày hiện tại khác với ngày được yêu cầu, luôn fetch
      if (date !== currentSelectedDate) {
        return true;
      }
      
      // Chỉ check cache nếu ngày trùng khớp
      if (isCacheValid(cacheData, expiryTime)) {
        return false;
      }
      return true;
    }
  }
);

export const fetchWorkers = createAsyncThunk(
  'work/fetchWorkers',
  async (jobData = null, { getState, signal }) => {
    const state = getState();
    const cacheKey = jobData ? JSON.stringify(jobData) : 'all';
    const cacheData = state.work.cache.workers[cacheKey];
    const expiryTime = state.work.cache.cacheExpiry;
    
    // Kiểm tra cache trước khi gọi API
    if (isCacheValid(cacheData, expiryTime)) {
      return cacheData.data;
    }
    const response = await fetchWorkersAPI(jobData);
    
    // Với API response mới, response trực tiếp là array
    if (Array.isArray(response)) {
      return response;
    }
    
    // Fallback: nếu response có data field (cũ)
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }    
    return [];
  },
  {
    // Redux Toolkit's built-in deduplication
    condition: (jobData, { getState }) => {
      const state = getState();
      const cacheKey = jobData ? JSON.stringify(jobData) : 'all';
      const cacheData = state.work.cache.workers[cacheKey];
      const expiryTime = state.work.cache.cacheExpiry;
      
      // Chỉ check cache, không check loading chung
      if (isCacheValid(cacheData, expiryTime)) {
        return false;
      }
      return true;
    }
  }
);

export const assignWorker = createAsyncThunk(
  'work/assignWorker',
  async (workData) => {
    const response = await assignWorkerAPI(workData);
    return response.data;
  }
);

export const changeWorker = createAsyncThunk(
  'work/changeWorker',
  async (workData) => {
    const response = await changeWorkerAPI(workData);
    return response.data;
  }
);

// Initial state
const today = new Date().toISOString().split('T')[0];

const initialState = {
  assignedWorks: [],
  unassignedWorks: [],
  workers: [],
  selectedDate: today,
  loading: false,
  error: null,
  // Cache system để tránh gọi API trùng lặp
  cache: {
    assignedWorks: {}, // { date: { data: [...], timestamp: number } }
    unassignedWorks: {}, // { date: { data: [...], timestamp: number } }
    workers: {}, // { jobDataKey: { data: [...], timestamp: number } }
    cacheExpiry: 1 * 60 * 1000, // Giảm xuống 1 phút để cập nhật thường xuyên hơn
  },
};

// Slice
const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      const newDate = action.payload;
      const oldDate = state.selectedDate;
      
      // Nếu ngày thay đổi, clear cache cho ngày cũ
      if (oldDate && oldDate !== newDate) {
        delete state.cache.assignedWorks[oldDate];
        delete state.cache.unassignedWorks[oldDate];
      }
      
      state.selectedDate = newDate;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetWorkState: (state) => {
      state.assignedWorks = [];
      state.unassignedWorks = [];
      state.workers = [];
      state.selectedDate = today;
      state.loading = false;
      state.error = null;
    },
    // Clear cache cho một ngày cụ thể
    clearCacheForDate: (state, action) => {
      const date = action.payload;
      const hadAssigned = !!state.cache.assignedWorks[date];
      const hadUnassigned = !!state.cache.unassignedWorks[date];
      
      delete state.cache.assignedWorks[date];
      delete state.cache.unassignedWorks[date];
    },
    
    // Thêm job mới vào Redux store
    addNewWork: (state, action) => {
      const { work, targetDate } = action.payload;
      try {
        // Đảm bảo unassignedWorks là object với categories
        if (!state.unassignedWorks || typeof state.unassignedWorks !== 'object') {
          state.unassignedWorks = {
            job_priority: [],
            job_normal: [],
            job_cancelled: [],
            job_no_answer: [],
            job_worker_return: []
          };
        }
        
        // Thêm vào category phù hợp dựa trên job_priority
        let targetCategory = 'job_normal'; // Mặc định
        
        if (work.job_priority === 'high') {
          targetCategory = 'job_priority';
        } else if (work.job_priority === 'medium') {
          targetCategory = 'job_normal';
        } else if (work.job_status === 'cancelled') {
          targetCategory = 'job_cancelled';
        } else if (work.job_status === 'no_answer') {
          targetCategory = 'job_no_answer';
        } else if (work.job_status === 'worker_return') {
          targetCategory = 'job_worker_return';
        }
        if (!state.unassignedWorks[targetCategory]) {
          state.unassignedWorks[targetCategory] = [];
        }
        
        // Thêm work vào category
        state.unassignedWorks[targetCategory].push(work);
        
        // Cập nhật cache nếu có
        if (targetDate && state.cache.unassignedWorks[targetDate]?.data) {
          const cacheData = state.cache.unassignedWorks[targetDate].data;
          if (typeof cacheData === 'object') {
            if (!cacheData[targetCategory]) {
              cacheData[targetCategory] = [];
            }
            cacheData[targetCategory].push(work);
          }
        }
        
      } catch (error) {
        console.error('❌ Error in addNewWork:', error);
      }
    },
    // Clear toàn bộ cache
    clearAllCache: (state) => {
      state.cache.assignedWorks = {};
      state.cache.unassignedWorks = {};
      state.cache.workers = {};
    },
    // Clear workers cache
    clearWorkersCache: (state) => {
      state.cache.workers = {};
    },
    // Cập nhật work trong danh sách - phiên bản đơn giản
    updateWorkInList: (state, action) => {
      const { workId, updatedData } = action.payload;
      try {
        // Đảm bảo assignedWorks và unassignedWorks là arrays hoặc objects
        if (!Array.isArray(state.assignedWorks) && typeof state.assignedWorks !== 'object') {
          state.assignedWorks = {};
        }
        
        if (!Array.isArray(state.unassignedWorks) && typeof state.unassignedWorks !== 'object') {
          state.unassignedWorks = {};
        }
        
        // Tìm và cập nhật trong assignedWorks (có thể là array hoặc object với categories)
        let foundInAssigned = false;
        if (Array.isArray(state.assignedWorks)) {
          for (let i = 0; i < state.assignedWorks.length; i++) {
            const work = state.assignedWorks[i];
            if (work && (work.id === workId || work.job_id === workId || work.work_id === workId)) {
              const updatedWork = { ...work, ...updatedData };
              state.assignedWorks[i] = updatedWork;
              foundInAssigned = true;
              break;
            }
          }
        } else if (state.assignedWorks && typeof state.assignedWorks === 'object') {
          // Nếu assignedWorks là object với categories, tìm trong từng category
          for (const categoryKey of Object.keys(state.assignedWorks)) {
            const category = state.assignedWorks[categoryKey];
            if (Array.isArray(category)) {
              for (let i = 0; i < category.length; i++) {
                const work = category[i];
                if (work && (work.id === workId || work.job_id === workId || work.work_id === workId)) {
                  state.assignedWorks[categoryKey][i] = { ...work, ...updatedData };
                  foundInAssigned = true;
                  break;
                }
              }
              if (foundInAssigned) break;
            }
          }
        }
        
        // Tìm và cập nhật trong unassignedWorks (có thể là array hoặc object với categories)
        let foundInUnassigned = false;
        let oldCategory = null;
        let workIndex = -1;
        
        if (Array.isArray(state.unassignedWorks)) {
          for (let i = 0; i < state.unassignedWorks.length; i++) {
            const work = state.unassignedWorks[i];
            if (work && (work.id === workId || work.job_id === workId || work.work_id === workId)) {
              const updatedWork = { ...work, ...updatedData };
              state.unassignedWorks[i] = updatedWork;
              foundInUnassigned = true;
              break;
            }
          }
        } else if (state.unassignedWorks && typeof state.unassignedWorks === 'object') {
          // Nếu unassignedWorks là object với categories, tìm trong từng category
          for (const categoryKey of Object.keys(state.unassignedWorks)) {
            const category = state.unassignedWorks[categoryKey];
            if (Array.isArray(category)) {
              for (let i = 0; i < category.length; i++) {
                const work = category[i];
                if (work && (work.id === workId || work.job_id === workId || work.work_id === workId)) {
                  oldCategory = categoryKey;
                  workIndex = i;
                  foundInUnassigned = true;
                  break;
                }
              }
              if (foundInUnassigned) break;
            }
          }
          
          // Nếu tìm thấy work, cập nhật và kiểm tra xem có cần di chuyển category không
          if (foundInUnassigned && oldCategory) {
            const work = state.unassignedWorks[oldCategory][workIndex];
            const updatedWork = { ...work, ...updatedData };
            
            // Xác định category mới dựa trên priority
            let newCategory = 'job_normal';
            if (updatedWork.job_priority === 'high') {
              newCategory = 'job_priority';
            } else if (updatedWork.job_priority === 'medium') {
              newCategory = 'job_normal';
            } else if (updatedWork.job_status === 'cancelled') {
              newCategory = 'job_cancelled';
            } else if (updatedWork.job_status === 'no_answer') {
              newCategory = 'job_no_answer';
            } else if (updatedWork.job_status === 'worker_return') {
              newCategory = 'job_worker_return';
            }
            
            // Nếu category thay đổi, di chuyển work
            if (oldCategory !== newCategory) {
              // Xóa khỏi category cũ
              state.unassignedWorks[oldCategory].splice(workIndex, 1);
              
              // Đảm bảo category mới tồn tại
              if (!state.unassignedWorks[newCategory]) {
                state.unassignedWorks[newCategory] = [];
              }
              
              // Thêm vào category mới
              state.unassignedWorks[newCategory].push(updatedWork);
            } else {
              // Cập nhật trong cùng category
              state.unassignedWorks[oldCategory][workIndex] = updatedWork;
            }
          }
        }
        
        
        // Cập nhật cache nếu có (xử lý cả array và object categories)
        const updateCacheData = (cacheData) => {
          if (!cacheData) return;
          
          if (Array.isArray(cacheData)) {
            for (let i = 0; i < cacheData.length; i++) {
              const work = cacheData[i];
              if (work && (work.id === workId || work.job_id === workId || work.work_id === workId)) {
                cacheData[i] = { ...work, ...updatedData };
              
                break;
              }
            }
          } else if (typeof cacheData === 'object') {
            Object.keys(cacheData).forEach(categoryKey => {
              const category = cacheData[categoryKey];
              if (Array.isArray(category)) {
                for (let i = 0; i < category.length; i++) {
                  const work = category[i];
                  if (work && (work.id === workId || work.job_id === workId || work.work_id === workId)) {
                    cacheData[categoryKey][i] = { ...work, ...updatedData };
                    break;
                  }
                }
              }
            });
          }
        };
        
        // Cập nhật assignedWorks cache
        if (state.cache.assignedWorks[state.selectedDate]?.data) {
          updateCacheData(state.cache.assignedWorks[state.selectedDate].data);
        }
        
        // Cập nhật unassignedWorks cache
        if (state.cache.unassignedWorks[state.selectedDate]?.data) {
          updateCacheData(state.cache.unassignedWorks[state.selectedDate].data);
        }
        
      } catch (error) {
        console.error('❌ Error in updateWorkInList:', error);
        // Không throw error để tránh crash app
      }
    },
  },
  extraReducers: (builder) => {
    // fetchUnassignedWorks
    builder
      .addCase(fetchUnassignedWorks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedWorks.fulfilled, (state, action) => {
        state.loading = false;
        // API response có thể có cấu trúc: { success: true, message: "...", data: {...} }
        // Hoặc trả về trực tiếp data
        let data = action.payload;
        
        // Nếu có cấu trúc { success, message, data }, lấy data
        if (data && typeof data === 'object' && 'data' in data) {
          data = data.data;
        }
        
        // Đảm bảo data là array hoặc object hợp lệ
        if (Array.isArray(data)) {
          state.unassignedWorks = data;
        } else if (data && typeof data === 'object') {
          state.unassignedWorks = data;
        } else {
          console.warn('⚠️ Invalid unassignedWorks data format:', data);
          state.unassignedWorks = [];
        }
        
        // Lưu vào cache với selectedDate
        state.cache.unassignedWorks[state.selectedDate] = {
          data: state.unassignedWorks,
          timestamp: Date.now()
        };
        state.error = null;
      })
      .addCase(fetchUnassignedWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // fetchAssignedWorks
    builder
      .addCase(fetchAssignedWorks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedWorks.fulfilled, (state, action) => {
        state.loading = false;
        // API response có thể có cấu trúc: { success: true, message: "...", data: {...} }
        // Hoặc trả về trực tiếp data
        let data = action.payload;
        
        // Nếu có cấu trúc { success, message, data }, lấy data
        if (data && typeof data === 'object' && 'data' in data) {
          data = data.data;
        }
        // Đảm bảo data là array hoặc object hợp lệ
        if (Array.isArray(data)) {
          state.assignedWorks = data;
        } else if (data && typeof data === 'object') {
          state.assignedWorks = data;
        } else {
          console.warn('⚠️ Invalid assignedWorks data format:', data);
          state.assignedWorks = [];
        }
        // Lưu vào cache với selectedDate
        state.cache.assignedWorks[state.selectedDate] = {
          data: state.assignedWorks,
          timestamp: Date.now()
        };
        state.error = null;
      })
      .addCase(fetchAssignedWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // fetchWorkers
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        // Đảm bảo workers luôn là array
        const workersData = Array.isArray(action.payload) ? action.payload : [];
        state.workers = workersData;
        
        // Lưu vào cache
        const cacheKey = action.meta.arg ? JSON.stringify(action.meta.arg) : 'all';
        state.cache.workers[cacheKey] = {
          data: workersData,
          timestamp: Date.now()
        };
        
        state.error = null;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // assignWorker
    builder
      .addCase(assignWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('🔄 assignWorker.pending: Starting worker assignment');
      })
      .addCase(assignWorker.fulfilled, (state, action) => {
        state.loading = false;
        // Clear cache sau khi assign worker để refresh data
        state.cache.assignedWorks = {};
        state.cache.unassignedWorks = {};
        state.error = null;
        console.log('✅ assignWorker.fulfilled: Cache cleared, data will be refreshed');
        console.log('✅ assignWorker.fulfilled: Response data:', action.payload);
      })
      .addCase(assignWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('❌ assignWorker.rejected:', action.error.message);
      });

    // changeWorker
    builder
      .addCase(changeWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeWorker.fulfilled, (state, action) => {
        state.loading = false;
        // Clear cache sau khi change worker để refresh data
        state.cache.assignedWorks = {};
        state.cache.unassignedWorks = {};
        state.error = null;
      })
      .addCase(changeWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { 
  setSelectedDate, 
  clearError, 
  resetWorkState, 
  clearCacheForDate, 
  clearAllCache,
  clearWorkersCache,
  updateWorkInList,
  addNewWork
} = workSlice.actions;

// Selectors
export const selectAssignedWorks = (state) => state.work.assignedWorks;
export const selectUnassignedWorks = (state) => state.work.unassignedWorks;
export const selectWorkers = (state) => state.work.workers;
export const selectSelectedDate = (state) => state.work.selectedDate;
export const selectLoading = (state) => state.work.loading;
export const selectError = (state) => state.work.error;

export default workSlice.reducer; 