import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, Lock } from 'lucide-react';
import { BurjKhalifaLogo } from './BurjKhalifaLogo.tsx';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenQuote: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenQuote,
  isAdminLoggedIn,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A1628] text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info with Burj Khalifa Logo */}
          <div className="lg:col-span-4 space-y-4">
            <BurjKhalifaLogo textColor="text-white" size={44} />
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Professional transportation services in Dubai operating modern commercial trucks, cargo vans, pickups, and trailers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Transport Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('fleet')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('areas')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Areas We Serve
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Essential Contact Information ONLY */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <a
                href="https://wa.me/923273172804?text=Hello%20Dubai%20Transport"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">WhatsApp:</span>
                  <span className="font-bold text-white text-sm">03273172804</span>
                </div>
              </a>

              <a
                href="tel:03273172804"
                className="flex items-center gap-2.5 hover:text-orange-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Direct Phone:</span>
                  <span className="font-bold text-white text-sm">03273172804</span>
                </div>
              </a>

              <a
                href="mailto:s38454672@gmail.com"
                className="flex items-center gap-2.5 hover:text-orange-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email:</span>
                  <span className="font-semibold text-white">s38454672@gmail.com</span>
                </div>
              </a>

              <div className="flex items-center gap-2.5 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Location:</span>
                  <span className="font-semibold text-white">Dubai, United Arab Emirates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Admin portal link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Dubai Transport. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQuote}
              className="text-slate-400 hover:text-orange-400 font-medium cursor-pointer"
            >
              Get a Quote
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
