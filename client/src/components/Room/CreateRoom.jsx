import { useState } from 'react';

const CreateRoom = ({ onRoomCreated }) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    
    try {
      // Generate a random room ID
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let roomId = '';
      for (let i = 0; i < 8; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onRoomCreated(roomId);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Create New Room</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Start a new coding session</p>
        </div>
      </div>

      <button
        onClick={handleCreateRoom}
        disabled={isCreating}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2"
      >
        {isCreating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Creating...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Room
          </>
        )}
      </button>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
        A unique room ID will be generated for you to share
      </p>
    </div>
  );
};

export default CreateRoom;