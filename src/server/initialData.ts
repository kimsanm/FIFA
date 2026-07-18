import { Team, Player, Match, Stadium, NewsArticle, User, AnalyticsSummary } from '../types.js';

export const initialTeams: Team[] = [
  { id: 't1', name: 'United States', code: 'USA', flag: '🇺🇸', group: 'Group A', rank: 11, coach: 'Mauricio Pochettino', points: 6, wins: 2, draws: 0, losses: 0, goalsFor: 4, goalsAgainst: 1, played: 2 },
  { id: 't2', name: 'France', code: 'FRA', flag: '🇫🇷', group: 'Group B', rank: 2, coach: 'Didier Deschamps', points: 4, wins: 1, draws: 1, losses: 0, goalsFor: 3, goalsAgainst: 1, played: 2 },
  { id: 't3', name: 'Brazil', code: 'BRA', flag: '🇧🇷', group: 'Group C', rank: 5, coach: 'Dorival Júnior', points: 6, wins: 2, draws: 0, losses: 0, goalsFor: 5, goalsAgainst: 0, played: 2 },
  { id: 't4', name: 'Argentina', code: 'ARG', flag: '🇦🇷', group: 'Group D', rank: 1, coach: 'Lionel Scaloni', points: 6, wins: 2, draws: 0, losses: 0, goalsFor: 6, goalsAgainst: 2, played: 2 },
  { id: 't5', name: 'Germany', code: 'GER', flag: '🇩🇪', group: 'Group A', rank: 16, coach: 'Julian Nagelsmann', points: 3, wins: 1, draws: 0, losses: 1, goalsFor: 3, goalsAgainst: 3, played: 2 },
  { id: 't6', name: 'Japan', code: 'JPN', flag: '🇯🇵', group: 'Group B', rank: 15, coach: 'Hajime Moriyasu', points: 4, wins: 1, draws: 1, losses: 0, goalsFor: 2, goalsAgainst: 1, played: 2 },
  { id: 't7', name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'Group C', rank: 4, coach: 'Thomas Tuchel', points: 3, wins: 1, draws: 0, losses: 1, goalsFor: 2, goalsAgainst: 2, played: 2 },
  { id: 't8', name: 'Spain', code: 'ESP', flag: '🇪🇸', group: 'Group D', rank: 3, coach: 'Luis de la Fuente', points: 3, wins: 1, draws: 0, losses: 1, goalsFor: 4, goalsAgainst: 3, played: 2 },
  { id: 't9', name: 'Mexico', code: 'MEX', flag: '🇲🇽', group: 'Group A', rank: 17, coach: 'Javier Aguirre', points: 3, wins: 1, draws: 0, losses: 1, goalsFor: 2, goalsAgainst: 2, played: 2 },
  { id: 't10', name: 'Canada', code: 'CAN', flag: '🇨🇦', group: 'Group B', rank: 35, coach: 'Jesse Marsch', points: 1, wins: 0, draws: 1, losses: 1, goalsFor: 1, goalsAgainst: 3, played: 2 },
  { id: 't11', name: 'South Korea', code: 'KOR', flag: '🇰🇷', group: 'Group C', rank: 22, coach: 'Hong Myung-bo', points: 3, wins: 1, draws: 0, losses: 1, goalsFor: 2, goalsAgainst: 3, played: 2 },
  { id: 't12', name: 'Cambodia', code: 'KHM', flag: '🇰🇭', group: 'Group D', rank: 178, coach: 'Koji Gyotoku', points: 3, wins: 1, draws: 0, losses: 1, goalsFor: 3, goalsAgainst: 5, played: 2 },
  { id: 't13', name: 'Italy', code: 'ITA', flag: '🇮🇹', group: 'Group A', rank: 9, coach: 'Luciano Spalletti', points: 0, wins: 0, draws: 0, losses: 2, goalsFor: 1, goalsAgainst: 4, played: 2 },
  { id: 't14', name: 'Morocco', code: 'MAR', flag: '🇲🇦', group: 'Group B', rank: 13, coach: 'Walid Regragui', points: 1, wins: 0, draws: 1, losses: 1, goalsFor: 1, goalsAgainst: 3, played: 2 },
  { id: 't15', name: 'Australia', code: 'AUS', flag: '🇦🇺', group: 'Group C', rank: 24, coach: 'Tony Popovic', points: 0, wins: 0, draws: 0, losses: 2, goalsFor: 0, goalsAgainst: 4, played: 2 },
  { id: 't16', name: 'China', code: 'CHN', flag: '🇨🇳', group: 'Group D', rank: 90, coach: 'Branko Ivanković', points: 0, wins: 0, draws: 0, losses: 2, goalsFor: 1, goalsAgainst: 5, played: 2 }
];

