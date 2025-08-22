import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAssignedWorksAPI, fetchUnassignedWorksAPI, fetchWorkersAPI, assignWorkerAPI, changeWorkerAPI } from '../../utils/api';

// Async thunks
export const fetchAssignedWorks = createAsyncThunk(
  'work/fetchAssignedWorks',
  async (date) => {
    const response = await fetchAssignedWorksAPI(date);
    return response.data;
  }
);

export const fetchUnassignedWorks = createAsyncThunk(
  'work/fetchUnassignedWorks',
  async (date) => {
    const response = await fetchUnassignedWorksAPI(date);
    return response.data;
  }
);

export const fetchWorkers = createAsyncThunk(
  'work/fetchWorkers',
  async () => {
    const response = await fetchWorkersAPI();
    return response.data;
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
};

// Slice
const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
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
        state.unassignedWorks = action.payload?.data || action.payload;
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
        state.assignedWorks = action.payload?.data || action.payload;
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
        state.workers = action.payload;
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
        state.error = null;
      })
      .addCase(changeWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedDate, clearError, resetWorkState } = workSlice.actions;

// Selectors
export const selectAssignedWorks = (state) => state.work.assignedWorks;
export const selectUnassignedWorks = (state) => state.work.unassignedWorks;
export const selectWorkers = (state) => state.work.workers;
export const selectSelectedDate = (state) => state.work.selectedDate;
export const selectLoading = (state) => state.work.loading;
export const selectError = (state) => state.work.error;

export default workSlice.reducer; 