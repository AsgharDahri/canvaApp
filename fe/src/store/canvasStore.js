import { create } from 'zustand';
import { io } from 'socket.io-client';

const useCanvasStore = create((set, get) => ({
  rectangles: [],
  socket: null,
  isConnected: false,
  
  initializeSocket: () => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3050');
    
    socket.on('connect', () => {
      set({ isConnected: true, socket });
    });
    
    socket.on('disconnect', () => {
      set({ isConnected: false });
    });
    
    socket.on('rectangle:add', (rectangleData) => {
      set((state) => ({
        rectangles: [...state.rectangles, rectangleData]
      }));
    });
    
    socket.on('rectangle:move', (moveData) => {
      set((state) => ({
        rectangles: state.rectangles.map(rect => 
          rect.id === moveData.id 
            ? { ...rect, x: moveData.x, y: moveData.y }
            : rect
        )
      }));
    });
  },
  
  addRectangle: () => {
    const { socket } = get();
    const newRectangle = {
      id: `rect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      width: 100,
      height: 80,
      fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };
    
    set((state) => ({
      rectangles: [...state.rectangles, newRectangle]
    }));
    
    if (socket) {
      socket.emit('rectangle:add', newRectangle);
    }
  },
  
  moveRectangle: (id, x, y) => {
    const { socket } = get();
    
    set((state) => ({
      rectangles: state.rectangles.map(rect => 
        rect.id === id ? { ...rect, x, y } : rect
      )
    }));
    
    if (socket) {
      socket.emit('rectangle:move', { id, x, y });
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