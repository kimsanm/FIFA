import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Ticket, MessageSquare, Newspaper, User, Settings, Bell, Menu, X, Landmark } from 'lucide-react';
import { User as UserType } from '../types.js';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserType | null;
  unreadNotifications: number;
  onOpenNotifications: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  unreadNotifications,
  onOpenNotifications
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Trophy },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'standings', label: 'Standings', icon: Landmark },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'guide', label: 'Stadium & Cities', icon: MapPin },
    { id: 'copilot', label: 'AI Copilot', icon: MessageSquare },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  if (currentUser?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: Settings });
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md" id="app-navbar">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick('home')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-emerald-600 shadow-md shadow-emerald-500/20">
            <Trophy className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-sans text-xl font-black tracking-tight text-white uppercase sm:inline-block">
              WFC <span className="text-lime-400">2026</span>
            </span>
            <span className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              Championship Hub
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-lime-400/10 text-lime-400 shadow-[inset_0_1px_0_0_rgba(163,230,53,0.1)]'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-lime-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Notification & User Actions */}
        <div className="flex items-center space-x-3">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationDropdown(!showNotificationDropdown);
                onOpenNotifications();
              }}
              className="relative rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-4.5 w-4.5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-mono text-[9px] font-bold text-white ring-2 ring-slate-950 animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Simple notification dropdown */}
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl ring-1 ring-black/5 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-sans text-sm font-bold text-white">Championship Alerts</h3>
                  <button 
                    className="text-xs text-lime-400 font-medium hover:underline"
                    onClick={() => {
                      setShowNotificationDropdown(false);
                      setActiveTab('profile');
                    }}
                  >
                    View All
                  </button>
                </div>
                <div className="mt-2 max-h-60 overflow-y-auto space-y-3">
                  {currentUser && currentUser.notifications.length > 0 ? (
                    currentUser.notifications.slice(0, 3).map((n) => (
                      <div key={n.id} className="text-xs border-b border-slate-800/50 pb-2">
                        <div className="flex justify-between font-bold text-slate-200">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{n.date}</span>
                        </div>
                        <p className="text-slate-400 mt-1">{n.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">No recent notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Quick Button */}
          <button
            onClick={() => handleTabClick('profile')}
            className={`hidden sm:flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-900 p-1 px-3 py-1.5 hover:bg-slate-800 transition-all ${
              activeTab === 'profile' ? 'ring-2 ring-lime-400' : ''
            }`}
          >
            <span className="text-base">{currentUser?.avatar || '👤'}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">{currentUser?.name || 'Guest Fan'}</p>
              <p className="text-[9px] font-mono uppercase text-lime-400 tracking-wider">
                {currentUser?.role === 'admin' ? 'Administrator' : 'Supporter'}
              </p>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950/98 px-2 pt-2 pb-4 lg:hidden">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? 'bg-lime-400/10 text-lime-400'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Profile bar */}
            <div className="mt-4 border-t border-slate-800 pt-4 px-2">
              <div className="flex items-center space-x-3" onClick={() => handleTabClick('profile')}>
                <span className="text-2xl">{currentUser?.avatar || '👤'}</span>
                <div>
                  <p className="text-sm font-bold text-white">{currentUser?.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{currentUser?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
