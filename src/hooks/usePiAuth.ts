import { useState, useEffect, useCallback } from 'react';
import { piSDK, isPiBrowser } from '@/lib/pi';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://workpiserv-api.onrender.com';

interface PiUser {
  _id: string;
  uid?: string;
  username: string;
  balance: number;
  type: string;
  unreadNotifications: number;
  unreadMessages: number;
  newOrders: number;
  avatar: string;
  isNewUser?: boolean;
}

interface UsePiAuthReturn {
  user: PiUser | null;
  loading: boolean;
  error: string | null;
  loggedIn: boolean;
  inPiBrowser: boolean;
  isNewUser: boolean;
  showChromeModal: boolean;
  setShowChromeModal: (show: boolean) => void;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearNewUser: () => void;
}

async function fetchMe(): Promise<PiUser | null> {
  const token = localStorage.getItem('workpiserv_token');
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export function usePiAuth(): UsePiAuthReturn {
  const [user, setUser] = useState<PiUser | null>(() => {
    try {
      const saved = localStorage.getItem('workpiserv_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showChromeModal, setShowChromeModal] = useState(false);
  
  const inPiBrowser = isPiBrowser();

  const refreshUser = useCallback(async () => {
    const fresh = await fetchMe();
    if (fresh) {
      setUser(fresh);
      localStorage.setItem('workpiserv_user', JSON.stringify(fresh));
    }
  }, []);

  const login = useCallback(async () => {
    if (!inPiBrowser) {
      setShowChromeModal(true);
      return;
    }

    if (loading) return;
    setLoading(true);
    setError(null);
    
    try {
      const result = await piSDK.authenticate();
      if (result?.user) {
        const firstLoginKey = `wps_first_${result.user.uid}`;
        const alreadySeen = localStorage.getItem(firstLoginKey);
        if (!alreadySeen) {
          setIsNewUser(true);
          localStorage.setItem(firstLoginKey, '1');
        }
        const fresh = await fetchMe();
        const userData = fresh || (result.user as unknown as PiUser);
        setUser(userData);
        localStorage.setItem('workpiserv_user', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  }, [inPiBrowser, loading]);

  useEffect(() => {
    const token = localStorage.getItem('workpiserv_token');
    if (inPiBrowser && !token && !loading) {
      login();
    } else if (token && !user) {
      refreshUser();
    }
  }, []);

  const logout = useCallback(() => {
    piSDK.logout();
    setUser(null);
    localStorage.removeItem('workpiserv_token');
    localStorage.removeItem('workpiserv_user');
  }, []);

  const clearNewUser = useCallback(() => {
    setIsNewUser(false);
  }, []);

  return {
    user,
    loading,
    error,
    loggedIn: !!localStorage.getItem('workpiserv_token') || user !== null,
    inPiBrowser,
    isNewUser,
    showChromeModal,
    setShowChromeModal,
    login,
    logout,
    refreshUser,
    clearNewUser,
  };
}
