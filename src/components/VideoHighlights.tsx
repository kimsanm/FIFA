import React, { useState, useEffect } from 'react';
import { Play, Clock, AlertCircle, Film, Sparkles } from 'lucide-react';
import { VideoHighlight } from '../types.js';
import VideoPlayerModal from './VideoPlayerModal.js';

interface VideoHighlightsProps {
  matchId?: string;       // Backward compatibility for single match recap
  matchIds?: string[];    // Batch support for displaying multiple match recaps
}

export default function VideoHighlights({ matchId, matchIds }: VideoHighlightsProps) {
  const [highlights, setHighlights] = useState<VideoHighlight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cinema Modal States (tracked per active playing highlight)
  const [activeHighlight, setActiveHighlight] = useState<VideoHighlight | null>(null);

  // Parse the IDs we need to fetch
  const idsToFetch = matchIds && matchIds.length > 0 
    ? matchIds 
    : (matchId ? [matchId] : []);

  // Fetch match highlights on mount / parameter changes
  useEffect(() => {
    let active = true;
    
    const fetchAllHighlights = async () => {
      if (idsToFetch.length === 0) {
        setHighlights([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const fetchPromises = idsToFetch.map(async (id) => {
          try {
            const res = await fetch(`/api/matches/${id}/highlights`);
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        });

        const results = await Promise.all(fetchPromises);
        const validHighlights = results.filter((h): h is VideoHighlight => h !== null);

        if (active) {
          setHighlights(validHighlights);
          if (validHighlights.length === 0) {
            setError('No video highlights are currently available for the requested matches.');
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to load video highlights.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAllHighlights();
    
    return () => {
      active = false;
    };
  }, [JSON.stringify(matchIds), matchId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 flex flex-col items-center justify-center space-y-3 text-xs text-slate-400 font-mono">
        <Film className="h-5 w-5 animate-spin text-lime-400" />
        <span className="tracking-wide text-slate-300">Assembling match highlights reel...</span>
      </div>
    );
  }

  if (error || highlights.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-red-950/30 bg-red-950/5 p-5 flex items-center space-x-3.5 text-xs text-red-400 font-sans">
        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
        <span>{error || 'No highlights are currently available for this selection.'}</span>
      </div>
    );
  }

  // Determine if single or multiple display
  const isMultiple = highlights.length > 1;

  return (
    <div className="space-y-5" id="video-highlights-section">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <Film className="h-4 w-4 text-lime-400" />
          <span>{isMultiple ? 'Match Highlights Collection' : 'Official Highlights Reel'}</span>
        </h3>
        
        {isMultiple && (
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
            {highlights.length} Clips Available
          </span>
        )}
      </div>

      {/* Grid of Highlight Cards */}
      <div className={isMultiple ? "grid grid-cols-1 sm:grid-cols-2 gap-5" : "space-y-4"}>
        {highlights.map((hl) => (
          <div 
            key={hl.id}
            onClick={() => setActiveHighlight(hl)}
            className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer shadow-lg hover:border-lime-400/50 transition-all duration-300 flex flex-col"
          >
            {/* Thumbnail Box */}
            <div className="aspect-video w-full relative overflow-hidden bg-slate-900 shrink-0">
              <img 
                src={hl.thumbnailUrl} 
                alt={hl.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-500" 
              />
              {/* Neon Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
              
              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-lime-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.35)] group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-5 w-5 fill-slate-950 ml-0.5" />
                </div>
              </div>

              {/* Time Indicator Badge */}
              <span className="absolute bottom-3 right-3 bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded-md flex items-center space-x-1">
                <Clock className="h-3 w-3 text-lime-400" />
                <span>{hl.duration}</span>
              </span>

              {/* Quality Tag */}
              <span className="absolute top-3 right-3 bg-lime-400/15 border border-lime-400/30 text-[8px] font-mono font-bold text-lime-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                1080p hd
              </span>
            </div>

            {/* Info and Watch button */}
            <div className="p-4 flex flex-col justify-between flex-grow gap-3">
              <div className="space-y-1">
                <h4 className="font-sans text-xs font-extrabold text-slate-200 group-hover:text-lime-300 transition-colors line-clamp-2">
                  {hl.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-sans flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-lime-400/70" />
                  <span>Includes {hl.keyEvents.length} commentary-tagged timelines.</span>
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHighlight(hl);
                }}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-lime-400 hover:bg-lime-300 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition-all cursor-pointer"
                id={`watch-recap-btn-${hl.matchId}`}
              >
                <Play className="h-3 w-3 fill-slate-950" />
                <span>Watch Recap</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Interactive Cinema Modal Player */}
      <VideoPlayerModal
        isOpen={activeHighlight !== null}
        highlight={activeHighlight}
        onClose={() => setActiveHighlight(null)}
      />

    </div>
  );
}
