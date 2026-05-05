import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const SocketProvider = ({ children }) => {
  const socketRef     = useRef(null);
  const listenersRef  = useRef(new Map());
  const { user }      = useAuth();

  const [connected,    setConnected]    = useState(false);
  const [users,        setUsers]        = useState([]);
  const [messages,     setMessages]     = useState([]);
  const [typingUsers,  setTypingUsers]  = useState({});
  const [roomSnapshot, setRoomSnapshot] = useState(null);

  // ── multi-file state ──────────────────────────────────────────────────────
  const [files,        setFiles]        = useState([]);   // [{id,name,content,language}]
  const [activeFileId, setActiveFileId] = useState(null);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    socket.on('connect',    () => { console.log('✅ Socket:', socket.id); setConnected(true);  });
    socket.on('disconnect', () => { console.log('❌ Disconnected');        setConnected(false); });
    socket.on('connect_error', (e) => console.error('❌', e.message));

    // ── Room snapshot (on join) ───────────────────────────────────────────
    socket.on('room-users', ({ users: roomUsers, language, chat, files: roomFiles, activeFileId: afid }) => {
      setUsers(roomUsers || []);
      if (chat && Array.isArray(chat)) setMessages(chat);
      if (roomFiles) {
        setFiles(roomFiles);
        setActiveFileId(afid || roomFiles[0]?.id || null);
      }
      setRoomSnapshot({ language: language ?? 'javascript' });
    });

    // ── Users ─────────────────────────────────────────────────────────────
    socket.on('users-update', (arr) => setUsers(arr || []));

    socket.on('user-joined', ({ userName }) => console.log(`👋 ${userName} joined`));

    socket.on('user-left', ({ userId, userName }) => {
      console.log(`👋 ${userName} left`);
      setTypingUsers(prev => { const { [userId]: _, ...rest } = prev; return rest; });
    });

    // ── Chat ──────────────────────────────────────────────────────────────
    socket.on('chat-broadcast', (msg) => {
      setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
    });

    socket.on('user-typing', ({ userId, userName, isTyping }) => {
      setTypingUsers(prev =>
        isTyping
          ? { ...prev, [userId]: userName }
          : (({ [userId]: _, ...rest }) => rest)(prev)
      );
    });

    // ── File events ───────────────────────────────────────────────────────
    socket.on('file-created', ({ file }) => {
      setFiles(prev => [...prev, file]);
    });

    socket.on('file-deleted', ({ fileId, newActiveId }) => {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      setActiveFileId(newActiveId);
    });

    socket.on('file-renamed', ({ fileId, newName, language }) => {
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, name: newName, language } : f
      ));
    });

    socket.on('file-content-update', ({ fileId, content }) => {
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, content } : f
      ));
    });

    socket.on('file-switched', ({ fileId }) => {
      // optional: could show remote cursor's active file
    });

    socketRef.current = socket;

    return () => {
      listenersRef.current.clear();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clearRoom = useCallback(() => {
    setMessages([]);
    setTypingUsers({});
    setRoomSnapshot(null);
    setFiles([]);
    setActiveFileId(null);
  }, []);

  // ── Room actions ──────────────────────────────────────────────────────────
  const joinRoom = useCallback((roomId) => {
    if (!socketRef.current || !user) return;
    if (!socketRef.current.connected) socketRef.current.connect();
    clearRoom();
    socketRef.current.emit('join-room', {
      roomId,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'User',
    });
  }, [user, clearRoom]);

  const leaveRoom = useCallback((roomId) => {
    if (!socketRef.current || !user) return;
    socketRef.current.emit('leave-room', { roomId, userId: user.uid });
    clearRoom();
  }, [user, clearRoom]);

  // ── File actions ──────────────────────────────────────────────────────────
  const emitFileCreate = useCallback((roomId, fileName) => {
    socketRef.current?.emit('file-create', { roomId, fileName });
  }, []);

  const emitFileDelete = useCallback((roomId, fileId) => {
    socketRef.current?.emit('file-delete', { roomId, fileId });
  }, []);

  const emitFileRename = useCallback((roomId, fileId, newName) => {
    socketRef.current?.emit('file-rename', { roomId, fileId, newName });
  }, []);

  const emitFileContentChange = useCallback((roomId, fileId, content) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('file-content-change', { roomId, fileId, content });
    }
  }, []);

  const emitFileSwitch = useCallback((roomId, fileId) => {
    socketRef.current?.emit('file-switch', { roomId, fileId });
  }, []);

  // ── Code / language (kept for backward compat) ────────────────────────────
  const emitCodeChange = useCallback((roomId, code, language) => {
    // now proxied through file-content-change — this is a no-op kept for safety
  }, []);

  const emitLanguageChange = useCallback((roomId, language) => {
    socketRef.current?.connected &&
      socketRef.current.emit('language-change', { roomId, language });
  }, []);

  const emitCursorPosition = useCallback((roomId, position) => {
    if (!user || !socketRef.current?.connected) return;
    socketRef.current.emit('cursor-position', { roomId, userId: user.uid, position });
  }, [user]);

  // ── Chat ──────────────────────────────────────────────────────────────────
  const emitChatMessage = useCallback((roomId, message) => {
    if (!socketRef.current?.connected || !user) return;
    socketRef.current.emit('chat-message', {
      roomId,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'User',
      message,
    });
  }, [user]);

  const emitTyping = useCallback((roomId, isTyping) => {
    if (!socketRef.current?.connected || !user) return;
    socketRef.current.emit('typing', {
      roomId,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'User',
      isTyping,
    });
  }, [user]);

  // ── Generic listener helpers ──────────────────────────────────────────────
  const on = useCallback((event, callback) => {
    if (!socketRef.current) return;
    const key = event;
    if (listenersRef.current.has(key)) {
      socketRef.current.off(key, listenersRef.current.get(key));
    }
    socketRef.current.on(event, callback);
    listenersRef.current.set(key, callback);
  }, []);

  const off = useCallback((event, callback) => {
    if (!socketRef.current) return;
    socketRef.current.off(event, callback);
    listenersRef.current.delete(event);
  }, []);

  return (
    <SocketContext.Provider value={{
      connected, users, setUsers, messages, typingUsers, roomSnapshot,
      // file state
      files, setFiles, activeFileId, setActiveFileId,
      // file actions
      emitFileCreate, emitFileDelete, emitFileRename,
      emitFileContentChange, emitFileSwitch,
      // room
      joinRoom, leaveRoom,
      // legacy / misc
      emitCodeChange, emitLanguageChange, emitCursorPosition,
      emitChatMessage, emitTyping,
      on, off,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);