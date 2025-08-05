# Real-time Canvas Application

A collaborative real-time canvas application built with React, Socket.io, and Konva for real-time drawing and shape manipulation.

## Features

- **Real-time Collaboration**: Multiple users can interact with the canvas simultaneously
- **Dynamic Rectangle Creation**: Add rectangles with random colors and positions
- **Drag & Drop**: Move rectangles with real-time position updates across all clients
- **Live Synchronization**: All changes are broadcasted to all connected clients
## Features
- **Connection Status**: Visual indicator of socket connection status
- **User Connection status**: Visual indicator of user being online
- **User Meta Data**: Display of user socket id, name
- **Display Moving Name**: Showing name when user moving box
- **Rename User Name**: Ability to change user name

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd be
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd fe
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd be
   npm start
   ```
   The backend will run on `http://localhost:3001`

2. **Start the Frontend Development Server**
   ```bash
   cd fe
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open Multiple Browser Tabs**
   - Open `http://localhost:3000` in multiple browser tabs
   - Test real-time collaboration by adding and moving rectangles

## Project Structure

```
canvasApp/
├── be/                 # Backend (Node.js + Socket.io)
│   ├── app.js         # Express app with Socket.io setup
│   ├── bin/www        # Server startup script
│   └── package.json   # Backend dependencies
└── fe/                # Frontend (React + Konva)
    ├── src/
    │   ├── components/
    │   │   ├── Canvas.js           # Main canvas component
    │   │   └── AddRectangleButton.js # Add rectangle button
    │   ├── store/
    │   │   └── canvasStore.js      # Zustand state management
    │   └── App.js                  # Main app component
    └── package.json   # Frontend dependencies
```

## Socket Events

### Client to Server
- `rectangle:add` - Broadcast new rectangle creation
- `rectangle:move` - Broadcast rectangle position updates

### Server to Client
- `rectangle:add` - Receive new rectangle from other clients
- `rectangle:move` - Receive position updates from other clients

## Development

- Backend runs on port 3001
- Frontend runs on port 3000
- Socket.io handles real-time communication between clients
- Zustand manages client-side state
- React Konva provides canvas drawing capabilities

## Testing Real-time Features

1. Open `http://localhost:3000` in multiple browser tabs
2. Add rectangles in one tab - they should appear in all tabs
3. Drag rectangles in any tab - movement should sync across all tabs
4. Test connection by stopping/starting the backend server

## Error Handling

- Connection status is displayed in the UI
- Socket reconnection is handled automatically
- Graceful degradation when server is unavailable 
