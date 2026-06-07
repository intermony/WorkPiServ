export default function SafetyPage() {
  return (
    <div className="section-container py-16 max-w-3xl mx-auto">
      <h1 className="font-heading font-bold text-3xl text-navy mb-4">Safety & Trust</h1>
      <div className="space-y-8">
        <div className="p-6 bg-green-50 rounded-xl border border-green-200">
          <h2 className="font-bold text-green-800 mb-2">🛡️ Escrow Protection</h2>
          <p className="text-green-700 text-sm">Your Pi is held securely until you confirm delivery. No one can access it before you approve.</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h2 className="font-bold text-blue-800 mb-2">✅ Pi Network Verified</h2>
          <p className="text-blue-700 text-sm">All users are authenticated via Pi Network — real humans, KYC verified by Pi Core Team.</p>
        </div>
        <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
          <h2 className="font-bold text-orange-800 mb-2">⚖️ Dispute Resolution</h2>
          <p className="text-orange-700 text-sm">Our team resolves disputes within 48 hours. Blockchain transaction records ensure full transparency.</p>
        </div>
        <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
          <h2 className="font-bold text-purple-800 mb-2">🔒 Blockchain Security</h2>
          <p className="text-purple-700 text-sm">All transactions are recorded on the Pi blockchain — immutable, transparent, and secure.</p>
        </div>
      </div>
    </div>
  );
}
