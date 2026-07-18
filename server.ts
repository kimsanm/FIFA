import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/dbStore.js';
import { askTournamentCopilot } from './src/server/geminiService.js';
import { Match, MatchEvent, Team, TicketBooking, VideoHighlight } from './src/types.js';
import { initialMatches } from './src/server/initialData.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper: Recalculate standings for a group after score changes
  const recalculateStandings = () => {
    const teams = db.getTeams();
    const matches = db.getMatches();

    // Reset stats
    const teamMap: Record<string, Team> = {};
    teams.forEach(t => {
      teamMap[t.id] = {
        ...t,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };
    });

    // Loop finished matches to compute
    matches.forEach(m => {
      if (m.status !== 'finished' || m.round !== 'Group Stage') return;
      const home = teamMap[m.homeTeamId];
      const away = teamMap[m.awayTeamId];
      if (!home || !away) return;

      home.played += 1;
      away.played += 1;
      home.goalsFor += m.homeScore;
      home.goalsAgainst += m.awayScore;
      away.goalsFor += m.awayScore;
      away.goalsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        home.wins += 1;
        home.points += 3;
        away.losses += 1;
      } else if (m.awayScore > m.homeScore) {
        away.wins += 1;
        away.points += 3;
        home.losses += 1;
      } else {
        home.draws += 1;
        home.points += 1;
        away.draws += 1;
        away.points += 1;
      }
    });

    db.setTeams(Object.values(teamMap));
  };

  // API 1: Teams
  app.get('/api/teams', (req, res) => {
    res.json(db.getTeams());
  });

  // API 2: Players
  app.get('/api/players', (req, res) => {
    res.json(db.getPlayers());
  });

  // API 3: Stadiums
  app.get('/api/stadiums', (req, res) => {
    res.json(db.getStadiums());
  });

  // API 4: Matches
  app.get('/api/matches', (req, res) => {
    res.json(db.getMatches());
  });

  // API 5: Update Match Score (Admin Control)
  app.post('/api/matches/:id/score', (req, res) => {
    const { id } = req.params;
    const { homeScore, awayScore, status } = req.body;

    const matches = db.getMatches();
    const matchIdx = matches.findIndex(m => m.id === id);

    if (matchIdx === -1) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matches[matchIdx];
    match.homeScore = Number(homeScore);
    match.awayScore = Number(awayScore);
    if (status) {
      match.status = status;
    }

    // Trigger score change events dynamically if score increases and match is live
    if (status === 'live' || match.status === 'live') {
      const homeTeam = db.getTeams().find(t => t.id === match.homeTeamId);
      const awayTeam = db.getTeams().find(t => t.id === match.awayTeamId);
      
      const newEvent: MatchEvent = {
        id: `event_${Date.now()}`,
        minute: Math.floor(Math.random() * 30) + 60, // random late minute
        type: 'goal',
        teamId: Math.random() > 0.5 ? match.homeTeamId : match.awayTeamId,
        playerName: 'Substitute Forward',
        detail: 'Brilliant tap-in after an administrative action!'
      };
      
      const teamName = newEvent.teamId === match.homeTeamId ? homeTeam?.name : awayTeam?.name;
      newEvent.playerName = newEvent.teamId === match.homeTeamId 
        ? (db.getPlayers().find(p => p.teamId === match.homeTeamId)?.name || 'Striker')
        : (db.getPlayers().find(p => p.teamId === match.awayTeamId)?.name || 'Striker');
      
      newEvent.detail = `Fantastic execution and finish for ${teamName}!`;
      match.events.push(newEvent);
    }

    db.setMatches(matches);
    recalculateStandings();

    // Log action to user notifications as an alert
    const users = db.getUsers();
    if (users[0]) {
      const homeTeam = db.getTeams().find(t => t.id === match.homeTeamId)?.name;
      const awayTeam = db.getTeams().find(t => t.id === match.awayTeamId)?.name;
      users[0].notifications.unshift({
        id: `notif_${Date.now()}`,
        title: 'Match Status Updated!',
        content: `Match ${homeTeam} vs ${awayTeam} score updated to ${homeScore}-${awayScore} (${match.status.toUpperCase()}).`,
        date: new Date().toLocaleDateString(),
        read: false
      });
      db.setUsers(users);
    }

    res.json(match);
  });

  // API 6: Add Match Event
  app.post('/api/matches/:id/event', (req, res) => {
    const { id } = req.params;
    const { type, teamId, playerName, minute, detail } = req.body;

    const matches = db.getMatches();
    const match = matches.find(m => m.id === id);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const newEvent: MatchEvent = {
      id: `e_${Date.now()}`,
      minute: Number(minute) || 45,
      type,
      teamId,
      playerName,
      detail
    };

    match.events.push(newEvent);
    db.setMatches(matches);

    res.json(match);
  });

  // API 7: News Article List
  app.get('/api/news', (req, res) => {
    res.json(db.getNews());
  });

  // API 8: Like News Article
  app.post('/api/news/:id/like', (req, res) => {
    const { id } = req.params;
    const news = db.getNews();
    const article = news.find(n => n.id === id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    article.likes += 1;
    db.setNews(news);
    res.json(article);
  });

  // API 9: Add Comment to News Article
  app.post('/api/news/:id/comment', (req, res) => {
    const { id } = req.params;
    const { content, userName } = req.body;

    const news = db.getNews();
    const article = news.find(n => n.id === id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    article.comments.push({
      id: `comment_${Date.now()}`,
      userName: userName || 'Anonymous Fan',
      avatar: '⚽',
      content,
      date: new Date().toLocaleDateString()
    });

    db.setNews(news);
    res.json(article);
  });

  // API 10: Current User Profile
  app.get('/api/users/me', (req, res) => {
    const users = db.getUsers();
    // Return primary user or mock first
    res.json(users[0] || null);
  });

  // API 11: Toggle Favorites
  app.post('/api/users/favorites', (req, res) => {
    const { teamId, playerId } = req.body;
    const users = db.getUsers();
    const user = users[0];

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (teamId) {
      const idx = user.favoriteTeams.indexOf(teamId);
      if (idx > -1) {
        user.favoriteTeams.splice(idx, 1);
      } else {
        user.favoriteTeams.push(teamId);
      }
    }

    if (playerId) {
      const idx = user.favoritePlayers.indexOf(playerId);
      if (idx > -1) {
        user.favoritePlayers.splice(idx, 1);
      } else {
        user.favoritePlayers.push(playerId);
      }
    }

    db.setUsers(users);
    res.json(user);
  });

  // API 12: Ticket Booking Simulator
  app.post('/api/tickets/book', (req, res) => {
    const { matchId, stadiumId, category, seatNumber, price } = req.body;
    const users = db.getUsers();
    const user = users[0];

    if (!user) return res.status(404).json({ error: 'User not found' });

    const newBooking: TicketBooking = {
      id: `booking_${Date.now()}`,
      userId: user.id,
      matchId,
      stadiumId,
      category,
      seatNumber,
      price: Number(price),
      bookingDate: new Date().toLocaleDateString(),
      qrCode: `WFC26-${matchId}-${seatNumber}-${Math.floor(Math.random() * 900000 + 100000)}`,
      status: 'confirmed'
    };

    db.addBooking(newBooking);

    // Update user notifications
    const homeTeam = db.getTeams().find(t => t.id === db.getMatches().find(m => m.id === matchId)?.homeTeamId)?.name;
    const awayTeam = db.getTeams().find(t => t.id === db.getMatches().find(m => m.id === matchId)?.awayTeamId)?.name;
    
    user.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Ticket Booked Successfully!',
      content: `Your board pass for ${homeTeam} vs ${awayTeam} (${category}, Seat ${seatNumber}) is ready in your Profile.`,
      date: new Date().toLocaleDateString(),
      read: false
    });
    db.setUsers(users);

    // Update Analytics Revenue & Ticket Count
    const analytics = db.getAnalytics();
    analytics.revenue += Number(price);
    const catSale = analytics.ticketSales.find(c => c.name === category);
    if (catSale) {
      catSale.count += 1;
    } else {
      analytics.ticketSales.push({ name: category, count: 1 });
    }
    
    // Increment attendance dynamically
    const matchName = `${homeTeam?.slice(0, 3)?.toUpperCase()} vs ${awayTeam?.slice(0, 3)?.toUpperCase()}`;
    const matchAtt = analytics.matchAttendance.find(a => a.name === matchName);
    if (matchAtt) {
      matchAtt.attendance += 1;
    } else {
      analytics.matchAttendance.push({ name: matchName, attendance: 1 });
    }
    db.setAnalytics(analytics);

    res.json({ success: true, booking: newBooking });
  });

  // API 13: Read Bookings for Current User
  app.get('/api/tickets/my-bookings', (req, res) => {
    res.json(db.getBookings());
  });

  // API 14: Analytics Summary
  app.get('/api/analytics', (req, res) => {
    res.json(db.getAnalytics());
  });

  // API 15: AI Copilot Assistant Chat
  app.post('/api/ai/chat', async (req, res) => {
    const { prompt, history } = req.body;
    try {
      const reply = await askTournamentCopilot(prompt, history);
      res.json({ reply });
    } catch (err) {
      res.status(500).json({ error: 'AI Generation Failed' });
    }
  });

  // API 16: Admin Match Reset
  app.post('/api/admin/match/reset', (req, res) => {
    db.setMatches(initialMatches);
    recalculateStandings();
    res.json({ success: true, message: 'Matches state reset successfully!' });
  });

  // API 17: Save Tournament Configuration
  app.get('/api/config', (req, res) => {
    res.json(db.getConfig());
  });

  app.post('/api/config', (req, res) => {
    const { countdownDate, ticketSalesOpen, announcement } = req.body;
    const config = db.getConfig();
    if (countdownDate) config.countdownDate = countdownDate;
    if (ticketSalesOpen !== undefined) config.ticketSalesOpen = ticketSalesOpen;
    if (announcement !== undefined) config.announcement = announcement;
    db.setConfig(config);
    res.json(config);
  });

  // API 18: Get Match Highlights
  app.get('/api/matches/:id/highlights', (req, res) => {
    const { id } = req.params;
    const matches = db.getMatches();
    const match = matches.find(m => m.id === id);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status !== 'finished') {
      return res.status(400).json({ error: 'Highlights are only available for finished matches' });
    }

    const homeTeam = db.getTeams().find(t => t.id === match.homeTeamId);
    const awayTeam = db.getTeams().find(t => t.id === match.awayTeamId);
    const homeName = homeTeam?.name || 'Home Team';
    const awayName = awayTeam?.name || 'Away Team';

    let highlight: VideoHighlight | null = null;

    if (id === 'm1') {
      highlight = {
        id: 'hl_m1',
        matchId: 'm1',
        title: `${homeName} 2 - 1 ${awayName} | Official Match Highlights`,
        duration: '02:00',
        thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        keyEvents: [
          { minute: 14, title: '⚽ Goal! USA 1 - 0 GER', description: 'Christian Pulisic scores an absolute screamer from 25 yards!', timestamp: 15 },
          { minute: 42, title: '⚽ Goal! USA 1 - 1 GER', description: 'Florian Wirtz taps in after a quick rebound off the keeper.', timestamp: 48 },
          { minute: 78, title: '⚽ Goal! USA 2 - 1 GER', description: 'Folarin Balogun slots it home from a clever McKennie pass!', timestamp: 82 },
          { minute: 82, title: '🟨 Yellow Card', description: 'Jamal Musiala receives a card for a tactical foul on the counter.', timestamp: 105 }
        ]
      };
    } else if (id === 'm2') {
      highlight = {
        id: 'hl_m2',
        matchId: 'm2',
        title: `${homeName} 4 - 2 ${awayName} | Six-Goal Thriller Recap`,
        duration: '02:40',
        thumbnailUrl: 'https://images.unsplash.com/photo-1540747737956-37872404a82f?q=80&w=800&auto=format&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        keyEvents: [
          { minute: 9, title: '⚽ Goal! ARG 1 - 0 KHM', description: 'Lionel Messi curls an exquisite direct free-kick into the top corner.', timestamp: 12 },
          { minute: 22, title: '⚽ Goal! ARG 1 - 1 KHM', description: 'Chan Vathanaka finishes a sensational solo counter-attack goal!', timestamp: 44 },
          { minute: 34, title: '⚽ Goal! ARG 2 - 1 KHM', description: 'Lautaro Martínez heads it past the keeper from a pinpoint corner.', timestamp: 72 },
          { minute: 58, title: '⚽ Goal! ARG 3 - 1 KHM', description: 'Lionel Messi converts a penalty with clinical precision.', timestamp: 102 },
          { minute: 71, title: '⚽ Goal! ARG 3 - 2 KHM', description: 'Lim Pisoth curls a gorgeous shot into the far post.', timestamp: 128 },
          { minute: 88, title: '⚽ Goal! ARG 4 - 2 KHM', description: 'Lautaro Martínez completes his brace, assisted beautifully by Messi.', timestamp: 146 }
        ]
      };
    } else {
      const events = [...match.events].sort((a, b) => a.minute - b.minute);
      const keyEvents = events.map((evt, idx) => {
        let typeStr = '📢 Play';
        if (evt.type === 'goal') typeStr = '⚽ Goal!';
        else if (evt.type === 'card_yellow') typeStr = '🟨 Yellow Card';
        else if (evt.type === 'card_red') typeStr = '🟥 Red Card';
        else if (evt.type === 'substitute') typeStr = '🔄 Sub';
        else if (evt.type === 'var') typeStr = '🖥️ VAR';

        const teamCode = evt.teamId === match.homeTeamId ? (homeTeam?.code || 'HOME') : (awayTeam?.code || 'AWAY');
        return {
          minute: evt.minute,
          title: `${typeStr} - ${evt.playerName} (${teamCode})`,
          description: evt.detail || `Action event at minute ${evt.minute}`,
          timestamp: Math.min(25 + idx * 30, 110)
        };
      });

      if (keyEvents.length === 0) {
        keyEvents.push({
          minute: 45,
          title: '⚽ Mid-match summary',
          description: 'Tactical summary of the first-half actions.',
          timestamp: 30
        });
        keyEvents.push({
          minute: 90,
          title: '🏁 Full-Time whistle',
          description: 'The final whistle blows!',
          timestamp: 95
        });
      }

      highlight = {
        id: `hl_${id}`,
        matchId: id,
        title: `${homeName} vs ${awayName} | Match Highlights`,
        duration: '02:00',
        thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        keyEvents
      };
    }

    res.json(highlight);
  });

  // Vite Integration for Client SPA or Built Assets in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] World Football Championship 2026 Engine Running on http://localhost:${PORT}`);
  });
}

startServer();
