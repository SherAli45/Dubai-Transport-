import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Compass } from 'lucide-react';

interface ServiceAreasSectionProps {
  onSelectAreaForQuote: (areaName: string) => void;
}

export const ServiceAreasSection: React.FC<ServiceAreasSectionProps> = ({
  onSelectAreaForQuote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Real Iconic Dubai & UAE Transport Hubs
  const famousLocations = [
    {
      name: 'Downtown Dubai (Burj Khalifa)',
      district: 'Central Commercial Hub',
      image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      badge: 'Burj Khalifa Hub',
    },
    {
      name: 'Dubai Marina & JBR',
      district: 'Coastal Waterfront',
      image_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
      badge: 'Marina Corridor',
    },
    {
      name: 'Business Bay',
      district: 'Corporate Towers',
      image_url: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=800&q=80',
      badge: 'Canal Zone',
    },
    {
      name: 'Palm Jumeirah',
      district: 'Island & Resorts',
      image_url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80',
      badge: 'The Palm Access',
    },
    {
      name: 'Al Quoz Industrial Hub',
      district: 'Warehousing & Fleet Yard',
      image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      badge: 'Main Logistics Yard',
    },
    {
      name: 'Jebel Ali Freezone (JAFZA)',
      district: 'Deepwater Port & Sea Freight',
      image_url: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=800&q=80',
      badge: 'Port Logistics',
    },
    {
      name: 'Deira & Dubai Creek',
      district: 'Old Dubai Wholesale Markets',
      image_url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
      badge: 'Trade Center',
    },
    {
      name: 'Dubai Investments Park (DIP)',
      district: 'Logistics Distribution',
      image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      badge: 'Distribution Park',
    },
    {
      name: 'Dubai South (DWC Airport)',
      district: 'Aviation & Freight City',
      image_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
      badge: 'Cargo Airport',
    },
    {
      name: 'Sharjah & Northern Emirates',
      district: 'Inter-Emirate Transit',
      image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
      badge: 'Highway Route',
    },
    {
      name: 'Abu Dhabi Highway Transit',
      district: 'Capital Commercial Corridor',
      image_url: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
      badge: 'Intercity Route',
    },
    {
      name: 'Ras Al Khor Industrial',
      district: 'Auto & Building Materials',
      image_url: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80',
      badge: 'Industrial Zone',
    },
  ];

  const filteredLocations = famousLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="areas" className="py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            Service Provide All Over Dubai &amp; UAE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Serving Customers All Over Dubai
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
            Direct commercial road dispatches across all major landmarks, industrial zones, and inter-emirate routes.
          </p>
        </div>

        {/* Quick Search across Dubai */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location (Downtown, Marina, JAFZA, Al Quoz, Sharjah)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* 3D Animated Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredLocations.map((loc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-orange-400 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={loc.image_url}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0A1628]/90 text-orange-400 border border-orange-500/30 shadow-xs">
                  {loc.badge}
                </span>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-sm truncate drop-shadow-sm">
                    {loc.name}
                  </h3>
                  <p className="text-[10px] text-slate-200">
                    {loc.district}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Dispatch
                </span>
                <button
                  onClick={() => onSelectAreaForQuote(loc.name)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
