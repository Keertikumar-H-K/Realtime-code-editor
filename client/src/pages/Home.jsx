import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';

/* ── animated counter ───────────────────────────────────────────── */
const Counter = ({ to, suffix = '', duration = 1800 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const steps = 55;
    const inc = to / steps;
    const iv = setInterval(() => {
      cur += inc;
      if (cur >= to) { setVal(to); clearInterval(iv); }
      else setVal(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(iv);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ═══════════════════════════════════════════════════════════════════
   VS CODE–STYLE EDITOR MOCKUP
   - Sidebar file tree
   - Tabs
   - Real syntax-highlighted code
   - 2 anonymous colored collaborator cursors (no names shown inline,
     just colored avatar chips in the tab bar like Cursor/Live Share)
   - Minimap strip
   - Bottom status bar
═══════════════════════════════════════════════════════════════════ */

const FILES = ['index.ts', 'room.ts', 'sync.ts'];

const CODE = {
  'index.ts': [
    { tokens: [{ c: '#569CD6', v: 'import' }, { c: '#D4D4D4', v: ' { ' }, { c: '#4EC9B0', v: 'createRoom' }, { c: '#D4D4D4', v: ', ' }, { c: '#4EC9B0', v: 'joinRoom' }, { c: '#D4D4D4', v: ' } ' }, { c: '#569CD6', v: 'from' }, { c: '#CE9178', v: " './room'" }] },
    { tokens: [{ c: '#569CD6', v: 'import' }, { c: '#D4D4D4', v: ' { ' }, { c: '#4EC9B0', v: 'SyncEngine' }, { c: '#D4D4D4', v: ' } ' }, { c: '#569CD6', v: 'from' }, { c: '#CE9178', v: " './sync'" }] },
    { tokens: [] },
    { tokens: [{ c: '#6A9955', v: '// Initialize collaborative session' }] },
    { tokens: [{ c: '#569CD6', v: 'const' }, { c: '#D4D4D4', v: ' session = ' }, { c: '#569CD6', v: 'await' }, { c: '#DCDCAA', v: ' createRoom' }, { c: '#D4D4D4', v: '({' }] },
    { tokens: [{ c: '#D4D4D4', v: '  lang: ' }, { c: '#CE9178', v: "'typescript'" }, { c: '#D4D4D4', v: ',' }] },
    { tokens: [{ c: '#D4D4D4', v: '  theme: ' }, { c: '#CE9178', v: "'dark'" }, { c: '#D4D4D4', v: ',' }] },
    { tokens: [{ c: '#D4D4D4', v: '  sync: ' }, { c: '#569CD6', v: 'true' }] },
    { tokens: [{ c: '#D4D4D4', v: '});' }] },
    { tokens: [] },
    { tokens: [{ c: '#6A9955', v: '// Start syncing changes' }] },
    { tokens: [{ c: '#4EC9B0', v: 'SyncEngine' }, { c: '#D4D4D4', v: '.' }, { c: '#DCDCAA', v: 'connect' }, { c: '#D4D4D4', v: '(session);' }] },
  ],
  'room.ts': [
    { tokens: [{ c: '#569CD6', v: 'export interface' }, { c: '#4EC9B0', v: ' Room' }, { c: '#D4D4D4', v: ' {' }] },
    { tokens: [{ c: '#D4D4D4', v: '  id: ' }, { c: '#4EC9B0', v: 'string' }, { c: '#D4D4D4', v: ';' }] },
    { tokens: [{ c: '#D4D4D4', v: '  lang: ' }, { c: '#4EC9B0', v: 'string' }, { c: '#D4D4D4', v: ';' }] },
    { tokens: [{ c: '#D4D4D4', v: '  peers: ' }, { c: '#4EC9B0', v: 'Peer' }, { c: '#D4D4D4', v: '[];' }] },
    { tokens: [{ c: '#D4D4D4', v: '}' }] },
    { tokens: [] },
    { tokens: [{ c: '#569CD6', v: 'export async function' }, { c: '#DCDCAA', v: ' createRoom' }, { c: '#D4D4D4', v: '(' }] },
    { tokens: [{ c: '#D4D4D4', v: '  opts: ' }, { c: '#4EC9B0', v: 'RoomOptions' }] },
    { tokens: [{ c: '#D4D4D4', v: '): ' }, { c: '#4EC9B0', v: 'Promise' }, { c: '#D4D4D4', v: '<' }, { c: '#4EC9B0', v: 'Room' }, { c: '#D4D4D4', v: '> {' }] },
    { tokens: [{ c: '#D4D4D4', v: '  ' }, { c: '#569CD6', v: 'return' }, { c: '#D4D4D4', v: ' ws.' }, { c: '#DCDCAA', v: 'open' }, { c: '#D4D4D4', v: '(opts);' }] },
    { tokens: [{ c: '#D4D4D4', v: '}' }] },
  ],
  'sync.ts': [
    { tokens: [{ c: '#569CD6', v: 'export class' }, { c: '#4EC9B0', v: ' SyncEngine' }, { c: '#D4D4D4', v: ' {' }] },
    { tokens: [{ c: '#D4D4D4', v: '  ' }, { c: '#569CD6', v: 'private' }, { c: '#D4D4D4', v: ' ws: ' }, { c: '#4EC9B0', v: 'WebSocket' }, { c: '#D4D4D4', v: ';' }] },
    { tokens: [] },
    { tokens: [{ c: '#D4D4D4', v: '  ' }, { c: '#DCDCAA', v: 'connect' }, { c: '#D4D4D4', v: '(room: ' }, { c: '#4EC9B0', v: 'Room' }, { c: '#D4D4D4', v: ') {' }] },
    { tokens: [{ c: '#D4D4D4', v: '    ' }, { c: '#569CD6', v: 'this' }, { c: '#D4D4D4', v: '.ws = ' }, { c: '#569CD6', v: 'new' }, { c: '#4EC9B0', v: ' WebSocket' }, { c: '#D4D4D4', v: '(room.id);' }] },
    { tokens: [{ c: '#D4D4D4', v: '    ' }, { c: '#569CD6', v: 'this' }, { c: '#D4D4D4', v: '.ws.' }, { c: '#DCDCAA', v: 'onmessage' }, { c: '#D4D4D4', v: ' = ' }, { c: '#D4D4D4', v: 'e => ' }, { c: '#569CD6', v: 'this' }, { c: '#D4D4D4', v: '.' }, { c: '#DCDCAA', v: 'apply' }, { c: '#D4D4D4', v: '(e);' }] },
    { tokens: [{ c: '#D4D4D4', v: '  }' }] },
    { tokens: [] },
    { tokens: [{ c: '#D4D4D4', v: '  ' }, { c: '#DCDCAA', v: 'apply' }, { c: '#D4D4D4', v: '(delta: ' }, { c: '#4EC9B0', v: 'Delta' }, { c: '#D4D4D4', v: ') {' }] },
    { tokens: [{ c: '#6A9955', v: '    // OT transform + broadcast' }] },
    { tokens: [{ c: '#D4D4D4', v: '  }' }] },
    { tokens: [{ c: '#D4D4D4', v: '}' }] },
  ],
};

/* two generic collaborator colors — no names, just like VS Code Live Share avatars */
const COLLAB_COLORS = ['#C9A84C', '#7EC9B8'];

const EditorMockup = () => {
  const [activeFile, setActiveFile]   = useState('index.ts');
  const [activeLine, setActiveLine]   = useState(4);
  const [cursorLines, setCursorLines] = useState([4, 8]);
  const [typingCol, setTypingCol]     = useState(0);

  /* cycle active line and cursor positions */
  useEffect(() => {
    const lines = CODE[activeFile];
    const iv = setInterval(() => {
      setActiveLine(p => {
        const next = p >= lines.length - 1 ? 0 : p + 1;
        return next;
      });
      setCursorLines(prev => prev.map(l => {
        const len = CODE[activeFile].length;
        return (l + 2) % len;
      }));
      setTypingCol(p => (p + 3) % 30);
    }, 1200);
    return () => clearInterval(iv);
  }, [activeFile]);

  const lines = CODE[activeFile];

  return (
    <div
      className="rounded-xl overflow-hidden shadow-2xl select-none"
      style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)', fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace" }}
    >
      {/* ── Activity bar (left strip, like VS Code) ── */}
      <div className="flex">
        <div className="flex flex-col items-center gap-5 px-2 py-4 border-r" style={{ background: '#333333', borderColor: 'rgba(255,255,255,0.06)', minWidth: 40 }}>
          {/* file explorer icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
            <rect x="2" y="2" width="5" height="12" rx="1" fill="#C5C5C5" />
            <rect x="9" y="5" width="5" height="9" rx="1" fill="#C5C5C5" />
          </svg>
          {/* search icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.4 }}>
            <circle cx="6" cy="6" r="4" stroke="#C5C5C5" strokeWidth="1.5" />
            <line x1="10" y1="10" x2="14" y2="14" stroke="#C5C5C5" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {/* git icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.4 }}>
            <circle cx="4" cy="4" r="2" stroke="#C5C5C5" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" stroke="#C5C5C5" strokeWidth="1.5" />
            <circle cx="12" cy="4" r="2" stroke="#C5C5C5" strokeWidth="1.5" />
            <line x1="4" y1="6" x2="12" y2="10" stroke="#C5C5C5" strokeWidth="1.2" />
          </svg>
        </div>

        {/* ── Sidebar file tree ── */}
        <div className="border-r py-3 px-2" style={{ background: '#252526', borderColor: 'rgba(255,255,255,0.06)', minWidth: 130 }}>
          <div className="text-xs uppercase tracking-wider mb-2 px-1" style={{ color: '#BBBBBB', fontSize: 10, letterSpacing: '0.1em' }}>Explorer</div>
          <div className="mb-1 px-1 text-xs" style={{ color: '#BBBBBB', opacity: 0.5, fontSize: 10 }}>▸ node_modules</div>
          <div className="mb-1 px-1 text-xs flex items-center gap-1" style={{ color: '#BBBBBB', opacity: 0.5, fontSize: 10 }}>▾ src</div>
          {FILES.map(f => (
            <button
              key={f}
              onClick={() => { setActiveFile(f); setActiveLine(0); }}
              className="w-full text-left pl-5 pr-2 py-0.5 rounded text-xs flex items-center gap-1.5 transition-colors"
              style={{
                fontSize: 11,
                color: activeFile === f ? '#FFFFFF' : '#BBBBBB',
                background: activeFile === f ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}
            >
              <span style={{ color: '#4EC9B0', fontSize: 9 }}>TS</span>
              {f}
            </button>
          ))}
          <div className="mt-1 px-1 text-xs" style={{ color: '#BBBBBB', opacity: 0.5, fontSize: 10 }}>  package.json</div>
          <div className="px-1 text-xs"      style={{ color: '#BBBBBB', opacity: 0.5, fontSize: 10 }}>  tsconfig.json</div>
        </div>

        {/* ── Main editor panel ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Tabs row */}
          <div className="flex items-center border-b" style={{ background: '#2D2D2D', borderColor: 'rgba(255,255,255,0.06)' }}>
            {FILES.map(f => (
              <button
                key={f}
                onClick={() => { setActiveFile(f); setActiveLine(0); }}
                className="px-4 py-2 text-xs border-r flex items-center gap-1.5 flex-shrink-0 transition-colors"
                style={{
                  fontSize: 11,
                  color: activeFile === f ? '#FFFFFF' : '#888888',
                  background: activeFile === f ? '#1E1E1E' : 'transparent',
                  borderColor: 'rgba(255,255,255,0.06)',
                  borderTop: activeFile === f ? '1px solid #C9A84C' : '1px solid transparent',
                }}
              >
                <span style={{ color: '#4EC9B0', fontSize: 9 }}>TS</span>
                {f}
              </button>
            ))}

            {/* collaborator avatars in tab bar — like VS Code Live Share */}
            <div className="ml-auto flex items-center gap-1.5 px-3">
              {COLLAB_COLORS.map((col, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: col, color: '#0B1120', fontSize: 9 }}
                  title={`Collaborator ${i + 1}`}
                >
                  {i + 1}
                </div>
              ))}
              <span className="text-xs ml-1" style={{ color: '#4A4A4A', fontSize: 10 }}>● Live</span>
            </div>
          </div>

          {/* Code area */}
          <div className="flex flex-1 overflow-hidden" style={{ maxHeight: 280 }}>

            {/* line numbers */}
            <div className="py-3 px-3 text-right flex-shrink-0 select-none" style={{ background: '#1E1E1E', color: '#858585', fontSize: 11, lineHeight: '20px', minWidth: 36 }}>
              {lines.map((_, li) => (
                <div key={li} style={{ color: activeLine === li ? '#C6C6C6' : '#5A5A5A' }}>{li + 1}</div>
              ))}
            </div>

            {/* code */}
            <div className="py-3 flex-1 overflow-x-auto">
              {lines.map((line, li) => (
                <div
                  key={li}
                  className="flex items-center relative"
                  style={{
                    lineHeight: '20px',
                    fontSize: 11,
                    paddingLeft: 8,
                    paddingRight: 16,
                    background: activeLine === li
                      ? 'rgba(255,255,255,0.04)'
                      : cursorLines.includes(li)
                      ? 'rgba(255,255,255,0.015)'
                      : 'transparent',
                    borderLeft: activeLine === li ? '1px solid rgba(201,168,76,0.4)' : '1px solid transparent',
                  }}
                >
                  {line.tokens.map((tok, ti) => (
                    <span key={ti} style={{ color: tok.c, whiteSpace: 'pre' }}>{tok.v}</span>
                  ))}

                  {/* collaborator cursor — blinking bar, no name label */}
                  {cursorLines[0] === li && (
                    <span
                      className="inline-block w-0.5 h-3.5 ml-0.5 animate-pulse align-middle"
                      style={{ background: COLLAB_COLORS[0], marginLeft: 1, verticalAlign: 'middle' }}
                    />
                  )}
                  {cursorLines[1] === li && (
                    <span
                      className="inline-block w-0.5 h-3.5 ml-0.5 animate-pulse align-middle"
                      style={{ background: COLLAB_COLORS[1], animationDelay: '0.5s', marginLeft: 1, verticalAlign: 'middle' }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* minimap strip */}
            <div className="flex-shrink-0 py-3" style={{ background: '#1E1E1E', width: 28, borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
              {lines.map((line, li) => (
                <div key={li} style={{ height: 2, marginBottom: 2.5, marginRight: 4, marginLeft: 4, borderRadius: 1, background: activeLine === li ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div
            className="flex items-center justify-between px-3 py-1 text-xs"
            style={{ background: '#007ACC', color: 'rgba(255,255,255,0.9)', fontSize: 10, fontFamily: 'monospace' }}
          >
            <div className="flex items-center gap-4">
              <span>⎇ main</span>
              <span>● Live Share</span>
            </div>
            <div className="flex items-center gap-4">
              <span>TypeScript</span>
              <span>UTF-8</span>
              <span>Ln {activeLine + 1}, Col {typingCol + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── data ───────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '⚡', title: 'Instant Sync',   desc: 'Sub-50ms propagation. Operational transforms resolve conflicts automatically.',    accent: '#C9A84C' },
  { icon: '🌐', title: 'Multi-Language', desc: '40+ runtimes — Node, Python, Rust, Go. Execute without leaving the editor.',      accent: '#7EC9B8' },
  { icon: '💬', title: 'Live Chat',      desc: 'Threads anchored to specific lines of code. Keep context without tab-switching.',  accent: '#A8C97E' },
  { icon: '👥', title: 'Team Presence',  desc: 'Colored cursors, follow-me mode, and full presence awareness across all files.',   accent: '#C97EC9' },
];

const STEPS = [
  { num: '01', title: 'Create a Room',   desc: 'One click opens a session. Share the link — nothing to install for guests.',  icon: '🚪' },
  { num: '02', title: 'Code Together',   desc: 'Edit, execute, and discuss simultaneously. Every keystroke syncs instantly.', icon: '💻' },
  { num: '03', title: 'Ship Faster',     desc: 'Deploy directly from the editor to the cloud. One-click to production.',      icon: '🚀' },
];

const STATS = [
  { value: 10000, suffix: '+', label: 'Active developers',   caption: 'and growing daily' },
  { value: 50000, suffix: '+', label: 'Code rooms created',  caption: 'across 80 countries' },
  { value: 99.9,  suffix: '%', label: 'Uptime SLA',          caption: 'enterprise reliability' },
];

const LOGOS = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'GitHub'];

/* ── shared variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

/* ═══════════════════════════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#0B1120', fontFamily: "'Lora', Georgia, serif", color: '#E8E3DA' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

        :root {
          --gold:      #C9A84C;
          --gold-pale: rgba(201,168,76,0.10);
          --gold-dim:  #8A6F2E;
          --navy:      #0B1120;
          --navy-3:    #1A2540;
          --cream:     #E8E3DA;
          --muted:     #8A94A6;
          --border:    rgba(201,168,76,0.15);
        }

        .display { font-family: 'Playfair Display', Georgia, serif; }
        .sans    { font-family: 'Instrument Sans', sans-serif; }

        .gold-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.35;
        }

        .section-label {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .ornament::before, .ornament::after {
          content: '—';
          opacity: 0.4;
          color: var(--gold);
          margin: 0 10px;
        }

        .cta-primary {
          background: linear-gradient(135deg, #C9A84C, #A07830);
          color: #0B1120;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 700;
          letter-spacing: 0.04em;
          transition: all 0.3s ease;
          box-shadow: 0 4px 28px rgba(201,168,76,0.28);
        }
        .cta-primary:hover {
          box-shadow: 0 8px 48px rgba(201,168,76,0.48);
          transform: translateY(-2px);
        }

        .cta-ghost {
          border: 1px solid rgba(201,168,76,0.3);
          color: var(--gold);
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.3s ease;
          background: transparent;
        }
        .cta-ghost:hover {
          background: var(--gold-pale);
          border-color: var(--gold);
          transform: translateY(-1px);
        }

        .feat-card {
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          transition: all 0.4s cubic-bezier(.22,1,.36,1);
        }
        .feat-card:hover {
          transform: translateY(-6px);
          border-color: var(--border);
          background: rgba(201,168,76,0.04);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.1);
        }

        .stat-card {
          border: 1px solid var(--border);
          background: var(--navy-3);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: var(--gold);
          box-shadow: 0 0 40px rgba(201,168,76,0.08);
        }

        .logo-chip {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          transition: all 0.3s ease;
          color: #4A5568;
        }
        .logo-chip:hover {
          border-color: rgba(201,168,76,0.2);
          color: var(--gold);
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .hero-shimmer {
          background: linear-gradient(90deg, var(--cream) 35%, var(--gold) 50%, var(--cream) 65%);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }

        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .float { animation: float-y 7s ease-in-out infinite; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--navy); }
        ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 3px; }
      `}</style>

      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-6 overflow-hidden">

        {/* background */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '700px', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 65%)' }} />
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${8 + i * 17}%`, width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.04), transparent)' }} />
          ))}
          <div className="absolute right-[6%] top-1/2 -translate-y-1/2 float pointer-events-none hidden xl:block" style={{ opacity: 0.05 }}>
            <svg width="360" height="360" viewBox="0 0 360 360" fill="none">
              <circle cx="180" cy="180" r="170" stroke="#C9A84C" strokeWidth="1" strokeDasharray="6 14" />
              <circle cx="180" cy="180" r="120" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3 10" />
              <circle cx="180" cy="180" r="70"  stroke="#C9A84C" strokeWidth="1" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid xl:grid-cols-2 gap-16 items-center relative z-10">

          {/* left — copy */}
          <div>
            <motion.h1
              className="display leading-none mb-8"
              style={{ fontSize: 'clamp(48px, 7vw, 86px)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <span className="hero-shimmer">Code Together,</span>
              <br />
              <span style={{ color: '#E8E3DA' }}>Build Faster.</span>
            </motion.h1>

            <motion.p
              className="text-lg leading-relaxed mb-10 max-w-xl"
              style={{ color: '#8A94A6', fontStyle: 'italic' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Real-time collaborative coding for modern teams.
              One room, every language, zero setup.
              Start in under ten seconds.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <button onClick={() => navigate('/dashboard')} className="cta-primary px-8 py-4 rounded-xl text-sm">
                Start Collaborating Free →
              </button>
              <button onClick={() => navigate('/features')} className="cta-ghost px-8 py-4 rounded-xl text-sm">
                See All Features
              </button>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-6 sans text-xs"
              style={{ color: '#4A5568', letterSpacing: '0.07em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              {['No credit card', 'Free forever tier', 'Open source core', 'SOC 2 compliant'].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <span style={{ color: '#C9A84C' }}>✦</span> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* right — editor */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <EditorMockup />
            <div className="mt-3 flex items-center justify-center gap-2 sans text-xs" style={{ color: '#4A5568' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              2 collaborators syncing live
            </div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: '#2D3748' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span className="sans text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-current to-transparent" />
        </motion.div>
      </section>

      <div className="gold-rule" />

      {/* ══ LOGOS ════════════════════════════════════════════════════ */}
      <section className="py-12 px-6" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center sans text-xs mb-8 tracking-widest uppercase"
            style={{ color: '#4A5568' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Trusted by teams at
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {LOGOS.map((l, i) => (
              <motion.div
                key={l}
                className="logo-chip sans font-semibold text-xs px-5 py-2.5 rounded-full"
                style={{ letterSpacing: '0.08em' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                {l}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ FEATURES ════════════════════════════════════════════════ */}
      <section className="py-28 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="section-label mb-4 ornament">Why CodeSync</div>
            <h2 className="display font-bold" style={{ fontSize: 'clamp(34px, 5vw, 56px)', color: '#E8E3DA' }}>
              Built for how developers actually work.
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed" style={{ color: '#8A94A6', fontStyle: 'italic' }}>
              Every feature earned its place. Nothing bloated, nothing missing.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="feat-card rounded-2xl p-7"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: `${f.accent}16`, border: `1px solid ${f.accent}28` }}
                >
                  {f.icon}
                </div>
                <h3 className="display font-bold text-lg mb-2" style={{ color: '#E8E3DA' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8A94A6', fontStyle: 'italic' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-10"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <button onClick={() => navigate('/features')} className="cta-ghost px-7 py-3.5 rounded-xl text-sm">
              View All 8 Features →
            </button>
          </motion.div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════ */}
      <section className="py-28 px-6 sm:px-12" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="section-label mb-4 ornament">Getting started</div>
            <h2 className="display font-bold" style={{ fontSize: 'clamp(34px, 5vw, 54px)', color: '#E8E3DA' }}>
              Three steps to ship together.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.num}
                className="relative p-8 rounded-2xl border text-center"
                style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -5, borderColor: 'rgba(201,168,76,0.2)' }}
              >
                <div className="display font-black italic absolute top-3 right-4 select-none"
                  style={{ fontSize: 64, color: 'rgba(201,168,76,0.07)', lineHeight: 1 }}>
                  {s.num}
                </div>
                <div className="relative z-10">
                  <div className="text-3xl mb-5">{s.icon}</div>
                  <h3 className="display font-bold text-xl mb-3" style={{ color: '#E8E3DA' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8A94A6', fontStyle: 'italic' }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ STATS ═════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-5">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="stat-card rounded-2xl p-8 text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="display font-black mb-1" style={{ fontSize: 'clamp(40px, 5vw, 56px)', color: '#C9A84C', lineHeight: 1 }}>
                  {s.suffix === '%'
                    ? <>{s.value}{s.suffix}</>
                    : <Counter to={s.value} suffix={s.suffix} />
                  }
                </div>
                <div className="sans font-semibold text-sm mt-2 mb-1" style={{ color: '#E8E3DA' }}>{s.label}</div>
                <div className="sans text-xs" style={{ color: '#4A5568', letterSpacing: '0.06em' }}>{s.caption}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ CTA ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 400px at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 float pointer-events-none select-none" style={{ opacity: 0.035 }}>
          <svg width="700" height="700" viewBox="0 0 700 700" fill="none">
            <circle cx="350" cy="350" r="340" stroke="#C9A84C" strokeWidth="1" strokeDasharray="8 16" />
            <circle cx="350" cy="350" r="260" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 12" />
            <circle cx="350" cy="350" r="160" stroke="#C9A84C" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-label mb-6 ornament">Start today</div>
            <h2 className="display font-black leading-none mb-6" style={{ fontSize: 'clamp(42px, 7vw, 80px)', color: '#E8E3DA' }}>
              Ready to code<br />
              <span className="display font-black italic" style={{ color: '#C9A84C' }}>together?</span>
            </h2>
            <p className="text-lg mb-10 max-w-md mx-auto leading-relaxed" style={{ color: '#8A94A6', fontStyle: 'italic' }}>
              Open a room in ten seconds. Invite your team with a link.
              No downloads, no accounts for guests.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button onClick={() => navigate('/dashboard')} className="cta-primary px-10 py-4 rounded-xl text-sm">
                Open a Room Free
              </button>
              <button onClick={() => navigate('/features')} className="cta-ghost px-10 py-4 rounded-xl text-sm">
                Explore Features
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 sans text-xs" style={{ color: '#4A5568', letterSpacing: '0.08em' }}>
              {['Free forever tier', 'No credit card', 'SOC 2 compliant', 'Open source'].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <span style={{ color: '#C9A84C' }}>✦</span> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="gold-rule" />
      <div className="py-6 text-center sans text-xs" style={{ color: '#2D3748' }}>
        © {new Date().getFullYear()} CodeSync · Crafted with precision
      </div>
    </div>
  );
};

export default Home;