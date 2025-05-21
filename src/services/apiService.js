import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://csm.thoviet.net', // Gốc API của bạn
  timeout: 10000, // timeout 10 giây
});

// Hàm gọi API search khách cũ
export const getOldCustomers = async (searchKey) => {
  const response = await apiClient.get('/api/web/old-cus-search', {
    params: { search_key: searchKey },
  });
  return response.data; // trả về kết quả dữ liệu response
};