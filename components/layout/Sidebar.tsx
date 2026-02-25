'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  HelpCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Calendar,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';
import { ITask } from '@/types/task';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [stats, setStats] = useState({
    myTasks: 0,
    urgent: 0,
    dueToday: 0,
    completed: 0,
  });
  const [upcomingTasks, setUpcomingTasks] = useState<ITask[]>([]);

  const fetchSidebarData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      const allTasks: ITask[] = response.data.tasks;
      
      // Filter tasks assigned to current user
      const myTasks = allTasks.filter(task => task.assignedTo === user?._id);
      
      // Calculate stats
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      setStats({
        myTasks: myTasks.filter(t => t.status !== 'done').length,
        urgent: myTasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
        dueToday: myTasks.filter(t => {
          if (!t.dueDate || t.status === 'done') return false;
          const dueDate = new Date(t.dueDate);
          return dueDate >= todayStart && dueDate <= today;
        }).length,
        completed: myTasks.filter(t => t.status === 'done').length,
      });

      // Get upcoming tasks (next 3 days, not done)
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      
      const upcoming = myTasks
        .filter(t => {
          if (!t.dueDate || t.status === 'done') return false;
          const dueDate = new Date(t.dueDate);
          return dueDate <= threeDaysFromNow;
        })
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 3);
      
      setUpcomingTasks(upcoming);
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  return (
    <div className="flex h-screen w-72 flex-col border-r border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl overflow-hidden">
      <div className="flex h-16 items-center border-b border-cyan-500/20 px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
            <span className="text-white font-black text-sm tracking-tighter relative z-10">PRO</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">PRO</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Navigation */}
        <nav className="space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="px-3 py-4 border-t border-cyan-500/10">
          <div className="flex items-center space-x-2 mb-3 px-3">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Stats</h3>
          </div>
          <div className="space-y-2">
            <div className="glass-effect border-cyan-500/20 rounded-lg p-3 card-hover animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">My Tasks</span>
                <CheckSquare className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-slate-200">{stats.myTasks}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="glass-effect border-red-500/20 rounded-lg p-2 card-hover animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center space-x-1 mb-1">
                  <AlertCircle className="h-3 w-3 text-red-400" />
                  <span className="text-xs text-slate-400">Urgent</span>
                </div>
                <p className="text-xl font-bold text-red-400">{stats.urgent}</p>
              </div>
              
              <div className="glass-effect border-amber-500/20 rounded-lg p-2 card-hover animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center space-x-1 mb-1">
                  <Calendar className="h-3 w-3 text-amber-400" />
                  <span className="text-xs text-slate-400">Today</span>
                </div>
                <p className="text-xl font-bold text-amber-400">{stats.dueToday}</p>
              </div>
            </div>

            <div className="glass-effect border-emerald-500/20 rounded-lg p-3 card-hover animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Completed</span>
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        {upcomingTasks.length > 0 && (
          <div className="px-3 py-4 border-t border-cyan-500/10">
            <div className="flex items-center space-x-2 mb-3 px-3">
              <Clock className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming</h3>
            </div>
            <div className="space-y-2">
              {upcomingTasks.map((task, index) => (
                <Link
                  key={task._id}
                  href={`/projects/${task.projectId}`}
                  className="block glass-effect border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/40 transition-all duration-200 group card-hover animate-slide-in-right"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {task.title}
                    </p>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full transition-all duration-200",
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{getDaysUntilDue(task.dueDate!)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="border-t border-cyan-500/20 p-4">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Link
          href="/help"
          className="mt-2 flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-200"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Need Help?</span>
        </Link>
      </div>
    </div>
  );
}
