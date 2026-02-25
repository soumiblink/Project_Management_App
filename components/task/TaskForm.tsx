'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ITask } from '@/types/task';
import { IProject } from '@/types/project';
import { IUserResponse } from '@/types/user';
import axiosInstance from '@/lib/axios';
import { User } from 'lucide-react';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ITask>) => void;
  task?: ITask | null;
  projects: IProject[];
  isLoading?: boolean;
  defaultProjectId?: string;
}

export default function TaskForm({ open, onClose, onSubmit, task, projects, isLoading, defaultProjectId }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    projectId: task?.projectId || defaultProjectId || '',
    assignedTo: task?.assignedTo || 'unassigned',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
  const [projectMembers, setProjectMembers] = useState<IUserResponse[]>([]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        assignedTo: task.assignedTo || 'unassigned',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else if (defaultProjectId) {
      setFormData(prev => ({ ...prev, projectId: defaultProjectId }));
    }
  }, [task, defaultProjectId]);

  useEffect(() => {
    if (formData.projectId) {
      fetchProjectMembers(formData.projectId);
    }
  }, [formData.projectId]);

  const fetchProjectMembers = async (projectId: string) => {
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}`);
      const project = response.data.project;
      
      if (project.members && project.members.length > 0) {
        const usersResponse = await axiosInstance.get('/api/users');
        const allUsers = usersResponse.data.users || [];
        const members = allUsers.filter((user: IUserResponse) => 
          project.members.includes(user._id)
        );
        setProjectMembers(members);
      } else {
        setProjectMembers([]);
      }
    } catch (error) {
      console.error('Error fetching project members:', error);
      setProjectMembers([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert 'unassigned' back to empty string for the API
    const submitData = {
      ...formData,
      assignedTo: formData.assignedTo === 'unassigned' ? '' : formData.assignedTo
    };
    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      projectId: defaultProjectId || '',
      assignedTo: 'unassigned',
      dueDate: '',
    });
    setProjectMembers([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => {
                  setFormData({ ...formData, projectId: value, assignedTo: '' });
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo" className="flex items-center">
              <User className="h-4 w-4 mr-2 text-cyan-400" />
              Assign To Team Member
            </Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={projectMembers.length > 0 ? "Select team member" : "No team members in this project"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {projectMembers.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>{member.name} ({member.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {projectMembers.length === 0 && formData.projectId && (
              <p className="text-xs text-amber-400">
                ⚠️ Add team members to the project first to assign tasks
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
