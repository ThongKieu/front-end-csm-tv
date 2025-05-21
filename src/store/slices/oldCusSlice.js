import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { getOldCustomers } from '@/services/apiService';
export const searchOldCustomers = createAsyncThunk(
  'customers/searchOld',
  async (searchKey, thunkAPI) => {
    const data = await getOldCustomers(searchKey);
    return data;
  }
);
const initialState = {
  customerOld: [],        // danh sách khách cũ
  searchKeyword: '',      // từ khóa tìm kiếm
  filteredCustomer: [],   // danh sách khách sau filter
}
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerOld: (state, action) => {
      state.customerOld = action.payload;
      state.filteredCustomer = action.payload; // ban đầu là toàn bộ
    },
    setSearchKeyword: (state, action) => {
      const keyword = action.payload.toLowerCase();
      state.searchKeyword = action.payload;
      // filter dựa theo keyword
      state.filteredCustomer = state.customerOld.filter(cust =>
        cust.name?.toLowerCase().includes(keyword) ||
        cust.phone?.toLowerCase().includes(keyword) ||
        cust.address?.toLowerCase().includes(keyword)
      );
    },
  },
})

export const { setCustomerOld, setSearchKeyword } = customerSlice.actions;
export default customerSlice.reducer;