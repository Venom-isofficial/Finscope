/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserSettings, WatchlistItem, SavedArticle, PriceAlert, RecentSearch, NotificationItem, ChatMessage } from "../types";
import { auth, db, googleProvider, appleProvider } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";

// Helper for Firestore Errors as mandated by the firebase-integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || "guest_user_id",
      email: auth.currentUser?.email || "guest@finscope.ai",
      emailVerified: auth.currentUser?.emailVerified || true,
      isAnonymous: auth.currentUser?.isAnonymous || false,
    },
    operationType,
    path
  };
  console.error('Firestore Error Captured: ', JSON.stringify(errInfo));
  // Throwing custom JSON string error as required by the skill
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  user: UserProfile | null;
  settings: UserSettings;
  watchlist: WatchlistItem[];
  savedArticles: SavedArticle[];
  alerts: PriceAlert[];
  recentSearches: RecentSearch[];
  notifications: NotificationItem[];
  chatHistory: ChatMessage[];
  loading: boolean;
  guestMode: boolean;
  
  // Actions
  loginWithEmail: (email: string, name?: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  
  // Watchlist Actions
  addToWatchlist: (symbol: string, name: string, type: "stock" | "crypto" | "etf") => Promise<void>;
  removeFromWatchlist: (symbol: string) => Promise<void>;
  
  // Bookmarks Actions
  saveArticle: (article: any) => Promise<void>;
  unsaveArticle: (newsId: string) => Promise<void>;
  
  // Price Alerts Actions
  addPriceAlert: (symbol: string, name: string, price: number, condition: "above" | "below", type: "price" | "news") => Promise<void>;
  toggleAlertActive: (alertId: string) => Promise<void>;
  deleteAlert: (alertId: string) => Promise<void>;
  
  // Search History Actions
  addSearchQuery: (query: string, type: string) => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  
  // Settings Actions
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  clearCache: () => void;
  
  // Chat Actions
  addChatMessage: (sender: "user" | "ai", message: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  
  // Notification Actions
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [guestMode, setGuestMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Core Local Storage backing states for 100% stable sandbox demo execution
  const [settings, setSettingsState] = useState<UserSettings>({
    userId: "guest",
    theme: "dark-green",
    language: "English",
    currency: "USD",
    country: "United States",
    pushNotifications: true,
    emailNotifications: false,
    updatedAt: new Date().toISOString()
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Subscribe to Firebase Auth and sync state
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setGuestMode(false);
        localStorage.removeItem("finscope_guest");

        // Load or create User Profile in Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        let profile: UserProfile | null = null;

        // Resolve name and profile pic according to Google / Apple preference
        let resolvedName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Investor";
        let resolvedPhotoURL = firebaseUser.photoURL || "";

        const googleProvider = firebaseUser.providerData?.find(p => p.providerId === "google.com");
        const appleProvider = firebaseUser.providerData?.find(p => p.providerId === "apple.com");

        if (googleProvider) {
          if (googleProvider.displayName) resolvedName = googleProvider.displayName;
          if (googleProvider.photoURL) resolvedPhotoURL = googleProvider.photoURL;
        } else if (appleProvider) {
          if (appleProvider.displayName) resolvedName = appleProvider.displayName;
          if (appleProvider.photoURL) resolvedPhotoURL = appleProvider.photoURL;
        }

        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const existingData = userDocSnap.data();
            profile = {
              uid: firebaseUser.uid,
              name: resolvedName,
              photoURL: resolvedPhotoURL,
              email: firebaseUser.email || existingData.email || "",
              country: existingData.country || "United States",
              membership: existingData.membership || "Premium",
              createdAt: existingData.createdAt || new Date().toISOString()
            };
            // Sync resolved profile back to Firestore
            await setDoc(userDocRef, profile, { merge: true });
          } else {
            // Create profile
            profile = {
              uid: firebaseUser.uid,
              name: resolvedName,
              photoURL: resolvedPhotoURL,
              email: firebaseUser.email || "",
              country: "United States",
              membership: "Premium",
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profile);
          }
          setUser(profile);
          localStorage.setItem("finscope_user", JSON.stringify(profile));
        } catch (err) {
          console.warn("Firestore error loading profile, falling back to local user profile", err);
          // Fallback to local profile
          const localUserStr = localStorage.getItem("finscope_user");
          const localProfile = localUserStr ? JSON.parse(localUserStr) : null;
          if (localProfile && localProfile.uid === firebaseUser.uid) {
            const updatedProfile = {
              ...localProfile,
              name: resolvedName,
              photoURL: resolvedPhotoURL
            };
            setUser(updatedProfile);
            localStorage.setItem("finscope_user", JSON.stringify(updatedProfile));
          } else {
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: resolvedName,
              photoURL: resolvedPhotoURL,
              email: firebaseUser.email || "",
              country: "United States",
              membership: "Premium",
              createdAt: new Date().toISOString()
            };
            setUser(fallbackProfile);
            localStorage.setItem("finscope_user", JSON.stringify(fallbackProfile));
          }
        }

        // Set up real-time firestore listeners with fallback
        
        // 1. Settings
        const settingsRef = doc(db, "users", firebaseUser.uid, "settings", "preferences");
        const unsubSettings = onSnapshot(settingsRef, (snapshot) => {
          if (snapshot.exists()) {
            setSettingsState(snapshot.data() as UserSettings);
          }
        }, (error) => {
          console.warn("Firestore settings listener permission denied, using local config");
        });

        // 2. Watchlist
        const watchlistQuery = query(collection(db, "users", firebaseUser.uid, "watchlist"), orderBy("addedAt", "desc"));
        const unsubWatchlist = onSnapshot(watchlistQuery, (snapshot) => {
          const items: WatchlistItem[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as WatchlistItem);
          });
          setWatchlist(items);
          localStorage.setItem("finscope_watchlist", JSON.stringify(items));
        }, (error) => {
          console.warn("Firestore watchlist listener permission denied, using local storage");
          const localWatch = localStorage.getItem("finscope_watchlist");
          if (localWatch) setWatchlist(JSON.parse(localWatch));
        });

        // 3. Saved Articles
        const savedArticlesQuery = query(collection(db, "users", firebaseUser.uid, "savedArticles"), orderBy("savedAt", "desc"));
        const unsubSaved = onSnapshot(savedArticlesQuery, (snapshot) => {
          const items: SavedArticle[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as SavedArticle);
          });
          setSavedArticles(items);
          localStorage.setItem("finscope_saved_articles", JSON.stringify(items));
        }, (error) => {
          console.warn("Firestore savedArticles listener permission denied, using local storage");
          const localSaved = localStorage.getItem("finscope_saved_articles");
          if (localSaved) setSavedArticles(JSON.parse(localSaved));
        });

        // 4. Alerts
        const alertsQuery = query(collection(db, "users", firebaseUser.uid, "alerts"), orderBy("createdAt", "desc"));
        const unsubAlerts = onSnapshot(alertsQuery, (snapshot) => {
          const items: PriceAlert[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as PriceAlert);
          });
          setAlerts(items);
          localStorage.setItem("finscope_alerts", JSON.stringify(items));
        }, (error) => {
          console.warn("Firestore alerts listener permission denied, using local storage");
          const localAlerts = localStorage.getItem("finscope_alerts");
          if (localAlerts) setAlerts(JSON.parse(localAlerts));
        });

        // 5. Notifications
        const notificationsQuery = query(collection(db, "users", firebaseUser.uid, "notifications"), orderBy("timestamp", "desc"));
        const unsubNotifications = onSnapshot(notificationsQuery, (snapshot) => {
          const items: NotificationItem[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as NotificationItem);
          });
          setNotifications(items);
          localStorage.setItem("finscope_notifications", JSON.stringify(items));
        }, (error) => {
          console.warn("Firestore notifications listener permission denied, using local storage");
          const localNotifs = localStorage.getItem("finscope_notifications");
          if (localNotifs) setNotifications(JSON.parse(localNotifs));
        });

        // 6. Chat History
        const chatQuery = query(collection(db, "users", firebaseUser.uid, "chatHistory"), orderBy("timestamp", "asc"));
        const unsubChat = onSnapshot(chatQuery, (snapshot) => {
          const items: ChatMessage[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as ChatMessage);
          });
          if (items.length > 0) {
            setChatHistory(items);
            localStorage.setItem("finscope_chat", JSON.stringify(items));
          } else {
            // Initialize with welcome message if empty
            const initialMsg: ChatMessage = {
              id: "c_1",
              userId: firebaseUser.uid,
              sender: "ai",
              message: "Hello! I am your FinScope AI financial assistant. Ask me anything about today's market trend, individual stocks, cryptocurrency technicals, or ETF allocations.",
              timestamp: new Date().toISOString()
            };
            setDoc(doc(db, "users", firebaseUser.uid, "chatHistory", "c_1"), initialMsg).catch(console.error);
            setChatHistory([initialMsg]);
            localStorage.setItem("finscope_chat", JSON.stringify([initialMsg]));
          }
        }, (error) => {
          console.warn("Firestore chatHistory listener permission denied, using local storage");
          const localChat = localStorage.getItem("finscope_chat");
          if (localChat) {
            setChatHistory(JSON.parse(localChat));
          } else {
            const initialMsg: ChatMessage = {
              id: "c_1",
              userId: firebaseUser.uid,
              sender: "ai",
              message: "Hello! I am your FinScope AI financial assistant. Ask me anything about today's market trend, individual stocks, cryptocurrency technicals, or ETF allocations.",
              timestamp: new Date().toISOString()
            };
            setChatHistory([initialMsg]);
            localStorage.setItem("finscope_chat", JSON.stringify([initialMsg]));
          }
        });

        setLoading(false);

        return () => {
          unsubSettings();
          unsubWatchlist();
          unsubSaved();
          unsubAlerts();
          unsubNotifications();
          unsubChat();
        };

      } else {
        // No Firebase user
        const persistedGuest = localStorage.getItem("finscope_guest");
        if (persistedGuest === "true") {
          setGuestMode(true);
          setUser({
            uid: "guest_user",
            name: "Ashish",
            email: "guest@finscope.ai",
            country: "United States",
            membership: "Premium",
            createdAt: new Date().toISOString()
          });
        } else {
          setUser(null);
          setGuestMode(false);
        }

        // Load local configurations for offline/guest mode
        const persistedSettings = localStorage.getItem("finscope_settings");
        const persistedWatchlist = localStorage.getItem("finscope_watchlist");
        const persistedSaved = localStorage.getItem("finscope_saved_articles");
        const persistedAlerts = localStorage.getItem("finscope_alerts");
        const persistedSearches = localStorage.getItem("finscope_searches");
        const persistedNotifs = localStorage.getItem("finscope_notifications");
        const persistedChat = localStorage.getItem("finscope_chat");

        if (persistedSettings) setSettingsState(JSON.parse(persistedSettings));
        
        if (persistedWatchlist) {
          setWatchlist(JSON.parse(persistedWatchlist));
        } else {
          const defaultWatch = [
            { id: "w_1", userId: "guest", symbol: "AAPL", name: "Apple Inc.", type: "stock", addedAt: new Date().toISOString() },
            { id: "w_2", userId: "guest", symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", addedAt: new Date().toISOString() },
            { id: "w_3", userId: "guest", symbol: "BTC", name: "Bitcoin", type: "crypto", addedAt: new Date().toISOString() },
            { id: "w_4", userId: "guest", symbol: "QQQ", name: "Invesco QQQ Trust", type: "etf", addedAt: new Date().toISOString() }
          ] as WatchlistItem[];
          setWatchlist(defaultWatch);
        }

        if (persistedSaved) setSavedArticles(JSON.parse(persistedSaved));
        
        if (persistedAlerts) {
          setAlerts(JSON.parse(persistedAlerts));
        } else {
          const defaultAlerts = [
            { id: "a_1", userId: "guest", symbol: "AAPL", name: "Apple Inc.", targetPrice: 190.00, condition: "above", type: "price", isActive: true, createdAt: new Date().toISOString() },
            { id: "a_2", userId: "guest", symbol: "BTC", name: "Bitcoin", targetPrice: 65000.00, condition: "below", type: "price", isActive: true, createdAt: new Date().toISOString() }
          ] as PriceAlert[];
          setAlerts(defaultAlerts);
        }

        if (persistedSearches) setRecentSearches(JSON.parse(persistedSearches));

        if (persistedNotifs) {
          setNotifications(JSON.parse(persistedNotifs));
        } else {
          const defaultNotifs = [
            {
              id: "n_1",
              userId: "guest",
              title: "Market Alert: Apple breakout",
              message: "Apple Inc. (AAPL) rose 1.94% today, breaking past local resistance of $180.00.",
              category: "Today",
              type: "price_alert",
              isRead: false,
              timestamp: new Date().toISOString()
            },
            {
              id: "n_2",
              userId: "guest",
              title: "AI Analysis Ready",
              message: "Your customized morning market digest summary has been prepared by FinScope AI.",
              category: "Today",
              type: "system",
              isRead: false,
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          ] as NotificationItem[];
          setNotifications(defaultNotifs);
        }

        if (persistedChat) {
          setChatHistory(JSON.parse(persistedChat));
        } else {
          setChatHistory([
            { id: "c_1", userId: "guest", sender: "ai", message: "Hello! I am your FinScope AI financial assistant. Ask me anything about today's market trend, individual stocks, cryptocurrency technicals, or ETF allocations.", timestamp: new Date().toISOString() }
          ]);
        }

        setLoading(false);
      }
    }, (error) => {
      console.error("Firebase auth state change error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync settings theme to document body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dark-green", "theme-light", "theme-midnight");
    
    if (settings.theme === "dark-green") {
      root.classList.add("theme-dark-green");
      root.style.setProperty("--bg-primary", "#071C16");
      root.style.setProperty("--bg-secondary", "#0D2B22");
      root.style.setProperty("--bg-card", "#163A2D");
      root.style.setProperty("--text-primary", "#FFFFFF");
      root.style.setProperty("--text-secondary", "#A6B0AA");
      root.style.setProperty("--accent", "#B6FF5A");
      root.style.setProperty("--accent-highlight", "#D8FF7E");
      root.style.setProperty("--btn-accent", "#A6FF4D");
      root.style.setProperty("--chart-green", "#92FF5A");
      root.style.setProperty("--chart-red", "#FF5D5D");
    } else if (settings.theme === "midnight") {
      root.classList.add("theme-midnight");
      root.style.setProperty("--bg-primary", "#090D16");
      root.style.setProperty("--bg-secondary", "#111726");
      root.style.setProperty("--bg-card", "#1A233A");
      root.style.setProperty("--text-primary", "#FFFFFF");
      root.style.setProperty("--text-secondary", "#8E9AA8");
      root.style.setProperty("--accent", "#38BDF8");
      root.style.setProperty("--accent-highlight", "#7DD3FC");
      root.style.setProperty("--btn-accent", "#0ea5e9");
      root.style.setProperty("--chart-green", "#34D399");
      root.style.setProperty("--chart-red", "#EF4444");
    } else {
      root.classList.add("theme-light");
      root.style.setProperty("--bg-primary", "#F3F5F4");
      root.style.setProperty("--bg-secondary", "#E1E5E3");
      root.style.setProperty("--bg-card", "#FFFFFF");
      root.style.setProperty("--text-primary", "#0F1A15");
      root.style.setProperty("--text-secondary", "#596660");
      root.style.setProperty("--accent", "#0D593F");
      root.style.setProperty("--accent-highlight", "#168B64");
      root.style.setProperty("--btn-accent", "#10B981");
      root.style.setProperty("--chart-green", "#10B981");
      root.style.setProperty("--chart-red", "#DC2626");
    }
  }, [settings.theme]);

  // Auth Operations using Firebase auth
  const loginWithEmail = async (email: string, name?: string, password?: string) => {
    const securePassword = password || "default_secure_password_123!";
    try {
      if (name) {
        // Registration flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, securePassword);
        const firebaseUser = userCredential.user;
        const parsedName = name || email.split("@")[0];
        
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: parsedName.charAt(0).toUpperCase() + parsedName.slice(1),
          email,
          country: "United States",
          membership: "Pro",
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, "users", firebaseUser.uid), profile);
        setUser(profile);
      } else {
        // Login flow
        const userCredential = await signInWithEmailAndPassword(auth, email, securePassword);
        const firebaseUser = userCredential.user;
        
        const userDocSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDocSnap.exists()) {
          setUser(userDocSnap.data() as UserProfile);
        } else {
          const profile: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || email.split("@")[0] || "Investor",
            email,
            country: "United States",
            membership: "Pro",
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, "users", firebaseUser.uid), profile);
          setUser(profile);
        }
      }
      setGuestMode(false);
      addNotification("Welcome to FinScope", "You have successfully authenticated via secure credentials.", "system");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "users");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      let profile: UserProfile;
      if (userDocSnap.exists()) {
        profile = userDocSnap.data() as UserProfile;
      } else {
        profile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Investor",
          email: firebaseUser.email || "",
          country: "India",
          membership: "Premium",
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profile);
      }
      setUser(profile);
      setGuestMode(false);
      localStorage.setItem("finscope_user", JSON.stringify(profile));
      localStorage.removeItem("finscope_guest");
      addNotification("Google Sign In", "Successfully connected with Google OAuth profile.", "system");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "users");
    }
  };

  const loginWithApple = async () => {
    try {
      const userCredential = await signInWithPopup(auth, appleProvider);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      let profile: UserProfile;
      if (userDocSnap.exists()) {
        profile = userDocSnap.data() as UserProfile;
      } else {
        profile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Investor",
          email: firebaseUser.email || "",
          country: "United States",
          membership: "Premium",
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profile);
      }
      setUser(profile);
      setGuestMode(false);
      localStorage.setItem("finscope_user", JSON.stringify(profile));
      localStorage.removeItem("finscope_guest");
      addNotification("Apple Sign In", "Successfully connected with Apple secure ID.", "system");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "users");
    }
  };

  const enterGuestMode = async () => {
    setGuestMode(true);
    const guestUser: UserProfile = {
      uid: "guest_user",
      name: "Ashish",
      email: "guest@finscope.ai",
      country: "United States",
      membership: "Premium",
      createdAt: new Date().toISOString()
    };
    setUser(guestUser);
    localStorage.setItem("finscope_guest", "true");
    localStorage.removeItem("finscope_user");
    addNotification("Guest Mode Active", "Logged in as guest. Your watchlists and preferences will be stored locally.", "system");
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error", error);
    }
    setUser(null);
    setGuestMode(false);
    localStorage.removeItem("finscope_user");
    localStorage.removeItem("finscope_guest");
  };

  const deleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }
    } catch (error) {
      console.error("Delete user error", error);
    }
    setUser(null);
    setGuestMode(false);
    localStorage.clear();
    setWatchlist([]);
    setSavedArticles([]);
    setAlerts([]);
    setRecentSearches([]);
    setChatHistory([]);
  };

  // Watchlist Actions with Firestore Sync
  const addToWatchlist = async (symbol: string, name: string, type: "stock" | "crypto" | "etf") => {
    if (watchlist.some(w => w.symbol.toUpperCase() === symbol.toUpperCase())) return;
    const newItem: WatchlistItem = {
      id: "w_" + Math.random().toString(36).substr(2, 9),
      userId: user?.uid || "guest",
      symbol: symbol.toUpperCase(),
      name,
      type,
      addedAt: new Date().toISOString()
    };
    
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "watchlist", newItem.id), newItem);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/watchlist/${newItem.id}`);
      }
    } else {
      const updated = [newItem, ...watchlist];
      setWatchlist(updated);
      localStorage.setItem("finscope_watchlist", JSON.stringify(updated));
    }
    addNotification("Watchlist Updated", `Added ${symbol.toUpperCase()} to your watchlist dashboard.`, "price_alert");
  };

  const removeFromWatchlist = async (symbol: string) => {
    const itemToRemove = watchlist.find(w => w.symbol.toUpperCase() === symbol.toUpperCase());
    if (auth.currentUser && itemToRemove) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "watchlist", itemToRemove.id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${auth.currentUser.uid}/watchlist/${itemToRemove.id}`);
      }
    } else {
      const updated = watchlist.filter(w => w.symbol.toUpperCase() !== symbol.toUpperCase());
      setWatchlist(updated);
      localStorage.setItem("finscope_watchlist", JSON.stringify(updated));
    }
    addNotification("Watchlist Updated", `Removed ${symbol.toUpperCase()} from your watchlist.`, "price_alert");
  };

  // Bookmarks Actions with Firestore Sync
  const saveArticle = async (article: any) => {
    if (savedArticles.some(a => a.newsId === article.id)) return;
    const newItem: SavedArticle = {
      id: "sa_" + Math.random().toString(36).substr(2, 9),
      userId: user?.uid || "guest",
      newsId: article.id,
      title: article.headline,
      summary: article.summary,
      source: article.source,
      url: article.url,
      image: article.image,
      category: article.category,
      datetime: article.datetime,
      savedAt: new Date().toISOString()
    };
    
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "savedArticles", newItem.id), newItem);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/savedArticles/${newItem.id}`);
      }
    } else {
      const updated = [newItem, ...savedArticles];
      setSavedArticles(updated);
      localStorage.setItem("finscope_saved_articles", JSON.stringify(updated));
    }
    addNotification("Article Bookmarked", "Successfully saved article for offline research.", "system");
  };

  const unsaveArticle = async (newsId: string) => {
    const itemToRemove = savedArticles.find(a => a.newsId === newsId);
    if (auth.currentUser && itemToRemove) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "savedArticles", itemToRemove.id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${auth.currentUser.uid}/savedArticles/${itemToRemove.id}`);
      }
    } else {
      const updated = savedArticles.filter(a => a.newsId !== newsId);
      setSavedArticles(updated);
      localStorage.setItem("finscope_saved_articles", JSON.stringify(updated));
    }
  };

  // Price Alerts Actions with Firestore Sync
  const addPriceAlert = async (symbol: string, name: string, price: number, condition: "above" | "below", type: "price" | "news") => {
    const newItem: PriceAlert = {
      id: "a_" + Math.random().toString(36).substr(2, 9),
      userId: user?.uid || "guest",
      symbol: symbol.toUpperCase(),
      name,
      targetPrice: price,
      condition,
      type,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "alerts", newItem.id), newItem);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/alerts/${newItem.id}`);
      }
    } else {
      const updated = [newItem, ...alerts];
      setAlerts(updated);
      localStorage.setItem("finscope_alerts", JSON.stringify(updated));
    }
    addNotification("Alert Setup Complete", `We'll trigger a notification when ${symbol.toUpperCase()} goes ${condition} $${price}.`, "price_alert");
  };

  const toggleAlertActive = async (alertId: string) => {
    const target = alerts.find(a => a.id === alertId);
    if (target) {
      if (auth.currentUser) {
        try {
          await updateDoc(doc(db, "users", auth.currentUser.uid, "alerts", alertId), { isActive: !target.isActive });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/alerts/${alertId}`);
        }
      } else {
        const updated = alerts.map(a => a.id === alertId ? { ...a, isActive: !a.isActive } : a);
        setAlerts(updated);
        localStorage.setItem("finscope_alerts", JSON.stringify(updated));
      }
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "alerts", alertId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${auth.currentUser.uid}/alerts/${alertId}`);
      }
    } else {
      const updated = alerts.filter(a => a.id !== alertId);
      setAlerts(updated);
      localStorage.setItem("finscope_alerts", JSON.stringify(updated));
    }
  };

  // Search History Actions
  const addSearchQuery = async (queryStr: string, type: string) => {
    if (!queryStr.trim()) return;
    const cleanQuery = queryStr.toUpperCase().trim();
    const filtered = recentSearches.filter(s => s.query !== cleanQuery);
    const newItem: RecentSearch = {
      id: "s_" + Math.random().toString(36).substr(2, 9),
      userId: user?.uid || "guest",
      query: cleanQuery,
      type,
      searchedAt: new Date().toISOString()
    };
    const updated = [newItem, ...filtered].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("finscope_searches", JSON.stringify(updated));
  };

  const clearSearchHistory = async () => {
    setRecentSearches([]);
    localStorage.removeItem("finscope_searches");
  };

  // Settings Actions with Firestore Sync
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    };
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "settings", "preferences"), updated);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/settings/preferences`);
      }
    } else {
      setSettingsState(updated);
      localStorage.setItem("finscope_settings", JSON.stringify(updated));
    }
    addNotification("Preferences Updated", "Your customized interface and alert preferences have been saved.", "system");
  };

  const clearCache = () => {
    localStorage.removeItem("finscope_watchlist");
    localStorage.removeItem("finscope_saved_articles");
    localStorage.removeItem("finscope_searches");
    localStorage.removeItem("finscope_alerts");
    localStorage.removeItem("finscope_chat");
    setWatchlist([]);
    setSavedArticles([]);
    setAlerts([]);
    setRecentSearches([]);
    setChatHistory([]);
    addNotification("Cache Cleared", "All cached market data and temporary logs successfully removed.", "system");
  };

  // Chat Actions with Firestore Sync
  const addChatMessage = async (sender: "user" | "ai", message: string) => {
    const newMessage: ChatMessage = {
      id: "chat_msg_" + Math.random().toString(36).substr(2, 9),
      userId: user?.uid || "guest",
      sender,
      message,
      timestamp: new Date().toISOString()
    };
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid, "chatHistory", newMessage.id), newMessage);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/chatHistory/${newMessage.id}`);
      }
    } else {
      const updated = [...chatHistory, newMessage];
      setChatHistory(updated);
      localStorage.setItem("finscope_chat", JSON.stringify(updated));
    }
  };

  const clearChatHistory = async () => {
    const initialMsg: ChatMessage = {
      id: "c_1",
      userId: user?.uid || "guest",
      sender: "ai",
      message: "Hello! I am your FinScope AI financial assistant. Ask me anything about today's market trend, individual stocks, cryptocurrency technicals, or ETF allocations.",
      timestamp: new Date().toISOString()
    };
    if (auth.currentUser) {
      try {
        const chatColl = collection(db, "users", auth.currentUser.uid, "chatHistory");
        const snapshot = await getDocs(chatColl);
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "users", auth.currentUser!.uid, "chatHistory", d.id)));
        await Promise.all(deletePromises);
        await setDoc(doc(db, "users", auth.currentUser.uid, "chatHistory", "c_1"), initialMsg);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/chatHistory`);
      }
    } else {
      setChatHistory([initialMsg]);
      localStorage.setItem("finscope_chat", JSON.stringify([initialMsg]));
    }
  };

  // Notifications Actions with Firestore Sync
  const markAllNotificationsRead = () => {
    if (auth.currentUser) {
      try {
        notifications.forEach(async (n) => {
          if (!n.isRead) {
            await updateDoc(doc(db, "users", auth.currentUser!.uid, "notifications", n.id), { isRead: true });
          }
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/notifications`);
      }
    } else {
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      setNotifications(updated);
      localStorage.setItem("finscope_notifications", JSON.stringify(updated));
    }
  };

  const addNotification = (title: string, message: string, type: string) => {
    const newNotif: NotificationItem = {
      id: "n_" + Math.random().toString(36).substr(2, 9),
      userId: user?.uid || "guest",
      title,
      message,
      category: "Today",
      type,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    if (auth.currentUser) {
      try {
        setDoc(doc(db, "users", auth.currentUser.uid, "notifications", newNotif.id), newNotif);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}/notifications/${newNotif.id}`);
      }
    } else {
      const updated = [newNotif, ...notifications];
      setNotifications(updated);
      localStorage.setItem("finscope_notifications", JSON.stringify(updated));
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      settings,
      watchlist,
      savedArticles,
      alerts,
      recentSearches,
      notifications,
      chatHistory,
      loading,
      guestMode,
      loginWithEmail,
      loginWithGoogle,
      loginWithApple,
      enterGuestMode,
      logout,
      deleteAccount,
      addToWatchlist,
      removeFromWatchlist,
      saveArticle,
      unsaveArticle,
      addPriceAlert,
      toggleAlertActive,
      deleteAlert,
      addSearchQuery,
      clearSearchHistory,
      updateSettings,
      clearCache,
      addChatMessage,
      clearChatHistory,
      markAllNotificationsRead,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

