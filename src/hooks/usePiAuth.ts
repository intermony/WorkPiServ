import { useState, useCallback } from 'react';
import { loginWithPi, logout as apiLogout, isLoggedIn } from '@/lib/api';

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

// Detect if we're inside the Pi Browser
function detectPiBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.Pi;
}

export function usePiAuth(): UsePiAuthReturn {
  const [user, setUser] = useState<PiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inPiBrowser = detectPiBrowser();

  const login = useCallback(async () => {
    // Not in Pi Browser — show friendly message
    if (!inPiBrowser) {
      setError('Please open WorkPiServ inside the Pi Browser app to login.');
      setTimeout(() => setError(null), 5000); // auto-dismiss after 5s
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const auth = await window.Pi!.authenticate(
        ['username', 'payments'],
        (payment) => {
          console.warn('Incomplete payment found:', payment);
        }
      );

      await loginWithPi(auth.user.uid, auth.user.username, '');
      setUser({ uid: auth.user.uid, username: auth.user.username });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  }, [inPiBrowser]);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    loggedIn: isLoggedIn() || user !== null,
    inPiBrowser,
    login,
    logout,
  };
}
