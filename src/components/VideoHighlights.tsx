import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Clock, AlertCircle, Film, Sparkles, Tv, RotateCcw } from 'lucide-react';
import { VideoHighlight, VideoHighlightEvent } from '../types.js';
import Modal from './Modal.js';

interface VideoHighlightsProps {
  matchId: string;
}

export default function VideoHighlights({ matchId }: VideoHighlightsProps) {
  const [highlight, setHighlight] = useState<VideoHighlight | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(-1);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch the simulated highlights when the matchId changes
  useEffect(() => {
    let active = true;
    const fetchHighlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/matches/${matchId}/highlights`);
        if (!res.ok) {
          throw new Error('Unable to retrieve highlight clips for this match.');
        }
        const data = await res.json();
        if (active) {
          setHighlight(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed fetching match highlights.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchHighlights();
    return () => {
      active = false;
    };
  }, [matchId]);

  // Video Event Handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Play error:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Find current active highlight event based on timestamp
    if (highlight) {
      let activeIdx = -1;
      for (let i = 0; i < highlight.keyEvents.length; i++) {
        if (time >= highlight.keyEvents[i].timestamp) {
          activeIdx = i;
        }
      }
      setActiveEventIndex(activeIdx);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleJumpToEvent = (evt: VideoHighlightEvent) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = evt.timestamp;
    setCurrentTime(evt.timestamp);
    if (!isPlaying) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Play error on jump:', err));
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatVideoTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 flex items-center justify-center space-x-3 text-xs text-slate-400 font-mono">
        <Film className="h-4 w-4 animate-spin text-lime-400" />
        <span>Loading high-definition recap packages...</span>
      </div>
    );
  }

  if (error || !highlight) {
    return (
      <div className="rounded-2xl border border-dashed border-red-950 bg-red-950/10 p-4 flex items-center space-x-3 text-xs text-red-400 font-sans">
        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
        <span>{error || 'Highlights are currently unavailable for this fixture.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4" id={`highlights-block-${matchId}`}>
      <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
        <Film className="h-4 w-4 text-lime-400" />
        <span>Match Highlights Reel</span>
      </h3>

      {/* Highlights Showcase Card */}
      <div 
        onClick={() => setIsOpen(true)}
        className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer shadow-lg hover:border-lime-400/50 transition-all duration-300"
      >
        <div className="aspect-video w-full relative">
          <img 
            src={highlight.thumbnailUrl} 
            alt={highlight.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
          />
          {/* Neon Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          
          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-lime-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.4)] group-hover:scale-110 transition-transform duration-300">
              <Play className="h-6 w-6 fill-slate-950 ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          <span className="absolute bottom-3 right-3 bg-slate-950/80 border border-slate-800 text-[10px] font-mono font-bold text-white px-2.5 py-1 rounded-md flex items-center space-x-1.5">
            <Clock className="h-3 w-3 text-lime-400" />
            <span>{highlight.duration}</span>
          </span>

          {/* HD Indicator Badge */}
          <span className="absolute top-3 right-3 bg-lime-400/10 border border-lime-400/30 text-[9px] font-mono font-bold text-lime-400 px-2 py-0.5 rounded uppercase tracking-wider">
            1080P HD
          </span>
        </div>

        {/* Video Metadata Panel with explicit Watch Recap Button */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <h4 className="font-sans text-xs font-extrabold text-slate-200 group-hover:text-lime-300 transition-colors truncate">
              {highlight.title}
            </h4>
            <p className="text-[11px] text-slate-500 font-sans flex items-center space-x-1.5">
              <Sparkles className="h-3 w-3 text-lime-400/70 shrink-0" />
              <span className="truncate">Recap includes {highlight.keyEvents.length} major match timeline highlights.</span>
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="shrink-0 flex items-center justify-center space-x-2 rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.15)] transition-all cursor-pointer"
            id={`watch-recap-btn-${matchId}`}
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span>Watch Recap</span>
          </button>
        </div>
      </div>

      {/* Immersive Cinema Modal Player */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsPlaying(false);
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }}
        size="3xl"
        showCloseButton={false}
        closeOnOverlayClick={true}
        className="border border-slate-800 bg-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        overlayClassName="bg-slate-950/95 backdrop-blur-md"
        id="modal-cinema-player"
      >
        {/* Main Modal Layout */}
        <div className="relative w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
          {/* Close Button top corner */}
          <button 
            onClick={() => {
              setIsOpen(false);
              setIsPlaying(false);
              if (videoRef.current) {
                videoRef.current.pause();
              }
            }}
            className="absolute top-4 right-4 z-20 rounded-full border border-slate-800 bg-slate-950/80 p-2 text-slate-400 hover:text-white hover:bg-slate-850 transition-all focus:outline-none focus:ring-2 focus:ring-lime-400"
            title="Close Player"
            id="modal-cinema-close-btn"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column: Interactive Video Stage */}
          <div className="flex-1 bg-black flex flex-col relative min-h-[250px] md:min-h-[400px]">
            {/* Actual Video tag */}
            <div className="relative flex-1 flex items-center justify-center">
              <video
                ref={videoRef}
                src={highlight.videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={handlePlayPause}
                className="w-full h-full max-h-[60vh] object-contain cursor-pointer"
                preload="metadata"
              />

              {/* Score Bug Overlay overlayed inside Video */}
              <div className="absolute top-4 left-4 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center space-x-2 font-mono text-[10px] text-white">
                <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-sans font-black text-lime-400 uppercase tracking-wider">REPLAY</span>
                <span className="text-slate-500">|</span>
                <span>{highlight.duration} HD</span>
              </div>

              {/* Dynamic On-Screen Commentary / Subtitles (matching key event timeline) */}
              {activeEventIndex !== -1 && highlight.keyEvents[activeEventIndex] && (
                <div className="absolute bottom-16 left-4 right-4 text-center">
                  <div className="inline-block bg-slate-950/90 border border-lime-400/40 text-white px-4 py-2.5 rounded-2xl shadow-xl max-w-[90%] mx-auto transition-all duration-300 transform scale-100">
                    <div className="flex items-center space-x-2 justify-center">
                      <span className="font-mono text-xs font-black text-lime-400 leading-none">
                        {highlight.keyEvents[activeEventIndex].minute}'
                      </span>
                      <span className="text-xs font-bold text-slate-100 font-sans">
                        {highlight.keyEvents[activeEventIndex].title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 italic font-sans leading-relaxed">
                      "{highlight.keyEvents[activeEventIndex].description}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Player Controls Bar */}
            <div className="bg-slate-950 p-4 border-t border-slate-850 space-y-3">
              {/* Timeline Progress Seeker */}
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-slate-400 font-bold">{formatVideoTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-grow accent-lime-400 h-1 rounded bg-slate-800 cursor-pointer focus:outline-none"
                />
                <span className="text-slate-400 font-bold">{formatVideoTime(duration)}</span>
              </div>

              {/* Control Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Play/Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="rounded-full bg-lime-400 p-2.5 text-slate-950 hover:opacity-90 transition-opacity"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 fill-slate-950 text-slate-950" />
                    ) : (
                      <Play className="h-4 w-4 fill-slate-950 text-slate-950 ml-0.5" />
                    )}
                  </button>

                  {/* Restart */}
                  <button
                    onClick={handleRestart}
                    className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Restart Video"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  <Tv className="h-3.5 w-3.5 text-slate-600" />
                  <span>BROADCAST MODE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Event Timeline Sidebar */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950/80 p-5 flex flex-col justify-between overflow-y-auto max-h-[35vh] md:max-h-none md:h-auto">
            <div className="space-y-4">
              <div>
                <h3 className="font-sans text-xs font-black uppercase text-white tracking-wider flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-lime-400" />
                  <span>Jump to Highlights</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  Select a pivotal event below to skip straight to the broadcaster feed replay.
                </p>
              </div>

              {/* List of events */}
              <div className="space-y-2 max-h-[300px] md:max-h-[380px] overflow-y-auto pr-1">
                {highlight.keyEvents.map((evt, idx) => {
                  const isActive = idx === activeEventIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleJumpToEvent(evt)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-lime-400/10 border-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.05)]'
                          : 'bg-slate-900/60 border-slate-850 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-[10px] font-black leading-none ${isActive ? 'text-lime-400' : 'text-slate-400'}`}>
                          {evt.minute}' Event
                        </span>
                        <span className="font-mono text-[9px] text-slate-500">
                          {formatVideoTime(evt.timestamp)}
                        </span>
                      </div>
                      <h4 className={`text-xs font-black mt-1 font-sans ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {evt.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2 font-sans italic">
                        {evt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Broadcast credit */}
            <div className="border-t border-slate-900 pt-4 mt-4 text-[9px] font-mono text-slate-600">
              WFC 2026 OFFICIAL HIGHLIGHT REELS DISTRIBUTED BY SANDBOX MEDIA INC. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
}
