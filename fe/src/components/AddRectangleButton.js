import React from 'react';
import useCanvasStore from '../store/canvasStore';

const AddRectangleButton = () => {
  const { addRectangle, isConnected } = useCanvasStore();

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Main Button */}
        <button
          onClick={addRectangle}
          className={`
            w-16 h-16 rounded-2xl shadow-2xl
            transition-all duration-300 transform hover:scale-110 active:scale-95
            flex items-center justify-center
            ${isConnected
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25'
              : 'bg-gray-400 cursor-not-allowed shadow-gray-400/25'
            }
          `}
          disabled={!isConnected}
          title={isConnected ? 'Add Rectangle' : 'Connecting...'}
        >
          <svg
            className={`w-8 h-8 transition-all duration-200 ${
              isConnected ? 'text-white hover:rotate-90' : 'text-gray-300'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {/* Connection Status Indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}></div>

        {/* Tooltip */}
        {!isConnected && (
          <div className="absolute -top-12 right-0 bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Disconnected</span>
            </div>
            <div className="absolute top-full right-2 w-2 h-2 bg-red-500 transform rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRectangleButton; 