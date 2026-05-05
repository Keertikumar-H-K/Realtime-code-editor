import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC69q9ZR_Qpj3Tp29YscGnGzi2atuMhexI",
  authDomain: "codesync-f3b26.firebaseapp.com",
  projectId: "codesync-f3b26",
  storageBucket: "codesync-f3b26.appspot.com", // ✅ FIXED
  messagingSenderId: "129189548044",
  appId: "1:129189548044:web:9274ff008be37bbd70de29",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();