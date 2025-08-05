const { Server } = require('socket.io');

class SocketHandler {
  constructor(server, options = {}) {
    this.io = new Server(server, {
      cors: {
        origin: options.corsOrigin || "http://localhost:3000",
        methods: options.corsMethods || ["GET", "POST"]
      }
    });
    
    this.setupSocketEvents();
  }

  setupSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Handle rectangle addition
      socket.on('rectangle:add', (rectangleData) => {
        console.log('Rectangle added by:', socket.id);
        socket.broadcast.emit('rectangle:add', rectangleData);
      });

      // Handle rectangle movement
      socket.on('rectangle:move', (moveData) => {
        console.log('Rectangle moved by:', socket.id);
        socket.broadcast.emit('rectangle:move', moveData);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  // Method to get the io instance
  getIO() {
    return this.io;
  }

  // Method to emit to all clients
  emitToAll(event, data) {
    this.io.emit(event, data);
  }

  // Method to emit to all clients except sender
  emitToOthers(event, data) {
    this.io.broadcast.emit(event, data);
  }

  // Method to get connected clients count
  getConnectedClientsCount() {
    return this.io.engine.clientsCount;
  }
}

module.exports = SocketHandler; 