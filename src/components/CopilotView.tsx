import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, ArrowDown, ShieldCheck, Activity, Mic, MicOff } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface CopilotViewProps {
  onSendMessage: (prompt: string, chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]) => Promise<{ reply: string }>;
}

export default function CopilotView({ onSendMessage }: CopilotViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Sabaidee and welcome! I am your **AI Tournament Copilot** for the World Football Championship 2026. Ask me anything about tactical forecasts, match schedules, host cities, hotel recommendations, or Cambodia’s historic tournament debut!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInputValue(transcript);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow mic access in your browser.');
        } else {
          setSpeechError(`Speech error: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (!textToSend) {
      setInputValue('');
    }

    // Append user message
    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Map simple message arrays to expected Gemini API structured chat history
      const formattedHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const res = await onSendMessage(text, formattedHistory);
      setMessages(m => [...m, { role: 'model', text: res.reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'model', text: '### ⚽ Network Delay\nI encountered a connection delay. Please ensure your Championship connection is stable and try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { text: 'Predict USA vs Germany match tactics', label: 'Tactics' },
    { text: 'Tell me about the Cambodian Angkor Warriors historic run', label: 'Cambodia' },
    { text: 'Recommend lodging near SoFi Stadium', label: 'Lodging' },
    { text: 'Explain ticket categories and pricing levels', label: 'Ticketing' }
  ];

  return (
    <div className="space-y-6" id="ai-copilot-section">
      
      {/* Title */}
      <div>
        <h2 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
          AI Tournament Copilot Terminal
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Chat with our real-time grounded intelligence model to forecast match results, locate hotels, and scan team standings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[calc(100vh-270px)] min-h-[500px]">
        
        {/* Left Suggestions & Info Rail (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/40 p-5 md:p-6 backdrop-blur shadow-xl">
          <div className="space-y-5">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
              <Sparkles className="h-4.5 w-4.5 text-lime-400" />
              <span>Suggested Queries</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug.text)}
                  className="w-full text-left rounded-2xl border border-slate-850 bg-slate-950/40 p-3.5 hover:border-slate-800 hover:bg-slate-950 transition-all text-xs font-semibold text-slate-300 hover:text-white flex items-start space-x-2.5 active:scale-[0.98]"
                >
                  <span className="text-xs shrink-0 mt-0.5">💡</span>
                  <span>{sug.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secure Copilot Footer Box */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 space-y-3.5 mt-6">
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-lime-400" />
              <span>Grounded Copilot Engine</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
              Powered by server-side Gemini intelligence directly sync'd with our World Championship tournament schema databases, matching host city metrics, live matches records, standings, and star rosters.
            </p>
          </div>
        </div>

        {/* Right Terminal Chat (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950 p-5 md:p-6 shadow-2xl overflow-hidden relative">
          
          {/* Active Chats scroll log */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 pb-4 scrollbar-thin">
            {messages.map((msg, idx) => {
              const isAI = msg.role === 'model';
              return (
                <div
                  key={idx}
                  className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 border ${
                      isAI
                        ? 'bg-slate-900/60 border-slate-850 text-slate-300 rounded-bl-none shadow-sm'
                        : 'bg-lime-400 border-lime-400 text-slate-950 font-semibold rounded-br-none shadow'
                    }`}
                  >
                    {/* Render basic markdown formatting simulation cleanly */}
                    <div className="whitespace-pre-line font-sans">
                      {msg.text.split('\n').map((line, lIdx) => {
                        // Check headers
                        if (line.startsWith('###')) {
                          return <h4 key={lIdx} className={`font-sans font-black text-sm uppercase mt-3 mb-1.5 ${isAI ? 'text-white' : 'text-slate-950'}`}>{line.replace('###', '')}</h4>;
                        }
                        if (line.startsWith('*')) {
                          return <div key={lIdx} className="pl-3 py-0.5">• {line.slice(1).replace(/\*\*/g, '')}</div>;
                        }
                        // Replace simple bold markers
                        const parts = line.split('**');
                        if (parts.length > 1) {
                          return (
                            <p key={lIdx}>
                              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className={isAI ? 'text-lime-400 font-bold' : 'text-slate-950 font-black'}>{p}</strong> : p)}
                            </p>
                          );
                        }
                        return <p key={lIdx}>{line}</p>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Loader animation */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-900/60 border border-slate-850 p-4 space-y-1 rounded-bl-none">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    <Activity className="h-3.5 w-3.5 text-lime-400 animate-pulse" />
                    <span>Analyzing Live Database...</span>
                  </div>
                  <div className="flex space-x-1.5 py-1">
                    <div className="h-2 w-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Voice Command feedback status */}
          {(isListening || speechError) && (
            <div className="px-4 py-2 text-xs flex items-center justify-between animate-fade-in bg-slate-900/60 rounded-xl border border-slate-850/60 mb-2">
              {isListening ? (
                <div className="flex items-center space-x-2 text-lime-400 font-semibold font-mono animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                  </span>
                  <span>Voice Active: Speak your question now...</span>
                </div>
              ) : (
                <div className="text-red-400 font-medium font-sans flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{speechError}</span>
                </div>
              )}
              {isListening && (
                <button
                  type="button"
                  onClick={() => {
                    if (recognitionRef.current) {
                      recognitionRef.current.stop();
                    }
                  }}
                  className="text-[10px] text-slate-400 hover:text-white uppercase font-bold tracking-wider"
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          {/* Interactive Chat Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mt-4 flex items-center space-x-2.5 border-t border-slate-900 pt-4"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening... Speak clearly" : "Ask Copilot about championship matches, hotel lodges, Cambodia profiles..."}
              className="flex-1 rounded-xl border border-slate-850 bg-slate-900 px-4 py-3.5 text-xs font-semibold text-slate-200 focus:border-lime-400 focus:bg-slate-900/80 focus:outline-none transition-all placeholder:text-slate-550"
            />
            
            {speechSupported ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleListening();
                }}
                className={`rounded-xl p-3.5 transition-all active:scale-95 border ${
                  isListening
                    ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-lime-400 hover:text-lime-400 hover:bg-slate-900/80'
                }`}
                title={isListening ? 'Stop voice recognition' : 'Ask via Voice Command'}
                id="voice-command-mic-btn"
              >
                <Mic className="h-4 w-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-xl bg-slate-950 border border-slate-900 p-3.5 text-slate-600 cursor-not-allowed"
                title="Web Speech API not supported in this browser"
                id="voice-command-disabled"
              >
                <MicOff className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="rounded-xl bg-lime-400 p-3.5 text-slate-950 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow shadow-lime-400/20"
            >
              <Send className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
