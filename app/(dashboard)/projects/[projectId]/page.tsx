'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Edit, Users } from 'lucide-react';
import KanbanBoard from '@/components/task/KanbanBoard';
import TaskForm from '@/components/task/TaskForm';
import ProjectForm from '@/components/project/ProjectForm';
import axiosInstance from '@/lib/axios';
import { IProject, IProjectWithDetails } from '@/types/project';
import { ITask, ITaskWithDetails, TaskStatus } from '@/types/task';
import { IUserResponse } from '@/types/user';
import { useSocket } from '@/hooks/useSocket';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<IProjectWithDetails | null>(null);
  const [tasks, setTasks] = useState<ITaskWithDetails[]>([]);
  const [projectMembers, setProjectMembers] = useState<IUserResponse[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  useEffect(() => {
    if (!socket || !projectId) return;

    socket.emit('join-project', projectId);

    socket.on('task-created', (task: ITaskWithDetails) => {
      if (task.projectId === projectId) {
        setTasks((prev) => [...prev, task]);
      }
    });

    socket.on('task-updated', (task: ITaskWithDetails) => {
      if (task.projectId === projectId) {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      }
    });

    socket.on('task-deleted', ({ taskId }: { taskId: string }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      socket.emit('leave-project', projectId);
      socket.off('task-created');
      socket.off('task-updated');
      socket.off('task-deleted');
    };
  }, [socket, projectId]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        axiosInstance.get(`/api/projects/${projectId}`),
        axiosInstance.get(`/api/tasks?projectId=${projectId}`),
        axiosInstance.get('/api/users'),
      ]);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
      
      // Filter members who are part of this project
      const allUsers = usersRes.data.users || [];
      const members = allUsers.filter((user: IUserResponse) => 
        projectRes.data.project.members?.includes(user._id)
      );
      setProjectMembers(members);
    } catch (error) {
      console.error('Error fetching project data:', error);
      router.push('/projects');
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateTask = async (data: Partial<ITask>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/api/tasks', {
        ...data,
        projectId,
      });
      setTasks((prev) => [...prev, response.data.task]);
      setIsTaskFormOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (data: Partial<ITask>) => {
    if (!selectedTask) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/api/tasks/${selectedTask._id}`, data);
      setTasks((prev) =>
        prev.map((t) => (t._id === selectedTask._id ? response.data.task : t))
      );
      setIsTaskFormOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (data: Partial<IProject>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/api/projects/${projectId}`, data);
      setProject(response.data.project);
      setIsProjectFormOpen(false);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      await axiosInstance.put(`/api/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error('Error moving task:', error);
      fetchProjectData();
    }
  };

  const handleEditClick = (task: ITaskWithDetails) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const completionRate = project.taskCount
    ? Math.round(((project.completedTaskCount || 0) / project.taskCount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsProjectFormOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-200">{project.taskCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{project.completedTaskCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{completionRate}%</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{projectMembers.length}</div>
            {projectMembers.length > 0 && (
              <div className="flex -space-x-2 mt-3">
                {projectMembers.slice(0, 5).map((member) => (
                  <div
                    key={member._id}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-2 border-slate-900 shadow-lg"
                    title={member.name}
                  >
                    <span className="text-white text-xs font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ))}
                {projectMembers.length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-900 text-xs text-slate-300">
                    +{projectMembers.length - 5}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <KanbanBoard
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onEditTask={handleEditClick}
        onDeleteTask={handleDeleteTask}
      />

      <TaskForm
        open={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        projects={[project]}
        isLoading={isLoading}
        defaultProjectId={projectId}
      />

      <ProjectForm
        open={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSubmit={handleUpdateProject}
        project={project}
        isLoading={isLoading}
      />
    </div>
  );
}
