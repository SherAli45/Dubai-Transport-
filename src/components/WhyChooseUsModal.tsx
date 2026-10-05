import React from 'react';
import { X, ShieldCheck, UserCheck, Wrench, Sliders, MapPin, Briefcase } from 'lucide-react';

interface WhyChooseUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const WhyChooseUsModal: React.FC<WhyChooseUsModalProps> = ({
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  if (!isOpen) return null;

  const points = [
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Dubai Transport Standards
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Why Choose Dubai Transport
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenQuote();
            }}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md"
          >
            Get a Quote
          </button>
        </div>
      </div>
    </div>
  );
};
