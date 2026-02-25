'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IProject } from '@/types/project';
import { IUserResponse } from '@/types/user';
import { X, UserPlus } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IProject>) => void;
  project?: IProject | null;
  isLoading?: boolean;
}

export default function ProjectForm({ open, onClose, onSubmit, project, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active',
    members: project?.members || [],
  });
  const [allUsers, setAllUsers] = useState<IUserResponse[]>([]);
  const [memberEmail, setMemberEmail] = useState('');
  const [searchResults, setSearchResults] = useState<IUserResponse[]>([]);

  useEffect(() => {
    if (open) {
      fetchUsers();
      if (project) {
        setFormData({
          name: project.name,
          description: project.description,
          status: project.status,
          members: project.members || [],
        });
      }
    }
  }, [open, project]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/users');
      setAllUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearchMembers = (email: string) => {
    setMemberEmail(email);
    if (email.length > 0) {
      const results = allUsers.filter(
        (user) =>
          (user.email.toLowerCase().includes(email.toLowerCase()) ||
            user.name.toLowerCase().includes(email.toLowerCase())) &&
          !formData.members.includes(user._id)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddMember = (userId: string) => {
    if (!formData.members.includes(userId)) {
      setFormData({ ...formData, members: [...formData.members, userId] });
      setMemberEmail('');
      setSearchResults([]);
    }
  };

  const handleRemoveMember = (userId: string) => {
    setFormData({
      ...formData,
      members: formData.members.filter((id) => id !== userId),
    });
  };

  const getMemberDetails = (userId: string) => {
    return allUsers.find((user) => user._id === userId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', status: 'active', members: [] });
    setMemberEmail('');
    setSearchResults([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              rows={4}
              required
            />
          </div>

          {project && (
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="relative">
              <Input
                placeholder="Search by email or name to add members..."
                value={memberEmail}
                onChange={(e) => handleSearchMembers(e.target.value)}
                className="pr-10"
              />
              <UserPlus className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>

            {searchResults.length > 0 && (
              <div className="border border-cyan-500/20 rounded-lg mt-2 max-h-40 overflow-y-auto bg-slate-900/50">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleAddMember(user._id)}
                    className="px-3 py-2 hover:bg-cyan-500/10 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <Button type="button" size="sm" variant="ghost" className="h-6 text-xs">
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {formData.members.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-slate-400">Added Members ({formData.members.length})</p>
                <div className="space-y-2">
                  {formData.members.map((memberId) => {
                    const member = getMemberDetails(memberId);
                    if (!member) return null;
                    return (
                      <div
                        key={memberId}
                        className="flex items-center justify-between p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{member.name}</p>
                            <p className="text-xs text-slate-400">{member.email}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(memberId)}
                          className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