export const initialPlayers: Player[] = [
  // USA
  { id: 'p1', name: 'Christian Pulisic', teamId: 't1', position: 'Forward', age: 27, height: '178cm', weight: '73kg', club: 'AC Milan', number: 10, goals: 3, assists: 1, yellowCards: 0, redCards: 0, rating: 8.5 },
  { id: 'p2', name: 'Folarin Balogun', teamId: 't1', position: 'Forward', age: 24, height: '178cm', weight: '75kg', club: 'Monaco', number: 9, goals: 1, assists: 1, yellowCards: 1, redCards: 0, rating: 7.2 },
  { id: 'p3', name: 'Weston McKennie', teamId: 't1', position: 'Midfielder', age: 27, height: '185cm', weight: '84kg', club: 'Juventus', number: 8, goals: 0, assists: 2, yellowCards: 0, redCards: 0, rating: 7.8 },
  // France
  { id: 'p4', name: 'Kylian Mbappé', teamId: 't2', position: 'Forward', age: 27, height: '178cm', weight: '75kg', club: 'Real Madrid', number: 10, goals: 2, assists: 1, yellowCards: 0, redCards: 0, rating: 8.9 },
  { id: 'p5', name: 'Antoine Griezmann', teamId: 't2', position: 'Midfielder', age: 35, height: '176cm', weight: '73kg', club: 'Atlético Madrid', number: 7, goals: 1, assists: 2, yellowCards: 1, redCards: 0, rating: 8.2 },
  // Brazil
  { id: 'p6', name: 'Vinícius Júnior', teamId: 't3', position: 'Forward', age: 25, height: '176cm', weight: '73kg', club: 'Real Madrid', number: 7, goals: 3, assists: 0, yellowCards: 0, redCards: 0, rating: 9.1 },
  { id: 'p7', name: 'Rodrygo', teamId: 't3', position: 'Forward', age: 25, height: '174cm', weight: '64kg', club: 'Real Madrid', number: 11, goals: 1, assists: 2, yellowCards: 0, redCards: 0, rating: 8.3 },
  // Argentina
  { id: 'p8', name: 'Lionel Messi', teamId: 't4', position: 'Forward', age: 39, height: '170cm', weight: '72kg', club: 'Inter Miami', number: 10, goals: 4, assists: 3, yellowCards: 0, redCards: 0, rating: 9.4 },
  { id: 'p9', name: 'Lautaro Martínez', teamId: 't4', position: 'Forward', age: 28, height: '174cm', weight: '72kg', club: 'Inter Milan', number: 22, goals: 2, assists: 0, yellowCards: 0, redCards: 0, rating: 7.9 },
  // Germany
  { id: 'p10', name: 'Jamal Musiala', teamId: 't5', position: 'Midfielder', age: 23, height: '184cm', weight: '72kg', club: 'Bayern Munich', number: 10, goals: 1, assists: 1, yellowCards: 0, redCards: 0, rating: 8.4 },
  { id: 'p11', name: 'Florian Wirtz', teamId: 't5', position: 'Midfielder', age: 23, height: '175cm', weight: '70kg', club: 'Bayer Leverkusen', number: 17, goals: 2, assists: 0, yellowCards: 0, redCards: 0, rating: 8.3 },
  // Japan
  { id: 'p12', name: 'Kaoru Mitoma', teamId: 't6', position: 'Forward', age: 29, height: '178cm', weight: '71kg', club: 'Brighton', number: 7, goals: 1, assists: 1, yellowCards: 0, redCards: 0, rating: 8.0 },
  { id: 'p13', name: 'Takefusa Kubo', teamId: 't6', position: 'Midfielder', age: 25, height: '173cm', weight: '67kg', club: 'Real Sociedad', number: 20, goals: 1, assists: 0, yellowCards: 1, redCards: 0, rating: 7.6 },
  // England
  { id: 'p14', name: 'Jude Bellingham', teamId: 't7', position: 'Midfielder', age: 23, height: '186cm', weight: '75kg', club: 'Real Madrid', number: 10, goals: 1, assists: 1, yellowCards: 1, redCards: 0, rating: 8.6 },
  { id: 'p15', name: 'Harry Kane', teamId: 't7', position: 'Forward', age: 32, height: '188cm', weight: '86kg', club: 'Bayern Munich', number: 9, goals: 1, assists: 0, yellowCards: 0, redCards: 0, rating: 7.9 },
  // Spain
  { id: 'p16', name: 'Lamine Yamal', teamId: 't8', position: 'Forward', age: 18, height: '180cm', weight: '72kg', club: 'Barcelona', number: 19, goals: 2, assists: 2, yellowCards: 0, redCards: 0, rating: 8.8 },
  { id: 'p17', name: 'Nico Williams', teamId: 't8', position: 'Forward', age: 24, height: '181cm', weight: '76kg', club: 'Athletic Bilbao', number: 11, goals: 1, assists: 1, yellowCards: 0, redCards: 0, rating: 8.1 },
  // Cambodia (Angkor Warriors Star!)
  { id: 'p18', name: 'Chan Vathanaka', teamId: 't12', position: 'Forward', age: 32, height: '175cm', weight: '68kg', club: 'Boeung Ket', number: 11, goals: 2, assists: 1, yellowCards: 0, redCards: 0, rating: 7.9 },
  { id: 'p19', name: 'Lim Pisoth', teamId: 't12', position: 'Forward', age: 25, height: '172cm', weight: '65kg', club: 'Phnom Penh Crown', number: 7, goals: 1, assists: 1, yellowCards: 0, redCards: 0, rating: 7.1 }
];

