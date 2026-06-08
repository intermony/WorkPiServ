// src/components/BetaBanner.tsx
import { useState } from 'react';
import { X } from 'lucide-react'; // ou remplace par un simple "×"

export default function BetaBanner() {
  const [closed, setClosed] = useState(false);
  
  if (closed) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 px-4 text-sm relative">
      <span className="mr-1">🚀</span>
      <strong>WorkpiServ</strong>
      <span className="mx-2 opacity-80">—</span>
      Launching soon on Pi Network Mainnet
      <a 
        href="#waitlist" 
        className="ml-3 text-white font-semibold underline underline-offset-2 hover:text-orange-100 transition-colors"
      >
        Get early access →
      </a>
      
      {/* Bouton fermer */}
      <button 
        onClick={() => setClosed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={16} /> {/* ou juste: × */}
      </button>
    </div>
  );
}
