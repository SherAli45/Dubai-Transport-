import React, { useState } from 'react';
import { Vehicle } from '../types/index.ts';
import { ArrowRight, Eye } from 'lucide-react';

interface FleetSectionProps {
  vehicles: Vehicle[];
  onOpenQuote: (serviceId?: string, vehicleId?: string) => void;
  onSelectVehicleDetail: (vehicle: Vehicle) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({
  vehicles,
  onOpenQuote,
  onSelectVehicleDetail,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter tabs strictly matching the reference tablet
  const tabs = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'truck', label: 'Trucks' },
    { id: 'trailer', label: 'Trailers' },
    { id: 'refrigerated', label: 'Refrigerated' },
    { id: 'van', label: 'Vans' },
    { id: 'pickup', label: 'Pickups' },
  ];

  const filteredVehicles = vehicles.filter((v) => {
    if (!v.active) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'truck') return v.vehicle_type === 'truck' || v.vehicle_type === 'box_truck';
    if (activeTab === 'trailer') return v.vehicle_type === 'flatbed' || v.vehicle_name.toLowerCase().includes('trailer');
    if (activeTab === 'refrigerated') return v.vehicle_type === 'refrigerated';
    if (activeTab === 'van') return v.vehicle_type === 'van';
    if (activeTab === 'pickup') return v.vehicle_type === 'pickup';
    return true;
  });

  return (
    <section id="fleet" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching reference */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Our Fleet
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
            Modern and well-maintained vehicles for all types of cargo.
          </p>
        </div>

        {/* Category Filter Tabs matching the reference tablet */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-10 gap-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0A1628] text-white shadow-md shadow-slate-900/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Vehicles Grid matching reference layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => {
            const isAvailable = vehicle.availability_status === 'available';

            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-300 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Vehicle Image - Pure Real Commercial Vehicle Photography (No saman/boxes) */}
                <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.vehicle_name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                      {isAvailable ? 'Available' : 'In Service'}
                    </span>
                  </div>

                  {/* Quick view button overlay */}
                  <button
                    onClick={() => onSelectVehicleDetail(vehicle)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-slate-600 hover:text-orange-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="View Specs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Vehicle Specs & Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-orange-500 transition-colors">
                      {vehicle.vehicle_name}
                    </h3>

                    {/* Capacity tag matching reference */}
                    <div className="text-xs font-bold text-slate-500 mt-0.5">
                      {vehicle.capacity}
                    </div>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                      {vehicle.short_description}
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => onSelectVehicleDetail(vehicle)}
                      className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors text-center cursor-pointer"
                    >
                      Specs
                    </button>
                    <button
                      onClick={() => onOpenQuote(undefined, vehicle.id)}
                      className="w-1/2 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>Get Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
