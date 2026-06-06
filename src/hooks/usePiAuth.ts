// WorkPiServ - Pi Network authentication hook
// Handles Pi SDK authenticate + backend login in one step

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
  login: () => Promise<void>;
  logout: () => void;
}

export function usePiAuth(): UsePiAuthReturn {
  const [user, setUser] = useState<PiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    if (!window.Pi) {
      setError('Pi Network app required. Please open WorkPiServ inside the Pi Browser.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Pi SDK
      const auth = await window.Pi.authenticate(
        ['username', 'payments'],
        (payment) => {
          // Handle incomplete payment — send to backend to resolve
          console.warn('Incomplete payment found:', payment);
        }
      );

      // 2. Send Pi credentials to our backend
      await loginWithPi(auth.user.uid, auth.user.username, '');

      setUser({ uid: auth.user.uid, username: auth.user.username });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    loggedIn: isLoggedIn() || user !== null,
    login,
    logout,
  };
}
