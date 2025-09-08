import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const saveAuthData = (token, user) => {
  try {

    // Lưu vào localStorage (persistent)
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Lưu vào sessionStorage (temporary, cho performance)
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Lưu vào cookie (7 ngày) - backup
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    
    return true;
  } catch (error) {
    console.error('Error saving auth data:', error);
    return false;
  }
};

export const getAuthToken = () => {
  try {
    // Thử lấy từ sessionStorage trước
    let token = sessionStorage.getItem(TOKEN_KEY);
    if (token) return token;
    
    // Fallback về localStorage
    token = localStorage.getItem(TOKEN_KEY);
    if (token) return token;
    
    // Fallback về cookie
    return Cookies.get('token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getAuthUser = () => {
  try {
    // Thử lấy từ sessionStorage trước
    let user = sessionStorage.getItem(USER_KEY);
    if (user) return JSON.parse(user);
    
    // Fallback về localStorage
    user = localStorage.getItem(USER_KEY);
    if (user) return JSON.parse(user);
    
    // Fallback về cookie
    user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
};

export const getAuthData = () => {
  try {
    // Ưu tiên lấy từ sessionStorage trước
    let token = sessionStorage.getItem(TOKEN_KEY);
    let user = sessionStorage.getItem(USER_KEY);
    
    // Nếu không có trong sessionStorage, lấy từ localStorage
    if (!token) {
      token = localStorage.getItem(TOKEN_KEY);
    }
    if (!user) {
      user = localStorage.getItem(USER_KEY);
    }
    
    // Nếu vẫn không có, lấy từ cookie
    if (!token) {
      token = Cookies.get('token');
    }
    if (!user) {
      user = Cookies.get('user');
    }
    
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null
    };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return { token: null, user: null };
  }
};

export const clearAuthData = () => {
  try {
    // Xóa khỏi tất cả storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    Cookies.remove('token');
    Cookies.remove('user');
    
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

export const clearCorruptedAuthData = () => {
  try {
    clearAuthData();
    return true;
  } catch (error) {
    console.error('Error clearing corrupted auth data:', error);
    return false;
  }
};

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Kiểm tra token có phải JWT không
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Kiểm tra expiration
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

export const validateAndCleanAuthData = () => {
  try {
    const { token, user } = getAuthData();
    
    if (!token || !user) {
      clearAuthData();
      return false;
    }
    
    if (!isTokenValid(token)) {
      clearAuthData();
      return false;
    }
    
    return true;
  } catch (error) {
    clearAuthData();
    return false;
  }
};

export const restoreAuthState = () => {
  try {
    if (typeof window === 'undefined') {
      return { token: null, user: null };
    }
    
    const { token, user } = getAuthData();
    
    if (token && user && isTokenValid(token)) {
      return { token, user };
    } else {
      clearAuthData();
      return { token: null, user: null };
    }
  } catch (error) {
    clearAuthData();
    return { token: null, user: null };
  }
};

export const setupAuthListener = (callback) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Chỉ lắng nghe thay đổi từ tab khác, không phải từ cùng tab
  const handleStorageChange = (e) => {
    if (e.key === TOKEN_KEY || e.key === USER_KEY) {
      // Chỉ gọi callback nếu thay đổi từ tab khác
      if (e.newValue !== e.oldValue) {
        callback();
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}; 