'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import NotificationPanel from './NotificationPanel';
import { Button } from '@/components/ui/button';
import { Search, Settings, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      setCurrentTime(`${timeString} • ${dateString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl px-6 shadow-lg">
      {/* Left section - Greeting */}
      <div className="flex items-center gap-4 flex-1">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">
            {getGreeting()}, <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{user?.name || 'User'}</span>
          </h1>
          <p className="text-xs text-slate-400">{currentTime}</p>
        </div>
      </div>

      {/* Center section - Search (optional) */}
      <div className="hidden md:flex flex-1 justify-center max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="w-full h-9 pl-10 pr-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <NotificationPanel />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-700/50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full p-0 hover:ring-2 hover:ring-cyan-500/50 transition-all"
            onClick={() => router.push('/account')}
            title="Account Settings"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-cyan-500/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-red-500/10 text-slate-400 hover:text-red-400"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
