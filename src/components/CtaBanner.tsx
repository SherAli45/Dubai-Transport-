import React from 'react';
import { MessageSquare, ArrowRight, Truck } from 'lucide-react';

interface CtaBannerProps {
  onOpenQuote: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenQuote }) => {
  return (
    <section className="py-12 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Navy Card matching reference */}
          <div className="lg:col-span-6 bg-[#0A1628] rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Need a Transport Partner for Your Business?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
                We provide reliable and efficient commercial vehicle transportation across all Dubai districts.
              </p>
            </div>
            <div className="pt-6 relative z-10">
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer group"
              >
                <span>Request Transport Quotation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Orange Card matching reference */}
          <div className="lg:col-span-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-lg shadow-orange-500/15">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-orange-100">
                  Instant WhatsApp Booking
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Get Your Transport Quote Now
              </h3>

              <p className="text-orange-100 text-xs leading-relaxed">
                Trucks • Trailers • Vans • Pickups • Flatbeds • Refrigerated Fleet
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenQuote}
                className="px-6 py-3.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Book Transport Now</span>
                <ArrowRight className="w-4 h-4 text-orange-600" />
              </button>

              <a
                href="https://wa.me/923273172804?text=Hello%20Dubai%20Transport,%20I%20would%20like%20to%20get%20a%20transport%20quote."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#0A1628] hover:bg-[#10223D] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: 03273172804</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
