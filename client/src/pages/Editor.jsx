import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSocket } from '../contexts/SocketContext';
import { executeCode } from '../utils/api';
import OutputPanel from '../components/Editor/OutputPanel';
import ChatPanel from '../components/Chat/ChatPanel';
import NewFileInput from '../components/Editor/NewFileInput';

// ─── File icon by extension ───────────────────────────────────────────────────
const FILE_ICONS = {
  js:   { icon: 'JS',  color: '#f7df1e' },
  jsx:  { icon: '⚛',   color: '#61dafb' },
  ts:   { icon: 'TS',  color: '#3178c6' },
  tsx:  { icon: '⚛',   color: '#3178c6' },
  py:   { icon: '🐍',  color: '#3572a5' },
  java: { icon: '☕',  color: '#b07219' },
  cpp:  { icon: 'C++', color: '#f34b7d' },
  c:    { icon: 'C',   color: '#555555' },
  cs:   { icon: 'C#',  color: '#178600' },
  go:   { icon: 'Go',  color: '#00add8' },
  rs:   { icon: '⚙',   color: '#dea584' },
  html: { icon: 'H5',  color: '#e34c26' },
  css:  { icon: '🎨',  color: '#563d7c' },
  scss: { icon: '🎨',  color: '#c6538c' },
  json: { icon: '{}',  color: '#cbcb41' },
  md:   { icon: 'M↓',  color: '#519aba' },
  sh:   { icon: '$_',  color: '#89e051' },
  yml:  { icon: 'Y',   color: '#cb171e' },
  yaml: { icon: 'Y',   color: '#cb171e' },
  sql:  { icon: '🗄',   color: '#e38c00' },
  rb:   { icon: '💎',  color: '#701516' },
  php:  { icon: '🐘',  color: '#4f5d95' },
  swift:{ icon: '🦅',  color: '#f05138' },
  kt:   { icon: 'K',   color: '#7f52ff' },
  xml:  { icon: 'XML', color: '#f60'    },
  txt:  { icon: 'TXT', color: '#888'    },
};

const getFileIcon = (name) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return FILE_ICONS[ext] || { icon: '📄', color: '#8b8b8b' };
};

const getLanguageFromName = (name) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const map = {
    js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
    ts: 'typescript', tsx: 'typescript',
    py: 'python', pyw: 'python',
    java: 'java',
    cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp',
    c: 'c', h: 'c',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin', kts: 'kotlin',
    html: 'html', htm: 'html',
    css: 'css', scss: 'scss', sass: 'sass', less: 'less',
    json: 'json',
    yaml: 'yaml', yml: 'yaml',
    xml: 'xml', svg: 'xml',
    md: 'markdown', mdx: 'markdown',
    sh: 'shell', bash: 'shell', zsh: 'shell',
    ps1: 'powershell',
    bat: 'bat',
    sql: 'sql',
    txt: 'plaintext', csv: 'plaintext',
    toml: 'ini',
  };
  return map[ext] || 'plaintext';
};

