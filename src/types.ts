export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  favoriteTeams: string[]; // Team IDs
  favoritePlayers: string[]; // Player IDs
  avatar: string;
  isVerified: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
}

export interface Team {
  id: string;
  name: string;
  code: string; // e.g., 'USA', 'FRA'
  flag: string; // Emoji or visual representation
  group: string; // e.g., 'Group A'
  rank: number;
  coach: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  played: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  age: number;
  height: string;
  weight: string;
  club: string;
  number: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'card_yellow' | 'card_red' | 'substitute' | 'var';
  teamId: string;
  playerName: string;
  detail?: string; // e.g., 'Assist by Griezmann', 'VAR: Goal Allowed'
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  offsides: { home: number; away: number };
  fouls: { home: number; away: number };
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished';
  date: string;
  time: string;
  group?: string; // e.g., 'Group A'
  round: 'Group Stage' | 'Round of 16' | 'Quarter-Finals' | 'Semi-Finals' | 'Third-Place' | 'Final';
  stadiumId: string;
  events: MatchEvent[];
  stats: MatchStats;
}

export interface VideoHighlightEvent {
  minute: number;
  title: string;
  description: string;
  timestamp: number; // point in simulated video (seconds)
}

export interface VideoHighlight {
  id: string;
  matchId: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  keyEvents: VideoHighlightEvent[];
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  description: string;
  weather: string;
  temperature: string;
  hotels: string[];
}

export interface Comment {
  id: string;
  userName: string;
  avatar: string;
  content: string;
  date: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Match Report' | 'Transfer' | 'Injury' | 'Interview' | 'Announcement';
  content: string;
  date: string;
  likes: number;
  readTime: string;
  tags: string[];
  comments: Comment[];
}

export interface TicketCategory {
  name: 'Category 1' | 'Category 2' | 'Category 3' | 'VIP';
  price: number;
  color: string;
}

export interface TicketBooking {
  id: string;
  userId: string;
  matchId: string;
  stadiumId: string;
  category: string;
  seatNumber: string;
  price: number;
  bookingDate: string;
  qrCode: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface TournamentConfig {
  countdownDate: string;
  ticketSalesOpen: boolean;
  announcement: string;
}

export interface AnalyticsSummary {
  dailyVisitors: number[];
  matchAttendance: { name: string; attendance: number }[];
  ticketSales: { name: string; count: number }[];
  revenue: number;
  userRegistrations: number;
}
