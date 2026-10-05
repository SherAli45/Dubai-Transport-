import React from 'react';
import { ArrowRight, ShieldCheck, Clock, MapPin, MessageSquare } from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  return (
    <section id="hero" className="relative bg-[#0A1628] text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0A1628] to-[#0A1628] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 lg:pt-16 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[440px] lg:min-h-[480px]">
          {/* Left Column: Clean & Compact Text (Replaced 'Your Trusted Transport...' with 'Dubai Transport') */}
          <div className="lg:col-span-5 space-y-4 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-orange-400 font-extrabold text-xs tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              SAFE • RELIABLE • ON TIME
            </div>

            {/* Main Title - Clean 'Dubai Transport' as requested */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none font-sans text-white">
              Dubai <br />
              <span className="text-orange-500">Transport</span>
            </h1>

            {/* Short & Concise Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base font-normal max-w-md leading-relaxed">
              Commercial road transport, trucks, trailers, vans, and pickups operating 24/7 across all Dubai districts and UAE.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-orange-500/30 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <a
                href="https://wa.me/923273172804?text=Hello%20Dubai%20Transport,%20I%20would%20like%20to%20hire%20a%20commercial%20vehicle."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: 03273172804</span>
              </a>
            </div>
          </div>

          {/* Right Column: Real Modern Commercial White Truck CLEARLY VISIBLE on Highway Road */}
          <div className="lg:col-span-7 relative h-[280px] sm:h-[360px] lg:h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 group">
            {/* Real High-Resolution White Commercial Semi-Truck Driving on Modern Road */}
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=95"
              alt="White Commercial Transport Truck on Dubai Highway"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />

            {/* Subtle Gradient only at the left and bottom edges for seamless integration, keeping truck crystal clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/60 via-transparent to-transparent hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent" />

            {/* Live Status Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-white">Commercial Fleet Active</span>
            </div>

            {/* Caption on Highway Road */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-orange-400">
                  Dubai Commercial Fleet
                </p>
                <p className="text-sm font-bold drop-shadow-sm">
                  Heavy Trucks, Vans &amp; Pickups on Road
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                24/7 Dispatch
              </span>
            </div>
          </div>
        </div>

        {/* 3 Trust Highlight Cards at bottom of hero */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Safe &amp; Secure</h3>
              <p className="text-orange-400 font-semibold text-xs uppercase tracking-wide">
                Transportation
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">On-Time</h3>
              <p className="text-orange-400 font-semibold text-xs uppercase tracking-wide">
                Delivery
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Nationwide</h3>
              <p className="text-orange-400 font-semibold text-xs uppercase tracking-wide">
                Coverage
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
