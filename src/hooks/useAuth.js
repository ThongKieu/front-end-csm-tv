import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  selectCurrentUser, 
  selectIsAuthenticated, 
  selectToken, 
  selectAuthLoading,
  logout 
} from '@/store/slices/authSlice';
import { clearAuthData } from '@/utils/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectAuthLoading);

  const handleLogout = () => {
    dispatch(logout());
    clearAuthData();
    router.push('/login');
  };

  const checkAuth = () => {
    return {
      user,
      isAuthenticated,
      token,
      isLoading
    };
  };

  return {
    user,
    isAuthenticated,
    token,
    isLoading,
    logout: handleLogout,
    checkAuth
  };
}; 