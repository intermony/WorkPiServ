// WorkPiServ API client — backend Node/Express sur Render
// ─────────────────────────────────────────────────────────────
// ⚠️ CORRECTIONS MAJEURES par rapport à l'ancienne version :
//   1. L'ancien fichier disait « FastAPI » et appelait des routes qui
//      N'EXISTENT PAS sur le backend réel (/auth/pi-login, /orders/me,
//      /payments/create…). Toutes les routes sont désormais alignées
//      sur server.js (préfixe /api, corps de requête conformes).
//   2. L'URL backend est désormais déduite du réseau via
//      src/config/network.ts (mainnet <-> testnet automatique selon
//      le nom d'hôte). Plus AUCUNE URL testnet par défaut en dur.
//   3. Chaque requête envoie l'en-tête X-Pi-Network (apiHeaders) —
//      exigé par la garde réseau du backend (403 NETWORK_MISMATCH
//      en cas d'incohérence, obligatoire en mode strict).
//
// Import : ce fichier suppose l'emplacement src/lib/api.ts.
//   → si api.ts est à src/api.ts, remplacer '../config/network'
//     par './config/network'.
// ─────────────────────────────────────────────────────────────

import { API_BASE_URL, apiHeaders } from '../config/network';

// VITE_BACKEND_URL reste utilisable pour un éventuel dev local,
// sinon l'URL est déterminée par le réseau (network.ts).
const BACKEND_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) || API_BASE_URL;

const TOKEN_KEY = 'workpiserv_token';

// ──────────────────────────────────────────────
// Helper fetch générique — JWT + garde réseau
// ──────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...apiHeaders(), // X-Pi-Network — vérifié par la garde réseau du backend
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    // Le backend Express renvoie { error, code? } — pas { detail } (FastAPI).
    const body = await res.json().catch(() => ({} as Record<string, unknown>));
    const err = new Error(
      (body as { error?: string }).error || `HTTP ${res.status}`
    ) as Error & { code?: string; status?: number };
    err.code = (body as { code?: string }).code; // ex. ACCESS_LOCKED, TERMS_NOT_ACCEPTED, NETWORK_MISMATCH
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────
export interface AuthUser {
  _id: string;
  id: string;
  pi_username: string;
  username: string;
  role: string;
  displayName: string;
  type: string;
  avatar: string;
  balance: number;
  pi_wallet_address: string;
  termsVersion: string;
  termsAccepted: boolean;
  requiredTermsVersion: string;
  unreadNotifications: number;
  unreadMessages: number;
  newOrders: number;
}

// Signature conservée pour compatibilité avec les composants existants.
// ⚠️ Seul accessToken est utilisé : le backend vérifie l'identité auprès
// de Pi (/v2/me) et IGNORE tout uid/username envoyé par le client.
export async function loginWithPi(
  _piUID: string,
  _piUsername: string,
  accessToken: string
) {
  const data = await apiFetch<{ token: string; user: AuthUser }>(
    '/api/auth/pi-login',
    {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
    }
  );
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export async function getMe() {
  return apiFetch<{ user: AuthUser }>('/api/auth/me');
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}

// ──────────────────────────────────────────────
// Services
// ──────────────────────────────────────────────
export async function getServices(params?: {
  category?: string;
  q?: string;
  sort?: string;
  page?: number;
  limit?: number;
  freelancer?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.q) query.set('q', params.q);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.freelancer) query.set('freelancer', params.freelancer);

  return apiFetch<{ services: unknown[]; total: number; pages: number }>(
    `/api/services?${query}`
  );
}

export async function getService(id: string) {
  return apiFetch<unknown>(`/api/services/${id}`);
}

// Cotation d'un service libellé en USD : fige le montant en Pi
// (valable RATE_LOCK_MINUTES côté serveur).
export async function quoteService(id: string) {
  return apiFetch<unknown>(`/api/services/${id}/quote`);
}

// ──────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────
export async function getMyOrders() {
  return apiFetch<unknown[]>('/api/orders');
}

export async function createOrder(serviceId: string, packageName: string) {
  return apiFetch<unknown>('/api/orders', {
    method: 'POST',
    // Le backend attend { serviceId, package } (camelCase, pas snake_case).
    body: JSON.stringify({ serviceId, package: packageName }),
  });
}

// ──────────────────────────────────────────────
// Pi Payments — flux réel :
//   1. Le SDK Pi crée le paiement CÔTÉ FRONTEND (Pi.createPayment).
//   2. Callback onReadyForServerApproval  → approvePayment(paymentId, …)
//   3. Callback onReadyForServerCompletion → completePayment(paymentId, txid, …)
//   4. Callback onIncompletePaymentFound  → incompletePayment(payment)
// (L'ancienne fonction createPayment appelait une route inexistante.)
// ──────────────────────────────────────────────
export async function approvePayment(
  paymentId: string,
  opts?: { serviceId?: string; order_id?: string }
) {
  return apiFetch<unknown>('/api/payments/approve', {
    method: 'POST',
    body: JSON.stringify({ paymentId, ...opts }),
  });
}

export async function completePayment(
  paymentId: string,
  txid: string,
  opts?: { order_id?: string }
) {
  return apiFetch<unknown>('/api/payments/complete', {
    method: 'POST',
    body: JSON.stringify({ paymentId, txid, ...opts }),
  });
}

export async function incompletePayment(payment: unknown) {
  return apiFetch<unknown>('/api/payments/incomplete', {
    method: 'POST',
    body: JSON.stringify({ payment }),
  });
}

// ──────────────────────────────────────────────
// Admin (role 'admin' requis — vérifié côté serveur)
// ──────────────────────────────────────────────
export interface AdminStats {
  users: number;
  services: number;
  orders: number;
  totalVolume: number;
  completedOrders: number;
  pendingOrders: number;
}

export interface AdminUser {
  _id: string;
  pi_uid?: string;
  pi_username?: string;
  username?: string;
  role?: string;
  banned?: boolean;
  createdAt?: string;
}

export interface AdminService {
  _id: string;
  title: string;
  price: number;
  category?: string;
  image?: string;
  ownerUsername?: string;
  createdAt?: string;
}

export interface AdminOrder {
  _id: string;
  serviceTitle?: string;
  buyerUsername?: string;
  sellerUsername?: string;
  amount: number;
  status: string;
  txid?: string;
  createdAt?: string;
}

export async function adminGetStats() {
  return apiFetch<AdminStats>('/api/admin/stats');
}

export async function adminGetUsers() {
  return apiFetch<AdminUser[]>('/api/admin/users');
}

export async function adminGetServices() {
  return apiFetch<AdminService[]>('/api/admin/services');
}

export async function adminGetOrders() {
  return apiFetch<AdminOrder[]>('/api/admin/orders');
}

export async function adminDeleteService(id: string) {
  return apiFetch<{ success: boolean }>(`/api/admin/services/${id}`, {
    method: 'DELETE',
  });
}

export async function adminSetUserBan(id: string, banned: boolean) {
  return apiFetch<{ success: boolean }>(`/api/admin/users/${id}/ban`, {
    method: 'PATCH',
    body: JSON.stringify({ banned }),
  });
}
