'use client';

import { ITaskWithDetails } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, User, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface TaskCardProps {
  task: ITaskWithDetails;
  onEdit: (task: ITaskWithDetails) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityConfig = {
    low: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      dot: 'bg-blue-500',
    },
    medium: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-500',
    },
    high: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
      dot: 'bg-red-500',
    },
  };

  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group card-hover animate-scale-in">
      {/* Priority indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${priority.dot} transition-all duration-300`} />
      
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 flex-1">
            {task.title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-cyan-500/20 hover:text-cyan-400 smooth-bounce"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-red-500/20 hover:text-red-400 smooth-bounce"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          {/* Priority badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${priority.bg} ${priority.border} border transition-all duration-200`}>
            <div className={`h-1.5 w-1.5 rounded-full ${priority.dot} animate-glow-pulse`} />
            <span className={`text-xs font-medium ${priority.text} capitalize`}>
              {task.priority}
            </span>
          </div>

          {/* Due date or assigned user */}
          <div className="flex items-center gap-2">
            {isOverdue && (
              <div className="flex items-center gap-1 text-red-400 animate-float">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
            )}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned user */}
        {task.assignedToUser && (
          <div className="flex items-center gap-2 pt-2 animate-slide-in-right">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium shadow-lg shadow-cyan-500/30">
              {task.assignedToUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-slate-400">{task.assignedToUser.name}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
