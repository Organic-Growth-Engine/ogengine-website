import React from "react";

function Marquee() {
  return (
    <div className="w-full py-6 md:py-8 bg-white border-y border-zinc-200/60 overflow-hidden relative z-40 select-none">
      <div className="flex whitespace-nowrap">
        {/* Track 1 */}
        <div className="flex shrink-0 gap-8 items-center animate-marquee select-none pr-8">
          <span className="text-lg md:text-xl font-mono text-[#a1a1aa] uppercase tracking-wider flex items-center gap-6">
            <span>OGENGINE</span>
            <span className="text-[#d4d4d8]">✦</span>
            <img src="/2d logo.jpeg" alt="logo" className="h-7 md:h-10 object-contain" />
            <span className="text-[#d4d4d8]">✦</span>
            <span>THE FUTURE OF <span className="text-red-600 font-bold">GRAPHICS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            <img src="/2d logo.jpeg" alt="logo" className="h-7 md:h-10 object-contain" />
            <span className="text-[#d4d4d8]">✦</span>
            <span>WEBGPU <span className="text-red-600 font-bold">LIVE</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            <img src="/2d logo.jpeg" alt="logo" className="h-7 md:h-10 object-contain" />
            <span className="text-[#d4d4d8]">✦</span>
          </span>
        </div>
        
        {/* Track 2 for seamless loop */}
        <div className="flex shrink-0 gap-8 items-center animate-marquee select-none pr-8" aria-hidden="true">
          <span className="text-lg md:text-xl font-mono text-[#a1a1aa] uppercase tracking-wider flex items-center gap-6">
            <span>OGENGINE</span>
            <span className="text-[#d4d4d8]">✦</span>
            <img src="/2d logo.jpeg" alt="logo" className="h-7 md:h-10 object-contain" />
            <span className="text-[#d4d4d8]">✦</span>
            <span>THE FUTURE OF <span className="text-red-600 font-bold">GRAPHICS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            <img src="/2d logo.jpeg" alt="logo" className="h-7 md:h-10 object-contain" />
            <span className="text-[#d4d4d8]">✦</span>
            <span>WEBGPU <span className="text-red-600 font-bold">LIVE</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            <img src="/2d logo.jpeg" alt="logo" className="h-7 md:h-10 object-contain" />
            <span className="text-[#d4d4d8]">✦</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Marquee;