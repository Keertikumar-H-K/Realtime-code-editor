const rooms = new Map();

// ─── helpers ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

const getLanguageFromName = (name) => {
  const ext = (name.split('.').pop() || '').toLowerCase();
  const map = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', java: 'java', cpp: 'cpp', c: 'c', cs: 'csharp',
    go: 'go', rs: 'rust', html: 'html', css: 'css', json: 'json',
    md: 'markdown', sh: 'shell', rb: 'ruby', php: 'php',
  };
  return map[ext] || 'plaintext';
};

const getOrCreateRoom = (roomId) => {
  if (!rooms.has(roomId)) {
    const defaultFileId = uid();
    rooms.set(roomId, {
      id: roomId,
      users: new Map(),
      language: 'javascript',
      chat: [],
      createdAt: new Date().toISOString(),
      // ── multi-file store ──────────────────────────────────────────────────
      files: new Map([
        [defaultFileId, {
          id: defaultFileId,
          name: 'main.js',
          content: '// Start coding...\n',
          language: 'javascript',
        }]
      ]),
      activeFileId: defaultFileId,
    });
  }
  return rooms.get(roomId);
};

const serializeFiles = (room) =>
  Array.from(room.files.values());

// ═══════════════════════════════════════════════════════════════════════════
export const handleSocketConnection = (socket, io) => {
  console.log(`🔌 Connected: ${socket.id}`);

  // ── JOIN ROOM ─────────────────────────────────────────────────────────────
  socket.on('join-room', ({ roomId, userId, userName }) => {
    if (!roomId || !userId || !userName) return;

    const room = getOrCreateRoom(roomId);
    const existingUser = room.users.get(userId);

    if (existingUser) {
      existingUser.socketId = socket.id;
      existingUser.online = true;
    } else {
      room.users.set(userId, { userId, name: userName, socketId: socket.id, online: true });
    }

    socket.join(roomId);
    socket.roomId  = roomId;
    socket.userId  = userId;
    socket.userName = userName;

    if (!existingUser) {
      socket.to(roomId).emit('user-joined', { userId, userName });
    }

    io.to(roomId).emit('users-update', Array.from(room.users.values()));

    // ✅ send full room snapshot including all files
    socket.emit('room-users', {
      users: Array.from(room.users.values()),
      language: room.language,
      chat: room.chat,
      files: serializeFiles(room),
      activeFileId: room.activeFileId,
    });

    console.log(`✅ ${userName} ${existingUser ? 'reconnected to' : 'joined'} ${roomId}`);
  });

  // ── FILE: CREATE ──────────────────────────────────────────────────────────
  socket.on('file-create', ({ roomId, fileName }) => {
    if (!roomId || !fileName?.trim()) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const fileId = uid();
    const language = getLanguageFromName(fileName);
    const file = { id: fileId, name: fileName.trim(), content: '', language };

    room.files.set(fileId, file);

    // broadcast to everyone in room (including sender)
    io.to(roomId).emit('file-created', { file });
    console.log(`📄 File created: ${fileName} in ${roomId}`);
  });

  // ── FILE: DELETE ──────────────────────────────────────────────────────────
  socket.on('file-delete', ({ roomId, fileId }) => {
    if (!roomId || !fileId) return;

    const room = rooms.get(roomId);
    if (!room || room.files.size <= 1) return; // must keep at least one file

    room.files.delete(fileId);

    // if deleted file was active, switch everyone to first remaining file
    let newActiveId = room.activeFileId;
    if (room.activeFileId === fileId) {
      newActiveId = room.files.keys().next().value;
      room.activeFileId = newActiveId;
    }

    io.to(roomId).emit('file-deleted', { fileId, newActiveId });
    console.log(`🗑 File deleted: ${fileId} in ${roomId}`);
  });

  // ── FILE: RENAME ──────────────────────────────────────────────────────────
  socket.on('file-rename', ({ roomId, fileId, newName }) => {
    if (!roomId || !fileId || !newName?.trim()) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const file = room.files.get(fileId);
    if (!file) return;

    file.name = newName.trim();
    file.language = getLanguageFromName(newName);

    io.to(roomId).emit('file-renamed', { fileId, newName: file.name, language: file.language });
    console.log(`✏️ File renamed to: ${file.name} in ${roomId}`);
  });

  // ── FILE: CONTENT CHANGE ──────────────────────────────────────────────────
  socket.on('file-content-change', ({ roomId, fileId, content }) => {
    if (!roomId || !fileId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const file = room.files.get(fileId);
    if (!file) return;

    file.content = content ?? file.content;

    // broadcast to others only (prevents echo loop)
    socket.to(roomId).emit('file-content-update', {
      fileId,
      content: file.content,
      userId: socket.userId,
    });
  });

  // ── FILE: SWITCH (inform others which file you're viewing) ────────────────
  socket.on('file-switch', ({ roomId, fileId }) => {
    if (!roomId || !fileId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    room.activeFileId = fileId;

    // optional — lets other users know which file is "primary"
    socket.to(roomId).emit('file-switched', { fileId, userId: socket.userId });
  });

  // ── CHAT ──────────────────────────────────────────────────────────────────
  socket.on('chat-message', ({ roomId, userId, userName, message }) => {
    if (!roomId || !message?.trim()) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const chatMessage = {
      id: Date.now().toString(),
      userId, userName,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: {},
    };

    room.chat.push(chatMessage);
    if (room.chat.length > 100) room.chat = room.chat.slice(-100);

    io.to(roomId).emit('chat-broadcast', chatMessage);
  });

  // ── TYPING ────────────────────────────────────────────────────────────────
  socket.on('typing', ({ roomId, userId, userName, isTyping }) => {
    socket.to(roomId).emit('user-typing', { userId, userName, isTyping });
  });

  // ── LANGUAGE CHANGE (room-level fallback) ─────────────────────────────────
  socket.on('language-change', ({ roomId, language }) => {
    if (!roomId || !language) return;
    const room = rooms.get(roomId);
    if (!room) return;
    room.language = language;
    socket.to(roomId).emit('language-changed', { language, userId: socket.userId });
  });

  // ── LEAVE ROOM ────────────────────────────────────────────────────────────
  socket.on('leave-room', ({ roomId, userId }) => {
    if (!roomId || !userId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    const user = room.users.get(userId);
    room.users.delete(userId);
    socket.leave(roomId);

    socket.to(roomId).emit('user-left', { userId, userName: user?.name });
    io.to(roomId).emit('users-update', Array.from(room.users.values()));
    console.log(`🚪 ${user?.name} left ${roomId}`);
  });

  // ── DISCONNECT ────────────────────────────────────────────────────────────
  socket.on('disconnect', (reason) => {
    const { roomId, userId } = socket;
    if (!roomId || !userId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const user = room.users.get(userId);
    if (!user) return;

    room.users.delete(userId);
    socket.to(roomId).emit('user-left', { userId, userName: user.name });
    io.to(roomId).emit('users-update', Array.from(room.users.values()));
    console.log(`🔌 Disconnected: ${socket.id} (${reason})`);
  });
};

export default handleSocketConnection;