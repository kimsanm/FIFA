import React, { useState } from 'react';
import { Settings, BarChart3, Edit3, Trash2, Sliders, Volume2, Calendar, RefreshCw, BadgePercent } from 'lucide-react';
import { Match, Team, AnalyticsSummary, TournamentConfig } from '../types.js';

interface AdminViewProps {
  matches: Match[];
  teams: Team[];
  analytics: AnalyticsSummary;
  config: TournamentConfig;
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number, status: 'scheduled' | 'live' | 'finished') => Promise<any>;
  onResetMatches: () => Promise<any>;
  onSaveConfig: (configData: Partial<TournamentConfig>) => Promise<any>;
}

export default function AdminView({
  matches,
  teams,
  analytics,
  config,
  onUpdateScore,
  onResetMatches,
  onSaveConfig
}: AdminViewProps) {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [homeInput, setHomeInput] = useState<number>(0);
  const [awayInput, setAwayInput] = useState<number>(0);
  const [statusInput, setStatusInput] = useState<'scheduled' | 'live' | 'finished'>('scheduled');

  const [announcementInput, setAnnouncementInput] = useState(config.announcement);
  const [countdownInput, setCountdownInput] = useState(config.countdownDate);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const getTeamCode = (id: string) => teams.find(t => t.id === id)?.code || 'UNK';
  const getTeamFlag = (id: string) => teams.find(t => t.id === id)?.flag || '🏳️';

  const handleStartEdit = (match: Match) => {
    setEditingMatchId(match.id);
    setHomeInput(match.homeScore);
    setAwayInput(match.awayScore);
    setStatusInput(match.status);
  };

  const handleSaveScore = async (matchId: string) => {
    await onUpdateScore(matchId, homeInput, awayInput, statusInput);
    setEditingMatchId(null);
  };

  const handleSaveGlobalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await onSaveConfig({
        announcement: announcementInput,
        countdownDate: countdownInput
      });
      alert('Global configuration synchronized successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleResetMatchesState = async () => {
    if (!window.confirm('Are you sure you want to reset all match records back to the default group stage simulation? This will recalculate all group standings.')) return;
    setIsResetting(true);
    try {
      await onResetMatches();
      alert('Tournament match records reset successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6" id="admin-section">
      
      {/* Page Title */}
      <div>
        <h2 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
          Tournament Control Room & Console
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform score overrides, manage stadium configurations, broadcast scroll announcements, and audit financial sales.
        </p>
      </div>

      {/* Top Level visual analytics row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Rev */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4.5 backdrop-blur">
          <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Total Simulated Revenue
          </span>
          <span className="block font-sans text-xl font-black text-lime-400 mt-1">
            ${analytics.revenue.toLocaleString()} USD
          </span>
          <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-800 mt-3">
            <div className="bg-lime-400 w-3/4" />
          </div>
        </div>

        {/* Sales */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4.5 backdrop-blur">
          <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Simulated Registrations
          </span>
          <span className="block font-sans text-xl font-black text-white mt-1">
            {analytics.userRegistrations.toLocaleString()} Users
          </span>
          <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-800 mt-3">
            <div className="bg-emerald-500 w-1/2" />
          </div>
        </div>

        {/* Attendance */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4.5 backdrop-blur">
          <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Highest Game Attendance
          </span>
          <span className="block font-sans text-xl font-black text-white mt-1">
            87,523 Fans
          </span>
          <p className="font-mono text-[8px] text-slate-500 mt-2">ESTADIO AZTECA • ARG VS KHM</p>
        </div>

        {/* Global state reset card */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4.5 flex flex-col justify-between">
          <div>
            <span className="block font-mono text-[9px] font-bold text-red-400 uppercase tracking-widest">
              Emergency Restore
            </span>
            <span className="block font-sans text-xs font-semibold text-slate-300 mt-1">
              Reset match records back to baseline.
            </span>
          </div>
          <button
            onClick={handleResetMatchesState}
            disabled={isResetting}
            className="flex items-center justify-center space-x-1 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/20 mt-3"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Database</span>
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Score Override table (8 Columns) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-5 md:p-6 backdrop-blur shadow-xl space-y-5">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
            <Edit3 className="h-4.5 w-4.5 text-lime-400" />
            <span>Championship Score Override Panel</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-900/50 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest pb-2">
                  <th className="pb-2">Fixture</th>
                  <th className="pb-2 text-center">Score Control</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/30 font-sans text-slate-300">
                {matches.map((match) => {
                  const isEditing = editingMatchId === match.id;
                  const homeFlag = getTeamFlag(match.homeTeamId);
                  const awayFlag = getTeamFlag(match.awayTeamId);
                  const homeCode = getTeamCode(match.homeTeamId);
                  const awayCode = getTeamCode(match.awayTeamId);

                  return (
                    <tr key={match.id} className="hover:bg-slate-800/10">
                      {/* Match names */}
                      <td className="py-3 font-semibold">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{homeFlag}</span>
                          <span className="font-bold text-slate-200">{homeCode}</span>
                          <span className="text-slate-500 text-[10px]">vs</span>
                          <span className="text-lg">{awayFlag}</span>
                          <span className="font-bold text-slate-200">{awayCode}</span>
                          <span className="text-[9px] font-mono rounded bg-slate-950 px-1 py-0.5 border border-slate-900 ml-1 font-bold text-slate-500 uppercase">
                            {match.round.split(' ')[0]}
                          </span>
                        </div>
                      </td>

                      {/* Score values */}
                      <td className="py-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center space-x-1.5">
                            <input
                              type="number"
                              min="0"
                              value={homeInput}
                              onChange={(e) => setHomeInput(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-10 rounded border border-slate-800 bg-slate-950 px-1 py-0.5 text-center font-mono font-bold text-white focus:outline-none focus:border-lime-400"
                            />
                            <span className="text-slate-500">:</span>
                            <input
                              type="number"
                              min="0"
                              value={awayInput}
                              onChange={(e) => setAwayInput(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-10 rounded border border-slate-800 bg-slate-950 px-1 py-0.5 text-center font-mono font-bold text-white focus:outline-none focus:border-lime-400"
                            />
                          </div>
                        ) : (
                          <span className="font-mono font-black text-slate-200 text-sm">
                            {match.homeScore} : {match.awayScore}
                          </span>
                        )}
                      </td>

                      {/* Match statuses */}
                      <td className="py-3 text-center font-mono">
                        {isEditing ? (
                          <select
                            value={statusInput}
                            onChange={(e) => setStatusInput(e.target.value as any)}
                            className="rounded border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-[10px] font-bold text-slate-300 focus:outline-none focus:border-lime-400"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="live">🔴 Live</option>
                            <option value="finished">Finished</option>
                          </select>
                        ) : (
                          <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase rounded ${
                            match.status === 'live'
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                              : match.status === 'finished'
                              ? 'bg-slate-950 text-slate-500 border border-slate-900'
                              : 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
                          }`}>
                            {match.status}
                          </span>
                        )}
                      </td>

                      {/* Action trigger */}
                      <td className="py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleSaveScore(match.id)}
                              className="rounded-lg bg-lime-400 px-2 py-1 text-[9px] font-black uppercase text-slate-950 shadow hover:opacity-90"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingMatchId(null)}
                              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[9px] font-bold uppercase text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(match)}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[9px] font-black uppercase text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                          >
                            Edit
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right announcement / global config panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Announcement broad caster Form */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur shadow-xl">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3 mb-4">
              <Volume2 className="h-4.5 w-4.5 text-lime-400" />
              <span>Championship Broadcast Notice</span>
            </h3>

            <form onSubmit={handleSaveGlobalConfig} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Ticker Announcement Notice
                </label>
                <textarea
                  value={announcementInput}
                  onChange={(e) => setAnnouncementInput(e.target.value)}
                  placeholder="Type an announcement to scroll across the home hero ticker..."
                  className="w-full h-24 rounded-xl border border-slate-850 bg-slate-950 px-3 py-2 text-slate-200 focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Countdown Date (ISO Format)
                </label>
                <input
                  type="text"
                  value={countdownInput}
                  onChange={(e) => setCountdownInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-850 bg-slate-950 px-3 py-2 font-mono text-slate-200 focus:border-lime-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingConfig}
                className="w-full rounded-xl bg-lime-400 py-3 font-bold uppercase tracking-wider text-slate-950 hover:opacity-90 active:scale-95 transition-all text-xs"
              >
                {isSavingConfig ? 'Saving Broadcast...' : 'Update Global Board'}
              </button>
            </form>
          </div>

          {/* Ticket categories ratio simulation */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur shadow-xl space-y-4">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
              <BarChart3 className="h-4.5 w-4.5 text-lime-400" />
              <span>Category Ticket Demand</span>
            </h3>

            <div className="space-y-3 font-mono text-[10px]">
              {analytics.ticketSales.map((sale, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-slate-400">
                    <span>{sale.name}</span>
                    <span>{sale.count} sold</span>
                  </div>
                  <div className="flex h-1.5 rounded-full bg-slate-950 border border-slate-900 mt-1">
                    <div
                      style={{ width: `${Math.min(100, (sale.count / 20) * 100)}%` }}
                      className="bg-lime-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
