import React from "react";

function Marquee() {
  return (
    <div className="w-full py-6 md:py-8 bg-white border-y border-zinc-200/60 overflow-hidden relative z-40 select-none">
      <div className="flex whitespace-nowrap">
        {/* Track 1 */}
        <div className="flex shrink-0 gap-8 items-center animate-marquee select-none pr-8">
          <span className="text-lg md:text-xl font-mono text-[#a1a1aa] uppercase tracking-wider flex items-center gap-6">
             <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>BUSINESSES</span></span>
            <span className="text-[#d4d4d8]">✦</span>
           
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>STARTUPS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>BRANDS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
           
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>FOUNDERS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>ENTREPRENEURS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>CREATORS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>BUILDERS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>INFLUENCERS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>FREELANCERS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>SOLOPRENEURS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
           
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>AGENCIES</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
          </span>
        </div>
        
        {/* Track 2 for seamless loop */}
        <div className="flex shrink-0 gap-8 items-center animate-marquee select-none pr-8" aria-hidden="true">
          <span className="text-lg md:text-xl font-mono text-[#a1a1aa] uppercase tracking-wider flex items-center gap-6">
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>BUSINESSES</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
           
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>STARTUPS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>BRANDS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
           
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>FOUNDERS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>ENTREPRENEURS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>CREATORS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>BUILDERS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>INFLUENCERS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>FREELANCERS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>SOLOPRENEURS</span></span>
            <span className="text-[#d4d4d8]">✦</span>
           
            <span>FOR <span className="font-bold" style={{ color: '#C98A2E' }}>AGENCIES</span></span>
            <span className="text-[#d4d4d8]">✦</span>
            
          </span>
        </div>
      </div>
    </div>
  );
}

export default Marquee;