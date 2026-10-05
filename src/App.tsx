/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Vehicle, TransportService, ServiceArea } from './types/index.ts';
import { getVehicles, getServices, getServiceAreas } from './lib/supabase.ts';
import { INITIAL_VEHICLES, INITIAL_SERVICES, INITIAL_AREAS } from './data/initialData.ts';

import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { QuickAccess } from './components/QuickAccess.tsx';
import { CombinedFleetServices } from './components/CombinedFleetServices.tsx';
import { ServiceAreasSection } from './components/ServiceAreasSection.tsx';
import { VehicleHireInquiry } from './components/VehicleHireInquiry.tsx';
import { HowItWorksAnimated } from './components/HowItWorksAnimated.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { QuoteModal } from './components/QuoteModal.tsx';
import { VehicleDetailModal } from './components/VehicleDetailModal.tsx';
import { WhyChooseUsModal } from './components/WhyChooseUsModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { MobileStickyBar } from './components/MobileStickyBar.tsx';

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [services, setServices] = useState<TransportService[]>(INITIAL_SERVICES);
  const [areas, setAreas] = useState<ServiceArea[]>(INITIAL_AREAS);

  // Quote Request Wizard State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteServiceId, setQuoteServiceId] = useState<string | undefined>(undefined);
  const [quoteVehicleId, setQuoteVehicleId] = useState<string | undefined>(undefined);
  const [quotePickupArea, setQuotePickupArea] = useState<string | undefined>(undefined);

  // Vehicle Detail Modal
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Why Choose Us Modal
  const [isWhyChooseUsOpen, setIsWhyChooseUsOpen] = useState(false);

  // Admin Portal State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Fetch live database vehicles, services and areas
  const loadData = async () => {
    try {
      const [vData, sData, aData] = await Promise.all([
        getVehicles(false),
        getServices(false),
        getServiceAreas(false),
      ]);
      if (vData && vData.length > 0) setVehicles(vData);
      if (sData && sData.length > 0) setServices(sData);
      if (aData && aData.length > 0) setAreas(aData);
    } catch (err) {
      console.warn('Using initial seed data fallback', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenQuote = (serviceId?: string, vehicleId?: string, pickupArea?: string) => {
    setQuoteServiceId(serviceId);
    setQuoteVehicleId(vehicleId);
    setQuotePickupArea(pickupArea);
    setIsQuoteOpen(true);
  };

  const handleSelectAction = (targetId: string) => {
    if (targetId === 'why-choose-us') {
      setIsWhyChooseUsOpen(true);
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white pb-14 sm:pb-0">
      {/* 1. Header Navigation Bar with Real Burj Khalifa Logo */}
      <Navbar
        onOpenQuote={() => handleOpenQuote()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenWhyChooseUs={() => setIsWhyChooseUsOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* 2. Hero Section: Clean Dubai Transport Title & Visible White Truck on Highway */}
      <Hero onOpenQuote={() => handleOpenQuote()} />

      {/* 3. Quick Service Access Row: 8 Circular Icon Badges */}
      <QuickAccess
        onSelectAction={handleSelectAction}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* 4. Combined Fleet & Services: 10 Accurate Commercial Vehicles with Cargo Selector */}
      <CombinedFleetServices
        vehicles={vehicles}
        onOpenQuote={(serviceId, vehicleId) => handleOpenQuote(serviceId, vehicleId)}
        onSelectVehicleDetail={(vehicle) => setSelectedVehicle(vehicle)}
      />

      {/* 5. Service Provide All Over Dubai & UAE with Iconic Landmark Cards */}
      <ServiceAreasSection
        onSelectAreaForQuote={(areaName) => handleOpenQuote(undefined, undefined, areaName)}
      />

      {/* 6. Vehicle Hire Inquiry: "Batayen Kis Cheez Ke Liye Hire Kar Rahe Hain?" */}
      <VehicleHireInquiry />

      {/* 7. How It Works: Visual 3D Animated 4-Step Process */}
      <HowItWorksAnimated />

      {/* 8. Direct Message Box & Contact Section */}
      <ContactSection />

      {/* 9. Clean Information Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenQuote={() => handleOpenQuote()}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Multi-Step Customer Quote Flow Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        services={services}
        vehicles={vehicles}
        areas={areas}
        initialServiceId={quoteServiceId}
        initialVehicleId={quoteVehicleId}
        initialPickupArea={quotePickupArea}
      />

      {/* Vehicle Technical Specs Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onRequestQuote={(vehicleId) => handleOpenQuote(undefined, vehicleId)}
      />

      {/* Why Choose Us Detailed Modal */}
      <WhyChooseUsModal
        isOpen={isWhyChooseUsOpen}
        onClose={() => setIsWhyChooseUsOpen(false)}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Admin Operations & Fleet Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        onFleetUpdated={loadData}
      />

      {/* Sticky Action Bar for Mobile */}
      <MobileStickyBar onOpenQuote={() => handleOpenQuote()} />
    </div>
  );
}
