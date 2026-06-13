/* ════════════════════════════════════════════════════════════
   WorkPiServ — Panneau d'administration (page cachée /admin)
   Fichier : src/pages/AdminPage.tsx
   - Accès réservé : role === 'admin' (vérifié CÔTÉ SERVEUR via /api/auth/me)
   - 4 onglets : Statistiques / Utilisateurs / Services / Commandes
   - Modération : suppression de services, bannissement d'utilisateurs
   ════════════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, Package, ShoppingBag, BarChart3,
  Trash2, Ban, CheckCircle2, RefreshCw, AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/i18n';
import {
  adminGetStats, adminGetUsers, adminGetServices, adminGetOrders,
  adminDeleteService, adminSetUserBan,
  type AdminStats, type AdminUser, type AdminService, type AdminOrder,
} from '@/lib/api';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://workpiserv-api.onrender.com';

type Tab = 'stats' | 'users' | 'services' | 'orders';

const STATUS_COLORS: Record<string, string> = {
  completed:   'bg-green-100 text-green-700',
  delivered:   'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  pending:     'bg-gray-100 text-gray-600',
  cancelled:   'bg-red-100 text-red-600',
};

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString(); } catch { return '—'; }
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // ── Garde d'accès : on revérifie le rôle auprès du SERVEUR
  // (jamais confiance au localStorage seul — il est modifiable)
  const [access, setAccess] = useState<'checking' | 'granted'>('checking');

  const [tab, setTab] = useState<Tab>('stats');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [stats, setStats]       = useState<AdminStats | null>(null);
  const [users, setUsers]       = useState<AdminUser[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [orders, setOrders]     = useState<AdminOrder[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = localStorage.getItem('workpiserv_token');
      if (!token) { navigate('/', { replace: true }); return; }
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { navigate('/', { replace: true }); return; }
        const me = await res.json();
        if (cancelled) return;
        if (me?.role === 'admin') setAccess('granted');
        else navigate('/', { replace: true });
      } catch {
        if (!cancelled) navigate('/', { replace: true });
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  // ── Chargement des données de l'onglet actif
  const loadTab = useCallback(async (which: Tab) => {
    setLoading(true);
    setError(null);
    try {
      if (which === 'stats')    setStats(await adminGetStats());
      if (which === 'users')    setUsers(await adminGetUsers());
      if (which === 'services') setServices(await adminGetServices());
      if (which === 'orders')   setOrders(await adminGetOrders());
    } catch {
      setError(t('admin.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (access === 'granted') loadTab(tab);
  }, [access, tab, loadTab]);

  // ── Actions de modération
  const handleDeleteService = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    try {
      await adminDeleteService(id);
      setServices(prev => prev.filter(s => s._id !== id));
      if (stats) setStats({ ...stats, services: Math.max(0, stats.services - 1) });
    } catch {
      setError(t('admin.error'));
    }
  };

  const handleToggleBan = async (u: AdminUser) => {
    const verb = u.banned ? t('admin.unban') : t('admin.ban');
    if (!window.confirm(`${verb} @${u.pi_username || u.username} ?`)) return;
    try {
      await adminSetUserBan(u._id, !u.banned);
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, banned: !u.banned } : x));
    } catch {
      setError(t('admin.error'));
    }
  };

  // ── Écran d'attente pendant la vérification du rôle
  if (access === 'checking') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Shield size={32} className="text-brand animate-pulse" />
        <p className="text-sm">{t('admin.checking')}</p>
      </div>
    );
  }

  const tabs: { id: Tab; key: string; icon: typeof Shield }[] = [
    { id: 'stats',    key: 'admin.tabStats',    icon: BarChart3 },
    { id: 'users',    key: 'admin.tabUsers',    icon: Users },
    { id: 'services', key: 'admin.tabServices', icon: Package },
    { id: 'orders',   key: 'admin.tabOrders',   icon: ShoppingBag },
  ];

  return (
    <main className="section-container py-6 pb-24 md:pb-10">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand rounded-full flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <h1 className="font-heading font-bold text-xl text-navy">{t('admin.title')}</h1>
        </div>
        <button
          onClick={() => loadTab(tab)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={t('admin.refresh')}
        >
          <RefreshCw size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Onglets — défilement horizontal sur mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {tabs.map(({ id, key, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              tab === id ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon size={15} />
            {t(key)}
          </button>
        ))}
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* ════════ ONGLET STATISTIQUES ════════ */}
      {tab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats ? (
            <>
              <StatCard label={t('admin.statUsers')}     value={String(stats.users)} />
              <StatCard label={t('admin.statServices')}  value={String(stats.services)} />
              <StatCard label={t('admin.statOrders')}    value={String(stats.orders)} />
              <StatCard label={t('admin.statVolume')}    value={`π ${stats.totalVolume.toFixed(2)}`} highlight />
              <StatCard label={t('admin.statCompleted')} value={String(stats.completedOrders)} />
              <StatCard label={t('admin.statPending')}   value={String(stats.pendingOrders)} />
            </>
          ) : !loading && <p className="col-span-2 text-gray-400 text-sm">{t('admin.empty')}</p>}
        </div>
      )}

      {/* ════════ ONGLET UTILISATEURS ════════ */}
      {tab === 'users' && (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u._id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
              <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center shrink-0">
                <span className="text-brand font-bold text-sm">
                  {(u.pi_username || u.username || '?').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-navy text-sm truncate">@{u.pi_username || u.username}</span>
                  {u.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-brand-light text-brand text-[10px] font-bold rounded-full uppercase">admin</span>
                  )}
                  {u.banned && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase">{t('admin.banned')}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{t('admin.joined')} : {formatDate(u.createdAt)}</p>
              </div>
              {u.role !== 'admin' && (
                <button
                  onClick={() => handleToggleBan(u)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    u.banned
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  {u.banned ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                  {u.banned ? t('admin.unban') : t('admin.ban')}
                </button>
              )}
            </div>
          ))}
          {!loading && users.length === 0 && <p className="text-gray-400 text-sm">{t('admin.empty')}</p>}
        </div>
      )}

      {/* ════════ ONGLET SERVICES ════════ */}
      {tab === 'services' && (
        <div className="space-y-2">
          {services.map(s => (
            <div key={s._id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
              {s.image ? (
                <img src={s.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-brand font-bold">π</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy text-sm truncate">{s.title}</p>
                <p className="text-xs text-gray-400 truncate">
                  {t('admin.by')} @{s.ownerUsername || '—'} · π {s.price} · {s.category || '—'}
                </p>
              </div>
              <button
                onClick={() => handleDeleteService(s._id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
              >
                <Trash2 size={13} />
                {t('admin.delete')}
              </button>
            </div>
          ))}
          {!loading && services.length === 0 && <p className="text-gray-400 text-sm">{t('admin.empty')}</p>}
        </div>
      )}

      {/* ════════ ONGLET COMMANDES ════════ */}
      {tab === 'orders' && (
        <div className="space-y-2">
          {orders.map(o => (
            <div key={o._id} className="p-3 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-medium text-navy text-sm truncate">{o.serviceTitle || o._id}</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                  {o.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {t('admin.buyer')} @{o.buyerUsername || '—'} → {t('admin.seller')} @{o.sellerUsername || '—'}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-brand">π {o.amount?.toFixed?.(2) ?? o.amount}</span>
                <span className="text-xs text-gray-400">{formatDate(o.createdAt)}</span>
              </div>
            </div>
          ))}
          {!loading && orders.length === 0 && <p className="text-gray-400 text-sm">{t('admin.empty')}</p>}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <RefreshCw size={22} className="text-brand animate-spin" />
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-brand-light border-brand/20' : 'bg-white border-gray-200'}`}>
      <p className={`text-2xl font-bold ${highlight ? 'text-brand' : 'text-navy'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
