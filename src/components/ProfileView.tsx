import React from 'react';
import { User, Ticket, Star, Bell, ShieldAlert, BadgeCheck, ClipboardList } from 'lucide-react';
import { User as UserType, Team, Player, TicketBooking, Match } from '../types.js';

interface ProfileViewProps {
  currentUser: UserType | null;
  teams: Team[];
  players: Player[];
  matches: Match[];
  bookings: TicketBooking[];
  onToggleFavoriteTeam: (teamId: string) => void;
  onToggleFavoritePlayer: (playerId: string) => void;
  onSelectBooking: (booking: TicketBooking) => void;
}

export default function ProfileView({
  currentUser,
  teams,
  players,
  matches,
  bookings,
  onToggleFavoriteTeam,
  onToggleFavoritePlayer,
  onSelectBooking
}: ProfileViewProps) {
  if (!currentUser) return null;

  const userBookings = bookings.filter(b => b.userId === currentUser.id);

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown';
  const getTeamCode = (id: string) => teams.find(t => t.id === id)?.code || 'UNK';
  const getTeamFlag = (id: string) => teams.find(t => t.id === id)?.flag || '🏳️';

  const getMatchName = (matchId: string) => {
    const m = matches.find(match => match.id === matchId);
    if (!m) return 'Unknown Match';
    const homeName = getTeamName(m.homeTeamId);
    const awayName = getTeamName(m.awayTeamId);
    return `${homeName} vs ${awayName}`;
  };

  const getPlayerDetails = (pId: string) => {
    return players.find(p => p.id === pId);
  };

  return (
    <div className="space-y-6" id="profile-section">
      
      {/* Title */}
      <div>
        <h2 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
          Supporter Clubhouse & Profiles
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your verified account preferences, review boarding passes, and follow your favorite superstars.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Supporter Info & Notifications (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card profile */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-lime-400 text-slate-950 font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded-bl">
              Verified Fan
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl rounded-2xl bg-slate-950 p-4 border border-slate-850">{currentUser.avatar}</span>
              <div>
                <div className="flex items-center space-x-1">
                  <h3 className="font-sans text-base font-black text-white">{currentUser.name}</h3>
                  <BadgeCheck className="h-4.5 w-4.5 text-lime-400 shrink-0" />
                </div>
                <p className="font-mono text-[10px] text-slate-400">{currentUser.email}</p>
                <span className="inline-block mt-2 rounded bg-lime-400/10 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-lime-400 border border-lime-400/20">
                  {currentUser.role.toUpperCase()} ACCOUNT
                </span>
              </div>
            </div>
          </div>

          {/* Notifications logs list */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur shadow-xl space-y-4">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
              <Bell className="h-4.5 w-4.5 text-lime-400" />
              <span>Notification Inbox Logs</span>
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {currentUser.notifications.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2 text-center">Your notification tray is clean.</p>
              ) : (
                currentUser.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-2xl border p-3.5 space-y-1 ${
                      notif.read
                        ? 'border-slate-900 bg-slate-950/20 text-slate-400'
                        : 'border-lime-400/20 bg-lime-400/5 text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="font-bold">{notif.title}</span>
                      <span className="text-slate-500">{notif.date}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">{notif.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Bookings, Stars & Favorites (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Bookings log */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 md:p-6 backdrop-blur shadow-xl space-y-4">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
              <Ticket className="h-4.5 w-4.5 text-lime-400" />
              <span>My Active Boarding Passes ({userBookings.length})</span>
            </h3>

            {userBookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-850 rounded-2xl bg-slate-950/20">
                <ClipboardList className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs font-bold font-mono uppercase text-slate-400">No Reservations Yet</p>
                <p className="text-[11px] text-slate-500 mt-1">Book your tickets inside our live Ticketing Simulator center!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onSelectBooking(b)}
                    className="group rounded-2xl border border-slate-850 bg-slate-950/60 p-4 hover:border-lime-400 hover:bg-slate-950 cursor-pointer transition-all space-y-2 relative"
                  >
                    <div className="flex justify-between text-[10px] font-mono text-lime-400 font-bold uppercase">
                      <span>{b.category}</span>
                      <span>SEC: {b.seatNumber}</span>
                    </div>
                    
                    <h4 className="font-sans text-xs font-black text-slate-200 truncate group-hover:text-white transition-colors">
                      {getMatchName(b.matchId)}
                    </h4>

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900/60 mt-2">
                      <span>{b.bookingDate}</span>
                      <span className="font-bold text-lime-400/80">REPRINT PASS →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Teams & Stars Tracker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Fav Teams */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur shadow-xl space-y-4">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
                <Star className="h-4.5 w-4.5 text-yellow-400" />
                <span>My Followed Teams ({currentUser.favoriteTeams.length})</span>
              </h3>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                {currentUser.favoriteTeams.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No favorite teams added yet.</p>
                ) : (
                  currentUser.favoriteTeams.map((teamId) => {
                    const team = teams.find(t => t.id === teamId);
                    if (!team) return null;
                    return (
                      <div key={team.id} className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-900">
                        <div className="flex items-center space-x-2.5 text-xs font-sans">
                          <span className="text-xl filter drop-shadow">{team.flag}</span>
                          <span className="font-bold text-slate-200">{team.name} ({team.code})</span>
                        </div>
                        <button
                          onClick={() => onToggleFavoriteTeam(team.id)}
                          className="text-[9px] font-mono font-bold uppercase text-red-400 hover:underline"
                        >
                          Unfollow
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Fav Players */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur shadow-xl space-y-4">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 border-b border-slate-850 pb-3">
                <Star className="h-4.5 w-4.5 text-yellow-400" />
                <span>My Followed Players ({currentUser.favoritePlayers.length})</span>
              </h3>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                {currentUser.favoritePlayers.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">No favorite players followed yet.</p>
                ) : (
                  currentUser.favoritePlayers.map((playerId) => {
                    const player = getPlayerDetails(playerId);
                    if (!player) return null;
                    return (
                      <div key={player.id} className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-900">
                        <div className="min-w-0">
                          <span className="block font-sans text-xs font-bold text-slate-200 truncate">{player.name}</span>
                          <span className="block text-[8px] font-mono text-slate-500 uppercase mt-0.5">{player.position} • No. {player.number}</span>
                        </div>
                        <button
                          onClick={() => onToggleFavoritePlayer(player.id)}
                          className="text-[9px] font-mono font-bold uppercase text-red-400 hover:underline"
                        >
                          Unfollow
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
