import { useState } from 'react';

const JoinRoom = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    // Validate room ID format
    if (roomId.length < 4) {
      setError('Room ID must be at least 4 characters');
      return;
    }

    setIsJoining(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onJoinRoom(roomId.trim());
    } catch (err) {
      setError('Failed to join room. Please check the room ID and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Extract room ID from URL if pasted
      const match = text.match(/room\/([a-zA-Z0-9]+)/);
      if (match) {
        setRoomId(match[1]);
      } else {
        setRoomId(text.trim());
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Join Room</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Enter a room ID to join</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID or paste link"
              className="input-field pr-10"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              title="Paste from clipboard"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={isJoining || !roomId.trim()}
          className="w-full btn-secondary py-3 flex items-center justify-center gap-2"
        >
          {isJoining ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent"></div>
              Joining...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Join Room
            </>
          )}
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
        Ask the room creator for the room ID
      </p>
    </div>
  );
};

export default JoinRoom;