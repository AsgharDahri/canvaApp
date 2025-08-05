import React, { useState } from 'react';
import useCanvasStore from '../store/canvasStore';

const UsersList = () => {
  const { connectedUsers, currentUser, renameUser } = useCanvasStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');

  const handleRename = () => {
    if (newName.trim()) {
      renameUser(newName.trim());
      setIsRenaming(false);
      setNewName('');
    }
  };

  const startRenaming = () => {
    setNewName(currentUser?.name || '');
    setIsRenaming(true);
  };

  const cancelRenaming = () => {
    setIsRenaming(false);
    setNewName('');
  };

  const formatConnectionTime = (connectedAt) => {
    if (!connectedAt) return '';
    const date = new Date(connectedAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span>Connected Users ({connectedUsers.length})</span>
        </h3>
      </div>

      <div className="space-y-3">
        {connectedUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              user.id === currentUser?.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                user.id === currentUser?.id
                  ? 'bg-blue-500'
                  : 'bg-gray-500'
              }`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    user.id === currentUser?.id ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {user.name}
                  </span>
                  {user.id === currentUser?.id && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">
                    Online • {formatConnectionTime(user.connectedAt)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  ID: {user.id.slice(-8)}
                </div>
              </div>
            </div>

            {user.id === currentUser?.id && !isRenaming && (
              <button
                onClick={startRenaming}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Rename
              </button>
            )}

            {user.id === currentUser?.id && isRenaming && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                  className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter new name"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={cancelRenaming}
                  className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {connectedUsers.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p className="text-sm">No users connected</p>
        </div>
      )}
    </div>
  );
};

export default UsersList; 