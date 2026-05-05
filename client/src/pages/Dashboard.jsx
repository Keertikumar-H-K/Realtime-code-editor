import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { SkeletonDashboard } from '../components/Common/Skeleton';

/* ─── Room code validation rules ──────────────────────────────────────────── */
const ROOM_RULES = [
  {
    id: 'length',
    label: 'At least 6 characters',
    test: (v) => v.length >= 6,
  },
  {
    id: 'maxlen',
    label: 'No more than 36 characters',
    test: (v) => v.length <= 36,
  },
  {
    id: 'chars',
    label: 'Letters, numbers, hyphens only',
    test: (v) => /^[a-zA-Z0-9-_]+$/.test(v),
  },
  {
    id: 'nospace',
    label: 'No spaces allowed',
    test: (v) => !v.includes(' '),
  },
];

function getRuleStatus(value, rule) {
  if (!value) return 'idle';
  return rule.test(value) ? 'pass' : 'fail';
}

/* ─── Animated counter ────────────────────────────────────────────────────── */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = to;
    if (from === to) return;

    let startTime = null;
    const duration = 800;

    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

/* ─── Tiny sparkline bar ──────────────────────────────────────────────────── */
function MiniBar({ percent, color }) {
  return (
    <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mt-3">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
    </div>
  );
}

