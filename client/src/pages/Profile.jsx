import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import NavbarUpgraded from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const API = 'http://localhost:3001/api';

/* ── helpers ──────────────────────────────────────────────────────── */
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const joinedDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

/* ── sub-components ───────────────────────────────────────────────── */
const Avatar = ({ user, size = 92 }) => {
  const letter = (user?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase();
  return (
    <div style={{ width: size, height: size, fontSize: size * 0.38 }} className="relative flex-shrink-0">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 blur-md opacity-50" />
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center font-black text-white shadow-2xl select-none">
        {letter}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, accent, delay = 0 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  const styles = {
    violet:  'from-violet-500/10  to-violet-500/5   border-violet-500/20  text-violet-400',
    fuchsia: 'from-fuchsia-500/10 to-fuchsia-500/5  border-fuchsia-500/20 text-fuchsia-400',
    cyan:    'from-cyan-500/10    to-cyan-500/5      border-cyan-500/20    text-cyan-400',
  };
  return (
    <div className={`bg-gradient-to-br border rounded-2xl p-5 transition-all duration-700 hover:scale-[1.02] cursor-default
      ${styles[accent]} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-2xl mb-3">{icon}</div>
      <div className={`text-2xl font-black tracking-tight mb-1 ${styles[accent].split(' ').pop()}`}>{value}</div>
      <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{label}</div>
    </div>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="bg-slate-900 border border-slate-700/60 rounded-3xl w-full max-w-md p-8 shadow-2xl"
      style={{ animation: 'modalIn .22s ease' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{label}</label>}
    <input {...props}
      className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all" />
  </div>
);

const Btn = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed';
  const v = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white hover:shadow-lg hover:shadow-violet-500/20',
    ghost:   'bg-slate-800 border border-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white',
    danger:  'bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600/20 hover:border-red-500/50',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  };
  return <button className={`${base} ${v[variant]} ${className}`} {...props}>{children}</button>;
};

const Toast = ({ message, type, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      animation: 'slideUp .3s ease',
      background: type === 'success' ? 'rgba(6,78,59,0.95)' : 'rgba(127,29,29,0.95)',
      borderColor: type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)',
      color: type === 'success' ? '#6ee7b7' : '#fca5a5',
    }}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-medium backdrop-blur-sm">
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
const Profile = () => {
  const { user, updateDisplayName, changePassword } = useAuth();
  const navigate = useNavigate();

  const [rooms, setRooms]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]             = useState(null);

  const [editName, setEditName]       = useState('');
  const [editSaving, setEditSaving]   = useState(false);

  const [pwCurrent, setPwCurrent]     = useState('');
  const [pwNew, setPwNew]             = useState('');
  const [pwConfirm, setPwConfirm]     = useState('');
  const [pwSaving, setPwSaving]       = useState(false);
  const [pwStrength, setPwStrength]   = useState(0);

  const [exporting, setExporting]     = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });

  /* fetch rooms */
  const fetchRooms = useCallback(async () => {
    if (!user) return;
    try {
      const res  = await fetch(`${API}/rooms/${user.uid}`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setEditName(user.displayName || '');
    fetchRooms();
  }, [user, navigate, fetchRooms]);

  /* password strength */
  useEffect(() => {
    let s = 0;
    if (pwNew.length >= 8)          s++;
    if (/[A-Z]/.test(pwNew))        s++;
    if (/[0-9]/.test(pwNew))        s++;
    if (/[^A-Za-z0-9]/.test(pwNew)) s++;
    setPwStrength(s);
  }, [pwNew]);

  /* edit profile */
  const handleEditSave = async () => {
    if (!editName.trim()) return;
    setEditSaving(true);
    try {
      await updateDisplayName(editName.trim());
      showToast('Profile updated!');
      setModal(null);
    } catch (e) {
      showToast(e.message || 'Failed to update profile', 'error');
    } finally {
      setEditSaving(false);
    }
  };

  /* change password */
  const handlePasswordChange = async () => {
    if (pwNew !== pwConfirm) { showToast('Passwords do not match', 'error'); return; }
    if (pwNew.length < 8)    { showToast('Password must be at least 8 characters', 'error'); return; }
    setPwSaving(true);
    try {
      await changePassword(pwCurrent, pwNew);
      showToast('Password changed successfully!');
      setModal(null);
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
    } catch (e) {
      const msg =
        e.code === 'auth/wrong-password'         ? 'Current password is incorrect' :
        e.code === 'auth/too-many-requests'      ? 'Too many attempts. Try again later.' :
        e.code === 'auth/requires-recent-login'  ? 'Session expired — please log out and back in.' :
        e.message || 'Failed to change password';
      showToast(msg, 'error');
    } finally {
      setPwSaving(false);
    }
  };

  /* delete session */
  const handleDeleteSession = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/rooms/${deleteTarget.roomId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setRooms((prev) => prev.filter((r) => r.roomId !== deleteTarget.roomId));
      showToast('Session deleted');
      setModal(null);
      setDeleteTarget(null);
    } catch (e) {
      showToast(e.message || 'Failed to delete session', 'error');
    } finally {
      setDeleting(false);
    }
  };

  /* export */
  const handleExport = async () => {
    setExporting(true);
    try {
      const payload = {
        profile: {
          uid:         user.uid,
          displayName: user.displayName,
          email:       user.email,
          joinedAt:    user.metadata?.creationTime,
        },
        stats: {
          totalSessions:  rooms.length,
          firstSession:   rooms.length > 0 ? rooms[rooms.length - 1].createdAt : null,
          latestSession:  rooms.length > 0 ? rooms[0].createdAt : null,
        },
        sessions: rooms.map((r) => ({
          roomId:    r.roomId,
          userName:  r.userName,
          createdAt: r.createdAt,
        })),
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const a = Object.assign(document.createElement('a'), {
        href:     URL.createObjectURL(blob),
        download: `devcollab-${user.uid.slice(0, 8)}.json`,
      });
      a.click();
      URL.revokeObjectURL(a.href);
      showToast('Data exported!');
      setModal(null);
    } catch {
      showToast('Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (!user) return null;

  const joinedLabel  = joinedDate(user.metadata?.creationTime);
  const strengthMeta = [
    { color: 'bg-red-500',     label: 'Weak'   },
    { color: 'bg-orange-500',  label: 'Fair'   },
    { color: 'bg-yellow-400',  label: 'Good'   },
    { color: 'bg-emerald-500', label: 'Strong' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        * { font-family: 'Space Grotesk', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .grid-bg {
          background-image:
            linear-gradient(rgba(139,92,246,.04) 1px, transparent 1px),
            linear-gradient(90deg,rgba(139,92,246,.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="min-h-screen bg-slate-950 text-white flex flex-col grid-bg">
        <NavbarUpgraded />

        {/* HERO */}
        <div className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 right-1/4 w-72 h-72 bg-fuchsia-600/6 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-7">
              <Avatar user={user} />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1.5">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                    {user.displayName || user.email?.split('@')[0] || 'Developer'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold uppercase tracking-widest">
                    Online
                  </span>
                </div>

                <p className="text-slate-400">{user.email}</p>

                <div className="flex flex-wrap gap-5 mt-3">
                  {joinedLabel && (
                    <span className="mono text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
                      Joined {joinedLabel}
                    </span>
                  )}
                  <span className="mono text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 inline-block" />
                    {user.uid.slice(0, 14)}…
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 self-start sm:self-center">
                <Btn variant="primary" onClick={() => setModal('edit')}>✏️ Edit Profile</Btn>
                <Btn variant="ghost"   onClick={() => setModal('password')}>🔑 Password</Btn>
                <Btn variant="ghost"   onClick={() => setModal('export')}>⬇️ Export</Btn>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* stats */}
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-slate-800/40 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Sessions"  value={rooms.length}                                              icon="🚀" accent="violet"  delay={0}   />
              <StatCard label="Joined"          value={joinedLabel || '—'}                                        icon="📅" accent="fuchsia" delay={80}  />
              <StatCard label="Latest Session"  value={rooms.length > 0 ? timeAgo(rooms[0].createdAt) : '—'}     icon="⚡" accent="cyan"    delay={160} />
            </div>
          )}

          {/* sessions list */}
          <div>
            <h2 className="text-lg font-bold text-white mb-5">
              Sessions
              <span className="ml-2.5 mono text-xs text-slate-500 font-normal">{rooms.length}</span>
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-slate-800/40 animate-pulse" />)}
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-3xl">
                <div className="text-5xl mb-4">🛸</div>
                <p className="text-slate-400 font-semibold">No sessions yet</p>
                <p className="text-slate-600 text-sm mt-1">Create a room to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {rooms.map((room, i) => (
                  <div key={room.roomId || i}
                    className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-slate-900/60 border border-slate-800/50 hover:border-violet-500/25 hover:bg-slate-900/80 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-sm flex-shrink-0">
                        🗂️
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white text-sm">Room</span>
                          <span className="mono text-violet-400 text-xs bg-violet-500/10 px-2 py-0.5 rounded-md">
                            {room.roomId}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5">
                          by <span className="text-slate-400">{room.userName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="mono text-slate-500 text-xs hidden sm:block">
                        {timeAgo(room.createdAt)}
                      </span>
                      <button
                        onClick={() => { setDeleteTarget(room); setModal('deleteSession'); }}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center text-xs"
                        title="Delete session"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* MODALS */}

      {modal === 'edit' && (
        <Modal title="Edit Profile" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <Field label="Display Name" value={editName} onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleEditSave()} />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email</label>
              <div className="w-full bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 py-3 text-slate-500 text-sm">
                {user.email}
                <span className="ml-2 text-slate-600 text-xs">(cannot be changed here)</span>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Btn variant="ghost"   className="flex-1" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant="primary" className="flex-1" onClick={handleEditSave} disabled={editSaving || !editName.trim()}>
                {editSaving ? 'Saving…' : 'Save Changes'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'password' && (
        <Modal title="Change Password" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Current Password" type="password" value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)} placeholder="••••••••" autoFocus />
            <Field label="New Password" type="password" value={pwNew}
              onChange={(e) => setPwNew(e.target.value)} placeholder="••••••••" />

            {pwNew.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[0,1,2,3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                      ${i < pwStrength ? strengthMeta[pwStrength - 1].color : 'bg-slate-700'}`} />
                  ))}
                </div>
                <p className={`text-xs font-medium ${
                  pwStrength <= 1 ? 'text-red-400' : pwStrength === 2 ? 'text-orange-400' :
                  pwStrength === 3 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {strengthMeta[Math.max(0, pwStrength - 1)].label}
                </p>
              </div>
            )}

            <Field label="Confirm New Password" type="password" value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)} placeholder="••••••••" />

            {pwNew && pwConfirm && pwNew !== pwConfirm && (
              <p className="text-red-400 text-xs">Passwords don't match</p>
            )}

            <div className="flex gap-3 pt-1">
              <Btn variant="ghost"   className="flex-1" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant="primary" className="flex-1" onClick={handlePasswordChange}
                disabled={pwSaving || !pwCurrent || !pwNew || !pwConfirm}>
                {pwSaving ? 'Updating…' : 'Update Password'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'export' && (
        <Modal title="Export Your Data" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/40 space-y-3 text-sm">
              <p className="text-slate-300 font-semibold mb-2">What's included:</p>
              {[
                { icon: '👤', text: `Profile — ${user.displayName || user.email}` },
                { icon: '📊', text: `${rooms.length} total sessions` },
                { icon: '🗂️', text: 'All room IDs and timestamps' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-slate-400">
                  <span>{item.icon}</span><span>{item.text}</span>
                  <span className="ml-auto text-emerald-400 text-xs">✓</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              Exported as <span className="mono text-slate-500">.json</span>. No passwords or tokens included.
            </p>
            <div className="flex gap-3">
              <Btn variant="ghost"   className="flex-1" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn variant="success" className="flex-1" onClick={handleExport} disabled={exporting}>
                {exporting ? 'Exporting…' : '⬇️ Download JSON'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'deleteSession' && deleteTarget && (
        <Modal title="Delete Session?" onClose={() => { setModal(null); setDeleteTarget(null); }}>
          <div className="space-y-5">
            <p className="text-slate-300 text-sm leading-relaxed">
              This will permanently delete session{' '}
              <span className="mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">{deleteTarget.roomId}</span>.
              {' '}This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Btn variant="ghost"  className="flex-1"
                onClick={() => { setModal(null); setDeleteTarget(null); }}>Cancel</Btn>
              <Btn variant="danger" className="flex-1" onClick={handleDeleteSession} disabled={deleting}>
                {deleting ? 'Deleting…' : '🗑 Delete Session'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
};

export default Profile;