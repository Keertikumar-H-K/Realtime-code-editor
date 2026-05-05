import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// ─── Country codes ────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code: '+91',  flag: '🇮🇳', name: 'India'         },
  { code: '+1',   flag: '🇺🇸', name: 'USA'           },
  { code: '+44',  flag: '🇬🇧', name: 'UK'            },
  { code: '+61',  flag: '🇦🇺', name: 'Australia'     },
  { code: '+1',   flag: '🇨🇦', name: 'Canada'        },
  { code: '+49',  flag: '🇩🇪', name: 'Germany'       },
  { code: '+33',  flag: '🇫🇷', name: 'France'        },
  { code: '+81',  flag: '🇯🇵', name: 'Japan'         },
  { code: '+86',  flag: '🇨🇳', name: 'China'         },
  { code: '+971', flag: '🇦🇪', name: 'UAE'           },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore'     },
  { code: '+60',  flag: '🇲🇾', name: 'Malaysia'      },
  { code: '+55',  flag: '🇧🇷', name: 'Brazil'        },
  { code: '+7',   flag: '🇷🇺', name: 'Russia'        },
  { code: '+82',  flag: '🇰🇷', name: 'South Korea'   },
  { code: '+92',  flag: '🇵🇰', name: 'Pakistan'      },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh'    },
  { code: '+94',  flag: '🇱🇰', name: 'Sri Lanka'     },
  { code: '+977', flag: '🇳🇵', name: 'Nepal'         },
  { code: '+20',  flag: '🇪🇬', name: 'Egypt'         },
];

// ─── Error message map ────────────────────────────────────────────────────────
const getErrorMessage = (code, rawMessage = '') => {
  const map = {
    'auth/user-not-found':                           'No account found with this email.',
    'auth/wrong-password':                           'Incorrect password.',
    'auth/invalid-credential':                       'Incorrect email or password.',
    'auth/invalid-email':                            'Invalid email address.',
    'auth/user-disabled':                            'This account has been disabled.',
    'auth/too-many-requests':                        'Too many attempts. Please try again later.',
    'auth/invalid-verification-code':               'Incorrect OTP. Please check and try again.',
    'auth/code-expired':                             'OTP has expired. Please request a new one.',
    'auth/invalid-phone-number':                     'Invalid phone number. Make sure country code is correct.',
    'auth/missing-phone-number':                     'Phone number is required.',
    'auth/popup-closed-by-user':                     'Sign-in popup was closed.',
    'auth/account-exists-with-different-credential':'An account exists with a different sign-in method.',
    'auth/captcha-check-failed':                     'reCAPTCHA failed. Please refresh and try again.',
    'auth/quota-exceeded':                           'SMS quota exceeded. Try again later or enable billing in Firebase.',
    'auth/missing-verification-code':               'Please enter the OTP.',
    'auth/network-request-failed':                   'Network error. Check your connection.',
    'auth/billing-not-enabled':                      'Firebase billing not enabled. Enable Blaze plan for phone auth.',
    'auth/internal-error':                           'Firebase internal error. Check console for details.',
    'auth/operation-not-allowed':                    'Phone sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.',
    'auth/web-storage-unsupported':                  'Your browser does not support web storage. Try disabling private mode.',
  };
  // ✅ Always show the real Firebase message if code is unknown
  return map[code] || rawMessage || `Error (${code || 'unknown'}). Check the browser console for details.`;
};

// ─── 6-digit OTP input ────────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const digits  = value.split('').concat(Array(6).fill('')).slice(0, 6);
  const refs    = Array.from({ length: 6 }, () => useRef(null));

  const handleKey = (e, idx) => {
    const key = e.key;

    if (key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[idx]) {
        next[idx] = '';
      } else if (idx > 0) {
        next[idx - 1] = '';
        refs[idx - 1].current?.focus();
      }
      onChange(next.join(''));
      return;
    }

    if (key === 'ArrowLeft' && idx > 0) {
      refs[idx - 1].current?.focus();
      return;
    }
    if (key === 'ArrowRight' && idx < 5) {
      refs[idx + 1].current?.focus();
      return;
    }

    if (!/^\d$/.test(key)) return;

    e.preventDefault();
    const next = [...digits];
    next[idx] = key;
    onChange(next.join(''));
    if (idx < 5) refs[idx + 1].current?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6).replace(/ /g, ''));
    // Focus last filled or next empty
    const nextIdx = Math.min(pasted.length, 5);
    refs[nextIdx].current?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          onChange={() => {}} // controlled via onKeyDown
          autoFocus={i === 0}
          style={{
            width: 44, height: 52,
            textAlign: 'center',
            fontSize: 22, fontWeight: 700,
            background: '#1e293b',
            border: `2px solid ${d ? '#6366f1' : '#334155'}`,
            borderRadius: 10,
            color: '#fff',
            outline: 'none',
            caretColor: 'transparent',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = '#818cf8'; }}
          onBlur={e => { e.target.style.borderColor = digits[i] ? '#6366f1' : '#334155'; }}
        />
      ))}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
