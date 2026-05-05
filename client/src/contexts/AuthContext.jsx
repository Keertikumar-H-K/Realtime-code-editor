import { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../utils/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName = null) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(result.user, { displayName });
      return result.user;
    } catch (err) { setError(err.message); throw err; }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) { setError(err.message); throw err; }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) { setError(err.message); throw err; }
  };

  // ✅ KEY FIX: Always destroys old verifier and creates fresh one.
  // React re-renders remove the DOM element the verifier was attached to,
  // causing "reCAPTCHA client element has been removed: 0".
  // The container div MUST live in index.html (outside React) so it never unmounts.
  const setupRecaptcha = (elementId = 'recaptcha-container') => {
    // Destroy any previous instance
    if (recaptchaVerifierRef.current) {
      try { recaptchaVerifierRef.current.clear(); } catch (_) {}
      recaptchaVerifierRef.current = null;
    }

    // Make sure the container exists in DOM right now
    const el = document.getElementById(elementId);
    if (!el) {
      throw new Error(
        `#${elementId} not found. Add <div id="recaptcha-container"></div> to index.html <body>.`
      );
    }

    const verifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        try { recaptchaVerifierRef.current?.clear(); } catch (_) {}
        recaptchaVerifierRef.current = null;
      },
    });

    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const loginWithPhone = async (phoneNumber, recaptchaVerifier) => {
    try {
      setError(null);
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return result;
    } catch (err) { setError(err.message); throw err; }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) { setError(err.message); throw err; }
  };

  const updateDisplayName = async (displayName) => {
    try {
      setError(null);
      await updateProfile(auth.currentUser, { displayName });
      setUser({ ...auth.currentUser });
    } catch (err) { setError(err.message); throw err; }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No authenticated user.');
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
    } catch (err) { setError(err.message); throw err; }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      signup, login, logout,
      loginWithGoogle,
      loginWithPhone,
      setupRecaptcha,
      updateDisplayName,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;