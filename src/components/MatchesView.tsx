import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Award, Star, Activity, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Match, Team, Player } from '../types.js';
import VideoHighlights from './VideoHighlights.js';

interface MatchesViewProps {
  matches: Match[];
  teams: Team[];
  players: Player[];
  favoriteMatches: string[];
  onToggleFavoriteMatch: (matchId: string) => void;
  onNavigateToTicketing: (matchId: string) => void;
}

export default function MatchesView({
  matches,
  teams,
  players,
  favoriteMatches,
  onToggleFavoriteMatch,
  onNavigateToTicketing
}: MatchesViewProps) {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown';
  const getTeamCode = (id: string) => teams.find(t => t.id === id)?.code || 'UNK';
  const getTeamFlag = (id: string) => teams.find(t => t.id === id)?.flag || '🏳️';

  const filteredMatches = matches.filter(m => {
    if (filter === 'live') return m.status === 'live';
    if (filter === 'upcoming') return m.status === 'scheduled';
    if (filter === 'finished') return m.status === 'finished';
    return true;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'card_yellow': return '🟨';
      case 'card_red': return '🟥';
      case 'substitute': return '🔄';
      case 'var': return '🖥️ VAR';
      default: return '📢';
    }
  };

  const currentMatch = selectedMatch ? matches.find(m => m.id === selectedMatch.id) || selectedMatch : null;

  return (
    <div className="space-y-6" id="matches-section">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
            Championship Fixtures & Live Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time score updates, card timelines, VAR reviews, and visual team statistics.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-900/60 p-1.5 border border-slate-800">
          {(['all', 'live', 'upcoming', 'finished'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                filter === type
                  ? 'bg-lime-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {type === 'live' ? '🔴 Live Now' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Match Cards List (Left 7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
              <Activity className="h-10 w-10 text-slate-600 mx-auto stroke-[1.5] mb-3 animate-pulse" />
              <p className="font-sans text-sm font-bold text-slate-400 uppercase">No Matches Found</p>
              <p className="text-xs text-slate-500 mt-1">There are no matches currently matching the filter selection.</p>
            </div>
          ) : (
            filteredMatches.map((match) => {
              const homeFlag = getTeamFlag(match.homeTeamId);
              const awayFlag = getTeamFlag(match.awayTeamId);
              const homeCode = getTeamCode(match.homeTeamId);
              const awayCode = getTeamCode(match.awayTeamId);
              const homeName = getTeamName(match.homeTeamId);
              const awayName = getTeamName(match.awayTeamId);
              const isFav = favoriteMatches.includes(match.id);

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                    currentMatch?.id === match.id
                      ? 'border-lime-400 bg-slate-900/80 shadow-[0_0_20px_rgba(163,230,53,0.05)]'
                      : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Status Banner Stripe */}
                  {match.status === 'live' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                  )}

                  <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Date and Stage Info */}
                    <div className="flex md:flex-col justify-between w-full md:w-auto items-center md:items-start text-xs border-b md:border-b-0 border-slate-800/50 pb-3 md:pb-0">
                      <span className="font-mono text-[10px] font-bold text-lime-400 uppercase tracking-widest leading-none">
                        {match.round}
                      </span>
                      <span className="text-slate-400 font-medium md:mt-2 block font-mono">
                        {match.date}
                      </span>
                      <div className="flex items-center space-x-1.5 md:mt-2 font-mono text-[10px] text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{match.time} UTC</span>
                      </div>
                    </div>

                    {/* Scores & Team Flags */}
                    <div className="flex items-center justify-center space-x-6 md:space-x-8 flex-1 py-2">
                      {/* Home Team */}
                      <div className="flex items-center space-x-3 text-right w-24 sm:w-32 justify-end">
                        <span className="font-sans text-sm sm:text-base font-black text-white truncate hidden sm:block">
                          {homeName}
                        </span>
                        <span className="font-sans text-sm sm:text-base font-bold text-white sm:hidden">
                          {homeCode}
                        </span>
                        <span className="text-3xl filter drop-shadow">{homeFlag}</span>
                      </div>

                      {/* Score Board Box */}
                      <div className="flex flex-col items-center justify-center rounded-xl bg-slate-950 border border-slate-800 px-4 py-2 min-w-[70px]">
                        {match.status === 'scheduled' ? (
                          <span className="font-sans text-xs font-bold text-slate-400 tracking-wider">VS</span>
                        ) : (
                          <span className="font-sans text-lg sm:text-xl font-black tracking-tight text-white">
                            {match.homeScore} : {match.awayScore}
                          </span>
                        )}

                        {match.status === 'live' ? (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-red-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-red-500 tracking-wider mt-1 animate-pulse">
                            <span className="h-1 w-1 rounded-full bg-red-500" />
                            <span>Live</span>
                          </span>
                        ) : match.status === 'finished' ? (
                          <span className="font-mono text-[8px] font-bold uppercase text-slate-500 tracking-wider mt-1">
                            FT
                          </span>
                        ) : (
                          <span className="font-mono text-[8px] font-bold uppercase text-lime-400 tracking-wider mt-1">
                            Scheduled
                          </span>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center space-x-3 text-left w-24 sm:w-32">
                        <span className="text-3xl filter drop-shadow">{awayFlag}</span>
                        <span className="font-sans text-sm sm:text-base font-black text-white truncate hidden sm:block">
                          {awayName}
                        </span>
                        <span className="font-sans text-sm sm:text-base font-bold text-white sm:hidden">
                          {awayCode}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteMatch(match.id);
                        }}
                        className={`rounded-xl border p-2.5 transition-all ${
                          isFav
                            ? 'border-yellow-400/30 bg-yellow-400/5 text-yellow-400'
                            : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-white hover:bg-slate-800'
                        }`}
                        title="Favorite Match"
                      >
                        <Star className={`h-4 w-4 ${isFav ? 'fill-yellow-400' : ''}`} />
                      </button>

                      {match.status === 'scheduled' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToTicketing(match.id);
                          }}
                          className="flex items-center space-x-1 rounded-xl bg-lime-400 px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-950 hover:opacity-90 transition-opacity"
                        >
                          <span>Tickets</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Match Live Center/Details (Right 5 Columns) */}
        <div className="lg:col-span-5">
          {currentMatch ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur shadow-2xl space-y-6">
              
              {/* Match Header Panel */}
              <div className="text-center pb-4 border-b border-slate-800">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-lime-400">
                  WFC Arena Live Center
                </span>
                
                <div className="flex items-center justify-center space-x-4 mt-3">
                  <span className="text-3xl filter drop-shadow">{getTeamFlag(currentMatch.homeTeamId)}</span>
                  <span className="font-sans text-lg font-black text-white">{getTeamCode(currentMatch.homeTeamId)}</span>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-sans text-base font-black text-white">
                    {currentMatch.status === 'scheduled' ? 'VS' : `${currentMatch.homeScore} - ${currentMatch.awayScore}`}
                  </div>
                  <span className="font-sans text-lg font-black text-white">{getTeamCode(currentMatch.awayTeamId)}</span>
                  <span className="text-3xl filter drop-shadow">{getTeamFlag(currentMatch.awayTeamId)}</span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 mt-3 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-slate-600" />
                  <span>East Rutherford Arena (MetLife)</span>
                </div>
              </div>

              {/* Highlight clips (Only for finished matches) */}
              {currentMatch.status === 'finished' && (
                <VideoHighlights matchId={currentMatch.id} />
              )}

              {/* Live Statistics (Comparing stats side-by-side) */}
              {currentMatch.status !== 'scheduled' && (
                <div className="space-y-4">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-lime-400" />
                    <span>Match Statistics Comparison</span>
                  </h3>

                  <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-850">
                    {/* Possession */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-bold text-slate-300 pb-1.5">
                        <span>{currentMatch.stats.possession.home}%</span>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px]">Possession</span>
                        <span>{currentMatch.stats.possession.away}%</span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-slate-800">
                        <div style={{ width: `${currentMatch.stats.possession.home}%` }} className="bg-lime-400 transition-all duration-500" />
                        <div style={{ width: `${currentMatch.stats.possession.away}%` }} className="bg-emerald-600 transition-all duration-500" />
                      </div>
                    </div>

                    {/* Shots */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-bold text-slate-300 pb-1.5">
                        <span>{currentMatch.stats.shots.home}</span>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px]">Total Shots</span>
                        <span>{currentMatch.stats.shots.away}</span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-slate-800">
                        <div style={{ width: `${(currentMatch.stats.shots.home / (currentMatch.stats.shots.home + currentMatch.stats.shots.away || 1)) * 100}%` }} className="bg-lime-400" />
                        <div style={{ width: `${(currentMatch.stats.shots.away / (currentMatch.stats.shots.home + currentMatch.stats.shots.away || 1)) * 100}%` }} className="bg-emerald-600" />
                      </div>
                    </div>

                    {/* Corners */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-bold text-slate-300 pb-1.5">
                        <span>{currentMatch.stats.corners.home}</span>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px]">Corners</span>
                        <span>{currentMatch.stats.corners.away}</span>
                      </div>
                      <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div style={{ width: `${(currentMatch.stats.corners.home / (currentMatch.stats.corners.home + currentMatch.stats.corners.away || 1)) * 100}%` }} className="bg-lime-400" />
                        <div style={{ width: `${(currentMatch.stats.corners.away / (currentMatch.stats.corners.home + currentMatch.stats.corners.away || 1)) * 100}%` }} className="bg-emerald-600" />
                      </div>
                    </div>

                    {/* Fouls */}
                    <div>
                      <div className="flex justify-between text-xs font-mono font-bold text-slate-300 pb-1.5">
                        <span>{currentMatch.stats.fouls.home}</span>
                        <span className="text-slate-500 uppercase tracking-widest text-[9px]">Fouls</span>
                        <span>{currentMatch.stats.fouls.away}</span>
                      </div>
                      <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div style={{ width: `${(currentMatch.stats.fouls.home / (currentMatch.stats.fouls.home + currentMatch.stats.fouls.away || 1)) * 100}%` }} className="bg-lime-400" />
                        <div style={{ width: `${(currentMatch.stats.fouls.away / (currentMatch.stats.fouls.home + currentMatch.stats.fouls.away || 1)) * 100}%` }} className="bg-emerald-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Match Event Timeline */}
              <div className="space-y-4">
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-lime-400" />
                  <span>Match Report Events Timeline</span>
                </h3>

                <div className="space-y-3 border-l border-slate-800 pl-4 py-1">
                  {currentMatch.events.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No event markers recorded for this match yet.</p>
                  ) : (
                    currentMatch.events.map((event) => (
                      <div key={event.id} className="relative flex items-start space-x-3 text-xs">
                        {/* Event bullet */}
                        <div className="absolute -left-[22px] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 border border-slate-700 font-mono text-[9px] text-white">
                          •
                        </div>

                        <span className="font-mono font-bold text-lime-400 leading-none pt-0.5">
                          {event.minute}'
                        </span>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-200">
                              {getEventIcon(event.type)} {event.playerName}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">
                              ({getTeamCode(event.teamId)})
                            </span>
                          </div>
                          {event.detail && (
                            <p className="text-slate-400 mt-1 text-[11px] leading-relaxed italic">{event.detail}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Lineup Simulation Showcase */}
              <div className="space-y-4">
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <Award className="h-4 w-4 text-lime-400" />
                  <span>Tactical Lineup Simulation</span>
                </h3>

                <div className="rounded-2xl border border-slate-800/80 bg-slate-950 p-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 border-b border-slate-900 pb-2 mb-2 uppercase font-mono">
                    <span>{getTeamCode(currentMatch.homeTeamId)} Starters</span>
                    <span>{getTeamCode(currentMatch.awayTeamId)} Starters</span>
                  </div>
                  
                  <div className="space-y-1.5 text-[11px] font-sans text-slate-300">
                    <div className="flex justify-between">
                      <span>GK: M. Turner (1)</span>
                      <span>GK: M. Maignan (16)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DF: C. Richards (3)</span>
                      <span>DF: W. Saliba (4)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MF: W. McKennie (8)</span>
                      <span>MF: A. Rabiot (14)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FW: C. Pulisic (10)</span>
                      <span>FW: K. Mbappé (10)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full rounded-3xl border border-dashed border-slate-800 p-8 text-center flex flex-col items-center justify-center py-20 bg-slate-900/10">
              <Sparkles className="h-8 w-8 text-slate-600 mb-3 animate-pulse" />
              <p className="font-sans text-sm font-bold text-slate-400 uppercase">Select Match To View Details</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Click any match card in the directory to explore comparative live statistics, cards timelines, lineups, and live event reports.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
