export default function ReportPage() {
  return (
    <div className="section-container py-16 max-w-xl mx-auto">
      <h1 className="font-heading font-bold text-3xl text-navy mb-4">Report an Issue</h1>
      <p className="text-gray-600 mb-8">Help us keep WorkπServ safe and fair for everyone.</p>
      <div className="space-y-4">
        {['Fraudulent service', 'Payment dispute', 'Abusive behavior', 'Fake reviews', 'Other'].map((type) => (
          <div key={type} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between hover:border-brand transition-colors cursor-pointer">
            <span className="text-gray-700">{type}</span>
            <span className="text-brand">→</span>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-sm mt-6 text-center">
        For urgent issues, email us at{' '}
        <a href="mailto:report@workpiserv.com" className="text-brand">report@workpiserv.com</a>
      </p>
    </div>
  );
}
