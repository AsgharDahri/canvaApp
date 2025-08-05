const { Server } = require('socket.io');

class SocketHandler {
  constructor(server, options = {}) {
    this.io = new Server(server, {
      cors: {
        origin: options.corsOrigin || "http://localhost:3000",
        methods: options.corsMethods || ["GET", "POST"]
      }
    });
    
    this.connectedUsers = new Map(); // Store connected users with their names
    this.userCounter = Math.floor(Math.random() * 10000); // Random starting point
    this.setupSocketEvents();
  }

  setupSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      
      // Generate a truly unique user ID using timestamp and random components
      this.userCounter++;
      const uniqueUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const defaultName = `User-${this.userCounter}`;
      
      // Store user information with unique ID as the key
      this.connectedUsers.set(uniqueUserId, {
        id: uniqueUserId,
        socketId: socket.id,
        name: defaultName,
        isOnline: true,
        connectedAt: new Date()
      });

      console.log(`Created user: ${defaultName} (${uniqueUserId}) with socket: ${socket.id}`);
      console.log(`Total connected users: ${this.connectedUsers.size}`);

      // Send current user info to the newly connected user
      socket.emit('user:info', {
        id: uniqueUserId,
        socketId: socket.id,
        name: defaultName
      });

      // Send updated users list to all clients
      this.emitUsersList();

      // Handle user name change
      socket.on('user:rename', (data) => {
        // Find user by socket ID since that's what we have in the event
        const user = Array.from(this.connectedUsers.values()).find(u => u.socketId === socket.id);
        if (user) {
          console.log(`User ${user.name} renamed to: ${data.name}`);
          user.name = data.name;
          this.connectedUsers.set(user.id, user);
          
          // Notify all clients about the name change
          this.io.emit('user:updated', {
            id: user.id,
            socketId: socket.id,
            name: data.name
          });
          
          this.emitUsersList();
        }
      });

      // Handle rectangle addition
      socket.on('rectangle:add', (rectangleData) => {
        console.log('Rectangle added by:', socket.id);
        const user = Array.from(this.connectedUsers.values()).find(u => u.socketId === socket.id);
        const dataWithUser = {
          ...rectangleData,
          userId: user ? user.id : 'unknown',
          socketId: socket.id,
          userName: user ? user.name : 'Unknown User'
        };
        socket.broadcast.emit('rectangle:add', dataWithUser);
      });

      // Handle rectangle movement
      socket.on('rectangle:move', (moveData) => {
        console.log('Rectangle moved by:', socket.id);
        const user = Array.from(this.connectedUsers.values()).find(u => u.socketId === socket.id);
        const dataWithUser = {
          ...moveData,
          userId: user ? user.id : 'unknown',
          socketId: socket.id,
          userName: user ? user.name : 'Unknown User'
        };
        socket.broadcast.emit('rectangle:move', dataWithUser);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find and remove user by socket ID
        const userToRemove = Array.from(this.connectedUsers.values()).find(u => u.socketId === socket.id);
        if (userToRemove) {
          console.log(`Removing user: ${userToRemove.name} (${userToRemove.id})`);
          this.connectedUsers.delete(userToRemove.id);
        }
        console.log(`Total connected users after disconnect: ${this.connectedUsers.size}`);
        this.emitUsersList();
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  // Method to emit updated users list to all clients
  emitUsersList() {
    const usersList = Array.from(this.connectedUsers.values()).map(user => ({
      id: user.id,
      socketId: user.socketId,
      name: user.name,
      isOnline: user.isOnline,
      connectedAt: user.connectedAt
    }));
    console.log(`Emitting users list with ${usersList.length} users:`, usersList.map(u => u.name));
    this.io.emit('users:list', usersList);
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

  // Method to get connected users
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }
}

module.exports = SocketHandler; 