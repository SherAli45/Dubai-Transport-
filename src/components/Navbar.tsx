import React, { useState } from 'react';
import { Menu, X, Phone, MessageSquare, Lock } from 'lucide-react';
import { BurjKhalifaLogo } from './BurjKhalifaLogo.tsx';

interface NavbarProps {
  onOpenQuote: (serviceId?: string, vehicleId?: string) => void;
  onOpenAdmin: () => void;
  onOpenWhyChooseUs?: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuote,
  onOpenAdmin,
  onOpenWhyChooseUs,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      {/* Top micro bar */}
      <div className="bg-[#0A1628] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Dubai Transport Commercial Fleet 24/7 Active
            </span>
          </div>
          <div className="flex items-center gap-5 text-slate-300">
            <a
              href="tel:03273172804"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>03273172804</span>
            </a>
            <a
              href="https://wa.me/923273172804?text=Hello%20Dubai%20Transport,%20I%20would%20like%20to%20inquire%20about%20transport%20rates."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: 03273172804</span>
            </a>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors ml-2 pl-3 border-l border-slate-700 text-xs cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Burj Khalifa + Dubai Transport */}
          <a
            href="#"
            className="group focus:outline-none"
          >
            <BurjKhalifaLogo size={46} />
          </a>

          {/* Desktop Nav Links matching reference */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <button
              onClick={() => scrollTo('hero')}
              className="hover:text-orange-500 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('fleet')}
              className="hover:text-orange-500 transition-colors cursor-pointer"
            >
              Fleet &amp; Services
            </button>
            <button
              onClick={() => scrollTo('areas')}
              className="hover:text-orange-500 transition-colors cursor-pointer"
            >
              Areas We Serve
            </button>
            <button
              onClick={() => (onOpenWhyChooseUs ? onOpenWhyChooseUs() : scrollTo('why-choose-us'))}
              className="hover:text-orange-500 transition-colors cursor-pointer"
            >
              Why Choose Us
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="hover:text-orange-500 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right CTA matching reference orange pill button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenQuote()}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenQuote()}
              className="sm:hidden px-3.5 py-1.5 text-xs font-bold text-white bg-orange-500 rounded-full"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 font-semibold text-slate-800 text-base">
            <button
              onClick={() => scrollTo('hero')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo('fleet')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Our Fleet
            </button>
            <button
              onClick={() => scrollTo('areas')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Areas We Serve
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Contact Us
            </button>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3 rounded-xl font-bold text-center text-white bg-orange-500 shadow-md"
              >
                Get a Free Quote
              </button>
              <a
                href="https://wa.me/923273172804?text=Hello%20Dubai%20Transport,%20I%20would%20like%20to%20inquire%20about%20transport%20rates."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-center text-slate-800 bg-slate-100 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                WhatsApp: 03273172804
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-xs text-slate-500 py-1 text-center hover:text-slate-800"
              >
                {isAdminLoggedIn ? 'Open Admin Dashboard' : 'Admin Login'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
