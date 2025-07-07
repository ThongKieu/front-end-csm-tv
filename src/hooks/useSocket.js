import { useEffect, useCallback } from 'react';
import { useSocketContext } from '@/providers/SocketProvider';

export const useSocket = (event, callback) => {
  const socketService = useSocketContext();

  useEffect(() => {
    // Kiểm tra socket service có tồn tại không
    if (!socketService) {
      console.log('Socket service not available');
      return;
    }

    // Kiểm tra socket có được enable không
    if (!socketService.isSocketEnabled) {
      console.log('Socket is temporarily disabled');
      return;
    }

    // Subscribe to event
    if (event && callback) {
      try {
        socketService.on(event, callback);
      } catch (error) {
        console.error('Error setting up socket event listener:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (event && callback && socketService && socketService.isSocketEnabled) {
        try {
          socketService.off(event, callback);
        } catch (error) {
          console.error('Error cleaning up socket event listener:', error);
        }
      }
    };
  }, [event, callback, socketService]);

  const emit = useCallback((event, data) => {
    if (socketService && socketService.isSocketEnabled) {
      try {
        socketService.emit(event, data);
      } catch (error) {
        console.error('Error emitting socket event:', error);
      }
    } else {
      console.log('Socket not available for emitting event:', event);
    }
  }, [socketService]);

  return { emit };
}; 