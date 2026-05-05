import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket = null;

export function initSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    socket.on('connect', () =>
      console.log('[Socket] Connected:', socket.id)
    );
    socket.on('connect_error', (err) =>
      console.error('[Socket] Error:', err.message)
    );
    socket.on('disconnect', (reason) =>
      console.warn('[Socket] Disconnected:', reason)
    );
  }
  return socket;
}

export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}