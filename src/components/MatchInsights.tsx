import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Match, Team } from '../types.js';
import { Sparkles, TrendingUp } from 'lucide-react';

interface MatchInsightsProps {
  match: Match;
  teams: Team[];
}

export default function MatchInsights({ match, teams }: MatchInsightsProps) {
  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown';
  const getTeamCode = (id: string) => teams.find(t => t.id === id)?.code || 'UNK';
  const getTeamFlag = (id: string) => teams.find(t => t.id === id)?.flag || '⚽';

  const homeCode = getTeamCode(match.homeTeamId);
  const awayCode = getTeamCode(match.awayTeamId);
  const homeFlag = getTeamFlag(match.homeTeamId);
  const awayFlag = getTeamFlag(match.awayTeamId);

  // Prepare custom statistics data for completed matches
  const statsData = [
    {
      metric: 'Possession (%)',
      [homeCode]: match.stats.possession.home,
      [awayCode]: match.stats.possession.away,
      homeRaw: match.stats.possession.home,
      awayRaw: match.stats.possession.away,
      suffix: '%',
    },
    {
      metric: 'Shots on Target',
      [homeCode]: match.stats.shotsOnTarget.home,
      [awayCode]: match.stats.shotsOnTarget.away,
      homeRaw: match.stats.shotsOnTarget.home,
      awayRaw: match.stats.shotsOnTarget.away,
      suffix: '',
    },
    {
      metric: 'Pass Completion (%)',
      [homeCode]: match.stats.passCompletion?.home || (match.id === 'm1' ? 83 : 90),
      [awayCode]: match.stats.passCompletion?.away || (match.id === 'm1' ? 85 : 68),
      homeRaw: match.stats.passCompletion?.home || (match.id === 'm1' ? 83 : 90),
      awayRaw: match.stats.passCompletion?.away || (match.id === 'm1' ? 85 : 68),
      suffix: '%',
    }
  ];

  // Custom tooltips to fit perfectly in slate design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md">
          <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {label}
          </p>
          <div className="space-y-1.5">
            {payload.map((entry: any, i: number) => (
              <div key={i} className="flex items-center justify-between space-x-6 text-xs">
                <span className="font-bold flex items-center space-x-1" style={{ color: entry.color }}>
                  <span>{entry.name === homeCode ? homeFlag : awayFlag}</span>
                  <span>{entry.name}</span>
                </span>
                <span className="font-mono font-black text-white">
                  {entry.value}{entry.payload.suffix}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-800/60 bg-slate-950/20 rounded-2xl p-4 space-y-4" id={`match-insights-${match.id}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-sans text-xs font-black uppercase text-white tracking-wider flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-lime-400" />
          <span>Match Analytics Insights</span>
        </h4>
        <span className="font-mono text-[9px] text-lime-400 bg-lime-400/10 border border-lime-400/20 px-2 py-0.5 rounded-full uppercase font-bold tracking-widest flex items-center space-x-1">
          <Sparkles className="h-3 w-3 animate-pulse" />
          <span>RECHARTS VISUALIZER</span>
        </span>
      </div>

      <div className="w-full h-44 -ml-4" id={`chart-container-${match.id}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statsData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="metric" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              fontFamily="sans-serif"
              fontWeight={600}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
              width={25}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <Legend 
              verticalAlign="top" 
              height={32}
              iconSize={8}
              iconType="circle"
              formatter={(value) => (
                <span className="text-[11px] font-bold text-slate-300 font-sans tracking-wide">
                  {value === homeCode ? `${homeFlag} ${getTeamName(match.homeTeamId)} (${homeCode})` : `${awayFlag} ${getTeamName(match.awayTeamId)} (${awayCode})`}
                </span>
              )}
            />
            <Bar 
              dataKey={homeCode} 
              fill="#a3e635" 
              radius={[4, 4, 0, 0]} 
              name={homeCode}
            />
            <Bar 
              dataKey={awayCode} 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              name={awayCode}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Highlight commentary box */}
      <div className="grid grid-cols-2 gap-3 text-center pt-1 border-t border-slate-900">
        <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-850">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Attack Dominance</p>
          <p className="text-[11px] text-slate-300 font-sans mt-0.5 leading-snug">
            {match.stats.shotsOnTarget.home > match.stats.shotsOnTarget.away ? (
              <>🏡 <span className="text-lime-400 font-bold">{homeCode}</span> had higher shot conversion threat.</>
            ) : match.stats.shotsOnTarget.away > match.stats.shotsOnTarget.home ? (
              <>✈️ <span className="text-emerald-400 font-bold">{awayCode}</span> generated superior precision opportunities.</>
            ) : (
              <>⚖️ Teams registered equal offensive accuracy on goal.</>
            )}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-850">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Possession Efficiency</p>
          <p className="text-[11px] text-slate-300 font-sans mt-0.5 leading-snug">
            {match.stats.possession.home > 55 ? (
              <>🔥 <span className="text-lime-400 font-bold">{homeCode}</span> systematically controlled midfield play.</>
            ) : match.stats.possession.away > 55 ? (
              <>🔥 <span className="text-emerald-400 font-bold">{awayCode}</span> successfully dictated tempo away.</>
            ) : (
              <>⏱️ Excellent end-to-end transition transitions from both sides.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
