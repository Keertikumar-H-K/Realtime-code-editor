import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';

/* ── animated counter ───────────────────────────────────────────── */
const Counter = ({ to, suffix = '', duration = 2000 }) => {
  const [val, setVal]   = useState(0);
  const ref             = useRef(null);
  const inView          = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start     = 0;
    const steps   = 60;
    const inc     = to / steps;
    const iv = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(iv); }
      else setVal(Math.floor(start));
    }, duration / steps);
    return () => clearInterval(iv);
  }, [inView, to, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ── data ───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '⚡',
    number: '01',
    title: 'Instant Real-time Sync',
    subtitle: 'WebSocket Infrastructure',
    desc: 'Changes propagate across every connected editor in under 50ms. Operational transforms guarantee zero conflicts, even under simultaneous edits from dozens of collaborators.',
    tags: ['Sub-50ms', 'Conflict-free', 'Version history'],
    accent: '#C9A84C',
  },
  {
    icon: '🎨',
    number: '02',
    title: 'Advanced Code Styling',
    subtitle: 'Tree-sitter Powered',
    desc: 'Semantic syntax highlighting for 40+ languages. Intelligent auto-formatting, custom themes, and bracket-pair coloring that adapts to your workflow.',
    tags: ['40+ languages', 'Custom themes', 'Auto-format'],
    accent: '#7C9EC9',
  },
  {
    icon: '👥',
    number: '03',
    title: 'Team Collaboration',
    subtitle: 'Live Presence Engine',
    desc: "See every teammate's cursor, selection, and focus in real time. Named cursors, follow-me mode, and rich presence awareness across all open files.",
    tags: ['Live cursors', 'Follow mode', 'Presence map'],
    accent: '#7EC99A',
  },
  {
    icon: '💻',
    number: '04',
    title: 'Multi-Language Runtime',
    subtitle: 'Sandboxed Execution',
    desc: 'Execute Node.js, Python, Rust, Go, C++, Java and more in isolated containers. Instant output, error highlighting, and zero-setup environments.',
    tags: ['12 runtimes', 'Live output', 'Isolated sandbox'],
    accent: '#C97C7C',
  },
  {
    icon: '💬',
    number: '05',
    title: 'Integrated Chat',
    subtitle: 'Context-aware Threads',
    desc: 'Message threads anchored to specific lines of code. Keep conversations in context without leaving the editor. Full search, mentions, and persistent history.',
    tags: ['Line threads', 'Mentions', 'Search'],
    accent: '#C9A84C',
  },
  {
    icon: '🔒',
    number: '06',
    title: 'Enterprise Security',
    subtitle: 'SOC 2 Type II',
    desc: 'End-to-end encryption for every session. Role-based access control, SSO via SAML 2.0, and immutable audit logs that satisfy the strictest compliance requirements.',
    tags: ['E2E encryption', 'RBAC + SSO', 'Audit logs'],
    accent: '#7C9EC9',
  },
  {
    icon: '📊',
    number: '07',
    title: 'Analytics & Insights',
    subtitle: 'Team Intelligence',
    desc: 'Real-time dashboards tracking session health, per-user contributions, error rates, and team velocity — configurable to any time window.',
    tags: ['Live dashboards', 'Contributions', 'Velocity'],
    accent: '#7EC99A',
  },
  {
    icon: '🚀',
    number: '08',
    title: 'One-Click Deploy',
    subtitle: 'Cloud Native',
    desc: 'Push directly to Vercel, AWS, Netlify, Railway, or Fly.io from the editor. Preview URLs generated on every push. Rollback in one click.',
    tags: ['6 cloud targets', 'Preview URLs', '1-click rollback'],
    accent: '#C97C7C',
  },
];

const METRICS = [
  { value: 50,    suffix: 'ms',  label: 'Sync latency',       caption: 'Maximum' },
  { value: 99.9,  suffix: '%',   label: 'Uptime guarantee',   caption: 'Enterprise SLA' },
  { value: 10000, suffix: '+',   label: 'Concurrent sessions', caption: 'Proven scale' },
  { value: 40,    suffix: '+',   label: 'Languages',          caption: 'Supported runtimes' },
];

