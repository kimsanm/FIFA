import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Clock, AlertCircle, Film, Sparkles, Tv, RotateCcw } from 'lucide-react';
import { VideoHighlight, VideoHighlightEvent } from '../types.js';
import Modal from './Modal.js';

interface VideoPlayerModalProps {
  highlight: VideoHighlight | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ highlight, isOpen, onClose }: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(-1);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset player state when highlight or modal status changes
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setActiveEventIndex(-1);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen, highlight]);

  // Handle Play/Pause trigger
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Error playing highlight video:', err));
    }
  };

  // Track playback time updates to map current subtitle commentary
  const handleTimeUpdate = () => {
    if (!videoRef.current || !highlight) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Identify active match event based on timestamp mapping
    let activeIdx = -1;
    for (let i = 0; i < highlight.keyEvents.length; i++) {
      if (time >= highlight.keyEvents[i].timestamp) {
        activeIdx = i;
      }
    }
    setActiveEventIndex(activeIdx);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Skip video time directly to key moment
  const handleJumpToEvent = (evt: VideoHighlightEvent) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = evt.timestamp;
    setCurrentTime(evt.timestamp);
    if (!isPlaying) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Play error on skipping to event:', err));
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

  return (
    <Modal
      isOpen={isOpen && highlight !== null}
      onClose={onClose}
      size="3xl"
      showCloseButton={false}
      closeOnOverlayClick={true}
      className="border border-slate-800 bg-slate-900 shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden"
      overlayClassName="bg-slate-950/95 backdrop-blur-md"
      id="modal-cinema-player"
    >
      {highlight && (
        <div className="relative w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
          
          {/* Custom Close Button inside Modal Corner */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full border border-slate-850 bg-slate-950/90 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-lime-400"
            title="Close Player"
            id="modal-cinema-close-btn"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Stage Column: Video Live Stream Area */}
          <div className="flex-1 bg-black flex flex-col relative min-h-[260px] md:min-h-[420px]">
            
            {/* Aspect Container */}
            <div className="relative flex-1 flex items-center justify-center bg-slate-950">
              <video
                ref={videoRef}
                src={highlight.videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={handlePlayPause}
                className="w-full h-full max-h-[60vh] object-contain cursor-pointer"
                preload="metadata"
              />

              {/* Tournament Broadcast Score Bug */}
              <div className="absolute top-4 left-4 bg-slate-950/85 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center space-x-2 font-mono text-[10px] text-white">
                <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-sans font-black text-lime-400 uppercase tracking-wider">OFFICIAL REPLAY</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300 font-bold">{highlight.duration} HD</span>
              </div>

              {/* Dynamic On-Screen Commentary Overlay */}
              {activeEventIndex !== -1 && highlight.keyEvents[activeEventIndex] && (
                <div className="absolute bottom-16 left-4 right-4 text-center">
                  <div className="inline-block bg-slate-950/95 border border-lime-400/40 text-white px-4 py-2.5 rounded-2xl shadow-xl max-w-[90%] mx-auto transition-all duration-300 transform scale-100">
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

            {/* Timeline Progress Slider & Main Controls */}
            <div className="bg-slate-950 p-4 border-t border-slate-850 space-y-3 shrink-0">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayPause}
                    className="rounded-full bg-lime-400 p-2.5 text-slate-950 hover:opacity-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 fill-slate-950 text-slate-950" />
                    ) : (
                      <Play className="h-4 w-4 fill-slate-950 text-slate-950 ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
                    title="Restart Video"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  <Tv className="h-3.5 w-3.5 text-slate-600" />
                  <span className="tracking-widest uppercase">HD BROADCAST</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column: Highlight Navigation Reel */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950/80 p-5 flex flex-col justify-between overflow-y-auto max-h-[35vh] md:max-h-none md:h-auto shrink-0">
            <div className="space-y-4">
              <div>
                <h3 className="font-sans text-xs font-black uppercase text-white tracking-wider flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-lime-400" />
                  <span>Interactive Log</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  Click a pivotal moment below to jump straight to its broadcast feed replay.
                </p>
              </div>

              {/* List of key replay events */}
              <div className="space-y-2 max-h-[280px] md:max-h-[350px] overflow-y-auto pr-1">
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
                          {evt.minute}' Highlight
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

            {/* Broadcast attribution info */}
            <div className="border-t border-slate-900 pt-4 mt-4 text-[9px] font-mono text-slate-600">
              WFC 2026 OFFICIAL HIGHLIGHT REELS DISTRIBUTED BY SANDBOX MEDIA INC. ALL RIGHTS RESERVED.
            </div>
          </div>

        </div>
      )}
    </Modal>
  );
}
