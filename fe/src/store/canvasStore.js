import { create } from 'zustand';
import { io } from 'socket.io-client';

const useCanvasStore = create((set, get) => ({
  rectangles: [],
  socket: null,
  isConnected: false,
  currentUser: null,
  connectedUsers: [],
  movingRectangle: null, // Track which rectangle is being moved and by whom
  
  initializeSocket: () => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3050');
    
    socket.on('connect', () => {
      console.log('Frontend connected with socket ID:', socket.id);
      set({ isConnected: true, socket });
    });
    
    socket.on('disconnect', () => {
      console.log('Frontend disconnected');
      set({ isConnected: false });
    });

    // Handle user info when connecting
    socket.on('user:info', (userInfo) => {
      console.log('Received user info:', userInfo);
      set({ currentUser: userInfo });
    });

    // Handle users list updates
    socket.on('users:list', (usersList) => {
      console.log('Received users list:', usersList);
      set({ connectedUsers: usersList });
    });

    // Handle user updates (name changes)
    socket.on('user:updated', (userUpdate) => {
      console.log('User updated:', userUpdate);
      set((state) => ({
        connectedUsers: state.connectedUsers.map(user => 
          user.id === userUpdate.id 
            ? { ...user, name: userUpdate.name }
            : user
        ),
        // Update current user if it's the current user
        currentUser: state.currentUser?.id === userUpdate.id 
          ? { ...state.currentUser, name: userUpdate.name }
          : state.currentUser
      }));
    });
    
    socket.on('rectangle:add', (rectangleData) => {
      console.log('Rectangle added:', rectangleData);
      set((state) => ({
        rectangles: [...state.rectangles, rectangleData]
      }));
    });
    
    socket.on('rectangle:move', (moveData) => {
      console.log('Rectangle moved:', moveData);
      set((state) => ({
        rectangles: state.rectangles.map(rect => 
          rect.id === moveData.id 
            ? { ...rect, x: moveData.x, y: moveData.y }
            : rect
        ),
        movingRectangle: {
          id: moveData.id,
          userName: moveData.userName,
          userId: moveData.userId,
          timestamp: Date.now()
        }
      }));

      // Clear the moving rectangle indicator after 3 seconds
      setTimeout(() => {
        set({ movingRectangle: null });
      }, 3000);
    });
  },

  // Rename current user
  renameUser: (newName) => {
    const { socket } = get();
    if (socket) {
      console.log('Renaming user to:', newName);
      socket.emit('user:rename', { name: newName });
    }
  },
  
  addRectangle: () => {
    const { socket, currentUser } = get();
    const newRectangle = {
      id: `rect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      width: 100,
      height: 80,
      fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
      userId: currentUser?.id,
      socketId: currentUser?.socketId,
      userName: currentUser?.name
    };
    
    console.log('Adding rectangle:', newRectangle);
    set((state) => ({
      rectangles: [...state.rectangles, newRectangle]
    }));
    
    if (socket) {
      socket.emit('rectangle:add', newRectangle);
    }
  },
  
  moveRectangle: (id, x, y) => {
    const { socket, currentUser } = get();
    
    console.log('Moving rectangle:', id, 'by user:', currentUser?.name);
    set((state) => ({
      rectangles: state.rectangles.map(rect => 
        rect.id === id ? { ...rect, x, y } : rect
      )
    }));
    
    if (socket) {
      socket.emit('rectangle:move', { 
        id, 
        x, 
        y,
        userId: currentUser?.id,
        socketId: currentUser?.socketId,
        userName: currentUser?.name
      });
    }
  },
  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, isConnected: false });
  }
}));

export default useCanvasStore; 