'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban } from 'lucide-react';
import ProjectCard from '@/components/project/ProjectCard';
import ProjectForm from '@/components/project/ProjectForm';
import axiosInstance from '@/lib/axios';
import { IProject, IProjectWithDetails } from '@/types/project';
import { useProjectStore } from '@/store/projectStore';

export default function ProjectsPage() {
  const { projects, setProjects, addProject, updateProject, deleteProject } = useProjectStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsFetching(false);
    }
  }, [setProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (data: Partial<IProject>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/api/projects', data);
      addProject(response.data.project);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (data: Partial<IProject>) => {
    if (!selectedProject) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/api/projects/${selectedProject._id}`, data);
      updateProject(selectedProject._id, response.data.project);
      setIsFormOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await axiosInstance.delete(`/api/projects/${projectId}`);
      deleteProject(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEditClick = (project: IProjectWithDetails) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProject(null);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Projects</h1>
          <p className="text-slate-400 mt-1">
            Manage and organize your projects
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/50">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderKanban className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-slate-200">No projects yet</h3>
          <p className="text-slate-400 mb-4">
            Get started by creating your first project
          </p>
          <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/50">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleEditClick}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      <ProjectForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
        project={selectedProject}
        isLoading={isLoading}
      />
    </div>
  );
}
