import React, { useState } from 'react';
import { MapPin, Cloud, Hotel, Globe, Languages, PhoneCall, Compass, Shield, Heart } from 'lucide-react';
import { Stadium } from '../types.js';

interface GuideViewProps {
  stadiums: Stadium[];
}

export default function GuideView({ stadiums }: GuideViewProps) {
  const [selectedStadiumId, setSelectedStadiumId] = useState<string>(stadiums[0]?.id || '');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  const currentStadium = stadiums.find(s => s.id === selectedStadiumId) || stadiums[0];

  const phrasesDict: Record<string, Record<string, string>> = {
    'English': {
      welcome: 'Welcome to the World Championship!',
      where: 'Where is the football stadium?',
      ticket: 'Do you have ticket bookings open?',
      goal: 'GOAL! What an amazing match!',
      emergency: 'Please help, where is the nearest emergency service?'
    },
    'French': {
      welcome: 'Bienvenue au Championnat du Monde !',
      where: 'Où se trouve le stade de football ?',
      ticket: 'Les réservations de billets sont-elles ouvertes ?',
      goal: 'BUT ! Quel match incroyable !',
      emergency: 'S\'il vous plaît, aidez-moi, où sont les urgences les plus proches ?'
    },
    'Spanish': {
      welcome: '¡Bienvenido al Campeonato Mundial!',
      where: '¿Dónde está el estadio de fútbol?',
      ticket: '¿Están abiertas las reservas de entradas?',
      goal: '¡GOL! ¡Qué partido tan increíble!',
      emergency: 'Por favor ayuda, ¿dónde está el servicio de urgencias más cercano?'
    },
    'German': {
      welcome: 'Willkommen zur Weltmeisterschaft!',
      where: 'Wo ist das Fußballstadion?',
      ticket: 'Sind Ticketbuchungen geöffnet?',
      goal: 'TOR! Was für ein fantastisches Spiel!',
      emergency: 'Bitte helfen Sie mir, wo ist der nächste Notdienst?'
    },
    'Portuguese': {
      welcome: 'Bem-vindo ao Campeonato Mundial!',
      where: 'Onde fica o estádio de futebol?',
      ticket: 'As reservas de ingressos estão abertas?',
      goal: 'GOLO! Que partida incrível!',
      emergency: 'Por favor ajude, onde fica o serviço de emergência mais próximo?'
    },
    'Arabic': {
      welcome: 'مرحباً بكم في بطولة العالم!',
      where: 'أين يقع ملعب كرة القدم؟',
      ticket: 'هل باب حجز التذاكر مفتوح؟',
      goal: 'هدف! يا لها من مباراة مذهلة!',
      emergency: 'الرجاء المساعدة، أين أقرب خدمة طوارئ؟'
    },
    'Chinese': {
      welcome: '欢迎来到世界锦标赛！',
      where: '足球场在哪里？',
      ticket: '门票预订开放了吗？',
      goal: '进球了！多么精彩的比赛！',
      emergency: '请问最近的急救中心在哪里？'
    },
    'Japanese': {
      welcome: '世界選手権へようこそ！',
      where: 'サッカースタジアムはどこですか？',
      ticket: 'チケットの予約は可能ですか？',
      goal: 'ゴール！なんて素晴らしい試合だ！',
      emergency: '助けてください、一番近い救急サービスはどこですか？'
    },
    'Korean': {
      welcome: '세계 선수권 대회에 오신 것을 환영합니다!',
      where: '축구 경기장은 어디에 있나요?',
      ticket: '티켓 예매가 진행 중인가요?',
      goal: '골! 정말 멋진 경기입니다!',
      emergency: '도와주세요, 가장 가까운 응급실이 어디인가요?'
    },
    'Khmer': {
      welcome: 'សូមស្វាគមន៍មកកាន់ការប្រកួតជើងឯកពិភពលោក!',
      where: 'តើកីឡដ្ឋានបាល់ទាត់នៅឯណា?',
      ticket: 'តើការកក់សំបុត្របើកហើយឬនៅ?',
      goal: 'ចូលហើយ! ពិតជាការប្រកួតដ៏អស្ចារ្យមែន!',
      emergency: 'សូមជួយផង តើសេវាសង្គ្រោះបន្ទាន់ដែលជិតបំផុតនៅឯណា?'
    }
  };

  const countriesGuide = [
    { name: 'United States', flag: '🇺🇸', currency: 'USD ($)', language: 'English', emergency: '911', transport: 'High-speed fan loop shuttles & light rail' },
    { name: 'Mexico', flag: '🇲🇽', currency: 'MXN ($)', language: 'Spanish', emergency: '911', transport: 'Metro buses & local stadium shuttles' },
    { name: 'Canada', flag: '🇨🇦', currency: 'CAD ($)', language: 'English/French', emergency: '911', transport: 'SkyTrain metro network & water taxis' },
    { name: 'Cambodia (Tribute)', flag: '🇰🇭', currency: 'KHR (៛) & USD', language: 'Khmer', emergency: '119', transport: 'Tuk-Tuks, local pass-app & clean electric buses' }
  ];

  return (
    <div className="space-y-6" id="guide-section">
      
      {/* Page Title */}
      <div>
        <h2 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
          Stadium & Host City Tourism Guides
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore iconic venues, live weather alerts, nearby lodging, and multi-language tourist translator logs.
        </p>
      </div>

      {/* Main Grid mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Stadium details panel (Left 8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Stadium Selector Tabs */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
            {stadiums.map((stad) => (
              <button
                key={stad.id}
                onClick={() => setSelectedStadiumId(stad.id)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all uppercase tracking-wide border ${
                  selectedStadiumId === stad.id
                    ? 'bg-lime-400 text-slate-950 border-lime-400 font-black shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-900/40 text-slate-400 border-slate-850 hover:text-white hover:border-slate-800'
                }`}
              >
                <span>{stad.name}</span>
              </button>
            ))}
          </div>

          {/* Active Stadium Profile card */}
          {currentStadium && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur shadow-xl space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-lime-400">
                    <MapPin className="h-4 w-4" />
                    <span>{currentStadium.city}, {currentStadium.country}</span>
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl font-black text-white uppercase">
                    {currentStadium.name}
                  </h3>
                  <p className="font-mono text-xs text-slate-500 uppercase tracking-widest font-bold">
                    CAPACITY: {currentStadium.capacity.toLocaleString()} SPECTATORS
                  </p>
                </div>

                {/* Weather Widget Box */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center space-x-3.5 self-start shadow-inner">
                  <div className="bg-lime-400/10 p-2.5 rounded-xl border border-lime-400/20 text-lime-400 animate-pulse">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider leading-none">
                      Stadium Weather
                    </span>
                    <span className="block font-sans text-sm font-black text-white mt-1 leading-none">
                      {currentStadium.temperature}
                    </span>
                    <span className="block text-[9px] font-mono text-slate-400 mt-1 uppercase font-semibold">
                      {currentStadium.weather}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stadium Description */}
              <p className="font-sans text-sm text-slate-300 leading-relaxed max-w-3xl">
                {currentStadium.description}
              </p>

              <div className="h-px bg-slate-850" />

              {/* Recommended lodging and hotels */}
              <div className="space-y-3">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <Hotel className="h-4 w-4 text-lime-400" />
                  <span>Recommended Nearby Hotels & Lodging</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentStadium.hotels.map((hotel, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-850 bg-slate-950/60 p-4 hover:border-slate-800 transition-all cursor-pointer shadow-sm flex items-center space-x-2.5"
                    >
                      <span className="text-xs">🏨</span>
                      <div className="min-w-0">
                        <span className="block font-sans text-xs font-bold text-slate-200 truncate">{hotel}</span>
                        <span className="block text-[8px] font-mono text-lime-400 font-bold mt-1 uppercase">★ Sandbox Approved</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Tourist Travel Guide & Translator (Right 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Mini Phrases Translator Translator */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur shadow-xl space-y-5">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
              <Languages className="h-4.5 w-4.5 text-lime-400" />
              <span>Multi-Language Tourist Dictionary</span>
            </h3>

            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-xl border border-slate-850 bg-slate-950 px-3 py-2 text-xs font-bold font-mono text-slate-200 focus:border-lime-400 focus:outline-none"
            >
              {Object.keys(phrasesDict).map((lang) => (
                <option key={lang} value={lang} className="bg-slate-950">
                  {lang} Phrasebook
                </option>
              ))}
            </select>

            {/* Active Phrases mappings */}
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="block text-[9px] font-mono font-bold text-slate-500 uppercase">Welcome Greeting</span>
                <p className="font-sans font-bold text-slate-200 mt-1">"{phrasesDict[selectedLanguage].welcome}"</p>
              </div>

              <div>
                <span className="block text-[9px] font-mono font-bold text-slate-500 uppercase">Asking for Location</span>
                <p className="font-sans font-bold text-slate-200 mt-1">"{phrasesDict[selectedLanguage].where}"</p>
              </div>

              <div>
                <span className="block text-[9px] font-mono font-bold text-slate-500 uppercase">Asking for Tickets</span>
                <p className="font-sans font-bold text-slate-200 mt-1">"{phrasesDict[selectedLanguage].ticket}"</p>
              </div>

              <div>
                <span className="block text-[9px] font-mono font-bold text-slate-500 uppercase">Goal Celebration</span>
                <p className="font-sans font-bold text-lime-400 mt-1">"{phrasesDict[selectedLanguage].goal}"</p>
              </div>

              <div className="border-t border-slate-850 pt-3">
                <span className="block text-[9px] font-mono font-bold text-red-500 uppercase">Emergency Support</span>
                <p className="font-sans font-bold text-red-400 mt-1">"{phrasesDict[selectedLanguage].emergency}"</p>
              </div>
            </div>

          </div>

          {/* Quick Country Directory */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur shadow-xl space-y-4">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
              <Compass className="h-4.5 w-4.5 text-lime-400" />
              <span>Host Country Quick Rules</span>
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {countriesGuide.map((c, idx) => (
                <div key={idx} className="text-xs border-b border-slate-850/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-2 font-bold text-slate-200">
                    <span className="text-xl">{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[10px] text-slate-400">
                    <div>
                      <span className="text-slate-600 block">CURRENCY:</span>
                      <span>{c.currency}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">EMERGENCY:</span>
                      <span className="text-red-400 font-bold">{c.emergency}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-600 block">TRANSIT:</span>
                      <span className="font-sans">{c.transport}</span>
                    </div>
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
