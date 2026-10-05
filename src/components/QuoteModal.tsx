import React, { useState, useEffect } from 'react';
import {
  TransportService,
  Vehicle,
  ServiceArea,
  QuoteRequest,
} from '../types/index.ts';
import { createQuoteRequest } from '../lib/supabase.ts';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone,
  MessageSquare,
  HelpCircle,
  Truck,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  FileText,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: TransportService[];
  vehicles: Vehicle[];
  areas: ServiceArea[];
  initialServiceId?: string;
  initialVehicleId?: string;
  initialPickupArea?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  services,
  vehicles,
  areas,
  initialServiceId,
  initialVehicleId,
  initialPickupArea,
}) => {
  // 6 guided steps:
  // 1: Service
  // 2: Pickup Area
  // 3: Dropoff Area
  // 4: Goods & Load Size (Smart recommendation)
  // 5: Vehicle Selection / Confirmation
  // 6: Date & Time + Contact Details
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Form State
  const [serviceId, setServiceId] = useState<string>(initialServiceId || '');
  const [pickupArea, setPickupArea] = useState<string>(initialPickupArea || '');
  const [dropoffArea, setDropoffArea] = useState<string>('');
  const [goodsType, setGoodsType] = useState<string>('General Goods');
  const [loadSize, setLoadSize] = useState<'Small' | 'Medium' | 'Large' | 'Not Sure'>('Medium');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicleId || '');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Morning (09:00 AM - 01:00 PM)');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  // Area search queries for selector
  const [pickupSearch, setPickupSearch] = useState<string>('');
  const [dropoffSearch, setDropoffSearch] = useState<string>('');

  // Pre-fill defaults or prop updates
  useEffect(() => {
    if (initialServiceId) setServiceId(initialServiceId);
    if (initialVehicleId) setSelectedVehicleId(initialVehicleId);
    if (initialPickupArea) setPickupArea(initialPickupArea);

    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, [initialServiceId, initialVehicleId, initialPickupArea, isOpen]);

  // Smart vehicle recommendation logic based on goodsType and loadSize
  useEffect(() => {
    if (initialVehicleId) return; // Keep user's explicitly picked vehicle if specified

    if (loadSize === 'Small') {
      const match = vehicles.find((v) => v.vehicle_type === 'pickup' || v.vehicle_type === 'van');
      if (match) setSelectedVehicleId(match.id);
    } else if (loadSize === 'Medium') {
      const match = vehicles.find((v) => v.vehicle_name.toLowerCase().includes('small truck') || v.vehicle_type === 'box_truck');
      if (match) setSelectedVehicleId(match.id);
    } else if (loadSize === 'Large') {
      const match = vehicles.find((v) => v.vehicle_name.toLowerCase().includes('medium truck') || v.vehicle_name.toLowerCase().includes('large truck'));
      if (match) setSelectedVehicleId(match.id);
    }
  }, [loadSize, goodsType, vehicles, initialVehicleId]);

  if (!isOpen) return null;

  const resetForm = () => {
    setCurrentStep(1);
    setSubmittedQuote(null);
    setSubmitError(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Step Validations
  const validateStep = (step: number): boolean => {
    setSubmitError(null);
    if (step === 1) {
      if (!serviceId) {
        setSubmitError('Please select a transport service to continue.');
        return false;
      }
    }
    if (step === 2) {
      if (!pickupArea.trim()) {
        setSubmitError('Please select or specify your Dubai pickup area.');
        return false;
      }
    }
    if (step === 3) {
      if (!dropoffArea.trim()) {
        setSubmitError('Please select or specify your Dubai drop-off area.');
        return false;
      }
      if (dropoffArea.trim().toLowerCase() === pickupArea.trim().toLowerCase()) {
        // Can be same area, but allow user note
      }
    }
    if (step === 4) {
      if (!goodsType) {
        setSubmitError('Please specify what you need transported.');
        return false;
      }
    }
    if (step === 5) {
      // Vehicle can be left empty if 'Not Sure', but we ensure a default or 'Not Sure'
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate Contact Details
    if (!customerName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setSubmitError('Please enter a valid contact phone number.');
      return;
    }
    if (!preferredDate) {
      setSubmitError('Please select your preferred transport date.');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await createQuoteRequest({
        customer_name: customerName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        email: email.trim() || undefined,
        service_id: serviceId || 'goods-transport',
        vehicle_id: selectedVehicleId || undefined,
        pickup_area: pickupArea,
        dropoff_area: dropoffArea,
        goods_type: goodsType,
        load_size: loadSize,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        additional_notes: additionalNotes.trim() || undefined,
      });

      setSubmittedQuote(created);
    } catch (err: any) {
      console.error('Submission failed', err);
      setSubmitError(err.message || 'An error occurred while submitting your request. Please try again or contact our WhatsApp dispatch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper lists for step 4
  const goodsCategories = [
    { id: 'General Goods', label: 'General Goods & Pallets', desc: 'Boxes, cartons, warehouse stock' },
    { id: 'Furniture', label: 'Furniture & Fixtures', desc: 'Home, retail or showroom furnishings' },
    { id: 'Boxes / Cartons', label: 'Boxes / Cartons', desc: 'Personal or commercial packaged boxes' },
    { id: 'Office Items', label: 'Office Items & IT', desc: 'Desks, filing cabinets, computer equipment' },
    { id: 'Construction Material', label: 'Construction / Industrial', desc: 'Building hardware, pipes, metal, tools' },
    { id: 'Other', label: 'Other Commercial Cargo', desc: 'Specialized cargo or machinery' },
  ];

  const loadSizes = [
    { id: 'Small', label: 'Small Load', desc: 'Up to 1.5 tons (A few boxes or single furniture piece)' },
    { id: 'Medium', label: 'Medium Load', desc: '1.5 - 5 tons (Multiple pallets, room or office contents)' },
    { id: 'Large', label: 'Large Load', desc: '5 - 15+ tons (Full warehouse transfer, heavy commercial)' },
    { id: 'Not Sure', label: 'Not Sure', desc: 'Our team will assess and recommend the right vehicle' },
  ];

  const popularAreasList = areas.filter((a) => a.active);
  const selectedVehicleObj = vehicles.find((v) => v.id === selectedVehicleId);
  const selectedServiceObj = services.find((s) => s.id === serviceId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 relative my-8 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header with Progress */}
        <div className="p-4 sm:p-6 pb-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Request Transport Service
                </h3>
                <p className="text-xs text-slate-500">
                  Dubai Commercial Road Transportation
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          {!submittedQuote && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                <span className="text-orange-600">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-slate-400">
                  {currentStep === 1 && 'Select Service'}
                  {currentStep === 2 && 'Pickup Location'}
                  {currentStep === 3 && 'Drop-off Location'}
                  {currentStep === 4 && 'Cargo Details'}
                  {currentStep === 5 && 'Vehicle Choice'}
                  {currentStep === 6 && 'Date & Contact'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          {/* Global error banner */}
          {submitError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SUCCESS SCREEN */}
          {/* ------------------------------------------------------------- */}
          {submittedQuote ? (
            <div className="text-center py-6 sm:py-8 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2">
                  Request Received
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Thank You, {submittedQuote.customer_name}!
                </h3>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your transport service request has been registered in our Dubai dispatch database.
                </p>
              </div>

              {/* Reference Card */}
              <div className="bg-slate-50 border-2 border-orange-200 rounded-2xl p-5 max-w-md mx-auto">
                <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
                  Official Reference Number
                </p>
                <p className="text-3xl font-black text-orange-600 font-mono tracking-wider mt-1">
                  {submittedQuote.reference_number}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Route:</span>
                    <span className="font-semibold text-slate-800">{submittedQuote.pickup_area} → {submittedQuote.dropoff_area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Preferred Date:</span>
                    <span className="font-semibold text-slate-800">{submittedQuote.preferred_date}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Our Dubai operations team will contact you shortly to confirm availability, truck assignment, and formal quotation.
              </p>

              {/* Instant WhatsApp & Call Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <a
                  href={`https://wa.me/923273172804?text=${encodeURIComponent(
                    `Hello Dubai Transport Team, I submitted quote request reference ${submittedQuote.reference_number} for transport from ${submittedQuote.pickup_area} to ${submittedQuote.dropoff_area}. Could you please confirm pricing?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  WhatsApp: 03273172804
                </a>

                <a
                  href="tel:03273172804"
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-slate-700" />
                  Call 03273172804
                </a>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 underline"
                >
                  Close &amp; Return to Website
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* --------------------------------------------------------- */}
              {/* STEP 1: SELECT SERVICE */}
              {/* --------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      What transport service do you need?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose the category that best matches your cargo or delivery type in Dubai.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {services.filter((s) => s.active).map((service) => {
                      const isSelected = serviceId === service.id;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            setServiceId(service.id);
                            setSubmitError(null);
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-2 ring-orange-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900">
                              {service.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {service.short_description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* STEP 2: PICKUP AREA */}
              {/* --------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Where should we pick up the goods?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select your Dubai pickup district or enter your specific community/building.
                    </p>
                  </div>

                  {/* Search / Custom input */}
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={pickupArea}
                      onChange={(e) => {
                        setPickupArea(e.target.value);
                        setPickupSearch(e.target.value);
                      }}
                      placeholder="Type or select pickup area (e.g. Al Quoz, Business Bay, Jebel Ali)..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Popular area chips */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Popular Dubai Pickup Zones:
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                      {popularAreasList
                        .filter((a) => !pickupSearch || a.name.toLowerCase().includes(pickupSearch.toLowerCase()))
                        .map((area) => (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => {
                              setPickupArea(area.name);
                              setSubmitError(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              pickupArea === area.name
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {area.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* STEP 3: DROP-OFF AREA */}
              {/* --------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Where is the destination in Dubai?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select the destination area or enter any location across Dubai / UAE.
                    </p>
                  </div>

                  {/* Search / Custom input */}
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={dropoffArea}
                      onChange={(e) => {
                        setDropoffArea(e.target.value);
                        setDropoffSearch(e.target.value);
                      }}
                      placeholder="Type or select drop-off area (e.g. Dubai Marina, Deira, DIP)..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Route preview if pickup set */}
                  {pickupArea && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Pickup:</span>
                      <span className="font-bold text-slate-900">{pickupArea}</span>
                    </div>
                  )}

                  {/* Popular area chips */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Popular Dubai Destination Zones:
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                      {popularAreasList
                        .filter((a) => !dropoffSearch || a.name.toLowerCase().includes(dropoffSearch.toLowerCase()))
                        .map((area) => (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => {
                              setDropoffArea(area.name);
                              setSubmitError(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              dropoffArea === area.name
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {area.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* STEP 4: GOODS & LOAD SIZE (SMART VEHICLE RECOMMENDATION) */}
              {/* --------------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      What are you transporting?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tell us about your items so we can prepare the proper vehicle.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {goodsCategories.map((cat) => {
                      const isSelected = goodsType === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setGoodsType(cat.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/70 font-bold text-slate-900'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-bold">{cat.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">{cat.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      How large is the load?
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Select approximate scale or choose &quot;Not Sure&quot;.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {loadSizes.map((size) => {
                        const isSelected = loadSize === size.id;
                        return (
                          <button
                            key={size.id}
                            type="button"
                            onClick={() => setLoadSize(size.id as any)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50/70'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-bold text-slate-900">
                                {size.label}
                              </span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{size.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* NOT SURE Callout */}
                  {loadSize === 'Not Sure' && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-900">
                          Not sure which vehicle you need?
                        </p>
                        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                          No problem! Simply describe your items in the notes and our Dubai logistics team will automatically match and quote the optimal truck or van.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* STEP 5: VEHICLE SELECTION / CONFIRMATION */}
              {/* --------------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        Select or Confirm Vehicle
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Recommended based on your {loadSize} load and cargo type.
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      Smart Match
                    </div>
                  </div>

                  {/* Vehicles Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                    {vehicles.filter((v) => v.active).map((vehicle) => {
                      const isSelected = selectedVehicleId === vehicle.id;
                      return (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => setSelectedVehicleId(vehicle.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-2 ring-orange-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden p-1 shrink-0">
                              <img
                                src={vehicle.image_url}
                                alt={vehicle.vehicle_name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {vehicle.vehicle_name}
                              </p>
                              <span className="inline-block text-[11px] font-bold text-orange-600">
                                {vehicle.capacity}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 line-clamp-1">
                            {vehicle.suitable_for}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* STEP 6: DATE, TIME & CONTACT DETAILS */}
              {/* --------------------------------------------------------- */}
              {currentStep === 6 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      When &amp; How should we reach you?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter preferred dispatch time and contact details for quotation confirmation.
                    </p>
                  </div>

                  {/* Summary recap chip */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-slate-400">Route: </span>
                      <strong className="text-slate-900">{pickupArea} → {dropoffArea}</strong>
                    </div>
                    {selectedVehicleObj && (
                      <span className="font-semibold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md">
                        {selectedVehicleObj.vehicle_name} ({selectedVehicleObj.capacity})
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Preferred Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    {/* Preferred Time Slot */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        Preferred Time Slot *
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                      >
                        <option>Morning (08:00 AM - 12:00 PM)</option>
                        <option>Afternoon (12:00 PM - 04:00 PM)</option>
                        <option>Evening (04:00 PM - 08:00 PM)</option>
                        <option>Night / Urgent (08:00 PM - 12:00 AM)</option>
                        <option>Flexible / Anytime</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-orange-500" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Mohammed Al Mansoori"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-orange-500" />
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+971 50 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Same as mobile or different"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.ae"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Additional Cargo Instructions or Loading Details
                    </label>
                    <textarea
                      rows={2}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. Ground floor pickup, loading dock pass required, fragile electronics, forklift needed..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!submittedQuote && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Request Transport Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
