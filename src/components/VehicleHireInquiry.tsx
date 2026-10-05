import React, { useState } from 'react';
import { Truck, MessageSquare, Phone, Send, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { sendContactMessage } from '../lib/supabase.ts';

export const VehicleHireInquiry: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('Small Truck (1–3 Ton)');
  const [cargoRequirement, setCargoRequirement] = useState('Commercial Goods & Pallets');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const vehicleOptions = [
    'Small Truck (1–3 Ton)',
    'Medium Truck (5–7 Ton)',
    'Large Heavy Truck (10–20 Ton)',
    'Trailer Truck (Heavy Load 25–40 Ton)',
    'Box Truck (Enclosed Body 3–5 Ton)',
    'Cargo Delivery Van (1.5 Ton)',
    '1-Ton Utility Pickup',
    'Refrigerated Chiller Truck (3–5 Ton)',
    'Flatbed Special Cargo Truck',
    'Vehicle Transport Recovery Flatbed',
  ];

  const requirementOptions = [
    'Commercial Goods & Pallets',
    'Furniture & Office Relocation',
    'Warehouse Inventory Dispatch',
    'Heavy Machinery & Steel Pipes',
    'Boxes & Packaged Delivery',
    'Chilled / Perishable Foodstuffs',
    'Vehicle Transport / Car Shift',
    'Other Transport Requirement',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      alert('Please enter your contact phone or WhatsApp number.');
      return;
    }

    try {
      setLoading(true);
      const fullMessage = `Vehicle: ${selectedVehicle} | Requirement: ${cargoRequirement} | Note: ${additionalNote || 'Direct hire inquiry'}`;
      await sendContactMessage({
        name: customerName.trim() || 'Valued Customer',
        phone: customerPhone.trim(),
        message: fullMessage,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Hire submit error', err);
      setSubmitted(true); // Still show WhatsApp direct action
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Dubai Transport Team, I want to hire a ${selectedVehicle} for ${cargoRequirement}. My phone is ${customerPhone || '03273172804'}. Please contact me.`
  );

  return (
    <section id="hire-inquiry" className="py-16 bg-[#0A1628] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2 border border-orange-500/30">
            Fast Vehicle Hire
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
            Kis Cheez Ke Liye Vehicle Hire Kar Rahe Hain?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Apna transport masla aur vehicle select karein. Hamari dispatch team foran WhatsApp/Phone par quotation ke saath rabta karegi.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {submitted ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Shukriya! Message Received Ho Gaya Hai
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Hamari Dubai Transport team foran aap se rabta karegi:
                </p>
                <div className="mt-2 text-orange-400 font-extrabold text-base">
                  WhatsApp Support: 03273172804
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/923273172804?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  Chat Directly on WhatsApp: 03273172804
                </a>

                <a
                  href="tel:03273172804"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-orange-400" />
                  Call: 03273172804
                </a>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Hire Another Vehicle
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-orange-400" />
                    Kaun Si Vehicle Chahiye? *
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {vehicleOptions.map((v, idx) => (
                      <option key={idx} value={v} className="bg-slate-900 text-white">
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cargo Requirement */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Kis Kaam / Saman Ke Liye Chahiye? *
                  </label>
                  <select
                    value={cargoRequirement}
                    onChange={(e) => setCargoRequirement(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {requirementOptions.map((r, idx) => (
                      <option key={idx} value={r} className="bg-slate-900 text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Aapka Naam
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-400" />
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="03273172804"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mazeed Details (Pickup/Drop-off Area ya Saman ki Wazaahat)
                </label>
                <textarea
                  rows={2}
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                  placeholder="e.g. Al Quoz se Deira saman le jana hai, emergency dispatch chahiye..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Send Transport Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
