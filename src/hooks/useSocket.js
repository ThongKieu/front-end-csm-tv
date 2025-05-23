import { useEffect, useCallback } from 'react';
import { socketService } from '@/utils/socket';

export const useSocket = (event, callback) => {
  useEffect(() => {
    // Connect to socket when component mounts
    const socket = socketService.connect();

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
  }, [event, callback]);

  const emit = useCallback((event, data) => {
    socketService.emit(event, data);
  }, []);

  return { emit };
}; 