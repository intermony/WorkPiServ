// ============================================================
// src/components/BadgeCounter.jsx
// Badge de compteur avec remise à zéro au clic
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { notify } from './NotificationSystem';

const API = import.meta.env.VITE_API_URL;

// ── Hook : compteurs depuis l'API ──
export function useCounters(token) {
  const [counters, setCounters] = useState({ notifications: 0, messages: 0, orders: 0 });

  const fetchCounters = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/user/counters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCounters({ notifications: data.notifications, messages: data.messages, orders: data.orders });
      }
    } catch { /* silencieux */ }
  }, [token]);

  const resetCounter = useCallback(async (type) => {
    if (!token) return;
    try {
      await fetch(`${API}/api/user/reset-counters`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type }),
      });
      // Mise à jour locale immédiate
      setCounters(prev => {
        const next = { ...prev };
        if (type === 'all')           { next.notifications = 0; next.messages = 0; next.orders = 0; }
        if (type === 'notifications') next.notifications = 0;
        if (type === 'messages')      next.messages = 0;
        if (type === 'orders')        next.orders = 0;
        return next;
      });
    } catch {
      notify.error('خطأ', 'تعذر إعادة تعيين العداد');
    }
  }, [token]);

  // Polling léger toutes les 30s
  useEffect(() => {
    fetchCounters();
    const interval = setInterval(fetchCounters, 30000);
    return () => clearInterval(interval);
  }, [fetchCounters]);

  return { counters, resetCounter, refetch: fetchCounters };
}

// ── Composant badge ──
export function Badge({ count, color = '#ef4444' }) {
  if (!count || count <= 0) return null;
  return (
    <span style={{
      position: 'absolute', top: '-6px', right: '-6px',
      background: color, color: '#fff',
      borderRadius: '50%', width: '18px', height: '18px',
      fontSize: '11px', fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '2px solid var(--bg-card, #1e293b)',
      lineHeight: 1,
    }}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

// ── Bouton icône avec badge + reset ──
export function IconWithBadge({ icon, count, onReset, label, badgeColor }) {
  function handleClick() {
    if (count > 0) onReset?.();
  }

  return (
    <button
      onClick={handleClick}
      title={label}
      style={{
        position: 'relative', background: 'none', border: 'none',
        cursor: count > 0 ? 'pointer' : 'default',
        padding: '8px', borderRadius: '10px',
        transition: 'background 0.2s',
        color: 'inherit',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {icon}
      <Badge count={count} color={badgeColor} />
    </button>
  );
                  }
