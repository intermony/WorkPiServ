import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Shield, Loader2, Truck, CheckCircle2, AlertTriangle, RotateCcw, Ban } from 'lucide-react';
import { usePiAuth } from '@/hooks/usePiAuth';
import Price from '@/components/shared/Price';
import { useLanguage } from '@/i18n';
import type { Order, OrderStatus, Milestone } from '@/types';

import { API_BASE_URL as API_URL, apiHeaders, handleUnauthorized } from '@/config/network';
// Order enrichi avec les IDs bruts pour savoir si on est acheteur ou vendeur
// (deliveredAt : champ backend pas encore dans le type Order partagé)
// order.date est une chaîne DÉJÀ formatée pour l'affichage (toLocaleDateString),
// donc jamais re-parsable de façon fiable par `new Date()` (ex. "16/07/2026" en fr
// est invalide pour le moteur JS → Invalid Date). createdAt garde l'ISO brut du
// backend, réservé aux recalculs (ex. timeline).
type OrderEx = Order & { buyerRawId: string; freelancerRawId: string; deliveredAt?: string | null; createdAt?: string | null };

const statusConfig: Record<OrderStatus, { labelKey: string; color: string; bg: string }> = {
  active:          { labelKey: 'orders.status.active',          color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
  pending_payment: { labelKey: 'orders.status.pending_payment', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  in_progress:     { labelKey: 'orders.status.in_progress',     color: 'text-escrow',    bg: 'bg-escrow-light' },
  delivered:       { labelKey: 'orders.status.delivered',       color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
  completed:       { labelKey: 'orders.status.completed',       color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
  cancelled:       { labelKey: 'orders.status.cancelled',       color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
  disputed:        { labelKey: 'orders.status.disputed',        color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  refunding:       { labelKey: 'orders.status.refunding',       color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  refunded:        { labelKey: 'orders.status.refunded',        color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
};

// Tolère les anciens statuts inconnus (ex. "pending" des premières versions)
function getStatusConfig(status: string) {
  return statusConfig[status as OrderStatus]
    ?? { labelKey: status, color: 'text-muted-foreground', bg: 'bg-muted' };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOrder(o: any): OrderEx {
  return {
    id           : o._id || o.id || '',
    buyerRawId      : o.buyerId?._id || o.buyerId || '',
    freelancerRawId : o.freelancerId?._id || o.freelancerId || '',
    orderId      : o.orderId || `#${(o._id || o.id || '').slice(-6).toUpperCase()}`,
    serviceId    : o.serviceId?._id || o.serviceId || '',
    serviceTitle : o.serviceId?.title || o.serviceTitle || 'Service',
    serviceImage : o.serviceId?.image || o.serviceImage || '/images/service-default.jpg',
    package      : o.package || 'Standard',
    status       : o.status || 'active',
    price        : o.amount || o.price || 0,
    date         : o.createdAt ? new Date(o.createdAt).toLocaleDateString() : o.date || '',
    createdAt    : o.createdAt || null,
    freelancer   : {
      id          : o.freelancerId?._id || '',
      name        : o.freelancerId?.username || 'Pioneer',
      username    : o.freelancerId?.username || '',
      avatar      : o.freelancerId?.avatar || '👤',
      title       : 'Freelancer on WorkPiServ',
      verified    : false,
      location    : 'Pi Network',
      memberSince : '',
      rating      : o.freelancerId?.rating || 0,
      orders      : 0,
      completion  : '—',
      responseTime: '—',
      yearsExp    : 0,
    },
    timeline     : o.timeline || [],
    deliveredAt  : o.deliveredAt || null,
    milestones   : o.milestones || [],
    deliverables : o.deliverables || [],
  };
}

// ── Timeline verticale : Créée → Payée → Livrée → Validée ──
function OrderTimeline({ order, t }: { order: OrderEx; t: (k: string) => string }) {
  if (['cancelled', 'disputed', 'refunding', 'refunded'].includes(order.status)) return null;

  const paidEvent      = order.timeline?.find((e: { event?: string }) => e?.event === 'payment_completed');
  const completedEvent = order.timeline?.find((e: { event?: string }) => e?.event === 'completed');

  const fmt = (d?: string | null) =>
    d ? new Date(d).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;

  const steps = [
    { key: 'created',   done: true,                                              title: t('orders.timeline.created'),   desc: t('orders.timeline.createdDesc').replace('{service}', order.serviceTitle), at: fmt(order.createdAt) },
    { key: 'paid',      done: order.status !== 'pending_payment',                title: t('orders.timeline.paid'),      desc: t('orders.timeline.paidDesc').replace('{n}', String(order.price)),        at: fmt(paidEvent?.at ?? null) },
    { key: 'delivered', done: ['delivered', 'completed'].includes(order.status), title: t('orders.timeline.delivered'), desc: t('orders.timeline.deliveredDesc').replace('{name}', order.freelancer?.name || ''), at: fmt(order.deliveredAt) },
    { key: 'validated', done: order.status === 'completed',                      title: t('orders.timeline.validated'), desc: t('orders.timeline.validatedDesc'),                                         at: fmt(completedEvent?.at ?? null) },
  ];

  const activeIndex = steps.findIndex(s => !s.done);

  return (
    <div className="mt-4 bg-card border border-border rounded-xl p-5">
      <h3 className="font-heading font-bold text-lg text-navy mb-4">{t('orders.timeline.title')}</h3>
      <div>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const isCurrent = i === activeIndex;
          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  step.done ? 'bg-escrow text-white' : isCurrent ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.done ? <CheckCircle2 size={13} /> : <span className="text-[10px] font-semibold">{i + 1}</span>}
                </div>
                {!isLast && <div className={`w-0.5 flex-1 min-h-[28px] ${step.done ? 'bg-escrow' : 'bg-muted'}`} />}
              </div>
              <div className={`pb-5 ${!step.done && !isCurrent ? 'opacity-50' : ''}`}>
                <p className={`font-medium text-sm ${step.done || isCurrent ? 'text-navy' : 'text-muted-foreground'}`}>{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                {step.at && <p className="text-[11px] text-muted-foreground mt-1">{step.at}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Jalons de commande : le freelance propose, l'acheteur valide ──
// Bloquant côté backend (route /complete refusée tant que non tous validés),
// mais paiement toujours unique et global — aucune libération fractionnée ici.
function MilestoneTracker({
  order, myId, t, acting, onAdd, onMarkDone, onApprove,
}: {
  order: OrderEx; myId: string; t: (k: string) => string; acting: boolean;
  onAdd: (title: string) => void; onMarkDone: (mid: string) => void; onApprove: (mid: string) => void;
}) {
  const [newTitle, setNewTitle] = useState('');
  const milestones: Milestone[] = order.milestones || [];
  const isFreelancer = myId === order.freelancerRawId;
  const isBuyer = myId === order.buyerRawId;
  const canEdit = order.status === 'in_progress';

  if (milestones.length === 0 && !(isFreelancer && canEdit)) return null;

  const approvedCount = milestones.filter(m => m.approvedBy).length;
  const total = milestones.length;
  const pct = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

  return (
    <div className="mt-4 bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading font-bold text-lg text-navy">{t('orders.milestones.title')}</h3>
        {total > 0 && <span className="text-sm text-muted-foreground">{pct}%</span>}
      </div>
      {total > 0 && (
        <>
          <p className="text-xs text-muted-foreground mb-2">
            {t('orders.milestones.progress').replace('{done}', String(approvedCount)).replace('{total}', String(total))}
          </p>
          <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-escrow rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </>
      )}

      <div className="space-y-2">
        {milestones.map(m => (
          <div key={m.id} className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                m.approvedBy ? 'bg-escrow text-white' : m.done ? 'bg-brand-light text-brand' : 'bg-muted text-muted-foreground'
              }`}>
                {m.approvedBy ? <CheckCircle2 size={11} /> : <span className="text-[9px] font-semibold">•</span>}
              </div>
              <span className={`text-sm truncate ${m.approvedBy ? 'text-navy' : 'text-muted-foreground'}`}>{m.title}</span>
            </div>
            {isFreelancer && !m.done && (
              <button
                disabled={acting}
                onClick={() => onMarkDone(m.id)}
                className="text-xs font-medium text-escrow shrink-0 disabled:opacity-50"
              >
                {t('orders.milestones.markDone')}
              </button>
            )}
            {isBuyer && m.done && !m.approvedBy && (
              <button
                disabled={acting}
                onClick={() => onApprove(m.id)}
                className="text-xs font-medium text-white bg-escrow px-2 py-1 rounded-full shrink-0 disabled:opacity-50"
              >
                {t('orders.milestones.approve')}
              </button>
            )}
            {m.done && !m.approvedBy && isFreelancer && (
              <span className="text-[11px] text-muted-foreground shrink-0">{t('orders.milestones.pendingApproval')}</span>
            )}
          </div>
        ))}
      </div>

      {isFreelancer && canEdit && total < 20 && (
        <div className="flex gap-2 mt-3">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder={t('orders.milestones.addPlaceholder')}
            maxLength={140}
            className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background"
          />
          <button
            disabled={acting || !newTitle.trim()}
            onClick={() => { onAdd(newTitle.trim()); setNewTitle(''); }}
            className="text-sm font-medium text-white bg-escrow px-3 py-2 rounded-lg disabled:opacity-50 shrink-0"
          >
            {t('orders.milestones.add')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user } = usePiAuth();
  const { t } = useLanguage();
  const [orders, setOrders]             = useState<OrderEx[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [acting, setActing]             = useState(false);
  const [actionError, setActionError]   = useState<string | null>(null);
  const [disputeFor, setDisputeFor]       = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  const myId = user?._id || '';

  // Action : livrer (freelance) ou confirmer/libérer les fonds (acheteur)
  const doOrderAction = async (orderId: string, action: 'deliver' | 'complete') => {
    setActing(true);
    setActionError(null);
    try {
      const token = localStorage.getItem('workpiserv_token');
      const res = await fetch(`${API_URL}/api/orders/${orderId}/${action}`, {
        method: 'POST',
        headers: apiHeaders(token ? { Authorization: `Bearer ${token}` } : {}),
      });
      const data = await res.json();
      if (!res.ok) { handleUnauthorized(res.status); throw new Error(data.error || 'failed'); }
      const newStatus: OrderStatus = action === 'deliver' ? 'delivered' : 'completed';
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch {
      setActionError(t('orders.actionFailed'));
    } finally {
      setActing(false);
    }
  };

  // Jalons : proposer (freelance), marquer fait (freelance), valider (acheteur).
  // Chaque appel remplace localement order.milestones avec la réponse serveur
  // (source de vérité), pas de mise à jour optimiste sur une structure imbriquée.
  const milestoneAction = async (orderId: string, method: 'POST' | 'PATCH', path: string, body?: object) => {
    setActing(true); setActionError(null);
    try {
      const token = localStorage.getItem('workpiserv_token');
      const res = await fetch(`${API_URL}/api/orders/${orderId}/milestones${path}`, {
        method,
        headers: apiHeaders({ 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }),
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { handleUnauthorized(res.status); throw new Error(data.error || t('orders.actionFailed')); }
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, milestones: data.milestones ?? o.milestones } : o)));
      return true;
    } catch (e) {
      setActionError(e instanceof Error ? e.message : t('orders.actionFailed'));
      return false;
    } finally {
      setActing(false);
    }
  };
  const addMilestone      = (orderId: string, title: string) => milestoneAction(orderId, 'POST', '', { title });
  const markMilestoneDone = (orderId: string, mid: string)    => milestoneAction(orderId, 'PATCH', `/${mid}/done`);
  const approveMilestone  = (orderId: string, mid: string)    => milestoneAction(orderId, 'PATCH', `/${mid}/approve`);

  // Actions litige / remboursement (réponses serveur variables : 200/202/400).
  // On affiche le message serveur (ex. « il reste X jours pour livrer »).
  const postAction = async (orderId: string, path: string, body?: object, optimisticStatus?: OrderStatus) => {
    setActing(true); setActionError(null);
    try {
      const token = localStorage.getItem('workpiserv_token');
      const res = await fetch(`${API_URL}/api/orders/${orderId}/${path}`, {
        method: 'POST',
        headers: apiHeaders({ 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }),
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { handleUnauthorized(res.status); throw new Error(data.error || t('orders.actionFailed')); }
      if (optimisticStatus) setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: optimisticStatus } : o)));
      return true;
    } catch (e) {
      setActionError(e instanceof Error ? e.message : t('orders.actionFailed'));
      return false;
    } finally {
      setActing(false);
    }
  };

  useEffect(() => {
    let token: string | null = null;
    try { token = localStorage.getItem('workpiserv_token'); } catch { token = null; }
    fetch(`${API_URL}/api/orders`, {
      headers: apiHeaders(token ? { Authorization: `Bearer ${token}` } : {}),
    })
      .then(r => { if (!r.ok) { handleUnauthorized(r.status); return null; } return r.json(); })
      .then(data => {
        if (!data) { setError(true); return; }
        const raw = Array.isArray(data) ? data : data.orders || [];
        setOrders(raw.map(normalizeOrder));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeStatus === 'all') return orders;
    return orders.filter(o => o.status === activeStatus);
  }, [activeStatus, orders]);

  const activeOrder = filtered.find(o => o.id === selectedId) || filtered[0] || null;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="text-brand animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">{t('orders.loading')}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <Package size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="font-semibold text-foreground mb-2">{t('orders.loadError')}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t('orders.checkConnection')}</p>
          <Link to="/" className="btn-primary">{t('orders.backHome')}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="section-container py-8">
          <div className="text-sm text-muted-foreground mb-2">
            <Link to="/" className="text-brand hover:underline">{t('nav.home')}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{t('orders.title')}</span>
          </div>
          <h1 className="font-heading font-bold text-3xl text-navy">{t('orders.title')}</h1>

          {/* Status tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
            {(['all', 'active', 'in_progress', 'delivered', 'completed', 'disputed', 'refunded', 'pending_payment', 'cancelled'] as const).map(key => {
              const count = key === 'all' ? orders.length : orders.filter(o => o.status === key).length;
              const labels: Record<string, string> = {
                all: 'orders.status.all', active: 'orders.status.active', in_progress: 'orders.status.in_progress',
                delivered: 'orders.status.delivered', completed: 'orders.status.completed',
                disputed: 'orders.status.disputed', refunded: 'orders.status.refunded',
                pending_payment: 'orders.status.pending', cancelled: 'orders.status.cancelled',
              };
              return (
                <button
                  key={key}
                  onClick={() => { setActiveStatus(key); setSelectedId(null); }}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeStatus === key ? 'bg-brand-light text-brand' : 'text-muted-foreground hover:bg-background'
                  }`}
                >
                  {t(labels[key])} <span className="opacity-60 text-xs">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">{t('orders.none')}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{t('orders.noneHint')}</