import fs from 'fs';
import path from 'path';
import { Team, Player, Match, Stadium, NewsArticle, User, TicketBooking, AnalyticsSummary, TournamentConfig, Notification } from '../types.js';
import { initialTeams, initialPlayers, initialStadiums, initialMatches, initialNews, initialUser, initialAnalytics } from './initialData.js';

const DB_FILE = path.join(process.cwd(), 'database_wfc_2026.json');

interface Schema {
  teams: Team[];
  players: Player[];
  stadiums: Stadium[];
  matches: Match[];
  news: NewsArticle[];
  users: User[];
  bookings: TicketBooking[];
  analytics: AnalyticsSummary;
  config: TournamentConfig;
}

class DbStore {
  private cache: Schema | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.cache = JSON.parse(raw);
        console.log('[DB] Database loaded successfully from file.');
      } else {
        console.log('[DB] Database file not found. Seeding initial data...');
        this.seed();
      }
    } catch (e) {
      console.error('[DB] Error initializing database. Falling back to memory mode.', e);
      this.seedMemory();
    }
  }

  private seed() {
    this.cache = {
      teams: initialTeams,
      players: initialPlayers,
      stadiums: initialStadiums,
      matches: initialMatches,
      news: initialNews,
      users: [initialUser],
      bookings: [],
      analytics: initialAnalytics,
      config: {
        countdownDate: '2026-06-11T12:00:00.000Z',
        ticketSalesOpen: true,
        announcement: 'Ticket bookings are officially OPEN for the Knockout Stages! Reserve your stadium seat today.'
      }
    };
    this.save();
  }

  private seedMemory() {
    this.cache = {
      teams: initialTeams,
      players: initialPlayers,
      stadiums: initialStadiums,
      matches: initialMatches,
      news: initialNews,
      users: [initialUser],
      bookings: [],
      analytics: initialAnalytics,
      config: {
        countdownDate: '2026-06-11T12:00:00.000Z',
        ticketSalesOpen: true,
        announcement: 'Ticket bookings are officially OPEN for the Knockout Stages! Reserve your stadium seat today.'
      }
    };
  }

  private save() {
    if (!this.cache) return;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.cache, null, 2), 'utf8');
    } catch (e) {
      console.error('[DB] Error writing database to file.', e);
    }
  }

  // API Methods
  public getTeams(): Team[] {
    return this.cache?.teams || [];
  }

  public setTeams(teams: Team[]) {
    if (this.cache) {
      this.cache.teams = teams;
      this.save();
    }
  }

  public getPlayers(): Player[] {
    return this.cache?.players || [];
  }

  public setPlayers(players: Player[]) {
    if (this.cache) {
      this.cache.players = players;
      this.save();
    }
  }

  public getStadiums(): Stadium[] {
    return this.cache?.stadiums || [];
  }

  public setStadiums(stadiums: Stadium[]) {
    if (this.cache) {
      this.cache.stadiums = stadiums;
      this.save();
    }
  }

  public getMatches(): Match[] {
    return this.cache?.matches || [];
  }

  public setMatches(matches: Match[]) {
    if (this.cache) {
      this.cache.matches = matches;
      this.save();
    }
  }

  public getNews(): NewsArticle[] {
    return this.cache?.news || [];
  }

  public setNews(news: NewsArticle[]) {
    if (this.cache) {
      this.cache.news = news;
      this.save();
    }
  }

  public getUsers(): User[] {
    return this.cache?.users || [];
  }

  public setUsers(users: User[]) {
    if (this.cache) {
      this.cache.users = users;
      this.save();
    }
  }

  public getBookings(): TicketBooking[] {
    return this.cache?.bookings || [];
  }

  public addBooking(booking: TicketBooking) {
    if (this.cache) {
      this.cache.bookings.push(booking);
      this.save();
    }
  }

  public getAnalytics(): AnalyticsSummary {
    return this.cache?.analytics || {
      dailyVisitors: [0, 0, 0, 0, 0, 0, 0],
      matchAttendance: [],
      ticketSales: [],
      revenue: 0,
      userRegistrations: 0
    };
  }

  public setAnalytics(analytics: AnalyticsSummary) {
    if (this.cache) {
      this.cache.analytics = analytics;
      this.save();
    }
  }

  public getConfig(): TournamentConfig {
    return this.cache?.config || { countdownDate: '2026-06-11T12:00:00.000Z', ticketSalesOpen: true, announcement: '' };
  }

  public setConfig(config: TournamentConfig) {
    if (this.cache) {
      this.cache.config = config;
      this.save();
    }
  }
}

export const db = new DbStore();
