import React, { useState } from 'react';
import { Ticket, Users, Layers, ShieldCheck, Mail, Sparkles, Printer, Check } from 'lucide-react';
import { Match, Team, Stadium, User } from '../types.js';

interface TicketingViewProps {
  matches: Match[];
  teams: Team[];
  stadiums: Stadium[];
  currentUser: User | null;
  onBookTicket: (bookingData: {
    matchId: string;
    stadiumId: string;
    category: string;
    seatNumber: string;
    price: number;
  }) => Promise<any>;
}

export default function TicketingView({
  matches,
  teams,
  stadiums,
  currentUser,
  onBookTicket
}: TicketingViewProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[3]?.id || matches[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<'Category 1' | 'Category 2' | 'Category 3' | 'VIP'>('Category 1');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState<any | null>(null);

  const activeMatch = matches.find(m => m.id === selectedMatchId) || matches[0];
  const activeStadium = stadiums.find(s => s.id === activeMatch?.stadiumId) || stadiums[0];

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown';
  const getTeamCode = (id: string) => teams.find(t => t.id === id)?.code || 'UNK';
  const getTeamFlag = (id: string) => teams.find(t => t.id === id)?.flag || '🏳️';

  const categoryPricing = {
    'VIP': { price: 450, color: 'bg-yellow-400 border-yellow-500' },
    'Category 1': { price: 250, color: 'bg-lime-400 border-lime-500' },
    'Category 2': { price: 150, color: 'bg-emerald-500 border-emerald-600' },
    'Category 3': { price: 85, color: 'bg-slate-700 border-slate-800' }
  };

  const handleSeatClick = (row: string, col: number) => {
    const seatId = `${row}-${col}`;
    setSelectedSeat(seatId);
  };

  const handleBook = async () => {
    if (!selectedSeat || !activeMatch || !activeStadium) return;
    setIsBooking(true);
    try {
      const price = categoryPricing[selectedCategory].price;
      const res = await onBookTicket({
        matchId: activeMatch.id,
        stadiumId: activeStadium.id,
        category: selectedCategory,
        seatNumber: `${selectedCategory.slice(-1)}${selectedSeat}`,
        price
      });
      if (res && res.success) {
        setIssuedTicket(res.booking);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6" id="tickets-section">
      
      {/* Page header */}
      <div>
        <h2 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
          Ticketing & Arena Booking Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pick a match, select your stadium zone from our interactive seating grid, and issue your official boarding pass.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Booking Selection & Seating Chart (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Match Picker Selector */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur shadow-xl">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
              <Ticket className="h-4.5 w-4.5 text-lime-400" />
              <span>1. Select Championship Match</span>
            </h3>

            <select
              value={selectedMatchId}
              onChange={(e) => {
                setSelectedMatchId(e.target.value);
                setSelectedSeat(null);
                setIssuedTicket(null);
              }}
              className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-xs font-bold font-mono text-slate-200 focus:border-lime-400 focus:outline-none"
            >
              {matches.map((m) => {
                const homeName = getTeamName(m.homeTeamId);
                const awayName = getTeamName(m.awayTeamId);
                const homeFlag = getTeamFlag(m.homeTeamId);
                const awayFlag = getTeamFlag(m.awayTeamId);
                return (
                  <option key={m.id} value={m.id} className="bg-slate-950 font-sans font-bold">
                    {homeFlag} {homeName} vs {awayFlag} {awayName} — {m.round} ({m.date} {m.time} UTC)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Seating Grid Map */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 md:p-6 backdrop-blur shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Layers className="h-4.5 w-4.5 text-lime-400" />
                <span>2. Interactive Stadium Seating Map</span>
              </h3>

              {/* Seating Tiers Legend */}
              <div className="flex flex-wrap gap-3">
                {Object.entries(categoryPricing).map(([catName, details]) => (
                  <button
                    key={catName}
                    onClick={() => {
                      setSelectedCategory(catName as any);
                      setSelectedSeat(null);
                    }}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[9px] font-mono font-bold uppercase border tracking-wider transition-all ${
                      selectedCategory === catName
                        ? 'bg-slate-950 border-lime-400 text-white shadow'
                        : 'bg-slate-950/40 border-slate-850 text-slate-500'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${details.color.split(' ')[0]}`} />
                    <span>{catName} (${details.price})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Seating Arena Grid */}
            <div className="flex flex-col items-center justify-center space-y-8 py-4">
              {/* Pitch Screen representation */}
              <div className="w-4/5 text-center py-2.5 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]">
                ⚽ ——— PLAYING PITCH FIELD SCREEN ——— ⚽
              </div>

              {/* Seating layout */}
              <div className="space-y-2.5">
                {['A', 'B', 'C', 'D'].map((row) => (
                  <div key={row} className="flex items-center space-x-3 text-xs">
                    <span className="font-mono font-black text-slate-500 w-4">{row}</span>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => {
                        const seatId = `${row}-${col}`;
                        const isSelected = selectedSeat === seatId;
                        const colColor = categoryPricing[selectedCategory].color;

                        return (
                          <button
                            key={col}
                            onClick={() => handleSeatClick(row, col)}
                            className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg border flex items-center justify-center font-mono text-[9px] font-bold tracking-tighter transition-all hover:scale-105 active:scale-95 ${
                              isSelected
                                ? 'bg-white text-slate-950 border-white ring-4 ring-lime-400/30'
                                : `${colColor} text-slate-950 hover:bg-white hover:text-slate-950`
                            }`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid instructions */}
              <p className="text-[10px] text-slate-500 font-mono text-center max-w-sm">
                Each seat corresponds to a unique coordinate in the {activeStadium?.name} sector mapping. Pricing is determined automatically by Tier levels.
              </p>
            </div>

          </div>

        </div>

        {/* Right Side: Price Board / Issued Pass (4 Columns) */}
        <div className="lg:col-span-4">
          {issuedTicket ? (
            /* Digital Boarding Pass Ticket */
            <div className="rounded-3xl border border-yellow-500/30 bg-slate-900/80 p-6 backdrop-blur shadow-2xl space-y-6 relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-400" />
              
              <div className="text-center pb-3 border-b border-slate-800">
                <div className="inline-flex items-center space-x-1 rounded-full bg-yellow-400/10 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-yellow-400">
                  <Sparkles className="h-3 w-3" />
                  <span>Pass Generated</span>
                </div>
                <h4 className="font-sans text-sm font-black text-white uppercase mt-2">Championship Access Pass</h4>
                <p className="font-mono text-[9px] text-slate-500 tracking-wider">SECURE DIGITAL IDENTIFICATION</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Holder */}
                <div className="flex justify-between font-mono pb-2 border-b border-slate-850">
                  <span className="text-slate-500">HOLDER:</span>
                  <span className="font-bold text-slate-200">{currentUser?.name}</span>
                </div>

                {/* Match */}
                <div className="flex justify-between font-mono pb-2 border-b border-slate-850">
                  <span className="text-slate-500">FIXTURE:</span>
                  <span className="font-bold text-slate-200 text-right">
                    {getTeamName(activeMatch.homeTeamId)} <br /> vs {getTeamName(activeMatch.awayTeamId)}
                  </span>
                </div>

                {/* Seat coordinate */}
                <div className="flex justify-between font-mono pb-2 border-b border-slate-850">
                  <span className="text-slate-500">SEAT SECTOR:</span>
                  <span className="font-black text-lime-400 uppercase tracking-widest">{issuedTicket.seatNumber}</span>
                </div>

                {/* Price paid */}
                <div className="flex justify-between font-mono pb-2 border-b border-slate-850">
                  <span className="text-slate-500">PAID TOTAL:</span>
                  <span className="font-bold text-white">${issuedTicket.price} USD</span>
                </div>

                {/* Barcode representation */}
                <div className="flex flex-col items-center justify-center pt-4 space-y-2">
                  <div className="bg-white p-3 rounded-xl border-2 border-slate-800 shadow">
                    {/* Visual QR Simulator */}
                    <div className="h-28 w-28 bg-slate-950 rounded flex flex-col items-center justify-center p-1 border-4 border-slate-900 font-mono text-[6px] text-lime-400 text-center select-none tracking-tighter">
                      <div className="grid grid-cols-4 gap-1 h-20 w-20 bg-slate-900 border border-slate-800 p-1">
                        <div className="bg-lime-400" /><div className="bg-slate-950" /><div className="bg-lime-400" /><div className="bg-lime-400" />
                        <div className="bg-slate-950" /><div className="bg-lime-400" /><div className="bg-slate-950" /><div className="bg-slate-950" />
                        <div className="bg-lime-400" /><div className="bg-slate-950" /><div className="bg-lime-400" /><div className="bg-lime-400" />
                        <div className="bg-lime-400" /><div className="bg-lime-400" /><div className="bg-slate-950" /><div className="bg-lime-400" />
                      </div>
                      <span className="mt-1 leading-none">SCAN GATE ACCESS</span>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">{issuedTicket.qrCode}</span>
                </div>

                {/* Print button */}
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl border border-slate-850 bg-slate-950/80 p-2.5 hover:bg-slate-950 font-mono text-[10px] uppercase font-bold text-slate-300 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Boarding Pass</span>
                </button>

                <button
                  onClick={() => {
                    setIssuedTicket(null);
                    setSelectedSeat(null);
                  }}
                  className="w-full text-center text-xs font-semibold text-lime-400 hover:underline pt-2 block"
                >
                  Book another ticket
                </button>
              </div>

            </div>
          ) : (
            /* Summary Price Board */
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur shadow-2xl space-y-6">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3">
                3. Access Pass Price Summary
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">CHAMPIONSHIP MATCH:</span>
                  <span className="font-bold text-slate-300">
                    {getTeamCode(activeMatch?.homeTeamId)} vs {getTeamCode(activeMatch?.awayTeamId)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">ARENA VENUE:</span>
                  <span className="font-bold text-slate-300 truncate max-w-[150px]">{activeStadium?.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">TIER CLASS:</span>
                  <span className="font-bold text-white uppercase">{selectedCategory}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">GRID SEAT:</span>
                  {selectedSeat ? (
                    <span className="font-black text-lime-400 font-sans">{selectedSeat}</span>
                  ) : (
                    <span className="text-red-400 italic">None Selected</span>
                  )}
                </div>

                <div className="h-px bg-slate-850" />

                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-400 font-sans uppercase">Total Price Paid:</span>
                  <span className="text-white">${selectedSeat ? categoryPricing[selectedCategory].price : 0} USD</span>
                </div>
              </div>

              {/* Secure transaction checkout */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-850 space-y-3">
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-lime-400" />
                  <span>Secure Sandbox checkout</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  You are checking out in our simulation environment. Submitting this booking sends an active API request to your Express server to log financial statistics and ticket logs.
                </p>
              </div>

              {/* Submit button */}
              <button
                disabled={!selectedSeat || isBooking}
                onClick={handleBook}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-emerald-500/10"
              >
                {isBooking ? (
                  <span>Processing Reservation...</span>
                ) : (
                  <>
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    <span>Purchase Simulation Access Pass</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