export const initialStadiums: Stadium[] = [
  { id: 's1', name: 'MetLife Stadium', city: 'East Rutherford (NY/NJ)', country: 'USA', capacity: 82500, description: 'State-of-the-art open-air venue scheduled to host the grand final of the tournament.', weather: 'Clear Sky', temperature: '24°C', hotels: ['Hilton Meadowlands', 'Sheraton Plaza', 'Renaissance Hotel'] },
  { id: 's2', name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', capacity: 70240, description: 'Architectural wonder featuring an immersive dual-sided screen and translucent canopy.', weather: 'Sunny', temperature: '27°C', hotels: ['The Westin LAX', 'Hotel June', 'Sofi Plaza Inn'] },
  { id: 's3', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523, description: 'Historic cathedral of world football, hosting the opening match of the Championship.', weather: 'Partly Cloudy', temperature: '21°C', hotels: ['Camino Real Pedregal', 'Radisson Paraiso', 'Krystal Grand'] },
  { id: 's4', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500, description: 'Stunning retactable-roof stadium positioned on the beautiful Pacific harborfront.', weather: 'Light Rain', temperature: '16°C', hotels: ['Georgian Court', 'Hotel Blu', 'The Sandman Signature'] },
  { id: 's5', name: 'Olympic Stadium', city: 'Phnom Penh (Tribute Host)', country: 'Cambodia', capacity: 50000, description: 'Iconic mid-century masterpiece, hosting honorary exhibition games & international celebrations.', weather: 'Tropical Humid', temperature: '31°C', hotels: ['Rosewood Phnom Penh', 'Sofitel Phokeethra', 'Palace Gate Resort'] }
];

export const initialMatches: Match[] = [
  // Finished Matches
  {
    id: 'm1',
    homeTeamId: 't1',
    awayTeamId: 't5',
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    date: '2026-06-12',
    time: '18:00',
    group: 'Group A',
    round: 'Group Stage',
    stadiumId: 's1',
    events: [
      { id: 'e1', minute: 14, type: 'goal', teamId: 't1', playerName: 'Christian Pulisic', detail: 'Screamer from outside the box!' },
      { id: 'e2', minute: 42, type: 'goal', teamId: 't5', playerName: 'Florian Wirtz', detail: 'Tap-in after goalie rebound' },
      { id: 'e3', minute: 78, type: 'goal', teamId: 't1', playerName: 'Folarin Balogun', detail: 'Assist by McKennie' },
      { id: 'e4', minute: 82, type: 'card_yellow', teamId: 't5', playerName: 'Jamal Musiala', detail: 'Tactical foul' }
    ],
    stats: {
      possession: { home: 48, away: 52 },
      shots: { home: 12, away: 14 },
      shotsOnTarget: { home: 6, away: 5 },
      corners: { home: 4, away: 8 },
      offsides: { home: 2, away: 1 },
      fouls: { home: 11, away: 10 },
      passCompletion: { home: 83, away: 85 }
    }
  },
  {
    id: 'm2',
    homeTeamId: 't4',
    awayTeamId: 't12',
    homeScore: 4,
    awayScore: 2,
    status: 'finished',
    date: '2026-06-13',
    time: '20:00',
    group: 'Group D',
    round: 'Group Stage',
    stadiumId: 's3',
    events: [
      { id: 'e5', minute: 9, type: 'goal', teamId: 't4', playerName: 'Lionel Messi', detail: 'Direct free-kick into top corner!' },
      { id: 'e6', minute: 22, type: 'goal', teamId: 't12', playerName: 'Chan Vathanaka', detail: 'Sensational solo counter-attack goal!' },
      { id: 'e7', minute: 34, type: 'goal', teamId: 't4', playerName: 'Lautaro Martínez', detail: 'Headed from a corner kick' },
      { id: 'e8', minute: 58, type: 'goal', teamId: 't4', playerName: 'Lionel Messi', detail: 'Penalty kick conversion' },
      { id: 'e9', minute: 71, type: 'goal', teamId: 't12', playerName: 'Lim Pisoth', detail: 'Beautiful curler past the keeper' },
      { id: 'e10', minute: 88, type: 'goal', teamId: 't4', playerName: 'Lautaro Martínez', detail: 'Assisted by Messi' }
    ],
    stats: {
      possession: { home: 68, away: 32 },
      shots: { home: 22, away: 8 },
      shotsOnTarget: { home: 11, away: 4 },
      corners: { home: 9, away: 2 },
      offsides: { home: 4, away: 3 },
      fouls: { home: 6, away: 12 },
      passCompletion: { home: 90, away: 68 }
    }
  },
  // Live Matches (Active right now!)
  {
    id: 'm3',
    homeTeamId: 't2',
    awayTeamId: 't6',
    homeScore: 1,
    awayScore: 1,
    status: 'live',
    date: '2026-07-17',
    time: '16:00',
    group: 'Group B',
    round: 'Group Stage',
    stadiumId: 's2',
    events: [
      { id: 'e11', minute: 28, type: 'goal', teamId: 't2', playerName: 'Kylian Mbappé', detail: 'Powerful shot inside near post' },
      { id: 'e12', minute: 55, type: 'goal', teamId: 't6', playerName: 'Kaoru Mitoma', detail: 'Incredible dribble and finish' },
      { id: 'e13', minute: 72, type: 'var', teamId: 't2', playerName: 'Antoine Griezmann', detail: 'Goal disallowed for offside after VAR review' }
    ],
    stats: {
      possession: { home: 54, away: 46 },
      shots: { home: 9, away: 8 },
      shotsOnTarget: { home: 4, away: 3 },
      corners: { home: 5, away: 4 },
      offsides: { home: 3, away: 1 },
      fouls: { home: 8, away: 9 },
      passCompletion: { home: 87, away: 81 }
    }
  },
  // Scheduled Matches
  {
    id: 'm4',
    homeTeamId: 't3',
    awayTeamId: 't7',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: '2026-07-18',
    time: '15:00',
    group: 'Group C',
    round: 'Group Stage',
    stadiumId: 's4',
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      offsides: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 }
    }
  },
  {
    id: 'm5',
    homeTeamId: 't12',
    awayTeamId: 't16',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: '2026-07-19',
    time: '18:00',
    group: 'Group D',
    round: 'Group Stage',
    stadiumId: 's5',
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      offsides: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 }
    }
  },
  // Knockout stage matches (simulated templates)
  {
    id: 'm_ko1',
    homeTeamId: 't1', // USA
    awayTeamId: 't6', // JPN
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: '2026-07-24',
    time: '20:00',
    round: 'Round of 16',
    stadiumId: 's1',
    events: [],
    stats: { possession: { home: 0, away: 0 }, shots: { home: 0, away: 0 }, shotsOnTarget: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 }, fouls: { home: 0, away: 0 } }
  },
  {
    id: 'm_ko2',
    homeTeamId: 't3', // BRA
    awayTeamId: 't2', // FRA
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    date: '2026-07-25',
    time: '20:00',
    round: 'Quarter-Finals',
    stadiumId: 's2',
    events: [],
    stats: { possession: { home: 0, away: 0 }, shots: { home: 0, away: 0 }, shotsOnTarget: { home: 0, away: 0 }, corners: { home: 0, away: 0 }, offsides: { home: 0, away: 0 }, fouls: { home: 0, away: 0 } }
  }
];

