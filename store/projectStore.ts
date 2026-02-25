import { create } from 'zustand';
import { IProject } from '@/types/project';

interface ProjectState {
  projects: IProject[];
  selectedProject: IProject | null;
  setProjects: (projects: IProject[]) => void;
  addProject: (project: IProject) => void;
  updateProject: (projectId: string, updates: Partial<IProject>) => void;
  deleteProject: (projectId: string) => void;
  setSelectedProject: (project: IProject | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === projectId ? { ...p, ...updates } : p
      ),
      selectedProject:
        state.selectedProject?._id === projectId
          ? { ...state.selectedProject, ...updates }
          : state.selectedProject,
    })),
  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== projectId),
      selectedProject:
        state.selectedProject?._id === projectId ? null : state.selectedProject,
    })),
  setSelectedProject: (project) => set({ selectedProject: project }),
}));