/* ─── Language badge ──────────────────────────────────────────────────────── */
const LANG_COLORS = {
  javascript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  python:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  typescript: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  cpp:        'bg-pink-500/20 text-pink-400 border-pink-500/30',
  java:       'bg-orange-500/20 text-orange-400 border-orange-500/30',
  go:         'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  rust:       'bg-orange-600/20 text-orange-300 border-orange-600/30',
  default:    'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

function LangBadge({ lang = 'default' }) {
  const key = lang.toLowerCase();
  const cls = LANG_COLORS[key] || LANG_COLORS.default;
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-widest ${cls}`}>
      {lang}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCreating, setIsCreating]     = useState(false);
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [joinTouched, setJoinTouched]   = useState(false);
  const [loading, setLoading]           = useState(true);
  const [recentRooms, setRecentRooms]   = useState([]);
  const [activeTab, setActiveTab]       = useState('create'); // 'create' | 'join'
  const [copied, setCopied]             = useState(null);
  const [stats, setStats]               = useState({
    totalRooms: 0, activeCollaborators: 0, codeSessions: 0, thisWeek: 0,
  });

  /* validation */
  const joinValid   = ROOM_RULES.every((r) => r.test(joinRoomCode));
  const joinHasAny  = joinRoomCode.length > 0;

  /* fetch */
  useEffect(() => {
    if (!user) return;
    const run = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`http://localhost:3001/api/rooms/${user.uid}`);
        let rooms  = [];
        try {
          const data = await res.json();
          rooms = Array.isArray(data) ? data : [];
        } catch { rooms = []; }

        setRecentRooms(rooms);
        const now        = new Date();
        const weekAgo    = new Date(now - 7 * 86400000);
        const thisWeek   = rooms.filter(r => new Date(r.createdAt) >= weekAgo).length;
        const uniq       = new Set(rooms.map(r => r.userId).filter(Boolean));
        setStats({
          totalRooms:          rooms.length,
          activeCollaborators: uniq.size,
          codeSessions:        rooms.length,
          thisWeek,
        });
      } catch {
        setRecentRooms([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  /* handlers */
  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const res  = await fetch('http://localhost:3001/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, userName: user.displayName }),
      });
      const data = await res.json();
      navigate(`/room/${data.roomId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    setJoinTouched(true);
    if (!joinValid) return;
    navigate(`/room/${joinRoomCode.trim()}`);
  };

  const handleCopy = async (roomId) => {
    await navigator.clipboard.writeText(roomId);
    setCopied(roomId);
    setTimeout(() => setCopied(null), 2000);
  };

  /* time-ago helper */
  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60)    return `${s}s ago`;
    if (s < 3600)  return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14]">
        <Navbar />
        <div className="py-12 px-4"><SkeletonDashboard /></div>
      </div>
    );
  }

  /* ── STAT CARDS DATA ── */
  const STAT_CARDS = [
    {
      label:   'Total Rooms',
      value:   stats.totalRooms,
      icon:    '🗂️',
      sub:     'rooms created',
      color:   'from-indigo-600/20 to-indigo-600/5',
      border:  'border-indigo-500/20',
      bar:     'bg-indigo-500',
      pct:     Math.min(stats.totalRooms * 10, 100),
      accent:  'text-indigo-400',
    },
    {
      label:   'Collaborators',
      value:   stats.activeCollaborators,
      icon:    '👥',
      sub:     'unique devs joined',
      color:   'from-purple-600/20 to-purple-600/5',
      border:  'border-purple-500/20',
      bar:     'bg-purple-500',
      pct:     Math.min(stats.activeCollaborators * 20, 100),
      accent:  'text-purple-400',
    },
    {
      label:   'Code Sessions',
      value:   stats.codeSessions,
      icon:    '💻',
      sub:     'executions run',
      color:   'from-pink-600/20 to-pink-600/5',
      border:  'border-pink-500/20',
      bar:     'bg-pink-500',
      pct:     Math.min(stats.codeSessions * 10, 100),
      accent:  'text-pink-400',
    },
    {
      label:   'This Week',
      value:   stats.thisWeek,
      icon:    '📈',
      sub:     'new rooms this week',
      color:   'from-emerald-600/20 to-emerald-600/5',
      border:  'border-emerald-500/20',
      bar:     'bg-emerald-500',
      pct:     Math.min(stats.thisWeek * 25, 100),
      accent:  'text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-white flex flex-col overflow-x-hidden">

      {/* ── Ambient ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-60 -left-40 w-[700px] h-[700px] bg-indigo-600/8 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-pink-600/6 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* ── WELCOME HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div>
              {/* Live pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Real-time collaboration active
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {user?.displayName?.split(' ')[0] || 'Developer'}
                </span>
                &nbsp;👋
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
                Your coding workspace. Start a session or pick up where you left off.
              </p>
            </div>

            {/* Quick avatar */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{user?.displayName || 'Developer'}</div>
                <div className="text-xs text-slate-500 truncate max-w-[140px]">{user?.email}</div>
              </div>
            </div>
          </motion.div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative p-6 rounded-2xl border ${s.border} bg-gradient-to-br ${s.color} backdrop-blur-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
              >
                {/* Icon watermark */}
                <div className="absolute -right-2 -top-2 text-5xl opacity-10 select-none group-hover:opacity-20 transition-opacity">
                  {s.icon}
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-4xl font-black ${s.accent}`}>
                  <AnimatedNumber value={s.value} />
                </p>
                <p className="text-slate-600 text-xs mt-1">{s.sub}</p>
                <MiniBar percent={s.pct} color={s.bar} />
              </motion.div>
            ))}
          </div>

          {/* ── CREATE / JOIN PANEL ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border border-white/10 overflow-hidden"
            style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.07) 0%,rgba(15,18,28,0.95) 60%,rgba(168,85,247,0.07) 100%)' }}
          >
            {/* Top accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            <div className="p-8 sm:p-10">
              {/* Tab switcher */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit mb-10">
                {['create', 'join'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'create' ? '✨ Create Room' : '🔗 Join Room'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">

                {/* ─── CREATE TAB ─── */}
                {activeTab === 'create' && (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="grid md:grid-cols-2 gap-10 items-center"
                  >
                    <div>
                      <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                        Start a new session
                      </h2>
                      <p className="text-slate-400 leading-relaxed mb-8">
                        A unique room ID is generated instantly. Share it with teammates and start coding together in real-time — no setup required.
                      </p>

                      {/* Feature pills */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {['Real-time sync', 'Live chat', '8+ languages', 'Code execution'].map((f) => (
                          <span key={f} className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold">
                            ✓ {f}
                          </span>
                        ))}
                      </div>

                      <motion.button
                        onClick={handleCreateRoom}
                        disabled={isCreating}
                        whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isCreating ? (
                            <>
                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                              </svg>
                              Creating room…
                            </>
                          ) : (
                            <>✨ Create New Room</>
                          )}
                        </span>
                        {/* Shimmer */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      </motion.button>
                    </div>

                    {/* Decorative code preview */}
                    <div className="hidden md:block relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl" />
                      <div className="relative rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden">
                        {/* Titlebar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                          <span className="w-3 h-3 rounded-full bg-red-500/70" />
                          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                          <span className="w-3 h-3 rounded-full bg-green-500/70" />
                          <span className="text-slate-600 text-xs ml-2 font-mono">collaborative-session.js</span>
                        </div>
                        <div className="p-5 font-mono text-xs leading-6 text-slate-400">
                          <span className="text-purple-400">const</span> <span className="text-blue-300">room</span> <span className="text-white">=</span> <span className="text-green-400">createRoom</span>(<span className="text-orange-300">'auto'</span>);<br/>
                          <span className="text-purple-400">await</span> room.<span className="text-green-400">invite</span>(<span className="text-orange-300">'teammate'</span>);<br/>
                          <span className="text-slate-600">// ✓ Real-time sync active</span><br/>
                          <span className="text-slate-600">// ✓ 0ms latency</span><br/>
                          <span className="text-purple-400">room</span>.<span className="text-green-400">onCode</span>(<span className="text-slate-300">syncInstantly</span>);
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── JOIN TAB ─── */}
                {activeTab === 'join' && (
                  <motion.div
                    key="join"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="grid md:grid-cols-2 gap-10 items-start"
                  >
                    <div>
                      <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                        Join a session
                      </h2>
                      <p className="text-slate-400 leading-relaxed mb-8">
                        Enter a room ID shared by your teammate to jump straight into the collaboration session.
                      </p>

                      <form onSubmit={handleJoinRoom} className="space-y-4">
                        {/* Input */}
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                            </svg>
                          </div>
                          <input
                            value={joinRoomCode}
                            onChange={(e) => {
                              setJoinRoomCode(e.target.value);
                              setJoinTouched(true);
                            }}
                            onBlur={() => setJoinTouched(true)}
                            placeholder="e.g. abc123-xyz"
                            className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-white/5 text-white placeholder-slate-600 font-mono text-sm focus:outline-none transition-all duration-200 ${
                              joinTouched && joinHasAny
                                ? joinValid
                                  ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                                  : 'border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                                : 'border-white/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20'
                            }`}
                          />
                          {/* Validation icon */}
                          {joinTouched && joinHasAny && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {joinValid
                                ? <span className="text-emerald-400 text-lg">✓</span>
                                : <span className="text-red-400 text-lg">✗</span>
                              }
                            </div>
                          )}
                        </div>

                        {/* ── VALIDATION RULES ── */}
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Room ID rules</p>
                          {ROOM_RULES.map((rule) => {
                            const status = getRuleStatus(joinRoomCode, rule);
                            return (
                              <motion.div
                                key={rule.id}
                                className="flex items-center gap-2.5"
                                animate={{ x: status === 'fail' && joinTouched ? [0, -4, 4, -2, 2, 0] : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 transition-all duration-300 ${
                                  status === 'pass' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                                  status === 'fail' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                                  'bg-white/5 text-slate-600 border border-white/10'
                                }`}>
                                  {status === 'pass' ? '✓' : status === 'fail' ? '✗' : '○'}
                                </span>
                                <span className={`text-xs transition-colors duration-300 ${
                                  status === 'pass' ? 'text-emerald-400' :
                                  status === 'fail' ? 'text-red-400' :
                                  'text-slate-500'
                                }`}>
                                  {rule.label}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          whileHover={joinValid ? { scale: 1.03, boxShadow: '0 0 30px rgba(168,85,247,0.4)' } : {}}
                          whileTap={joinValid ? { scale: 0.97 } : {}}
                          className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden group ${
                            joinValid
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer'
                              : 'bg-white/5 text-slate-600 border border-white/10 cursor-not-allowed'
                          }`}
                        >
                          <span className="relative z-10">
                            {joinValid ? '🔗 Join Session →' : 'Enter a valid Room ID'}
                          </span>
                          {joinValid && (
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          )}
                        </motion.button>
                      </form>
                    </div>

                    {/* Info card */}
                    <div className="space-y-4 mt-2">
                      <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">What to expect</p>
                        {[
                          { icon: '⚡', text: 'Instant connection to the shared editor' },
                          { icon: '🔄', text: "You'll receive the room's current code state" },
                          { icon: '👁️', text: "See all collaborators' cursors in real-time" },
                          { icon: '💬', text: 'Access to full chat history of the session' },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0"
                          >
                            <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                            <span className="text-slate-400 text-sm leading-relaxed">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3">
                        <span className="text-yellow-400 flex-shrink-0 mt-0.5">⚠️</span>
                        <p className="text-yellow-300/80 text-xs leading-relaxed">
                          Room IDs are case-sensitive. Make sure you copy the ID exactly as shared by your teammate.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </motion.div>

          {/* ── RECENT ROOMS ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Recent Rooms</h2>
                <p className="text-slate-500 text-sm mt-0.5">Click any room to rejoin instantly</p>
              </div>
              {recentRooms.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold">
                  {recentRooms.length} room{recentRooms.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {recentRooms.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                <div className="text-5xl mb-4">🚀</div>
                <p className="text-white font-bold text-lg mb-2">No rooms yet</p>
                <p className="text-slate-500 text-sm mb-6">Create your first room to start collaborating</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                >
                  Create a Room
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentRooms.map((room, i) => (
                  <motion.div
                    key={room.roomId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.05 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    onClick={() => navigate(`/room/${room.roomId}`)}
                    className="group relative p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 cursor-pointer transition-all duration-200 overflow-hidden"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                    <div className="relative">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-sm flex-shrink-0">
                            📝
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-bold text-sm font-mono truncate max-w-[130px]">
                              {room.roomId}
                            </p>
                            <p className="text-slate-600 text-xs">{timeAgo(room.createdAt)}</p>
                          </div>
                        </div>
                        <LangBadge lang={room.language || 'js'} />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(room.roomId); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-medium transition-all"
                        >
                          {copied === room.roomId ? (
                            <><span className="text-emerald-400">✓</span> Copied</>
                          ) : (
                            <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copy ID</>
                          )}
                        </button>

                        <span className="flex-1" />

                        <span className="flex items-center gap-1 text-indigo-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          Rejoin <span>→</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;