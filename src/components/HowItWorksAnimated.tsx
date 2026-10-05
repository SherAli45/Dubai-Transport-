import React, { useState } from 'react';
import { ClipboardList, Truck, CheckCircle2, Navigation, ArrowRight } from 'lucide-react';

export const HowItWorksAnimated: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Specify Cargo & Route',
      desc: 'Select pickup & drop-off anywhere in Dubai with cargo details.',
      icon: ClipboardList,
      color: 'from-amber-500 to-orange-500',
    },
    {
      num: '02',
      title: 'Choose Matching Vehicle',
      desc: 'Select from our commercial fleet of trucks, vans, or pickups.',
      icon: Truck,
      color: 'from-orange-500 to-amber-600',
    },
    {
      num: '03',
      title: 'Get Fast Quotation',
      desc: 'Immediate dispatch confirmation via WhatsApp or phone call.',
      icon: CheckCircle2,
      color: 'from-amber-500 to-emerald-500',
    },
    {
      num: '04',
      title: 'On-Time Delivery',
      desc: 'Licensed commercial vehicle arrives promptly for safe transit.',
      icon: Navigation,
      color: 'from-blue-600 to-indigo-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-normal">
            Fast, transparent commercial transport arranged in 4 easy steps.
          </p>
        </div>

        {/* 4 Interactive 3D Animated Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`relative rounded-3xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-50/90 to-white border-orange-500 shadow-lg scale-102 ring-2 ring-orange-500/20'
                    : 'bg-slate-50/70 border-slate-200/80 hover:border-orange-300 hover:bg-white shadow-2xs'
                }`}
              >
                <div>
                  {/* Step Number & 3D Icon Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black font-mono text-slate-300 group-hover:text-orange-500 transition-colors">
                      {item.num}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-orange-600">
                  <span>Step {idx + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
