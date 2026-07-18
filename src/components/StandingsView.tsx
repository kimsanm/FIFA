import React, { useState } from 'react';
import { Landmark, Award, ChevronRight, Share2, Info, Star } from 'lucide-react';
import { Team, Match } from '../types.js';

interface StandingsViewProps {
  teams: Team[];
  matches: Match[];
}

export default function StandingsView({ teams, matches }: StandingsViewProps) {
  const [stageTab, setStageTab] = useState<'groups' | 'knockouts'>('groups');

  // Group teams by their designated group name
  const groups: Record<string, Team[]> = {};
  teams.forEach(team => {
    if (!groups[team.group]) {
      groups[team.group] = [];
    }
    groups[team.group].push(team);
  });

  // Sort teams in each group by points, goal difference, goals for
  Object.keys(groups).forEach(gName => {
    groups[gName].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const aGD = a.goalsFor - a.goalsAgainst;
      const bGD = b.goalsFor - b.goalsAgainst;
      if (bGD !== aGD) return bGD - aGD;
      return b.goalsFor - a.goalsFor;
    });
  });

  return (
    <div className="space-y-6" id="standings-section">
      
      {/* Tab Switcher Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
            Standings & Knockout Brackets
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time standings calculating wins, losses, points, and playoff advancing statuses.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-xl bg-slate-900/60 p-1 border border-slate-800">
          <button
            onClick={() => setStageTab('groups')}
            className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              stageTab === 'groups'
                ? 'bg-lime-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Group Standings
          </button>
          <button
            onClick={() => setStageTab('knockouts')}
            className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              stageTab === 'knockouts'
                ? 'bg-lime-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Knockout Stage Bracket
          </button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {stageTab === 'groups' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(groups).sort().map((groupName) => (
            <div
              key={groupName}
              className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur shadow-xl hover:border-slate-700/80 transition-all"
            >
              {/* Group Title */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center space-x-2">
                  <Landmark className="h-4.5 w-4.5 text-lime-400" />
                  <h3 className="font-sans text-sm font-black text-white uppercase tracking-wide">
                    {groupName}
                  </h3>
                </div>
                <span className="font-mono text-[9px] font-bold text-slate-500 uppercase">
                  Top 2 Advance
                </span>
              </div>

              {/* Table Standings */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900/50 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                      <th className="pb-2 w-8">Pos</th>
                      <th className="pb-2">Team</th>
                      <th className="pb-2 text-center w-8">PL</th>
                      <th className="pb-2 text-center w-8">W</th>
                      <th className="pb-2 text-center w-8">D</th>
                      <th className="pb-2 text-center w-8">L</th>
                      <th className="pb-2 text-center w-10">GD</th>
                      <th className="pb-2 text-right w-10 font-black text-lime-400">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/30 text-xs font-sans text-slate-300">
                    {groups[groupName].map((team, idx) => {
                      const isAdvancing = idx < 2;
                      const gd = team.goalsFor - team.goalsAgainst;
                      const gdString = gd > 0 ? `+${gd}` : gd;

                      return (
                        <tr
                          key={team.id}
                          className={`hover:bg-slate-800/20 transition-colors group ${
                            isAdvancing ? 'text-slate-100' : 'text-slate-400'
                          }`}
                        >
                          {/* Position */}
                          <td className="py-2.5 font-mono font-bold">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black ${
                                isAdvancing
                                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                  : 'bg-slate-950 border border-slate-850 text-slate-500'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>

                          {/* Team Name */}
                          <td className="py-2.5 font-sans font-semibold">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl filter drop-shadow">{team.flag}</span>
                              <span className="font-bold truncate group-hover:text-white transition-colors">
                                {team.name}
                              </span>
                              <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">
                                {team.code}
                              </span>
                            </div>
                          </td>

                          {/* Played */}
                          <td className="py-2.5 text-center font-mono font-bold text-slate-400">{team.played}</td>
                          {/* Wins */}
                          <td className="py-2.5 text-center font-mono font-bold text-slate-400">{team.wins}</td>
                          {/* Draws */}
                          <td className="py-2.5 text-center font-mono font-bold text-slate-400">{team.draws}</td>
                          {/* Losses */}
                          <td className="py-2.5 text-center font-mono font-bold text-slate-400">{team.losses}</td>
                          {/* GD */}
                          <td className={`py-2.5 text-center font-mono font-bold ${
                            gd > 0 ? 'text-emerald-400' : gd < 0 ? 'text-red-400' : 'text-slate-500'
                          }`}>
                            {gdString}
                          </td>
                          {/* Points */}
                          <td className="py-2.5 text-right font-mono font-black text-lime-400">{team.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Visual Brackets map */
        <div className="space-y-6">
          
          <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-5 md:p-8 backdrop-blur shadow-2xl">
            <div className="text-center pb-4 mb-6 border-b border-slate-800">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-400">
                Playoff Bracket Visualizer
              </span>
              <h3 className="font-sans text-lg font-black text-white mt-1 uppercase">
                Single Elimination Knockout Stage
              </h3>
            </div>

            {/* Brackets Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              
              {/* Round of 16 Slot */}
              <div className="space-y-4">
                <div className="text-center font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-800/60">
                  Round of 16
                </div>

                <div className="rounded-2xl border border-slate-850 bg-slate-950/50 p-3 space-y-2 relative">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">🇺🇸 USA</span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">TBD</span>
                  </div>
                  <div className="h-px bg-slate-900" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">🇯🇵 Japan</span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">TBD</span>
                  </div>
                  <div className="text-[9px] text-center font-mono text-lime-400 border-t border-slate-900/50 pt-1.5 mt-1.5 uppercase font-bold">
                    July 24 • MetLife Arena
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-850 bg-slate-950/50 p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">🇩🇪 Germany</span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">TBD</span>
                  </div>
                  <div className="h-px bg-slate-900" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">🇫🇷 France</span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">TBD</span>
                  </div>
                  <div className="text-[9px] text-center font-mono text-slate-500 border-t border-slate-900/50 pt-1.5 mt-1.5 uppercase font-bold">
                    July 24 • Estadio Azteca
                  </div>
                </div>
              </div>

              {/* Quarter-Finals Slot */}
              <div className="space-y-4">
                <div className="text-center font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-800/60">
                  Quarter-Finals
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2 relative">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Winner R16 Slot 1</span>
                    <span className="font-mono text-[10px] text-slate-600">—</span>
                  </div>
                  <div className="h-px bg-slate-900" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Winner R16 Slot 2</span>
                    <span className="font-mono text-[10px] text-slate-600">—</span>
                  </div>
                  <div className="text-[9px] text-center font-mono text-slate-600 border-t border-slate-900/50 pt-1.5 mt-1.5 uppercase font-bold">
                    July 28 • SoFi Stadium
                  </div>
                </div>
              </div>

              {/* Semi-Finals Slot */}
              <div className="space-y-4">
                <div className="text-center font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-800/60">
                  Semi-Finals
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Winner Quarter 1</span>
                    <span className="font-mono text-[10px] text-slate-600">—</span>
                  </div>
                  <div className="h-px bg-slate-900" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Winner Quarter 2</span>
                    <span className="font-mono text-[10px] text-slate-600">—</span>
                  </div>
                  <div className="text-[9px] text-center font-mono text-slate-600 border-t border-slate-900/50 pt-1.5 mt-1.5 uppercase font-bold">
                    Aug 02 • BC Place
                  </div>
                </div>
              </div>

              {/* Grand Final Slot */}
              <div className="space-y-4">
                <div className="text-center font-mono text-[10px] font-bold text-lime-400 uppercase tracking-widest pb-2 border-b border-lime-400/20">
                  🏆 Grand Final
                </div>

                <div className="rounded-2xl border-2 border-lime-400 bg-slate-950 p-5 space-y-3 shadow-[0_0_30px_rgba(163,230,53,0.1)] text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-lime-400 text-slate-950 font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded-bl">
                    Championship match
                  </div>
                  
                  <Award className="h-8 w-8 text-lime-400 mx-auto animate-bounce mt-2" />
                  
                  <div className="space-y-1 mt-2">
                    <p className="text-xs font-black text-white uppercase font-sans">Finalist 1</p>
                    <p className="text-[10px] text-slate-500 font-mono">vs</p>
                    <p className="text-xs font-black text-white uppercase font-sans">Finalist 2</p>
                  </div>

                  <div className="text-[9px] font-mono text-lime-400 font-bold border-t border-slate-900 pt-2.5 uppercase tracking-wider">
                    Aug 09 • MetLife Stadium
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
