import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';

/* ─── Animation helpers ─────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

/* ─── Skill pill ────────────────────────────────────────────────────────── */
const Pill = ({ label, color }) => (
  <span
    className="px-3 py-1 rounded-full text-xs font-semibold border"
    style={{ color, borderColor: `${color}55`, background: `${color}15` }}
  >
    {label}
  </span>
);

/* ─── Stat card ─────────────────────────────────────────────────────────── */
const Stat = ({ value, label, accent }) => (
  <motion.div variants={fadeUp} className="text-center">
    <div className="text-3xl font-black tracking-tighter" style={{ color: accent }}>
      {value}
    </div>
    <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{label}</div>
  </motion.div>
);

/* ─── Value card ────────────────────────────────────────────────────────── */
const ValueCard = ({ icon, title, desc, accent }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="group relative p-7 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-md overflow-hidden"
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}18 0%, transparent 70%)` }}
    />
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════════════ */
const About = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const skills = [
    { label: 'React', color: '#61dafb' },
    { label: 'Node.js', color: '#84cc16' },
    { label: 'Socket.IO', color: '#a78bfa' },
    { label: 'MongoDB', color: '#4ade80' },
    { label: 'TypeScript', color: '#60a5fa' },
    { label: 'Firebase', color: '#fb923c' },
    { label: 'Express', color: '#e2e8f0' },
    { label: 'Tailwind CSS', color: '#38bdf8' },
  ];

  const timeline = [
    { year: '2023', title: 'Started Coding', desc: 'Began my CS journey in third year of engineering, fell in love with building things on the web.' },
    { year: '2024', title: 'First Full-Stack App', desc: 'Built and deployed my first real full-stack application — learned the entire MERN stack hands-on.' },
    { year: '2025', title: 'Real-Time Obsession', desc: 'Discovered the magic of WebSockets and real-time systems. Started exploring collaborative tooling.' },
    { year: '2026', title: 'CodeSync Born', desc: 'Turned team collaboration frustration into CodeSync — a real-time collaborative coding platform.' },
  ];

  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">

      {/* ── Global background ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,#1e1b4b_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,#0f172a_0%,transparent_55%)]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center px-6 pt-24 pb-16"
      >
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Our Story
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-6xl sm:text-7xl font-black tracking-tighter leading-none mb-6"
          >
            Built by developers,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              for developers.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            CodeSync was born from real frustration: too many tools, not enough collaboration.
            We set out to build the editor we always wished existed.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* ══ ABOUT CODESYNC ════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
                Platform
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tighter text-white mb-6">
                About CodeSync
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  CodeSync is a modern real-time collaborative coding platform built for teams
                  who want to focus on code — not coordination overhead.
                </p>
                <p>
                  Every millisecond counts in real-time collaboration. That's why we obsess
                  over latency, reliability, and the tiny details that separate a tool you
                  tolerate from one you love.
                </p>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/8"
              >
                <Stat value="10K+" label="Active Users" accent="#818cf8" />
                <Stat value="50K+" label="Sessions" accent="#a78bfa" />
                <Stat value="99.9%" label="Uptime" accent="#e879f9" />
              </motion.div>
            </motion.div>

            {/* Feature card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/20 blur-sm" />
              <div className="relative rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl p-8">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-6">Built for Real-Time</h3>
                <ul className="space-y-4">
                  {[
                    { icon: '🔄', text: 'Instant code sync across all collaborators' },
                    { icon: '💬', text: 'Integrated chat — no switching tabs' },
                    { icon: '▶', text: 'One-click code execution in 10+ languages' },
                    { icon: '👥', text: 'Live presence — see who\'s in the room' },
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-sm flex-shrink-0">{f.icon}</span>
                      <span className="text-sm leading-relaxed">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ MEET THE CREATOR — HERO SPOTLIGHT ════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Section glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#312e81_0%,transparent_65%)] opacity-40" />

        <div className="relative max-w-6xl mx-auto">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              The Creator
            </span>
          </motion.div>

          {/* ── MAIN CREATOR CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden border border-white/10"
            style={{ background: 'linear-gradient(135deg, #0f1729 0%, #13102a 50%, #0f1729 100%)' }}
          >
            {/* Card inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative grid lg:grid-cols-5 gap-0">

              {/* LEFT — Identity panel */}
              <div className="lg:col-span-2 p-10 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-white/8">

                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  className="relative mb-6"
                >
                  {/* Rotating ring */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
                      padding: '3px',
                      borderRadius: '50%',
                      animation: 'spin 6s linear infinite',
                    }}
                  />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 flex items-center justify-center border-4 border-[#0f1729] shadow-2xl shadow-violet-900/50 z-10">
                    <span className="text-3xl font-black tracking-tight text-white">KK</span>
                  </div>

                  {/* Online dot */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0f1729] z-20 shadow-lg shadow-emerald-400/50" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                >
                  <h2 className="text-2xl font-black tracking-tight text-white mb-1">
                    Keertikumar H K
                  </h2>
                  <p className="text-sm font-semibold text-violet-400 mb-1">
                    Full Stack Developer
                  </p>
                  <p className="text-xs text-slate-500 mb-6">Bengaluru, India 🇮🇳</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {skills.map((s) => (
                      <Pill key={s.label} {...s} />
                    ))}
                  </div>

                  {/* Social links */}
                  <div className="flex gap-3 justify-center">
                    {[
                      {
                        href: 'https://github.com',
                        title: 'GitHub',
                        icon: (
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        ),
                        fill: true,
                      },
                      {
                        href: 'https://linkedin.com',
                        title: 'LinkedIn',
                        icon: (
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                        ),
                        fill: true,
                      },
                      {
                        href: 'mailto:keertikumar@example.com',
                        title: 'Email',
                        icon: (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        ),
                        fill: false,
                      },
                    ].map((link) => (
                      <motion.a
                        key={link.title}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.title}
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/15 hover:border-violet-500/40 transition-all"
                      >
                        <svg className="w-4 h-4" fill={link.fill ? 'currentColor' : 'none'} stroke={link.fill ? 'none' : 'currentColor'} viewBox="0 0 24 24">
                          {link.icon}
                        </svg>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* RIGHT — Story + Timeline */}
              <div className="lg:col-span-3 p-10 flex flex-col gap-8">

                {/* Quote */}
                <motion.blockquote
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative pl-5 border-l-2 border-violet-500"
                >
                  <p className="text-lg font-medium text-slate-200 leading-relaxed italic">
                    "I started CodeSync because I was tired of Googling 'how to share screen for code review' for the fifth time. There had to be a better way."
                  </p>
                  <span className="text-sm text-slate-500 mt-2 block">— Keertikumar H K</span>
                </motion.blockquote>

                {/* Bio */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3 text-slate-400 text-sm leading-relaxed"
                >
                  <p>
                    I'm a passionate full-stack developer and CS student from Bengaluru.
                    My journey began in my third year of engineering when I realised that
                    writing code was only half the challenge — the other half was actually
                    working <em>with</em> people on it.
                  </p>
                  <p>
                    I'm drawn to real-time systems, clean architecture, and the kind of
                    UI that gets out of your way. CodeSync is my answer to a problem I
                    felt personally — and I'm building it the way I'd want to use it.
                  </p>
                </motion.div>

                {/* Timeline */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">
                    Journey
                  </p>
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/60 via-violet-500/40 to-transparent" />

                    <div className="space-y-6">
                      {timeline.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                          className="flex gap-4"
                        >
                          {/* Dot */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-900/40 z-10">
                            {item.year.slice(2)}
                          </div>
                          <div className="pt-1.5">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-violet-400 font-semibold">{item.year}</span>
                              <span className="text-sm font-bold text-white">{item.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ MISSION & VISION ═════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Purpose</p>
            <h2 className="text-4xl font-black tracking-tighter text-white">Mission & Vision</h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              {
                icon: '🎯',
                title: 'Our Mission',
                accent: '#6366f1',
                text: 'To democratize real-time collaborative coding. Every developer — regardless of background or resources — deserves world-class collaboration tools. CodeSync removes the technical and financial barriers.',
              },
              {
                icon: '🚀',
                title: 'Our Vision',
                accent: '#8b5cf6',
                text: 'A world where remote teams collaborate as if they\'re in the same room. Where distance is not a barrier to building great software. Where the tools disappear and only the code remains.',
              },
            ].map((card) => (
              <ValueCard key={card.title} {...card} desc={card.text} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CORE VALUES ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Principles</p>
            <h2 className="text-4xl font-black tracking-tighter text-white">Core Values</h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: '⚡', title: 'Performance', desc: 'Sub-50ms latency. Speed is a feature, not an afterthought.', accent: '#fbbf24' },
              { icon: '✦', title: 'Simplicity', desc: 'Complex code, brutally simple UX. Complexity should be invisible.', accent: '#34d399' },
              { icon: '🔒', title: 'Reliability', desc: '99.9% uptime. We\'re here every time you need us, without exception.', accent: '#818cf8' },
            ].map((v) => <ValueCard key={v.title} {...v} />)}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,#1e1b4b_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl font-black tracking-tighter text-white mb-4 leading-tight">
              Ready to code<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                together?
              </span>
            </h2>
            <p className="text-slate-400 mb-10 text-lg">
              Join thousands of developers who've already made the switch.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-base shadow-xl shadow-indigo-900/40 transition-shadow"
            >
              Start Collaborating Today →
            </motion.button>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;