export const initialNews: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Christian Pulisic Screamer Propels USA Past Germany in Group A Climax',
    category: 'Match Report',
    content: 'An incredible 25-yard curling strike from captain Christian Pulisic in the 14th minute galvanized MetLife Stadium as the United States secured a decisive 2-1 victory over Germany. Weston McKennie was a maestro in midfield, dishing two elegant assists. Despite a late tap-in from German marvel Florian Wirtz, Folarin Balogun sealed the deal for the Red, White, and Blue in front of a record-breaking sell-out crowd.',
    date: '2026-07-16',
    likes: 1240,
    readTime: '4 min read',
    tags: ['USA', 'Germany', 'Group A', 'Pulisic'],
    comments: [
      { id: 'c1', userName: 'JohnSoccer99', avatar: '🦁', content: 'What a hit by Captain America! Best game ever!', date: '2026-07-16' },
      { id: 'c2', userName: 'El_Trigre', avatar: '🦅', content: 'Incredible atmosphere at MetLife. USA looks real scary in this tournament.', date: '2026-07-16' }
    ]
  },
  {
    id: 'n2',
    title: 'Argentina vs Cambodia: Lionel Messi and Chan Vathanaka Swap Shirts After 6-Goal Classic',
    category: 'Interview',
    content: 'In what has been hailed as the most joyful match of the group stages, Argentina overcame a spirited Cambodia 4-2 in Mexico City. After the match, legendary forward Lionel Messi exchanged shirts with Cambodia’s beloved star Chan Vathanaka. "They played with absolute heart and beautiful passing," Messi remarked. Chan Vathanaka was ecstatic: "To play against the greatest of all time and score a goal at the Azteca is a dream I will cherish forever."',
    date: '2026-07-15',
    likes: 3105,
    readTime: '6 min read',
    tags: ['Argentina', 'Cambodia', 'Messi', 'Vathanaka', 'Azteca'],
    comments: [
      { id: 'c3', userName: 'PhnomPenhUltra', avatar: '🐅', content: 'So proud of our Angkor Warriors! scoring 2 against world champions is legendary!', date: '2026-07-15' },
      { id: 'c4', userName: 'LaAlbiceleste', avatar: '🔟', content: 'True sportsmanship! Messi has so much respect for other players. Great match.', date: '2026-07-15' }
    ]
  },
  {
    id: 'n3',
    title: 'Mbappé Declared Fully Fit After Ankle Scare Prior to Knockouts',
    category: 'Injury',
    content: 'France manager Didier Deschamps confirmed that star striker Kylian Mbappé has completed a full training session with no discomfort following a mild ankle twist. "Kylian is 100% and ready to lead our front line," Deschamps stated. Les Bleus fans around the world breathed a collective sigh of relief as France prepares to enter the high-stakes single-elimination phase next week.',
    date: '2026-07-14',
    likes: 850,
    readTime: '3 min read',
    tags: ['France', 'Mbappé', 'Injury Update'],
    comments: []
  },
  {
    id: 'n4',
    title: 'FIFA Commends Host Cities for Seamless High-Speed Transportation Network',
    category: 'Announcement',
    content: 'The 2026 World Football Championship Organizing Committee has received pristine marks from international audits regarding the host countries’ transport systems. High-speed rail connections, free fan shuttles, and zero-emission city buses have successfully moved over 1.2 million supporters between fan zones, city centers, and stadiums with minimal delay and maximum comfort.',
    date: '2026-07-13',
    likes: 620,
    readTime: '3 min read',
    tags: ['Hosting', 'Transport', 'Sustainability'],
    comments: []
  }
];

