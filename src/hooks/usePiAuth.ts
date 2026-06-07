import { useState, useCallback } from 'react';
import { piSDK, isPiBrowser } from '@/lib/pi';

interface PiUser {
  uid: string;
  username: string;
}

interface UsePiAuthReturn {
  user: PiUser | null;
  loading: boolean;
  error: string | null;
  loggedIn: boolean;
  inPiBrowser: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

export function usePiAuth(): UsePiAuthReturn {
  const [user, setUser] = useState<PiUser | null>(() => {
    try {
      const saved = localStorage.getItem('workpiserv_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detected at click time, not render time — avoids timeout
  const inPiBrowser = isPiBrowser();

  const login = useCallback(async () => {
    if (!inPiBrowser) {
      // Show modal — handled in Header
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await piSDK.authenticate();
      if (result?.user) {
        setUser({ uid: result.user.uid, username: result.user.username });
      } else {
        setError('Authentication failed. Please try again.');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  }, [inPiBrowser]);

  const logout = useCallback(() => {
    piSDK.logout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    loggedIn: !!localStorage.getItem('workpiserv_token') || user !== null,
    inPiBrowser,
    login,
    logout,
  };
}
  
