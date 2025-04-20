import { create } from 'zustand';

import { Workspace } from '@/common/types';
import { workspaceService } from '@/services/workspaceService';

export type Path = {
	id: string;
	name: string;
	type: 's' | 'l';
};

interface WorkspaceState {
	// workspace
	workspaces: Workspace[];
	getAllWorkspaces: () => Promise<void>;
	addWorkspace: (name: string, description?: string) => Promise<string>;
	deleteWorkspace: (workspaceId: string) => Promise<void>;

	// project
	addProject: (workspaceId: string, name: string, description?: string) => Promise<string>;
	deleteProject: (projectId: string) => Promise<void>;
	// find item
	pathCache: Record<string, Path[]>;
	findPathToItem: (itemId: string) => Path[] | null;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
	workspaces: [],
	pathCache: {},

	getAllWorkspaces: async () => {
		const response = await workspaceService.getWorkspaces();
		set({ workspaces: response.data });
	},

	addWorkspace: async (name: string, description?: string) => {
		const response = await workspaceService.createWorkspace(name, description);
		if (response.status === 'success') {
			set({ workspaces: [...get().workspaces, response.data] });
			return response.data.id;
		}
		throw new Error('Failed to create workspace');
	},

	deleteWorkspace: async (workspaceId: string) => {
		await workspaceService.deleteWorkspace(workspaceId);
		set({ workspaces: get().workspaces.filter((workspace) => workspace.id !== workspaceId) });
	},

	addProject: async (workspaceId: string, name: string, description?: string) => {
		const response = await workspaceService.createProject({
			workspaceId,
			name,
			description,
		});
		if (response.status === 'success') {
			const updatedWorkspaces = get().workspaces.map((workspace) => {
				if (workspace.id === workspaceId) {
					return {
						...workspace,
						projects: [...(workspace.projects || []), response.data],
					};
				}
				return workspace;
			});

			set({ workspaces: updatedWorkspaces });

			return response.data.id;
		}
		throw new Error('Failed to create project');
	},

	findPathToItem: (itemId: string) => {
		const workspaces = get().workspaces;
		const cachedPath = get().pathCache[itemId];

		if (cachedPath) {
			// recheck if the path is still valid
			let next;
			for (const path of cachedPath) {
				if (path.type === 's') {
					next = workspaces.find((workspace) => workspace.id === path.id);
				} else if (path.type === 'l') {
					next = (next as Workspace).projects.find((project) => project.id === path.id);
				}
			}

			if (next) {
				return cachedPath;
			}
		}

		for (const workspace of workspaces) {
			if (workspace.id === itemId) {
				get().pathCache[itemId] = [{ id: workspace.id, name: workspace.name, type: 's' }];
				return get().pathCache[itemId];
			}

			for (const project of workspace.projects || []) {
				if (project.id === itemId) {
					get().pathCache[itemId] = [
						{ id: workspace.id, name: workspace.name, type: 's' },
						{ id: project.id, name: project.name, type: 'l' },
					];
					return get().pathCache[itemId];
				}
			}
		}

		return [];
	},

	deleteProject: async (projectId: string) => {
		await workspaceService.deleteProject(projectId);
		set({
			workspaces: get().workspaces.map((workspace) => ({
				...workspace,
				projects: workspace.projects?.filter((project) => project.id !== projectId),
			})),
		});
	},
}));
