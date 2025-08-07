import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Lưu token vào cả cookie và localStorage
export const saveAuthData = (token, user) => {
  try {
    console.log('saveAuthData: Lưu authentication data...')
    console.log('saveAuthData: Token:', token ? 'Có' : 'Không')
    console.log('saveAuthData: User:', user ? 'Có' : 'Không')
    console.log('saveAuthData: Token value:', token)
    console.log('saveAuthData: User value:', user)
    
    // Lưu vào cookie (cho SSR và middleware)
    if (token) {
      Cookies.set('token', token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax',
        path: '/'
      });
    }
    
    // Lưu vào localStorage (cho client-side)
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    
    console.log('saveAuthData: Đã lưu thành công vào localStorage và cookie')
    console.log('saveAuthData: Kiểm tra localStorage sau khi lưu:')
    if (typeof window !== 'undefined') {
      console.log('saveAuthData: - auth_token:', localStorage.getItem(TOKEN_KEY))
      console.log('saveAuthData: - auth_user:', localStorage.getItem(USER_KEY))
    }
    console.log('saveAuthData: - cookie token:', Cookies.get('token'))
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

// Lấy token từ localStorage (ưu tiên) hoặc cookie
export const getAuthToken = () => {
  try {
    // Thử lấy từ localStorage trước
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) {
      return localToken;
    }
    
    // Fallback về cookie
    return Cookies.get('token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Lấy thông tin user từ localStorage
export const getAuthUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    // Kiểm tra nếu userStr là "undefined" hoặc null hoặc rỗng
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error getting auth user:', error);
    // Xóa dữ liệu hỏng
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

// Xóa tất cả dữ liệu authentication
export const clearAuthData = () => {
  try {
    console.log('clearAuthData: Xóa tất cả dữ liệu authentication...')
    
    // Xóa cookie
    Cookies.remove('token', { path: '/' });
    
    // Xóa localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    
    console.log('clearAuthData: Đã xóa thành công')
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Xóa dữ liệu authentication bị hỏng
export const clearCorruptedAuthData = () => {
  try {
    // Xóa tất cả dữ liệu authentication
    clearAuthData();
    console.log('Cleared corrupted authentication data');
  } catch (error) {
    console.error('Error clearing corrupted auth data:', error);
  }
};

// Kiểm tra token có hợp lệ không
export const isTokenValid = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  try {
    // Kiểm tra format JWT (3 phần được phân tách bởi dấu chấm)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    // Kiểm tra thời gian hết hạn
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Khôi phục trạng thái authentication
export const restoreAuthState = () => {
  try {
    console.log('restoreAuthState: Bắt đầu khôi phục...')
    
    // Kiểm tra xem localStorage có sẵn sàng không
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('restoreAuthState: localStorage không sẵn sàng')
      return null;
    }
    
    const token = getAuthToken();
    const user = getAuthUser();
    
    console.log('restoreAuthState: Token từ storage:', token ? 'Có' : 'Không')
    console.log('restoreAuthState: User từ storage:', user ? 'Có' : 'Không')
    
    // Kiểm tra nếu có token và user hợp lệ
    if (token && user && isTokenValid(token)) {
      console.log('restoreAuthState: Token và user hợp lệ, khôi phục thành công')
      return { token, user };
    }
    
    console.log('restoreAuthState: Token hoặc user không hợp lệ')
    console.log('restoreAuthState: Token valid:', token ? isTokenValid(token) : false)
    
    // Nếu có token nhưng không hợp lệ hoặc không có user, xóa dữ liệu cũ
    if (token && (!isTokenValid(token) || !user)) {
      console.log('restoreAuthState: Xóa dữ liệu authentication cũ')
      clearAuthData();
    }
    
    return null;
  } catch (error) {
    console.error('Error restoring auth state:', error);
    // Xóa dữ liệu hỏng khi có lỗi
    clearAuthData();
    return null;
  }
};

// Lắng nghe thay đổi localStorage giữa các tab
export const setupAuthListener = (callback) => {
  const handleStorageChange = (e) => {
    if (e.key === TOKEN_KEY || e.key === USER_KEY) {
      callback();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}; 