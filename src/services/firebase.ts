import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZREClRI-Az-m4pKDgaeWr8pcX2rcUUnU",
  authDomain: "stock-news-application.firebaseapp.com",
  projectId: "stock-news-application",
  storageBucket: "stock-news-application.firebasestorage.app",
  messagingSenderId: "501179853822",
  appId: "1:501179853822:web:ccd2eef3764b4f15172eaf",
  measurementId: "G-5G9PF3GY50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };

// Providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
