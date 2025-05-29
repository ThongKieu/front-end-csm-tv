import { useEffect, useCallback } from 'react';
import { useSocketContext } from '@/providers/SocketProvider';

export const useSocket = (event, callback) => {
  const socketService = useSocketContext();

  useEffect(() => {
    // Subscribe to event
    if (event && callback) {
      socketService.on(event, callback);
    }

    // Cleanup on unmount
    return () => {
      if (event && callback) {
        socketService.off(event, callback);
      }
    };
  }, [event, callback, socketService]);

  const emit = useCallback((event, data) => {
    socketService.emit(event, data);
  }, [socketService]);

  return { emit };
}; 