// ─── VS Code colour tokens ────────────────────────────────────────────────────
const C = {
  activityBar:   '#333333',
  sidebar:       '#252526',
  sidebarBorder: '#1e1e1e',
  editor:        '#1e1e1e',
  tabBar:        '#2d2d2d',
  tabActive:     '#1e1e1e',
  tabInactive:   '#2d2d2d',
  tabBorder:     '#252526',
  statusBar:     '#007acc',
  text:          '#cccccc',
  textDim:       '#888888',
  textMute:      '#555555',
  border:        '#3c3c3c',
  hover:         '#2a2d2e',
  selected:      '#094771',
  danger:        '#f44747',
  accent:        '#007acc',
  success:       '#4ec994',
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function EditorPage() {
  const { roomId }  = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { isDark }  = useTheme();

  const {
    connected, joinRoom, leaveRoom,
    emitChatMessage, emitTyping,
    emitFileCreate, emitFileDelete, emitFileRename,
    emitFileContentChange, emitFileSwitch,
    on, off,
    users, messages, typingUsers,
    files, setFiles, activeFileId, setActiveFileId,
    roomSnapshot,
  } = useSocket();

  // ── State ─────────────────────────────────────────────────────────────────
  const [output,         setOutput]         = useState(null);
  const [isRunning,      setIsRunning]      = useState(false);
  const [cursorPos,      setCursorPos]      = useState({ line: 1, col: 1 });
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [activeTab,      setActiveTab]      = useState('explorer');
  const [openTabs,       setOpenTabs]       = useState([]);
  const [renamingFileId, setRenamingFileId] = useState(null);
  const [renameValue,    setRenameValue]    = useState('');
  const [showNewInput,   setShowNewInput]   = useState(false);
  const [copied,         setCopied]         = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const roomJoinedRef   = useRef(false);
  const editorRef       = useRef(null);
  const isRemoteRef     = useRef(false);
  const contentTimerRef = useRef(null);
  const renameInputRef  = useRef(null);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeFile = files.find(f => f.id === activeFileId) || files[0] || null;

  // ── Join room ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!connected || !user || !roomId) return;
    if (roomJoinedRef.current) return;
    roomJoinedRef.current = true;
    joinRoom(roomId);
    return () => {
      roomJoinedRef.current = false;
      leaveRoom(roomId);
    };
  }, [connected, user, roomId]);

  // ── Sync snapshot → open first file tab ──────────────────────────────────
  useEffect(() => {
    if (!roomSnapshot || !activeFileId) return;
    setOpenTabs(prev =>
      prev.includes(activeFileId) ? prev : [activeFileId]
    );
  }, [roomSnapshot, activeFileId]);

  // ── Open tab when activeFileId changes ────────────────────────────────────
  useEffect(() => {
    if (!activeFileId) return;
    setOpenTabs(prev =>
      prev.includes(activeFileId) ? prev : [...prev, activeFileId]
    );
  }, [activeFileId]);

  // ── Listen for remote file content changes ────────────────────────────────
  useEffect(() => {
    if (!connected) return;

    const handleContentUpdate = ({ fileId, content }) => {
      if (fileId !== activeFileId) return;
      isRemoteRef.current = true;
      if (editorRef.current) {
        const pos = editorRef.current.getPosition();
        editorRef.current.setValue(content);
        if (pos) editorRef.current.setPosition(pos);
      }
      setTimeout(() => { isRemoteRef.current = false; }, 100);
    };

    on('file-content-update', handleContentUpdate);
    return () => off('file-content-update', handleContentUpdate);
  }, [connected, activeFileId, on, off]);

  // ── Editor mount ──────────────────────────────────────────────────────────
  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        col:  e.position.column,
      });
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });
  }, []);

  // ── Local code change ─────────────────────────────────────────────────────
  const handleEditorChange = useCallback((value) => {
    if (!activeFile || isRemoteRef.current) return;

    setFiles(prev => prev.map(f =>
      f.id === activeFile.id ? { ...f, content: value ?? '' } : f
    ));

    if (contentTimerRef.current) clearTimeout(contentTimerRef.current);
    contentTimerRef.current = setTimeout(() => {
      emitFileContentChange(roomId, activeFile.id, value ?? '');
    }, 200);
  }, [activeFile, roomId, emitFileContentChange, setFiles]);

  // ── File selection ────────────────────────────────────────────────────────
  const handleSelectFile = useCallback((fileId) => {
    setActiveFileId(fileId);
    setOpenTabs(prev =>
      prev.includes(fileId) ? prev : [...prev, fileId]
    );
    emitFileSwitch(roomId, fileId);
  }, [roomId, emitFileSwitch, setActiveFileId]);

  // ── Close tab ─────────────────────────────────────────────────────────────
  const handleCloseTab = useCallback((e, fileId) => {
    e.stopPropagation();
    setOpenTabs(prev => {
      const next = prev.filter(id => id !== fileId);
      if (fileId === activeFileId && next.length > 0) {
        setActiveFileId(next[next.length - 1]);
      }
      return next;
    });
  }, [activeFileId, setActiveFileId]);

  // ── Delete file ───────────────────────────────────────────────────────────
  const handleDeleteFile = useCallback((e, fileId) => {
    e.stopPropagation();
    if (files.length <= 1) return;
    emitFileDelete(roomId, fileId);
    setOpenTabs(prev => prev.filter(id => id !== fileId));
  }, [files.length, roomId, emitFileDelete]);

  // ── Rename file ───────────────────────────────────────────────────────────
  const handleStartRename = useCallback((e, file) => {
    e.stopPropagation();
    setRenamingFileId(file.id);
    setRenameValue(file.name);
    setTimeout(() => renameInputRef.current?.select(), 50);
  }, []);

  const handleRenameSubmit = useCallback((fileId) => {
    if (renameValue.trim()) {
      emitFileRename(roomId, fileId, renameValue.trim());
    }
    setRenamingFileId(null);
    setRenameValue('');
  }, [renameValue, roomId, emitFileRename]);

  // ── Run code ──────────────────────────────────────────────────────────────
  const handleRunCode = useCallback(async () => {
    if (!activeFile) return;
    setIsRunning(true);
    setOutput(null);
    try {
      const result = await executeCode(activeFile.content, activeFile.language);
      setOutput({
        success:       result.success !== false,
        output:        result.output || '',
        error:         result.error  || null,
        executionTime: result.executionTime || 0,
      });
    } catch (err) {
      setOutput({ success: false, output: '', error: err.message });
    } finally {
      setIsRunning(false);
    }
  }, [activeFile]);

  // ── Copy room ID ──────────────────────────────────────────────────────────
  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // ── Chat ──────────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback((msg) => {
    if (msg.trim()) emitChatMessage(roomId, msg);
  }, [roomId, emitChatMessage]);

  const handleTyping = useCallback((isTyping) => {
    emitTyping(roomId, isTyping);
  }, [roomId, emitTyping]);

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      background: C.editor, color: C.text,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflow: 'hidden',
    }}>

      {/* ══ TITLE BAR ════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 35, background: '#323233',
        borderBottom: `1px solid ${C.sidebarBorder}`,
        padding: '0 12px', flexShrink: 0, gap: 12,
      }}>

        {/* Left: logo + room badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>
            ⌨ CodeSync
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: C.sidebar, borderRadius: 4, padding: '2px 8px',
            border: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 10, color: C.textDim, letterSpacing: '0.08em' }}>
              ROOM
            </span>
            <code style={{
              fontSize: 11, color: C.accent,
              maxWidth: 140, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {roomId}
            </code>
            <button onClick={handleCopyRoomId} style={{
              background: 'none', border: 'none',
              color: copied ? C.success : C.textDim,
              fontSize: 10, cursor: 'pointer', padding: '0 4px',
            }}>
              {copied ? '✓' : '⧉'}
            </button>
          </div>
        </div>

        {/* Center: online users */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          overflow: 'hidden', flex: 1, justifyContent: 'center',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: connected ? C.success : C.danger,
            boxShadow: connected ? `0 0 6px ${C.success}` : 'none',
            flexShrink: 0, display: 'inline-block',
          }} />
          {users.map(u => (
            <div key={u.socketId || u.userId} title={u.name} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: C.sidebar, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: '2px 8px 2px 4px',
              fontSize: 11, flexShrink: 0,
              color: u.userId === user?.uid ? '#c792ea' : C.text,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'linear-gradient(135deg, #007acc, #c792ea)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#fff',
              }}>
                {(u.name || '?')[0].toUpperCase()}
              </span>
              {u.name}
              {u.userId === user?.uid && (
                <span style={{ fontSize: 8, color: '#c792ea', marginLeft: 2 }}>you</span>
              )}
            </div>
          ))}
        </div>

        {/* Right: run + leave */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={handleRunCode}
            disabled={isRunning || !activeFile}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: isRunning ? '#1e7e34' : '#238636',
              border: 'none', borderRadius: 4, color: '#fff',
              fontSize: 12, fontWeight: 600, padding: '4px 14px',
              cursor: isRunning || !activeFile ? 'not-allowed' : 'pointer',
              opacity: !activeFile ? 0.5 : 1,
            }}>
            {isRunning
              ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Running…</>
              : <>▶ Run Code</>
            }
          </button>
          <button
            onClick={() => { leaveRoom(roomId); navigate('/dashboard'); }}
            style={{
              background: 'none', border: `1px solid ${C.danger}`,
              borderRadius: 4, color: C.danger, fontSize: 11,
              fontWeight: 600, padding: '3px 10px', cursor: 'pointer',
            }}>
            Leave
          </button>
        </div>
      </div>

      {/* ══ MAIN BODY ════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Activity Bar ─────────────────────────────────────────────────── */}
        <div style={{
          width: 48, background: C.activityBar,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', paddingTop: 8,
          borderRight: `1px solid ${C.sidebarBorder}`,
          flexShrink: 0, gap: 4,
        }}>
          {[
            { id: 'explorer', icon: '⊞', label: 'Explorer' },
            { id: 'search',   icon: '🔍', label: 'Search (coming soon)' },
          ].map(item => (
            <button
              key={item.id}
              title={item.label}
              onClick={() => {
                if (item.id === activeTab && sidebarOpen) {
                  setSidebarOpen(false);
                  return;
                }
                setActiveTab(item.id);
                setSidebarOpen(true);
              }}
              style={{
                width: 36, height: 36, borderRadius: 4,
                border: 'none', cursor: 'pointer',
                background: activeTab === item.id && sidebarOpen
                  ? 'rgba(255,255,255,0.1)' : 'none',
                color: activeTab === item.id && sidebarOpen
                  ? '#fff' : C.textDim,
                fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderLeft: activeTab === item.id && sidebarOpen
                  ? `2px solid ${C.accent}` : '2px solid transparent',
              }}>
              {item.icon}
            </button>
          ))}
        </div>

        {/* ── File Explorer Sidebar ─────────────────────────────────────────── */}
        {sidebarOpen && (
          <div style={{
            width: 240, background: C.sidebar,
            display: 'flex', flexDirection: 'column',
            borderRight: `1px solid ${C.sidebarBorder}`,
            flexShrink: 0, overflow: 'hidden',
          }}>

            {/* Sidebar header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: `1px solid ${C.sidebarBorder}`,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', color: C.textDim,
                textTransform: 'uppercase',
              }}>
                Explorer
              </span>
              <button
                onClick={() => setShowNewInput(true)}
                title="New File"
                style={{
                  background: 'none', border: 'none',
                  color: C.textDim, cursor: 'pointer',
                  fontSize: 18, padding: '0 2px', lineHeight: 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.textDim; }}
              >
                +
              </button>
            </div>

            {/* Project label */}
            <div style={{
              padding: '6px 12px 2px', fontSize: 11, fontWeight: 600,
              color: C.text, letterSpacing: '0.04em', userSelect: 'none',
            }}>
              📁 CODESYNC / {roomId?.slice(0, 8).toUpperCase()}
            </div>

            {/* ✅ New file input with full VS Code validation */}
            {showNewInput && (
              <NewFileInput
                existingFiles={files}
                onCreate={(fileName) => {
                  emitFileCreate(roomId, fileName);
                  setShowNewInput(false);
                }}
                onCancel={() => setShowNewInput(false)}
              />
            )}

            {/* File list */}
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: 2 }}>
              {files.map(file => {
                const { icon, color } = getFileIcon(file.name);
                const isActive    = file.id === activeFileId;
                const isRenaming  = renamingFileId === file.id;

                return (
                  <div
                    key={file.id}
                    className="file-row"
                    onClick={() => !isRenaming && handleSelectFile(file.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '3px 8px 3px 20px', cursor: 'pointer',
                      background: isActive ? C.selected : 'transparent',
                      fontSize: 13, color: isActive ? '#fff' : C.text,
                      userSelect: 'none',
                      borderLeft: isActive
                        ? `2px solid ${C.accent}`
                        : '2px solid transparent',
                      position: 'relative',
                    }}
                  >
                    {/* File icon */}
                    <span style={{ fontSize: 12, color, flexShrink: 0 }}>
                      {icon}
                    </span>

                    {/* Name or rename input */}
                    {isRenaming ? (
                      <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter')  handleRenameSubmit(file.id);
                          if (e.key === 'Escape') setRenamingFileId(null);
                        }}
                        onBlur={() => handleRenameSubmit(file.id)}
                        onClick={e => e.stopPropagation()}
                        style={{
                          flex: 1, background: '#3c3c3c',
                          border: `1px solid ${C.accent}`,
                          borderRadius: 2, color: '#fff',
                          fontSize: 12, padding: '1px 4px', outline: 'none',
                        }}
                      />
                    ) : (
                      <span style={{
                        flex: 1, overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontSize: 13,
                      }}>
                        {file.name}
                      </span>
                    )}

                    {/* Hover actions */}
                    {!isRenaming && (
                      <div className="file-actions" style={{
                        display: 'flex', gap: 2, marginLeft: 'auto',
                        opacity: 0, transition: 'opacity 0.1s',
                      }}>
                        <span
                          onClick={e => handleStartRename(e, file)}
                          title="Rename"
                          style={{
                            cursor: 'pointer', fontSize: 11,
                            padding: '1px 3px', borderRadius: 3,
                            color: C.textDim,
                          }}
                        >✏</span>
                        {files.length > 1 && (
                          <span
                            onClick={e => handleDeleteFile(e, file.id)}
                            title="Delete"
                            style={{
                              cursor: 'pointer', fontSize: 11,
                              padding: '1px 3px', borderRadius: 3,
                              color: C.danger,
                            }}
                          >✕</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Editor + Chat ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>

          {/* Editor column */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            overflow: 'hidden', minWidth: 0,
          }}>

            {/* ── Tab bar ── */}
            <div style={{
              display: 'flex', alignItems: 'center',
              background: C.tabBar,
              borderBottom: `1px solid ${C.sidebarBorder}`,
              flexShrink: 0, overflowX: 'auto', height: 35,
            }}>
              {openTabs.map(fileId => {
                const file = files.find(f => f.id === fileId);
                if (!file) return null;
                const { icon, color } = getFileIcon(file.name);
                const isActive = fileId === activeFileId;

                return (
                  <div
                    key={fileId}
                    onClick={() => handleSelectFile(fileId)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '0 12px', height: '100%', cursor: 'pointer',
                      background: isActive ? C.tabActive : C.tabInactive,
                      color: isActive ? '#fff' : C.textDim,
                      borderRight: `1px solid ${C.tabBorder}`,
                      borderTop: isActive
                        ? `1px solid ${C.accent}`
                        : '1px solid transparent',
                      fontSize: 12, flexShrink: 0,
                      userSelect: 'none', minWidth: 100, maxWidth: 180,
                    }}>
                    <span style={{ fontSize: 11, color }}>{icon}</span>
                    <span style={{
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap', flex: 1,
                    }}>
                      {file.name}
                    </span>
                    <span
                      onClick={e => handleCloseTab(e, fileId)}
                      title="Close"
                      style={{
                        fontSize: 14, color: C.textDim,
                        cursor: 'pointer', borderRadius: 3,
                        padding: '0 2px', lineHeight: 1,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = C.textDim;
                        e.currentTarget.style.background = 'none';
                      }}
                    >×</span>
                  </div>
                );
              })}

              {/* Fill remaining tab bar space */}
              <div style={{ flex: 1, height: '100%', background: C.tabBar }} />
            </div>

            {/* ── Monaco Editor ── */}
            <div style={{ flex: 1, minHeight: 0 }}>
              {activeFile ? (
                <Editor
                  key={activeFile.id}
                  height="100%"
                  language={activeFile.language}
                  value={activeFile.content}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
                    fontLigatures: true,
                    minimap: { enabled: true },
                    lineNumbers: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: 'off',
                    tabSize: 2,
                    renderLineHighlight: 'gutter',
                    bracketPairColorization: { enabled: true },
                    guides: { bracketPairs: true },
                    smoothScrolling: true,
                    cursorBlinking: 'phase',
                    padding: { top: 8 },
                  }}
                />
              ) : (
                <div style={{
                  height: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: C.textMute, flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ fontSize: 48, opacity: 0.3 }}>⌨</div>
                  <p style={{ fontSize: 13 }}>
                    No file open — click <strong>+</strong> in the explorer to create one.
                  </p>
                </div>
              )}
            </div>

            {/* ── Output panel ── */}
            {output && (
              <OutputPanel
                output={output}
                onClose={() => setOutput(null)}
              />
            )}
          </div>

          {/* ── Chat Panel ───────────────────────────────────────────────────── */}
          <div style={{
            width: 300, flexShrink: 0,
            borderLeft: `1px solid ${C.sidebarBorder}`,
            background: '#1e1e1e',
            display: 'flex', flexDirection: 'column',
          }}>
            <ChatPanel
              messages={messages}
              users={users}
              onSendMessage={handleSendMessage}
              currentUser={user}
              typingUsers={typingUsers}
              onTyping={handleTyping}
            />
          </div>
        </div>
      </div>

      {/* ══ STATUS BAR ═══════════════════════════════════════════════════════ */}
      <div style={{
        height: 22,
        background: connected ? C.statusBar : '#68217a',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px', flexShrink: 0,
        fontSize: 11, color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>{connected ? '⟳ Live' : '✗ Offline'}</span>
          {activeFile && (
            <>
              <span>{activeFile.language}</span>
              <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>👥 {users.length} online</span>
          <span>UTF-8</span>
          <span>CRLF</span>
          {activeFile && (
            <span>
              {getFileIcon(activeFile.name).icon} {activeFile.name}
            </span>
          )}
        </div>
      </div>

      {/* ── Global styles ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .file-row:hover {
          background: ${C.hover} !important;
        }
        .file-row:hover .file-actions {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}