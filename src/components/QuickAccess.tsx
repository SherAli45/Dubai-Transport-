import React from 'react';
import {
  PackageCheck,
  Package,
  Truck,
  Layers,
  CircleDollarSign,
  Star,
  MapPin,
  MessageSquare,
} from 'lucide-react';

interface QuickAccessProps {
  onSelectAction: (targetId: string) => void;
  onOpenQuote: () => void;
}

export const QuickAccess: React.FC<QuickAccessProps> = ({ onSelectAction, onOpenQuote }) => {
  const items = [
    {
      label: 'Loading & Offloading Services',
      icon: PackageCheck,
      action: () => onOpenQuote(),
    },
    {
      label: 'Goods Transportation',
      icon: Package,
      action: () => onSelectAction('services'),
    },
    {
      label: 'Fleet Showcase',
      icon: Truck,
      action: () => onSelectAction('fleet'),
    },
    {
      label: 'Transport Services',
      icon: Layers,
      action: () => onSelectAction('services'),
    },
    {
      label: 'Vehicle & Service Pricing',
      icon: CircleDollarSign,
      action: () => onSelectAction('fleet'),
    },
    {
      label: 'Customer Testimonials',
      icon: Star,
      action: () => onSelectAction('why-choose-us'),
    },
    {
      label: 'Contact & Business Info',
      icon: MapPin,
      action: () => onSelectAction('contact'),
    },
    {
      label: 'WhatsApp Integration',
      icon: MessageSquare,
      action: () => {
        window.open(
          'https://wa.me/923273172804?text=Hello%20Dubai%20Transport,%20I%20would%20like%20to%20inquire%20about%20transport%20rates.',
          '_blank'
        );
      },
    },
  ];

  return (
    <div className="bg-white border-b border-slate-100 shadow-xs py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center text-center p-2 rounded-2xl hover:bg-orange-50/60 transition-all duration-200 group cursor-pointer"
              >
                {/* Round orange icon badge matching reference */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-200 mb-2.5">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
