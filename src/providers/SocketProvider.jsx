import { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '@/utils/socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    try {
      // Tạm thời không kết nối socket để tránh lỗi timeout
      console.log('Socket provider initialized (socket disabled)');
      setIsSocketReady(true);
      
      // Code cũ (comment lại để sau này dùng):
      /*
      // Connect to socket when provider mounts
      const socket = socketService.connect();
      
      if (socket) {
        // Đợi socket kết nối thành công
        const checkConnection = () => {
          if (socketService.connected) {
            setIsSocketReady(true);
          } else {
            // Thử lại sau 1 giây nếu chưa kết nối
            setTimeout(checkConnection, 1000);
          }
        };
        
        checkConnection();
      }
      */
    } catch (error) {
      console.error('Error initializing socket provider:', error);
      setIsSocketReady(true); // Vẫn set ready để app không bị lỗi
    }

    // Cleanup on unmount
    return () => {
      try {
        socketService.disconnect();
      } catch (error) {
        console.error('Error disconnecting socket:', error);
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketService}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
}; 