const Login = () => {
  const navigate  = useNavigate();
  const { login, loginWithGoogle, loginWithPhone, setupRecaptcha } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // ── Tab: 'email' | 'phone' ────────────────────────────────────────────────
  const [tab,           setTab]           = useState('email');

  // ── Email state ───────────────────────────────────────────────────────────
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [showPassword,  setShowPassword]  = useState(false);

  // ── Phone state ───────────────────────────────────────────────────────────
  const [country,       setCountry]       = useState(COUNTRIES[0]);
  const [phoneNumber,   setPhoneNumber]   = useState('');
  const [otp,           setOtp]           = useState('');
  const [otpSent,       setOtpSent]       = useState(false);
  const [resendTimer,   setResendTimer]   = useState(0);
  const [confirmResult, setConfirmResult] = useState(null);

  // ── Shared state ──────────────────────────────────────────────────────────
  const [isLoading,     setIsLoading]     = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');

  const timerRef = useRef(null);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    timerRef.current = setTimeout(() => setResendTimer(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [resendTimer]);

  // ── Email login ───────────────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('[Email login]', err.code, err.message);
      setError(getErrorMessage(err.code, err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google login ──────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError(''); setSuccess('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('[Google login]', err.code, err.message);
      setError(getErrorMessage(err.code, err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }

    const fullNumber = `${country.code}${cleaned}`;
    setIsLoading(true);

    try {
      // ✅ FIX: setupRecaptcha returns the verifier (stored in AuthContext ref)
      const verifier = setupRecaptcha('recaptcha-container');
      const result   = await loginWithPhone(fullNumber, verifier);
      setConfirmResult(result);
      setOtpSent(true);
      setResendTimer(30);
      setSuccess(`OTP sent to ${fullNumber}`);
    } catch (err) {
      console.error('[Send OTP]', err.code, err.message);
      setError(getErrorMessage(err.code, err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (otp.replace(/\D/g, '').length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsLoading(true);
    try {
      await confirmResult.confirm(otp);
      navigate('/dashboard');
    } catch (err) {
      console.error('[Verify OTP]', err.code, err.message);
      setError(getErrorMessage(err.code, err.message));
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp('');
    setOtpSent(false);
    setConfirmResult(null);
    setError('');
    setSuccess('');
  };

  // ── Reset phone flow ──────────────────────────────────────────────────────
  const resetPhone = () => {
    setOtpSent(false);
    setConfirmResult(null);
    setOtp('');
    setPhoneNumber('');
    setError('');
    setSuccess('');
    setResendTimer(0);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
      >
        {theme === 'dark'
          ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        }
      </button>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl mb-3 shadow-lg shadow-indigo-900/40">
            ⌨
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">CodeSync</h1>
          <p className="mt-1 text-slate-400 text-sm">Real-time collaborative coding</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">

          {/* ── Tab switcher ── */}
          <div className="flex rounded-xl bg-slate-900/60 p-1 mb-6 gap-1">
            {[
              { id: 'email', label: '✉ Email',  },
              { id: 'phone', label: '📱 Phone',  },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(''); setSuccess(''); resetPhone(); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: tab === t.id
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'transparent',
                  color: tab === t.id ? '#fff' : '#94a3b8',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Error / Success banners ── */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">✕</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* ════════════════════════════════════════
              EMAIL TAB
          ════════════════════════════════════════ */}
          {tab === 'email' && (
            <>
              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full mb-5 py-3 px-4 bg-white border border-slate-300 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-slate-800/60 text-slate-500">or sign in with email</span>
                </div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {isLoading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</span>
                    : 'Sign In'
                  }
                </button>
              </form>
            </>
          )}

          {/* ════════════════════════════════════════
              PHONE TAB
          ════════════════════════════════════════ */}
          {tab === 'phone' && (
            <>
              {!otpSent ? (
                /* ── Step 1: Enter phone ── */
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>

                    {/* Country + number row */}
                    <div className="flex gap-2">
                      {/* Country selector */}
                      <div className="relative flex-shrink-0">
                        <select
                          value={country.code + country.name}
                          onChange={e => {
                            const found = COUNTRIES.find(c => c.code + c.name === e.target.value);
                            if (found) setCountry(found);
                          }}
                          className="appearance-none pl-3 pr-8 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                          style={{ minWidth: 90 }}
                        >
                          {COUNTRIES.map(c => (
                            <option key={c.code + c.name} value={c.code + c.name}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Phone number input */}
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        required
                        maxLength={15}
                        className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono tracking-wider"
                      />
                    </div>

                    {/* Preview */}
                    {phoneNumber && (
                      <p className="mt-1.5 text-xs text-slate-500">
                        Will send OTP to{' '}
                        <span className="text-indigo-400 font-mono">
                          {country.code} {phoneNumber}
                        </span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phoneNumber.length < 7}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    {isLoading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP…</>
                      : <>📱 Send OTP</>
                    }
                  </button>

                  <p className="text-center text-xs text-slate-600">
                    We'll send a 6-digit code via SMS. Standard rates may apply.
                  </p>
                </form>

              ) : (
                /* ── Step 2: Enter OTP ── */
                <form onSubmit={handleVerifyOtp} className="space-y-6">

                  {/* Phone display */}
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">OTP sent to</p>
                    <p className="text-white font-mono font-bold text-lg mt-0.5">
                      {country.code} {phoneNumber}
                    </p>
                    <button
                      type="button"
                      onClick={resetPhone}
                      className="text-indigo-400 text-xs mt-1 hover:underline"
                    >
                      Change number
                    </button>
                  </div>

                  {/* 6-digit OTP boxes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
                      Enter 6-digit OTP
                    </label>
                    <OtpInput value={otp} onChange={setOtp} />
                  </div>

                  {/* Verify button */}
                  <button
                    type="submit"
                    disabled={isLoading || otp.replace(/\D/g, '').length !== 6}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    {isLoading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying…</>
                      : '✓ Verify & Sign In'
                    }
                  </button>

                  {/* Resend */}
                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-slate-500 text-sm">
                        Resend OTP in{' '}
                        <span className="text-indigo-400 font-mono font-bold">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-indigo-400 text-sm hover:underline"
                      >
                        Didn't receive it? Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </>
          )}

          {/* ── Sign up link ── */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/*
        recaptcha-container is in index.html (outside React) so it
        never gets removed by re-renders. Do NOT add it here.
      */}
    </div>
  );
};

export default Login;