const WHY = [
  {
    icon: '📦',
    title: 'Zero configuration',
    desc: 'Open a room, share the link, begin. No installs, no accounts required for guests. Working in under ten seconds.',
  },
  {
    icon: '🔧',
    title: 'Developer-first API',
    desc: 'Comprehensive REST API, WebSocket SDK, and TypeScript types. Automate anything, integrate with your existing toolchain.',
  },
  {
    icon: '🌍',
    title: 'Global edge network',
    desc: 'Rooms intelligently route to the nearest of 18 edge regions. Collaboration feels local regardless of where your team sits.',
  },
];

const BUILT_FOR = [
  { title: 'RESTful API',    desc: 'Integrate with your workflow using our comprehensive REST API and webhook system.',    num: 'v2.4' },
  { title: 'CLI Tooling',    desc: 'Manage rooms, users, and deployments directly from your terminal.',                   num: 'npm' },
  { title: 'IDE Extensions', desc: 'VS Code, JetBrains, and Vim/Neovim extensions for native integration.',               num: '3 IDEs' },
  { title: 'Open Source',    desc: 'The core collaboration engine is open source. Fork, extend, and contribute.',         num: 'MIT' },
];

/* ─── fade-up variant ──────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

/* ═══════════════════════════════════════════════════════════════════ */
const Features = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: '#0B1120',
        fontFamily: "'Lora', Georgia, serif",
        color: '#E8E3DA',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Sans:wght@400;500;600&display=swap');

        :root {
          --gold:      #C9A84C;
          --gold-dim:  #8A6F2E;
          --gold-pale: rgba(201,168,76,0.12);
          --navy:      #0B1120;
          --navy-2:    #111827;
          --navy-3:    #1A2540;
          --cream:     #E8E3DA;
          --muted:     #8A94A6;
          --border:    rgba(201,168,76,0.15);
        }

        .display { font-family: 'Playfair Display', Georgia, serif; }
        .sans    { font-family: 'Instrument Sans', sans-serif; }

        /* gold shimmer line */
        .gold-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.4;
        }

        /* card hover glow */
        .feature-card {
          transition: transform 0.4s cubic-bezier(.22,1,.36,1),
                      box-shadow 0.4s ease,
                      border-color 0.4s ease,
                      background 0.4s ease;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: var(--border);
          background: rgba(201,168,76,0.04);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.1);
        }

        /* number watermark */
        .number-mark {
          font-family: 'Playfair Display', serif;
          font-size: 96px;
          font-weight: 900;
          font-style: italic;
          color: rgba(201,168,76,0.05);
          line-height: 1;
          user-select: none;
          position: absolute;
          top: -8px;
          right: -4px;
          transition: color 0.4s;
        }
        .feature-card:hover .number-mark { color: rgba(201,168,76,0.1); }

        /* gold tag */
        .gold-tag {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          border: 1px solid rgba(201,168,76,0.25);
          background: var(--gold-pale);
          padding: 2px 8px;
          border-radius: 3px;
        }

        /* metric card */
        .metric-card {
          background: var(--navy-3);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .metric-card:hover {
          border-color: var(--gold);
          box-shadow: 0 0 40px rgba(201,168,76,0.08);
        }

        /* decorative quote mark */
        .quote-mark {
          font-family: 'Playfair Display', serif;
          font-size: 120px;
          line-height: 0.8;
          color: var(--gold);
          opacity: 0.15;
          user-select: none;
        }

        /* CTA button */
        .cta-primary {
          background: linear-gradient(135deg, #C9A84C, #A07830);
          color: #0B1120;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.3s ease;
          box-shadow: 0 4px 24px rgba(201,168,76,0.3);
        }
        .cta-primary:hover {
          box-shadow: 0 8px 40px rgba(201,168,76,0.5);
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
        }

        /* section label */
        .section-label {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
        }

        /* ornament */
        .ornament::before,
        .ornament::after {
          content: '—';
          opacity: 0.4;
          color: var(--gold);
          margin: 0 10px;
        }

        /* built-for card */
        .built-card {
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          transition: all 0.3s ease;
        }
        .built-card:hover {
          border-color: rgba(201,168,76,0.2);
          background: rgba(201,168,76,0.03);
        }

        /* scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--navy); }
        ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 3px; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, var(--cream) 40%, var(--gold) 50%, var(--cream) 60%);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .float-slow { animation: float-slow 7s ease-in-out infinite; }
      `}</style>

      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-32 px-6 overflow-hidden">

        {/* background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
            width: '900px', height: '600px',
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
          }} />
          {/* vertical lines */}
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${10 + i * 20}%`,
              width: '1px',
              background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.04), transparent)',
            }} />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-label mb-6 ornament"
          >
            Feature Showcase
          </motion.div>

          <motion.h1
            className="display leading-none mb-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: 'clamp(52px, 8vw, 96px)' }}
          >
            <span className="shimmer-text">Packed with power.</span>
            <br />
            <span style={{ color: '#E8E3DA' }}>Built with care.</span>
          </motion.h1>

          <motion.p
            className="text-lg leading-relaxed max-w-2xl mx-auto mb-12"
            style={{ color: '#8A94A6', fontStyle: 'italic' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Everything your team needs to collaborate, build, and ship —
            refined into a single, elegant workspace.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <button className="cta-primary px-8 py-4 rounded-lg text-sm">
              Start Collaborating Free
            </button>
            <button className="cta-ghost px-8 py-4 rounded-lg text-sm">
              View Documentation →
            </button>
          </motion.div>

          {/* quick metrics row */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {METRICS.map((m, i) => (
              <div key={i} className="text-center">
                <div className="display font-black text-3xl" style={{ color: '#C9A84C' }}>
                  {m.suffix === '%' ? <>{m.value}{m.suffix}</> : <Counter to={m.value} suffix={m.suffix} />}
                </div>
                <div className="sans text-xs mt-1" style={{ color: '#8A94A6', letterSpacing: '0.08em' }}>
                  {m.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ FEATURES GRID ═════════════════════════════════════════════ */}
      <section className="py-28 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">

          <motion.div
            className="text-center mb-20"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="section-label mb-4 ornament">Everything included</div>
            <h2 className="display font-bold" style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#E8E3DA' }}>
              The complete feature set.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.number}
                className="feature-card rounded-2xl p-7 relative overflow-hidden"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i % 4}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* watermark number */}
                <div className="number-mark">{f.number}</div>

                {/* top row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}30` }}
                  >
                    {f.icon}
                  </div>
                </div>

                {/* subtitle tag */}
                <div className="gold-tag mb-3 inline-block">{f.subtitle}</div>

                {/* title */}
                <h3
                  className="display font-bold text-lg mb-3 leading-snug"
                  style={{ color: '#E8E3DA' }}
                >
                  {f.title}
                </h3>

                {/* desc */}
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: '#8A94A6', fontStyle: 'italic' }}
                >
                  {f.desc}
                </p>

                {/* divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 16 }} />

                {/* tags */}
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className="sans text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#8A94A6',
                        fontSize: 11,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)`,
                    opacity: hovered === i ? 0.8 : 0,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ WHY SECTION ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 sm:px-12" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* left: quote + text */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <div className="quote-mark leading-none mb-4 select-none">"</div>
              <h2
                className="display font-bold italic leading-tight mb-6"
                style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: '#E8E3DA', marginTop: -24 }}
              >
                Built for developers who care about the craft.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#8A94A6' }}>
                CodeSync isn't just a tool — it's an opinion about how software should be built together.
                Every decision prioritises speed, reliability, and the developer experience above all else.
              </p>

              <button className="cta-primary px-7 py-3.5 rounded-lg text-sm">
                See It in Action
              </button>
            </motion.div>

            {/* right: why cards */}
            <div className="space-y-4">
              {WHY.map((w, i) => (
                <motion.div
                  key={i}
                  className="built-card rounded-xl p-6 flex gap-5"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}
                  >
                    {w.icon}
                  </div>
                  <div>
                    <h3 className="display font-bold text-base mb-1" style={{ color: '#E8E3DA' }}>
                      {w.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#8A94A6', fontStyle: 'italic' }}>
                      {w.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ METRICS SECTION ═══════════════════════════════════════════ */}
      <section className="py-28 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">

          <motion.div
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="section-label mb-4 ornament">Performance you can trust</div>
            <h2 className="display font-bold" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#E8E3DA' }}>
              The numbers speak.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((m, i) => (
              <motion.div
                key={i}
                className="metric-card rounded-2xl p-8 text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div
                  className="display font-black mb-2"
                  style={{ fontSize: 'clamp(36px, 5vw, 52px)', color: '#C9A84C', lineHeight: 1 }}
                >
                  {m.suffix === '%'
                    ? <>{m.value}{m.suffix}</>
                    : <Counter to={m.value} suffix={m.suffix} />}
                </div>
                <div className="sans font-semibold text-sm mb-1" style={{ color: '#E8E3DA' }}>
                  {m.label}
                </div>
                <div className="sans text-xs" style={{ color: '#8A94A6', letterSpacing: '0.06em' }}>
                  {m.caption}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ BUILT FOR DEVS ════════════════════════════════════════════ */}
      <section className="py-28 px-6 sm:px-12" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-6xl mx-auto">

          <motion.div
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="section-label mb-4 ornament">Developer tooling</div>
            <h2 className="display font-bold" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#E8E3DA' }}>
              Built for developers.
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#8A94A6', fontStyle: 'italic' }}>
              Designed by developers, for developers. We prioritise what matters: speed, reliability, and an interface that gets out of your way.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {BUILT_FOR.map((item, i) => (
              <motion.div
                key={i}
                className="built-card rounded-2xl p-7 flex items-start gap-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i % 2}
              >
                <div
                  className="sans font-black text-lg flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: '#C9A84C',
                    fontSize: 12,
                    letterSpacing: '0.06em',
                  }}
                >
                  {item.num}
                </div>
                <div>
                  <h3 className="display font-bold text-lg mb-2" style={{ color: '#E8E3DA' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8A94A6', fontStyle: 'italic' }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-rule" />

      {/* ══ CTA ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">

        {/* subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }} />

        {/* decorative ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 float-slow pointer-events-none select-none">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" style={{ opacity: 0.04 }}>
            <circle cx="300" cy="300" r="280" stroke="#C9A84C" strokeWidth="1" strokeDasharray="6 12" />
            <circle cx="300" cy="300" r="200" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3 9" />
            <circle cx="300" cy="300" r="120" stroke="#C9A84C" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="section-label mb-6 ornament">Begin today</div>

            <h2
              className="display font-black leading-none mb-6"
              style={{ fontSize: 'clamp(42px, 7vw, 80px)', color: '#E8E3DA' }}
            >
              Ready to experience <br />
              <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>all of this?</span>
            </h2>

            <p
              className="text-lg mb-10 max-w-lg mx-auto leading-relaxed"
              style={{ color: '#8A94A6', fontStyle: 'italic' }}
            >
              Start collaborating with your team today.
              Free forever for small teams. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button className="cta-primary px-10 py-4 rounded-lg text-sm">
                Get Started — It's Free
              </button>
              <button className="cta-ghost px-10 py-4 rounded-lg text-sm">
                Talk to Sales
              </button>
            </div>

            {/* trust row */}
            <div
              className="flex flex-wrap items-center justify-center gap-8 sans text-xs"
              style={{ color: '#4A5568', letterSpacing: '0.08em' }}
            >
              {['No credit card required', 'Free for small teams', 'SOC 2 compliant', 'Open source core'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span style={{ color: '#C9A84C' }}>✦</span> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* footer rule */}
      <div className="gold-rule" />
      <div className="py-6 text-center sans text-xs" style={{ color: '#4A5568' }}>
        © {new Date().getFullYear()} CodeSync · Crafted with precision
      </div>
    </div>
  );
};

export default Features;