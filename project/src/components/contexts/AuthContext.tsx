import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface AcceptedChallenge {
  challengeId: string;
  acceptedAt: string; // ISO string
  completed?: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  points: number;
  badges: string[];
  joinedAt: Date;
  acceptedChallenges?: AcceptedChallenge[]; // challenge ids with accept date
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loading: boolean;
  acceptChallenge: (challengeId: string) => void;
  completeChallenge: (challengeId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// ...existing code...

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check for user in localStorage and refresh from Firestore if found
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('datasprint_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Try to fetch latest user data from Firestore
        try {
          const userRef = doc(db, 'users', parsed.email);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({
              ...userData,
              joinedAt: new Date(userData.joinedAt),
              role: (userData.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
              badges: Array.isArray(userData.badges) ? userData.badges : [],
              acceptedChallenges: Array.isArray(userData.acceptedChallenges) ? userData.acceptedChallenges : [],
            });
            localStorage.setItem('datasprint_user', JSON.stringify(userData));
          } else {
            setUser(parsed);
          }
        } catch {
          setUser(parsed);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', email);
      const userSnap = await getDoc(userRef);
      let userData;
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        // If not found, create new user
        userData = {
          id: email,
          email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'user',
          points: 0,
          badges: [],
          joinedAt: new Date().toISOString(),
          acceptedChallenges: [],
        };
        await setDoc(userRef, { ...userData, createdAt: serverTimestamp() });
      }
      // Always use Firestore data, never dummy
      localStorage.setItem('datasprint_user', JSON.stringify(userData));
      setUser({
        ...userData,
        joinedAt: new Date(userData.joinedAt),
        role: (userData.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
        badges: Array.isArray(userData.badges) ? userData.badges : [],
        acceptedChallenges: Array.isArray(userData.acceptedChallenges) ? userData.acceptedChallenges : [],
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', email);
      const userData = {
        id: email,
        email,
        name,
        role: 'user',
        points: 0,
        badges: [],
        joinedAt: new Date().toISOString(),
        acceptedChallenges: [],
      };
      await setDoc(userRef, { ...userData, createdAt: serverTimestamp() });
      localStorage.setItem('datasprint_user', JSON.stringify(userData));
      setUser({
        ...userData,
        joinedAt: new Date(userData.joinedAt),
        role: (userData.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
        badges: Array.isArray(userData.badges) ? userData.badges : [],
        acceptedChallenges: Array.isArray(userData.acceptedChallenges) ? userData.acceptedChallenges : [],
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('datasprint_user');
    setUser(null);
  };

  // Accept a challenge by id
  const acceptChallenge = async (challengeId: string) => {
    if (!user) return;
    const now = new Date().toISOString();
    let acceptedChallenges = user.acceptedChallenges || [];
    if (!acceptedChallenges.some(ac => ac.challengeId === challengeId)) {
      acceptedChallenges = [...acceptedChallenges, { challengeId, acceptedAt: now }];
      const updated = { ...user, acceptedChallenges };
      await updateDoc(doc(db, 'users', user.id), { acceptedChallenges });
      localStorage.setItem('datasprint_user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  // Mark a challenge as completed for the user and update points
  const completeChallenge = async (challengeId: string) => {
    if (!user) return;
    let acceptedChallenges = user.acceptedChallenges || [];
    let changed = false;
    acceptedChallenges = acceptedChallenges.map(ac => {
      if (ac.challengeId === challengeId && !ac.completed) {
        changed = true;
        return { ...ac, completed: true };
      }
      return ac;
    });
    if (changed) {
      // Get challenge points from localStorage (datasprint_challenges)
      let pointsToAdd = 0;
      const challengesRaw = localStorage.getItem('datasprint_challenges');
      if (challengesRaw) {
        try {
          const challenges = JSON.parse(challengesRaw);
          const challenge = challenges.find((c: any) => c.id === challengeId);
          if (challenge && challenge.points) {
            pointsToAdd = challenge.points;
          }
        } catch {}
      }
      const newPoints = (user.points || 0) + pointsToAdd;
      const updated = { ...user, acceptedChallenges, points: newPoints };
      await updateDoc(doc(db, 'users', user.id), { acceptedChallenges, points: newPoints });
      localStorage.setItem('datasprint_user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  // Google login implementation
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const userRef = doc(db, 'users', googleUser.email || googleUser.uid);
      let userData;
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        userData = {
          id: googleUser.email || googleUser.uid,
          email: googleUser.email || '',
          name: googleUser.displayName || '',
          role: 'user',
          avatar: googleUser.photoURL || undefined,
          points: 0,
          badges: [],
          joinedAt: new Date().toISOString(),
          acceptedChallenges: [],
        };
        await setDoc(userRef, { ...userData, createdAt: serverTimestamp() });
      }
      localStorage.setItem('datasprint_user', JSON.stringify(userData));
      setUser({
        ...userData,
        joinedAt: new Date(userData.joinedAt),
        role: (userData.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
        badges: Array.isArray(userData.badges) ? userData.badges : [],
        acceptedChallenges: Array.isArray(userData.acceptedChallenges) ? userData.acceptedChallenges : [],
      });
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  // Remove expired challenges from user.acceptedChallenges
  // Remove expired challenges from user.acceptedChallenges
  useEffect(() => {
    if (!user || !user.acceptedChallenges || user.acceptedChallenges.length === 0) return;
    // Get challenges from localStorage (simulate, since we don't have context here)
    const challengesRaw = localStorage.getItem('datasprint_challenges');
    if (!challengesRaw) return;
    let challenges: any[] = [];
    try {
      challenges = JSON.parse(challengesRaw);
    } catch {}
    const now = new Date();
    const filtered = user.acceptedChallenges.filter(ac => {
      const ch = challenges.find(c => c.id === ac.challengeId);
      if (!ch) return true;
      const deadline = new Date(ch.deadline);
      return deadline > now;
    });
    if (filtered.length !== user.acceptedChallenges.length) {
      const updated = { ...user, acceptedChallenges: filtered };
      localStorage.setItem('datasprint_user', JSON.stringify(updated));
      setUser(updated);
    }
  }, [user]);

  const value = {
    user,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading,
    acceptChallenge,
    completeChallenge,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;