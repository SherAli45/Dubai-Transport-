import React, { useState } from 'react';
import { Vehicle } from '../types/index.ts';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

interface CombinedFleetServicesProps {
  vehicles: Vehicle[];
  onOpenQuote: (serviceId?: string, vehicleId?: string) => void;
  onSelectVehicleDetail: (vehicle: Vehicle) => void;
}

export const CombinedFleetServices: React.FC<CombinedFleetServicesProps> = ({
  vehicles,
  onOpenQuote,
  onSelectVehicleDetail,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCargo, setSelectedCargo] = useState<string>('all');

  // Cargo Types ("Saman ke mutabiq vehicle choose karein")
  const cargoTypes = [
    { id: 'all', label: 'All Fleet (10 Vehicles)' },
    { id: 'boxes', label: 'Boxes & Packages', targetTab: 'pickup' },
    { id: 'furniture', label: 'Furniture & Fixtures', targetTab: 'box_truck' },
    { id: 'pallets', label: 'Commercial Pallets', targetTab: 'truck' },
    { id: 'heavy', label: 'Heavy Bulk / Steel', targetTab: 'trailer' },
    { id: 'chilled', label: 'Chilled / Perishables', targetTab: 'refrigerated' },
    { id: 'vehicles', label: 'Vehicle Recovery', targetTab: 'recovery' },
  ];

  // Category filter tabs
  const tabs = [
    { id: 'all', label: 'All Vehicles (10)' },
    { id: 'truck', label: 'Trucks' },
    { id: 'trailer', label: 'Trailers' },
    { id: 'refrigerated', label: 'Refrigerated' },
    { id: 'box_truck', label: 'Box Trucks' },
    { id: 'van', label: 'Vans' },
    { id: 'pickup', label: 'Pickups' },
  ];

  const handleCargoSelect = (cargoId: string) => {
    setSelectedCargo(cargoId);
    if (cargoId === 'all') {
      setActiveTab('all');
    } else if (cargoId === 'boxes') {
      setActiveTab('pickup');
    } else if (cargoId === 'furniture') {
      setActiveTab('box_truck');
    } else if (cargoId === 'pallets') {
      setActiveTab('truck');
    } else if (cargoId === 'heavy') {
      setActiveTab('trailer');
    } else if (cargoId === 'chilled') {
      setActiveTab('refrigerated');
    } else if (cargoId === 'vehicles') {
      setActiveTab('trailer');
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (!v.active) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'truck') return v.vehicle_type === 'truck';
    if (activeTab === 'trailer') return v.vehicle_type === 'flatbed';
    if (activeTab === 'refrigerated') return v.vehicle_type === 'refrigerated';
    if (activeTab === 'box_truck') return v.vehicle_type === 'box_truck';
    if (activeTab === 'van') return v.vehicle_type === 'van';
    if (activeTab === 'pickup') return v.vehicle_type === 'pickup';
    return true;
  });

  return (
    <section id="fleet" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
            Dubai Commercial Fleet
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Our Fleet &amp; Transport Services
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
            Choose from 10 commercial transport vehicles with 100% accurate specifications for your cargo.
          </p>
        </div>

        {/* Cargo Selector ("Saman ke mutabiq vehicle choose karein") */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-8 max-w-4xl mx-auto shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Saman Ke Mutabiq Vehicle Choose Karein:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {cargoTypes.map((cargo) => (
              <button
                key={cargo.id}
                onClick={() => handleCargoSelect(cargo.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCargo === cargo.id
                    ? 'bg-orange-500 text-white shadow-xs scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300'
                }`}
              >
                {cargo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedCargo('all');
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
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

        {/* Exact 10 Commercial Vehicle Cards (No empty cards, Accurate Real Photos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {filteredVehicles.map((vehicle) => {
            const isAvailable = vehicle.availability_status === 'available';

            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* 100% Accurate Real Commercial Vehicle Image */}
                <div className="relative h-44 bg-slate-50 flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.vehicle_name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-2xs'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                      {isAvailable ? 'Available' : 'In Service'}
                    </span>
                  </div>

                  {/* Specs Quick Peek Button */}
                  <button
                    onClick={() => onSelectVehicleDetail(vehicle)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-slate-700 hover:text-orange-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="View Specs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-orange-500 transition-colors">
                      {vehicle.vehicle_name}
                    </h3>

                    {/* Capacity tag */}
                    <div className="text-[11px] font-bold text-orange-600 mt-0.5">
                      {vehicle.capacity}
                    </div>

                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                      {vehicle.suitable_for}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
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
                      <span>Quote</span>
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
