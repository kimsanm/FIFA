import React, { useState, useEffect } from 'react';
import { Calendar, Globe, MapPin, ChevronRight, Volume2, Users } from 'lucide-react';

interface HeroBannerProps {
  countdownDate: string;
  announcement: string;
  onNavigateToTicketing: () => void;
  onNavigateToGuide: () => void;
}

export default function HeroBanner({
  countdownDate,
  announcement,
  onNavigateToTicketing,
  onNavigateToGuide
}: HeroBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(countdownDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownDate]);

  return (
    <section className="relative overflow-hidden bg-slate-950 pb-12 pt-8 sm:pb-16 sm:pt-12" id="hero-banner">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute right-10 bottom-0 h-96 w-96 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Ticker Announcement */}
        {announcement && (
          <div className="mb-8 flex items-center space-x-3 rounded-xl border border-lime-400/20 bg-lime-400/5 p-3 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.02)]">
            <Volume2 className="h-4.5 w-4.5 shrink-0 animate-bounce text-lime-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-400/80">Alert:</span>
            <p className="font-sans text-xs font-semibold tracking-wide text-slate-200">
              {announcement}
            </p>
          </div>
        )}

        {/* Main Grid Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Headline & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 backdrop-blur">
              <Globe className="h-3.5 w-3.5 text-lime-400 animate-spin" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-300">
                North America & Southeast Asia Tribute 2026
              </span>
            </div>
            
            <h1 className="font-sans text-4xl font-black tracking-tight text-white sm:text-6xl leading-none uppercase">
              The World <br />
              Champions <br />
              <span className="bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Championship 2026
              </span>
            </h1>
            
            <p className="font-sans text-base text-slate-400 max-w-xl leading-relaxed">
              Witness the ultimate global football pinnacle. 16 elite football nations, iconic mega-stadiums, legendary superstars, and the highly anticipated tribute arenas. Connect, support, and secure your place in history.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onNavigateToTicketing}
                className="group flex items-center space-x-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:opacity-90 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <span>Book Tickets Now</span>
                <ChevronRight className="h-4 w-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onNavigateToGuide}
                className="flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 active:scale-95 transition-all"
              >
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>Explore Host Cities</span>
              </button>
            </div>
          </div>

          {/* Countdown Clock Panel */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur shadow-2xl relative">
            <div className="absolute -top-3 left-6 inline-flex items-center space-x-1.5 rounded-full bg-slate-950 border border-slate-800 px-3.5 py-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-red-500">Live countdown</span>
            </div>

            <p className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-6 mt-2">
              Championship Opening Match Kickoff
            </p>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
              
              {/* Days */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/80 border border-slate-800/50 p-3 sm:p-4 shadow-inner">
                <span className="font-sans text-2xl sm:text-4xl font-black text-lime-400 leading-none">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/80 border border-slate-800/50 p-3 sm:p-4 shadow-inner">
                <span className="font-sans text-2xl sm:text-4xl font-black text-white leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/80 border border-slate-800/50 p-3 sm:p-4 shadow-inner">
                <span className="font-sans text-2xl sm:text-4xl font-black text-white leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold">
                  Mins
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/80 border border-slate-800/50 p-3 sm:p-4 shadow-inner">
                <span className="font-sans text-2xl sm:text-4xl font-black text-emerald-400 leading-none">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold">
                  Secs
                </span>
              </div>

            </div>

            {/* Secondary Countdown info */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-slate-500 border-t border-slate-800/60 pt-6">
              <div className="flex items-center space-x-1.5 text-xs font-semibold">
                <Calendar className="h-4 w-4 text-lime-400/80" />
                <span>June 11, 2026</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold">
                <Users className="h-4 w-4 text-emerald-400/80" />
                <span>4.8M Fans expected</span>
              </div>
            </div>
          </div>

        </div>

        {/* Mini Hosts Cards */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { country: 'United States', code: 'USA', flag: '🇺🇸', stadium: 'SoFi Stadium & MetLife' },
            { country: 'Canada', code: 'CAN', flag: '🇨🇦', stadium: 'BC Place Stadium' },
            { country: 'Mexico', code: 'MEX', flag: '🇲🇽', stadium: 'Estadio Azteca' },
            { country: 'Cambodia', code: 'KHM', flag: '🇰🇭', stadium: 'Olympic Stadium Phnom Penh' }
          ].map((host, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 rounded-2xl border border-slate-900 bg-slate-900/30 p-3.5 hover:border-slate-800 hover:bg-slate-900/50 transition-all cursor-pointer"
              onClick={onNavigateToGuide}
            >
              <span className="text-2xl">{host.flag}</span>
              <div className="min-w-0">
                <h4 className="font-sans text-xs font-bold text-slate-200 leading-none">{host.country}</h4>
                <p className="font-mono text-[9px] text-slate-500 truncate mt-1">{host.stadium}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
