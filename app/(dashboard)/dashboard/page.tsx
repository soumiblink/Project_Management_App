'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, CheckSquare, CheckCircle2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { IProject } from '@/types/project';
import { ITask } from '@/types/task';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        axiosInstance.get('/api/projects'),
        axiosInstance.get('/api/tasks'),
      ]);

      const projects: IProject[] = projectsRes.data.projects;
      const tasks: ITask[] = tasksRes.data.tasks;

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.status === 'done').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20 border border-blue-500/30',
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20 border border-cyan-500/30',
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20 border border-green-500/30',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Overview of your projects and tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="glass-effect border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-effect border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/projects"
              className="p-6 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer group"
            >
              <h3 className="font-semibold mb-1 text-slate-200 group-hover:text-cyan-300 transition-colors">Manage Projects</h3>
              <p className="text-sm text-slate-400">
                Create, edit, and organize your projects
              </p>
            </a>
            <a
              href="/tasks"
              className="p-6 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer group"
            >
              <h3 className="font-semibold mb-1 text-slate-200 group-hover:text-cyan-300 transition-colors">View Tasks</h3>
              <p className="text-sm text-slate-400">
                Track and manage all your tasks
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
