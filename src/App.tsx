import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.js';
import HeroBanner from './components/HeroBanner.js';
import MatchesView from './components/MatchesView.js';
import StandingsView from './components/StandingsView.js';
import TicketingView from './components/TicketingView.js';
import GuideView from './components/GuideView.js';
import CopilotView from './components/CopilotView.js';
import NewsView from './components/NewsView.js';
import ProfileView from './components/ProfileView.js';
import AdminView from './components/AdminView.js';

import { Team, Player, Match, Stadium, NewsArticle, User, TicketBooking, AnalyticsSummary, TournamentConfig } from './types.js';
import { Calendar, Users, Trophy, ChevronRight, Activity, BellRing, Ticket, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<TicketBooking[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [config, setConfig] = useState<TournamentConfig | null>(null);

  const [loading, setLoading] = useState(true);

  // Sync state with the backend on component mount
  const syncState = async () => {
    try {
      const [teamsRes, playersRes, stadiumsRes, matchesRes, newsRes, userRes, bookingsRes, analyticsRes, configRes] = await Promise.all([
        fetch('/api/teams').then(r => r.json()),
        fetch('/api/players').then(r => r.json()),
        fetch('/api/stadiums').then(r => r.json()),
        fetch('/api/matches').then(r => r.json()),
        fetch('/api/news').then(r => r.json()),
        fetch('/api/users/me').then(r => r.json()),
        fetch('/api/tickets/my-bookings').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json()),
        fetch('/api/config').then(r => r.json())
      ]);

      setTeams(teamsRes);
      setPlayers(playersRes);
      setStadiums(stadiumsRes);
      setMatches(matchesRes);
      setNews(newsRes);
      setCurrentUser(userRes);
      setBookings(bookingsRes);
      setAnalytics(analyticsRes);
      setConfig(configRes);
    } catch (err) {
      console.error('[CLIENT] Failed syncing server state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncState();
  }, []);

  // Action Handler: Toggle Favorites
  const handleToggleFavoriteTeam = async (teamId: string) => {
    try {
      const res = await fetch('/api/users/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId })
      });
      const updatedUser = await res.json();
      setCurrentUser(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavoritePlayer = async (playerId: string) => {
    try {
      const res = await fetch('/api/users/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });
      const updatedUser = await res.json();
      setCurrentUser(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavoriteMatch = (matchId: string) => {
    if (!currentUser) return;
    // Client-side local toggle simulation
    const updated = currentUser.favoriteTeams.includes(matchId)
      ? currentUser.favoriteTeams.filter(id => id !== matchId)
      : [...currentUser.favoriteTeams, matchId];
    
    setCurrentUser({
      ...currentUser,
      favoriteTeams: updated
    });
  };

  // Action Handler: News Likes & Comments
  const handleLikeNewsArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}/like`, { method: 'POST' });
      const updatedArticle = await res.json();
      setNews(news.map(art => art.id === id ? updatedArticle : art));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewsComment = async (id: string, content: string) => {
    try {
      const res = await fetch(`/api/news/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userName: currentUser?.name })
      });
      const updatedArticle = await res.json();
      setNews(news.map(art => art.id === id ? updatedArticle : art));
      // Sync notifications in user profiles
      const userRes = await fetch('/api/users/me').then(r => r.json());
      setCurrentUser(userRes);
    } catch (err) {
      console.error(err);
    }
  };

  // Action Handler: Ticket Booking
  const handleBookTicketSimulation = async (bookingData: {
    matchId: string;
    stadiumId: string;
    category: string;
    seatNumber: string;
    price: number;
  }) => {
    try {
      const res = await fetch('/api/tickets/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const result = await res.json();
      if (result.success) {
        // Reload bookings, user, and analytics
        const [bookingsRes, userRes, analyticsRes] = await Promise.all([
          fetch('/api/tickets/my-bookings').then(r => r.json()),
          fetch('/api/users/me').then(r => r.json()),
          fetch('/api/analytics').then(r => r.json())
        ]);
        setBookings(bookingsRes);
        setCurrentUser(userRes);
        setAnalytics(analyticsRes);
      }
      return result;
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  // Action Handler: AI Copilot Message
  const handleSendCopilotMessage = async (prompt: string, chatHistory: any[]) => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history: chatHistory })
    });
    return res.json();
  };

  // Action Handler: Admin Match Score Override
  const handleUpdateMatchScore = async (
    matchId: string,
    homeScore: number,
    awayScore: number,
    status: 'scheduled' | 'live' | 'finished'
  ) => {
    try {
      const res = await fetch(`/api/matches/${matchId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeScore, awayScore, status })
      });
      const updatedMatch = await res.json();
      setMatches(matches.map(m => m.id === matchId ? updatedMatch : m));
      
      // Standings/teams could have changed, reload team ratings, standings, user notifications
      const [teamsRes, userRes] = await Promise.all([
        fetch('/api/teams').then(r => r.json()),
        fetch('/api/users/me').then(r => r.json())
      ]);
      setTeams(teamsRes);
      setCurrentUser(userRes);
    } catch (err) {
      console.error(err);
    }
  };

  // Action Handler: Admin Baseline Database Reset
  const handleResetMatchesDatabase = async () => {
    try {
      const res = await fetch('/api/admin/match/reset', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        await syncState();
      }
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  // Action Handler: Global config updates
  const handleSaveGlobalConfig = async (newConfig: Partial<TournamentConfig>) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      const updatedConfig = await res.json();
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadNotifications = async () => {
    // Simulated notification read state
    if (!currentUser) return;
    const readAll = currentUser.notifications.map(n => ({ ...n, read: true }));
    setCurrentUser({
      ...currentUser,
      notifications: readAll
    });
  };

  const handleSelectBookingFromProfile = (booking: TicketBooking) => {
    setActiveTab('tickets');
  };

  // Counting unread notifications
  const unreadNotifCount = currentUser?.notifications.filter(n => !n.read).length || 0;

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 text-slate-300 space-y-4" id="app-loading-screen">
        <Trophy className="h-12 w-12 text-lime-400 animate-bounce stroke-[1.5]" />
        <p className="font-mono text-xs uppercase tracking-widest text-lime-400/80 font-black animate-pulse">
          Seeding 2026 Tournament Groundings...
        </p>
      </div>
    );
  }

  const liveMatchesCount = matches.filter(m => m.status === 'live').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-lime-400 selection:text-slate-950 font-sans leading-normal antialiased">
      
      {/* Sticky Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        unreadNotifications={unreadNotifCount}
        onOpenNotifications={handleReadNotifications}
      />

      {/* Main Container */}
      <main className="flex-grow">
        
        {/* Render HOME Tab Panel */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Dynamic Countdown Hero Banner */}
            <HeroBanner
              countdownDate={config?.countdownDate || '2026-06-11T12:00:00.000Z'}
              announcement={config?.announcement || ''}
              onNavigateToTicketing={() => setActiveTab('tickets')}
              onNavigateToGuide={() => setActiveTab('guide')}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
              
              {/* Home Grid: Live matches indicators & breaking news updates */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: matches directory (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                      <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-ping" />
                      <span>Live Championship Fixtures</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('matches')}
                      className="text-xs font-bold text-lime-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Full Match Reports</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <MatchesView
                    matches={matches.slice(0, 3)}
                    teams={teams}
                    players={players}
                    favoriteMatches={currentUser?.favoriteTeams || []}
                    onToggleFavoriteMatch={handleToggleFavoriteMatch}
                    onNavigateToTicketing={() => setActiveTab('tickets')}
                  />
                </div>

                {/* Right: Side info news desk (4 Columns) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
                      Championship Press Desk
                    </h3>
                    <button
                      onClick={() => setActiveTab('news')}
                      className="text-xs font-bold text-lime-400 hover:underline flex items-center space-x-1"
                    >
                      <span>All News</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {news.slice(0, 2).map((art) => (
                      <div
                        key={art.id}
                        onClick={() => setActiveTab('news')}
                        className="group rounded-2xl border border-slate-900 bg-slate-900/20 p-4.5 hover:border-slate-800 hover:bg-slate-900/40 transition-all cursor-pointer space-y-2"
                      >
                        <span className="font-mono text-[9px] font-bold text-lime-400 uppercase">{art.category}</span>
                        <h4 className="font-sans text-xs font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                          {art.title}
                        </h4>
                        <p className="font-sans text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {art.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Group Standings Quick View */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
                    Live Group Stage Leaders
                  </h3>
                  <button
                    onClick={() => setActiveTab('standings')}
                    className="text-xs font-bold text-lime-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Brackets & Standings</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <StandingsView
                  teams={teams}
                  matches={matches}
                />
              </div>

            </div>

          </div>
        )}

        {/* Tab Route: MATCHES */}
        {activeTab === 'matches' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <MatchesView
              matches={matches}
              teams={teams}
              players={players}
              favoriteMatches={currentUser?.favoriteTeams || []}
              onToggleFavoriteMatch={handleToggleFavoriteMatch}
              onNavigateToTicketing={() => setActiveTab('tickets')}
            />
          </div>
        )}

        {/* Tab Route: STANDINGS */}
        {activeTab === 'standings' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <StandingsView
              teams={teams}
              matches={matches}
            />
          </div>
        )}

        {/* Tab Route: TICKETS */}
        {activeTab === 'tickets' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <TicketingView
              matches={matches}
              teams={teams}
              stadiums={stadiums}
              currentUser={currentUser}
              onBookTicket={handleBookTicketSimulation}
            />
          </div>
        )}

        {/* Tab Route: STADIUM & CITIES GUIDE */}
        {activeTab === 'guide' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <GuideView
              stadiums={stadiums}
            />
          </div>
        )}

        {/* Tab Route: AI COPILOT */}
        {activeTab === 'copilot' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <CopilotView
              onSendMessage={handleSendCopilotMessage}
            />
          </div>
        )}

        {/* Tab Route: PRESS NEWS CENTER */}
        {activeTab === 'news' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <NewsView
              news={news}
              currentUser={currentUser}
              onLikeArticle={handleLikeNewsArticle}
              onAddComment={handleAddNewsComment}
            />
          </div>
        )}

        {/* Tab Route: PROFILE CLUBHOUSE */}
        {activeTab === 'profile' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <ProfileView
              currentUser={currentUser}
              teams={teams}
              players={players}
              matches={matches}
              bookings={bookings}
              onToggleFavoriteTeam={handleToggleFavoriteTeam}
              onToggleFavoritePlayer={handleToggleFavoritePlayer}
              onSelectBooking={handleSelectBookingFromProfile}
            />
          </div>
        )}

        {/* Tab Route: ADMIN CONTROL CENTER */}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <AdminView
              matches={matches}
              teams={teams}
              analytics={analytics || { dailyVisitors: [], matchAttendance: [], ticketSales: [], revenue: 0, userRegistrations: 0 }}
              config={config || { countdownDate: '2026-06-11T12:00:00.000Z', ticketSalesOpen: true, announcement: '' }}
              onUpdateScore={handleUpdateMatchScore}
              onResetMatches={handleResetMatchesDatabase}
              onSaveConfig={handleSaveGlobalConfig}
            />
          </div>
        )}

      </main>

      {/* Global Sports Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-xs text-slate-500" id="app-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-900">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-lime-400 flex items-center justify-center text-slate-950 font-black text-xs">W</div>
                <span className="font-sans font-black tracking-tight text-white uppercase text-sm">WFC 2026 Hub</span>
              </div>
              <p className="font-sans text-[11px] leading-relaxed text-slate-400">
                The premier digital arena of the World Football Championship 2026. Supporting sportsmanship and absolute original design and branding, crafted for elite fans around the globe.
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h4 className="font-mono text-[9px] font-bold uppercase text-slate-400 tracking-wider">Quick Navigation</h4>
              <ul className="space-y-1.5 font-sans font-semibold text-slate-300">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-lime-400">Dashboard Center</button></li>
                <li><button onClick={() => setActiveTab('matches')} className="hover:text-lime-400">Live Fixtures</button></li>
                <li><button onClick={() => setActiveTab('tickets')} className="hover:text-lime-400">Ticketing Center</button></li>
                <li><button onClick={() => setActiveTab('copilot')} className="hover:text-lime-400">AI Copilot Terminal</button></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h4 className="font-mono text-[9px] font-bold uppercase text-slate-400 tracking-wider">Our Grand Venues</h4>
              <ul className="space-y-1.5 font-sans text-slate-400">
                <li>MetLife Stadium, New York</li>
                <li>SoFi Stadium, Los Angeles</li>
                <li>Estadio Azteca, Mexico City</li>
                <li>Olympic Stadium, Phnom Penh</li>
              </ul>
            </div>

            {/* Column 4 - Newsletter */}
            <div className="space-y-3.5">
              <h4 className="font-mono text-[9px] font-bold uppercase text-slate-400 tracking-wider">Championship Ticker</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Subscribe to instant press desk alerts and breaking team announcement logs.
              </p>
              <div className="flex space-x-1.5">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="rounded border border-slate-850 bg-slate-900 px-2.5 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-lime-400 w-full"
                />
                <button className="rounded bg-lime-400 px-3 py-1.5 font-bold uppercase tracking-wider text-slate-950 font-sans hover:opacity-90">
                  Join
                </button>
              </div>
            </div>

          </div>

          {/* Sponsors Showcase */}
          <div className="py-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-b border-slate-900 font-mono text-[9px] text-slate-600 font-bold tracking-widest uppercase">
            <span>🏆 OFFICIAL PARTNERS:</span>
            <span>⚡ ENERGYDRINK</span>
            <span>✈️ GLOBALAIRLINES</span>
            <span>⚽ LEAGUEBALL</span>
            <span>📱 PHONEMAKER</span>
            <span>💳 SANDBOXCARD</span>
          </div>

          {/* Disclosures & copyrights */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-600">
            <p>© 2026 World Football Championship Hub. Built with 100% original visual assets & code structures.</p>
            <div className="flex space-x-4">
              <a href="#privacy" className="hover:underline">Privacy Policy</a>
              <a href="#terms" className="hover:underline">Terms of Service</a>
              <a href="#faq" className="hover:underline">FAQ Directory</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
