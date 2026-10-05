import React from 'react';
import { Vehicle } from '../types/index.ts';
import { X, CheckCircle, ArrowRight, ShieldCheck, Gauge, Maximize2, Tag } from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onRequestQuote: (vehicleId: string) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onRequestQuote,
}) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[92vh] flex flex-col">
        {/* Top header bar */}
        <div className="p-4 sm:p-6 pb-0 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-orange-100 text-orange-700">
              {vehicle.vehicle_type.replace('_', ' ')}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Fleet ID: {vehicle.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Vehicle Showcase */}
          <div className="relative rounded-2xl bg-slate-50 border border-slate-200/70 p-6 flex items-center justify-center min-h-[220px]">
            <img
              src={vehicle.image_url}
              alt={vehicle.vehicle_name}
              className="max-h-56 max-w-full object-contain"
            />
            <div className="absolute bottom-3 left-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                vehicle.availability_status === 'available'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  vehicle.availability_status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}></span>
                {vehicle.availability_status === 'available' ? 'Ready for Dispatch' : 'Currently in Service'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {vehicle.vehicle_name}
            </h3>
            <p className="text-orange-600 font-bold text-base mt-1">
              Rated Capacity: {vehicle.capacity}
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              {vehicle.short_description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <Gauge className="w-4 h-4 text-orange-500" />
                <span>Payload Limit</span>
              </div>
              <p className="mt-1 font-bold text-sm text-slate-900">
                {vehicle.payload_capacity || vehicle.capacity}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <Maximize2 className="w-4 h-4 text-orange-500" />
                <span>Cargo Dimensions</span>
              </div>
              <p className="mt-1 font-bold text-sm text-slate-900">
                {vehicle.dimensions || 'Standard Commercial'}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <Tag className="w-4 h-4 text-orange-500" />
                <span>Zone Clearance</span>
              </div>
              <p className="mt-1 font-bold text-sm text-slate-900">
                All Dubai Zones
              </p>
            </div>
          </div>

          {/* Recommended Usage Box */}
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/60">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-950 mb-2">
              Recommended Cargo &amp; Suitability
            </h4>
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{vehicle.suitable_for}</span>
            </div>
          </div>

          {/* Safety and Driver note */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
            <span>
              Provided with licensed, RTA-certified professional driver and route clearance across Dubai.
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onRequestQuote(vehicle.id);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Request This Vehicle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
