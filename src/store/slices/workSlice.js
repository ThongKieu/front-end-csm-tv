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
        // API response có cấu trúc: { success: true, message: "...", data: {...} }
        // Chỉ lấy phần data
        const data = action.payload?.data || action.payload;
        state.unassignedWorks = data;
        // Lưu vào cache với selectedDate
        state.cache.unassignedWorks[state.selectedDate] = {
          data: data,
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
        // API response có cấu trúc: { success: true, message: "...", data: {...} }
        // Chỉ lấy phần data
        const data = action.payload?.data || action.payload;
        state.assignedWorks = data;
        // Lưu vào cache với selectedDate
        state.cache.assignedWorks[state.selectedDate] = {
          data: data,
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
      })
      .addCase(assignWorker.fulfilled, (state, action) => {
        state.loading = false;
        // Clear cache sau khi assign worker để refresh data
        state.cache.assignedWorks = {};
        state.cache.unassignedWorks = {};
        state.error = null;
      })
      .addCase(assignWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
  clearWorkersCache
} = workSlice.actions;

// Selectors
export const selectAssignedWorks = (state) => state.work.assignedWorks;
export const selectUnassignedWorks = (state) => state.work.unassignedWorks;
export const selectWorkers = (state) => state.work.workers;
export const selectSelectedDate = (state) => state.work.selectedDate;
export const selectLoading = (state) => state.work.loading;
export const selectError = (state) => state.work.error;

export default workSlice.reducer; 