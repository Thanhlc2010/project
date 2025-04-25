import uniqBy from 'lodash/uniqBy';
import { create } from 'zustand';

import { Pert, Workspace, User } from '@/common/types';
import { workspaceService } from '@/services/workspaceService';

export type Path = {
	id: string;
	name: string;
	type: 's' | 'l' | 'p';
};

interface WorkspaceState {
	// workspace
	isFetchingWorkspaces: boolean;
	workspaces: Workspace[];
	getAllWorkspaces: () => Promise<void>;
	addWorkspace: (name: string, description?: string) => Promise<string>;
	deleteWorkspace: (workspaceId: string) => Promise<void>;
	addMembersToWorkspace: (workspaceId: string, memberIds: string[]) => Promise<void>;
	availableUsers: {
		users: User[];
		totalCount: number;
		page: number;
		limit: number;
		loading: boolean;
	  };
	getAvailableUsersForWorkspace: (workspaceId: string, page?: number, limit?: number) => Promise<void>;


	// project
	projectPertMap: Record<string, Pert[]>;
	addProject: (workspaceId: string, name: string, description?: string) => Promise<string>;
	deleteProject: (projectId: string) => Promise<void>;
	createPert: (params: {
		projectId: string;
		pertName: string;
		description: string;
		// selectedTasks: { taskId: number; taskName: string; duration: number }[];
	}) => Promise<string>;
	getPertByProjectId: (projectId: string) => Promise<void>;
	getPertById: (pertId: string) => Promise<Pert | null>;
	// find item
	pathCache: Record<string, Path[]>;
	findPathToItem: (itemId: string) => Path[] | null;
	setPathToItem: (itemId: string, path: Path[]) => void;
	
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
	workspaces: [],
	pathCache: {},
	projectPertMap: {},
	isFetchingWorkspaces: false,
	getAllWorkspaces: async () => {
		set({ isFetchingWorkspaces: true });
		const response = await workspaceService.getWorkspaces();
		set({ workspaces: response.data });
		set({ isFetchingWorkspaces: false });
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

	addMembersToWorkspace: async (workspaceId: string, memberIds: string[]) => {
		const response = await workspaceService.addMemberWorkspaceById(workspaceId, memberIds);
	
		if (response.status === 'success') {
			debugger;
			// Trích xuất danh sách user từ response.data
			const newMembers: User[] = response.data.map((item: any) => item.user);
	
			const updatedWorkspaces = get().workspaces.map((workspace) => {
				if (workspace.id === workspaceId) {
					const existingMembers = workspace.members || []; // đảm bảo là array
			
					const allMembers = [
						...existingMembers,
						...newMembers.filter(
							(newMember) => !existingMembers.some((m) => m.id === newMember.id)
						),
					];
			
					return {
						...workspace,
						members: allMembers,
					};
				}
				return workspace;
			});
	
			set({ workspaces: updatedWorkspaces });
		} else {
			throw new Error('Failed to add members to workspace');
		}
	},

	  availableUsers: {
		users: [],
		totalCount: 0,
		page: 1,
		limit: 10,
		loading: false
	  },
	  
	  getAvailableUsersForWorkspace: async (workspaceId: string, page = 1, limit = 10) => {
		try {
			debugger;
		  set(state => ({
			availableUsers: {
			  ...state.availableUsers,
			  loading: true
			}
		  }));
		  
		  const response = await workspaceService.getAvailableUsers(workspaceId, page, limit);
		  
		  if (response.status === 'success') {
			set({
			  availableUsers: {
				users: response.data.users,
				totalCount: response.data.totalCount,
				page: response.data.page,
				limit: response.data.limit,
				loading: false
			  }
			});
		  } else {
			set(state => ({
			  availableUsers: {
				...state.availableUsers,
				loading: false
			  }
			}));
			throw new Error('Failed to fetch available users');
		  }
		} catch (error) {
		  set(state => ({
			availableUsers: {
			  ...state.availableUsers,
			  loading: false
			}
		  }));
		  throw error;
		}
	  },

	findPathToItem: (itemId: string) => {
		const workspaces = get().workspaces;
		const cachedPath = get().pathCache[itemId];

		if (cachedPath && cachedPath.length > 0) {
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

	setPathToItem: (itemId: string, path: Path[]) => {
		set({ pathCache: { ...get().pathCache, [itemId]: path } });
	},

	deleteProject: async (projectId: string) => {
		await workspaceService.deleteProject(projectId);

		if (get().findPathToItem(projectId)) {
			set({
				pathCache: {
					...get().pathCache,
					[projectId]: [],
				},
			});
		}
		set({
			workspaces: get().workspaces.map((workspace) => ({
				...workspace,
				projects: workspace.projects?.filter((project) => project.id !== projectId),
			})),
		});
	},
	createPert: async (params: { projectId: string; pertName: string; description: string }) => {
		const response = await workspaceService.createPert({
			projectId: params.projectId,
			taskNodes: [],
			taskEdges: [],
		});

		if (response.status === 'success') {
			const currentPert = get().projectPertMap[params.projectId] ?? [];
			const updatedProjectPertMap = {
				...get().projectPertMap,
				[params.projectId]: currentPert.concat(response.data),
			};
			set({
				projectPertMap: updatedProjectPertMap,
			});
			return response.data.id;
		}
		throw new Error('Failed to create pert');
	},
	getPertByProjectId: async (projectId: string) => {
		const response = await workspaceService.retrievePertByProjectId(projectId);

		if (response.status === 'success') {
			set({ projectPertMap: { ...get().projectPertMap, [projectId]: response.data } });
		} else {
			throw new Error('Failed to get pert by project id');
		}
	},
	getPertById: async (pertId: string) => {
		const response = await workspaceService.retrievePertById(pertId);
		if (response.status === 'success') {
			const projectId = response.data.projectId;
			const currentPert = get().projectPertMap[projectId] ?? [];
			const updatedProjectPertMap = {
				...get().projectPertMap,
				[projectId]: uniqBy(currentPert.concat(response.data), 'id'),
			};
			set({ projectPertMap: updatedProjectPertMap });
			return response.data;
		}
		throw new Error('Failed to get pert by id');
	},

	// getIssuesByProject: async (projectId: Str) => {
	// 	// set({ isFetchingIssues: true });
	
	// 	try {
	// 	  const res = await issueService.getIssues(filters);
	
	// 	  if (res.status === 'success' && Array.isArray(res.data)) {
	// 		set((state) => ({
	// 		  issuesByProject: {
	// 			...state.issuesByProject,
	// 			[filters.projectId]: res.data as Task[],
	// 		  },
	// 		  isFetchingIssues: false,
	// 		}));
	// 	  } else {
	// 		throw new Error('Invalid response from server');
	// 	  }
	// 	} catch (err) {
	// 	  console.error('Failed to fetch issues:', err);
	// 	  set({ isFetchingIssues: false });
	// 	}
	//   },
}));

