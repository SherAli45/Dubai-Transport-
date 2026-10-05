import React from 'react';
import { ClipboardList, Truck, Calculator, CheckCircle2, Navigation } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Tell Us Your Requirement',
      desc: 'Select your service, pickup & drop-off locations in Dubai, and what items or goods need transport.',
      icon: ClipboardList,
    },
    {
      step: '02',
      title: 'Get Recommended Vehicle',
      desc: 'Choose from our fleet or let our smart system suggest the exact truck, van, or pickup for your load.',
      icon: Truck,
    },
    {
      step: '03',
      title: 'Receive Your Quotation',
      desc: 'Get an immediate estimate and fast confirmation from our Dubai dispatch team via phone or WhatsApp.',
      icon: Calculator,
    },
    {
      step: '04',
      title: 'Confirm Your Service',
      desc: 'Approve your preferred date, time slot, and any special loading requirements.',
      icon: CheckCircle2,
    },
    {
      step: '05',
      title: 'Transport Is Arranged',
      desc: 'Our commercial vehicle arrives on schedule for secure loading, transit, and on-time delivery.',
      icon: Navigation,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-extrabold uppercase tracking-wider mb-2">
            Simple 5-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            How It Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            We make booking transport in Dubai straightforward, transparent, and completely hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70 hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-200 flex flex-col items-start group"
              >
                {/* Step pill */}
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-black text-slate-300 group-hover:text-orange-400 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