export const initialUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'v4udevelop.app@gmail.com',
  role: 'admin', // Make user admin by default to allow exploring the admin panel easily
  favoriteTeams: ['t1', 't12'], // USA and Cambodia
  favoritePlayers: ['p1', 'p18'], // Pulisic and Chan Vathanaka
  avatar: '👤',
  isVerified: true,
  notifications: [
    { id: 'notif1', title: 'Ticket Confirmed!', content: 'Your Category 1 ticket for USA vs Germany has been issued successfully.', date: '2026-07-16', read: false },
    { id: 'notif2', title: 'Live Match Alert', content: 'France vs Japan is live right now! Click to watch line-ups and stats.', date: '2026-07-17', read: true }
  ]
};

export const initialAnalytics: AnalyticsSummary = {
  dailyVisitors: [12000, 15400, 19200, 24500, 21000, 28000, 32000],
  matchAttendance: [
    { name: 'USA vs GER', attendance: 82500 },
    { name: 'ARG vs KHM', attendance: 87523 },
    { name: 'FRA vs JPN', attendance: 68400 }
  ],
  ticketSales: [
    { name: 'VIP', count: 450 },
    { name: 'Category 1', count: 1800 },
    { name: 'Category 2', count: 3200 },
    { name: 'Category 3', count: 5400 }
  ],
  revenue: 1548000,
  userRegistrations: 1420
};
