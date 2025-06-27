import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Lưu token vào cả cookie và localStorage
export const saveAuthData = (token, user) => {
  try {
    // Lưu vào cookie (cho SSR)
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
    
    // Lưu vào localStorage (cho client-side)
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
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
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
};

// Xóa tất cả dữ liệu authentication
export const clearAuthData = () => {
  try {
    Cookies.remove('token');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Kiểm tra token có hợp lệ không
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
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
    const token = getAuthToken();
    const user = getAuthUser();
    
    if (token && user && isTokenValid(token)) {
      return { token, user };
    }
    
    // Nếu token không hợp lệ, xóa dữ liệu cũ
    if (token && !isTokenValid(token)) {
      clearAuthData();
    }
    
    return null;
  } catch (error) {
    console.error('Error restoring auth state:', error);
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