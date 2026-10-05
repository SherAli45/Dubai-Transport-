import React from 'react';
import { Phone, MessageSquare, Truck } from 'lucide-react';

interface MobileStickyBarProps {
  onOpenQuote: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenQuote }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 sm:hidden shadow-lg">
      <div className="grid grid-cols-3 gap-2">
        <a
          href="tel:03273172804"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-100 text-slate-800 text-[11px] font-bold active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4 text-orange-600 mb-0.5" />
          <span>03273172804</span>
        </a>

        <a
          href="https://wa.me/923273172804?text=Hello%20Dubai%20Transport,%20I%20would%20like%20to%20request%20a%20transport%20service."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold active:scale-95 transition-transform"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={onOpenQuote}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-orange-500 text-white text-[11px] font-bold shadow-md active:scale-95 transition-transform"
        >
          <Truck className="w-4 h-4 text-white mb-0.5" />
          <span>Get Quote</span>
        </button>
      </div>
    </div>
  );
};
