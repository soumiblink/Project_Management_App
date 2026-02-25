'use client';

import { IProjectWithDetails } from '@/types/project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface ProjectCardProps {
  project: IProjectWithDetails;
  onEdit: (project: IProjectWithDetails) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const completionRate = project.taskCount
    ? Math.round(((project.completedTaskCount || 0) / project.taskCount) * 100)
    : 0;

  return (
    <Card className="glass-effect border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 group card-hover animate-scale-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/projects/${project._id}`}>
              <CardTitle className="hover:text-cyan-400 cursor-pointer transition-colors group-hover:text-cyan-300">
                {project.name}
              </CardTitle>
            </Link>
            <CardDescription className="mt-2 line-clamp-2 text-slate-400">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-cyan-500/10 hover:text-cyan-400 smooth-bounce"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-500/10 hover:text-red-400 smooth-bounce"
              onClick={() => onDelete(project._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Tasks</span>
            <span className="font-medium text-slate-200">
              {project.completedTaskCount || 0} / {project.taskCount || 0}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50 relative overflow-hidden"
              style={{ width: `${completionRate}%` }}
            >
              <div className="absolute inset-0 shimmer"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <span className="text-xs text-slate-400">
                {project.members?.length || 0} member{(project.members?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs transition-all duration-200 ${
              project.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              project.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-slate-500/20 text-slate-400 border border-slate-500/30'
            }`}>
              {project.status}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Created {formatDate(project.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
