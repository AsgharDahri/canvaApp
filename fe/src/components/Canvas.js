import React, { useEffect } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import useCanvasStore from '../store/canvasStore';
import UsersList from './UsersList';

const Canvas = () => {
  const { 
    rectangles, 
    isConnected, 
    initializeSocket, 
    disconnectSocket,
    moveRectangle,
    movingRectangle,
    currentUser
  } = useCanvasStore();

  useEffect(() => {
    initializeSocket();
    return () => {
      disconnectSocket();
    };
  }, [initializeSocket, disconnectSocket]);

  const handleDragMove = (id, e) => {
    const { x, y } = e.target.position();
    moveRectangle(id, x, y);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Collaborative Canvas
                  </h1>
                  <p className="text-sm text-gray-500">Real-time drawing experience</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Current User Info */}
              {currentUser && (
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200/50">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{currentUser.name}</span>
                </div>
              )}
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200/50">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="text-gray-700 font-medium">{rectangles.length}</span>
                  <span className="text-gray-500">shapes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Users List Sidebar */}
            <div className="lg:col-span-1">
              <UsersList />
            </div>

            {/* Canvas Container */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Canvas Workspace</h2>
                    <div className="text-sm text-gray-500">
                      Drag shapes to move • Real-time collaboration
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Stage 
                    width={window.innerWidth - 96} 
                    height={window.innerHeight - 200}
                    className="bg-gradient-to-br from-gray-50 to-gray-100"
                  >
                    <Layer>
                      {rectangles.map((rect) => (
                        <React.Fragment key={rect.id}>
                          <Rect
                            x={rect.x}
                            y={rect.y}
                            width={rect.width}
                            height={rect.height}
                            fill={rect.fill}
                            stroke="#4B5563"
                            strokeWidth={2}
                            draggable
                            onDragMove={(e) => handleDragMove(rect.id, e)}
                            shadowBlur={10}
                            shadowColor="rgba(0,0,0,0.2)"
                            cornerRadius={8}
                            opacity={0.95}
                          />
                          {/* Show user name when rectangle is being moved */}
                          {movingRectangle && movingRectangle.id === rect.id && (
                            <Text
                              x={rect.x}
                              y={rect.y - 30}
                              text={`${movingRectangle.userName} is moving this shape`}
                              fontSize={12}
                              fill="#1F2937"
                              fontFamily="Inter, sans-serif"
                              padding={6}
                              background="#FEF3C7"
                              cornerRadius={6}
                              shadowBlur={4}
                              shadowColor="rgba(0,0,0,0.1)"
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </Layer>
                  </Stage>
                  
                  {/* Canvas Overlay Info */}
                  {rectangles.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-lg font-medium">Empty Canvas</p>
                        <p className="text-sm">Click "Add Rectangle" to start creating</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas; 