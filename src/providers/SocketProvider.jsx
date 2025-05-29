import { createContext, useContext, useEffect } from 'react';
import { socketService } from '@/utils/socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Connect to socket when provider mounts
    const socket = socketService.connect();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
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