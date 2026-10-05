import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Wrench,
  Sliders,
  MapPin,
  Briefcase,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const highlights = [
    {
      title: 'Reliable Service',
      desc: 'Committed to agreed timelines with proactive communication from dispatch to final drop-off.',
      icon: ShieldCheck,
    },
    {
      title: 'Professional Drivers',
      desc: 'Experienced, courteous, and licensed drivers familiar with Dubai routes, ports, and loading guidelines.',
      icon: UserCheck,
    },
    {
      title: 'Well-Maintained Vehicles',
      desc: 'Regularly serviced commercial fleet conforming to UAE transportation and safety standards.',
      icon: Wrench,
    },
    {
      title: 'Flexible Transport Options',
      desc: 'Single-trip dispatches, hourly rentals, full-day charters, and recurring monthly commercial contracts.',
      icon: Sliders,
    },
    {
      title: 'Dubai-Wide Coverage',
      desc: 'Full operational reach across all Dubai commercial zones, residential areas, and industrial corridors.',
      icon: MapPin,
    },
    {
      title: 'Business & Personal Transport',
      desc: 'Solutions tailored for corporate cargo, wholesale merchandise, retail stock, and personal transport.',
      icon: Briefcase,
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-extrabold uppercase tracking-wider mb-2 border border-slate-700">
            Why Choose Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Committed to Transportation Excellence
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 font-normal">
            We deliver the highest standards of commercial road transport across Dubai with dependable vehicles and dedicated drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-orange-500/50 hover:bg-slate-800 transition-all duration-300 flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
