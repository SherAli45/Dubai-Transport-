import React, { useState } from 'react';
import { TransportService } from '../types/index.ts';
import {
  Package,
  Truck,
  Container,
  Car,
  Boxes,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ServicesSectionProps {
  services: TransportService[];
  onOpenQuote: (serviceId?: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Package,
  Truck,
  Container,
  Car,
  Boxes,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onOpenQuote }) => {
  const [selectedService, setSelectedService] = useState<TransportService | null>(null);

  return (
    <section id="services" className="py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header EXACT MATCH TO REFERENCE */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Our Services
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal">
            Comprehensive transport and logistics solutions for your business.
          </p>
        </div>

        {/* Services Cards with REAL Commercial Vehicles Only (Zero saman/boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Truck;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-orange-300 transition-all duration-300 flex flex-col group"
              >
                {/* Clean Real Vehicle Image Only */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Floating Icon badge */}
                  <div className="absolute top-3.5 left-3.5 w-10 h-10 rounded-xl bg-white/95 text-orange-500 shadow-md flex items-center justify-center">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {service.short_description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer py-1"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      Details
                    </button>

                    <button
                      onClick={() => onOpenQuote(service.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
                    >
                      <span>Get a Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="relative h-44 bg-slate-100">
              <img
                src={selectedService.image_url}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4">
                <h3 className="text-xl font-extrabold text-white">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedService.long_description || selectedService.short_description}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const sid = selectedService.id;
                    setSelectedService(null);
                    onOpenQuote(sid);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
