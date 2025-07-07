import { io } from 'socket.io-client';

console.log('SOCKET_URL env:', process.env.NEXT_PUBLIC_SOCKET_URL);
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
console.log('SOCKET_URL used:', SOCKET_URL);

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 3; // Giảm số lần thử kết nối
    this.isSocketEnabled = false; // Flag để kiểm soát việc sử dụng socket
  }

  connect() {
    try {
      // Tạm thời disable socket để tránh lỗi timeout
      console.log('Socket temporarily disabled to avoid timeout errors');
      this.isSocketEnabled = false;
      return null;
      
      // Code cũ (comment lại để sau này dùng):
      /*
      if (!this.socket) {
        console.log('Attempting to connect to socket at:', SOCKET_URL);
        
        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: this.maxConnectionAttempts,
          reconnectionDelay: 1000,
          withCredentials: true,
          secure: SOCKET_URL.startsWith('https'),
          rejectUnauthorized: false,
          path: '/socket.io/',
          extraHeaders: {
            'Access-Control-Allow-Origin': '*'
          },
          timeout: 5000 // Thêm timeout ngắn hơn
        });

        this.socket.on('connect', () => {
          console.log('Socket connected successfully');
          this.isConnected = true;
          this.connectionAttempts = 0;
          this.isSocketEnabled = true;
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.isConnected = false;
          this.connectionAttempts++;
          
          if (this.connectionAttempts >= this.maxConnectionAttempts) {
            console.error('Max connection attempts reached. Socket connection failed.');
            this.isSocketEnabled = false;
          }
        });

        this.socket.on('disconnect', () => {
          console.log('Socket disconnected');
          this.isConnected = false;
          this.isSocketEnabled = false;
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
        });
      }
      return this.socket;
      */
    } catch (error) {
      console.error('Error creating socket connection:', error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.isSocketEnabled = false;
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected && this.isSocketEnabled) {
      try {
        this.socket.emit(event, data);
      } catch (error) {
        console.error('Error emitting socket event:', error);
      }
    } else {
      console.log('Socket not available, skipping emit:', event);
    }
  }

  on(event, callback) {
    if (this.socket && this.isSocketEnabled) {
      try {
        this.socket.on(event, callback);
      } catch (error) {
        console.error('Error adding socket event listener:', error);
      }
    } else {
      console.log('Socket not available, skipping event listener:', event);
    }
  }

  off(event, callback) {
    if (this.socket && this.isSocketEnabled) {
      try {
        this.socket.off(event, callback);
      } catch (error) {
        console.error('Error removing socket event listener:', error);
      }
    }
  }

  // Getter để kiểm tra trạng thái kết nối
  get connected() {
    return this.isConnected && this.socket && this.isSocketEnabled;
  }
}

export const socketService = new SocketService(); 