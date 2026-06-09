import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Loader2, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://workpiserv-api.onrender.com';

const CATEGORIES = [
  { id: 'design',      name: 'Design' },
  { id: 'development', name: 'Development' },
  { id: 'marketing',  name: 'Marketing' },
  { id: 'writing',    name: 'Writing & Translation' },
  { id: 'video',      name: 'Video & Animation' },
  { id: 'audio',      name: 'Audio & Voice' },
  { id: 'business',   name: 'Business' },
  { id: 'consulting', name: 'Consulting' },
];

export default function CreateServicePage() {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const [title, setTitle]           = useState('');
  const [category, setCategory]     = useState('');
  const [price, setPrice]           = useState('');
  const [deliveryDays, setDelivery] = useState('3');
  const [description, setDesc]      = useState('');

  const isValid = title.trim().length >= 10 && category && Number(price) > 0 && description.trim().length >= 30;

  async function handleSubmit() {
    if (!isValid) return;
    setLoading(true);
    setError('');
    let token: string | null = null;
    try { token = localStorage.getItem('workpiserv_token'); } catch { token = null; }

    try {
      const res = await fetch(`${API_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          price: Number(price),
          deliveryDays: Number(deliveryDays),
          description: description.trim(),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { message?: string }).message || 'Failed to create service. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-2xl text-navy mb-2">Service Created!</h2>
          <p className="text-gray-500">Redirecting to your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="section-container py-6">
          <div className="text-sm text-gray-500 mb-2">
            <Link to="/" className="text-brand hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/profile" className="text-brand hover:underline">Profile</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Create Service</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-navy">Create a New Service</h1>
          <p className="text-gray-500 text-sm mt-1">Offer your skills and start earning Pi</p>
        </div>
      </div>

      <div className="section-container py-8 max-w-2xl">
        <div className="space-y-5">

          {/* Title */}
          <div className="card-surface p-5">
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Service Title <span className="text-brand">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">Be specific and clear — min. 10 characters</p>
            <input
              type="text"
              placeholder="e.g. I will design a professional logo for your brand"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/120</p>
          </div>

          {/* Category */}
          <div className="card-surface p-5">
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Category <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full h-12 px-4 pr-10 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Price & Delivery */}
          <div className="card-surface p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">
                  Price (π) <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand font-bold text-sm">π</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    min="1"
                    className="w-full h-12 pl-8 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Delivery (days)</label>
                <div className="relative">
                  <select
                    value={deliveryDays}
                    onChange={e => setDelivery(e.target.value)}
                    className="w-full h-12 px-4 pr-10 border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
                  >
                    {[1, 2, 3, 5, 7, 10, 14, 21, 30].map(d => (
                      <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card-surface p-5">
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Description <span className="text-brand">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">Describe what you offer — min. 30 characters</p>
            <textarea
              placeholder="Describe your service in detail: what you offer, what the client will receive, your experience..."
              value={description}
              onChange={e => setDesc(e.target.value)}
              rows={6}
              maxLength={2000}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-y"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/2000</p>
          </div>

          {/* Escrow note */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-700">
            🔒 All payments are protected by WorkπServ Escrow — you receive π only after the client confirms delivery.
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
              isValid && !loading
                ? 'bg-brand text-white hover:bg-brand/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Publishing...</>
            ) : (
              '+ Publish Service'
            )}
          </button>

        </div>
      </div>
    </main>
  );
}
