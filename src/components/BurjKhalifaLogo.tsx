import React from 'react';

interface BurjKhalifaLogoProps {
  className?: string;
  size?: number;
  textColor?: string;
  showSubtitle?: boolean;
}

export const BurjKhalifaLogo: React.FC<BurjKhalifaLogoProps> = ({
  className = '',
  size = 46,
  textColor = 'text-slate-900',
  showSubtitle = true,
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Real Burj Khalifa Landmark Photo Emblem */}
      <div
        className="rounded-2xl bg-[#0A1628] border-2 border-orange-500/80 shadow-md shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=85"
          alt="Burj Khalifa Dubai"
          className="w-full h-full object-cover object-center scale-110"
        />
        {/* Subtle orange corner indicator */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-tl-md"></span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black text-xl sm:text-2xl tracking-tight ${textColor} font-sans`}>
            Dubai
          </span>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-orange-500 font-sans">
            Transport
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
            Commercial Fleet &amp; Logistics
          </span>
        )}
      </div>
    </div>
  );
};
