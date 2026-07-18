import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, RefreshCw, HelpCircle } from 'lucide-react';

interface MatchPredictionProps {
  matchId: string;
  homeCode: string;
  awayCode: string;
}

export default function MatchPrediction({ matchId, homeCode, awayCode }: MatchPredictionProps) {
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/matches/${matchId}/prediction`);
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setPrediction(data.forecast);
    } catch (err) {
      console.error('[CLIENT] Failed to fetch prediction:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && !prediction && !loading) {
      fetchPrediction();
    }
  }, [expanded]);

  return (
    <div className="mt-3" id={`match-prediction-container-${matchId}`}>
      {/* Interactive Badge Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className={`inline-flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
          expanded
            ? 'bg-lime-400 text-slate-950 shadow-[0_0_12px_rgba(163,230,53,0.25)] border border-lime-400'
            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-lime-400 hover:text-lime-400'
        }`}
        id={`predict-badge-btn-${matchId}`}
      >
        <Sparkles className={`h-3 w-3 ${expanded ? 'animate-pulse' : ''}`} />
        <span>AI Prediction</span>
      </button>

      {/* Expanded Forecast Area */}
      {expanded && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="mt-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm relative overflow-hidden animate-fade-in"
          id={`prediction-panel-${matchId}`}
        >
          {/* Subtle tech background highlight */}
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-lime-400/5 blur-xl pointer-events-none" />

          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 font-mono text-[9px] uppercase font-bold tracking-widest text-slate-400">
              <BrainCircuit className="h-3.5 w-3.5 text-lime-400" />
              <span>AI Copilot Forecast ({homeCode} vs {awayCode})</span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchPrediction();
              }}
              disabled={loading}
              className="text-slate-500 hover:text-white transition-colors disabled:opacity-40"
              title="Recalculate AI Standing & Rating Forecast"
              id={`prediction-refresh-${matchId}`}
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Output content area */}
          {loading ? (
            <div className="py-2.5 space-y-2">
              <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-ping" />
                <span>Scanning Standings & Team Ratings...</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-md w-full animate-pulse" />
            </div>
          ) : error ? (
            <div className="py-2 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-red-400 font-medium">
                <span>⚽</span>
                <span>Could not synthesize prediction.</span>
              </span>
              <button
                onClick={fetchPrediction}
                className="text-[10px] font-bold text-lime-400 hover:underline uppercase"
              >
                Retry
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium" id={`prediction-text-${matchId}`}>
              "{prediction}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
