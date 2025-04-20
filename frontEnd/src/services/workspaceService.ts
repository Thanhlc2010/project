import { api } from '../lib/api';
import { Project, ProjectStatus, Workspace, WorkspaceStatus } from '@/common/types';

interface WorkspaceResponse {
	status: string;
	data: Workspace[];
}

interface UpdateWorkspaceParams {
	name?: string;
	status?: WorkspaceStatus;
}

interface CreateProjectParams {
	name: string;
	description?: string;
	workspaceId: string;
}

interface UpdateProjectParams {
	name?: string;
	description?: string;
	status?: ProjectStatus;
}

export const workspaceService = {
	//#region Workspace
	// Get all workspaces
	async getWorkspaces(): Promise<WorkspaceResponse> {
		return api.get<WorkspaceResponse>('/api/workspaces');
	},

	// Create a workspace
	async createWorkspace(
		name: string,
		description?: string,
	): Promise<{
		status: string;
		data: Workspace;
	}> {
		return api.post('/api/workspaces', { name, description });
	},

	// Get a workspace by ID
	async retrieveWorkspaceById(workspaceId: string): Promise<Workspace> {
		return api.get<Workspace>(`/api/workspaces/${workspaceId}`);
	},

	// Update a workspace
	async updateWorkspace(workspaceId: string, data: UpdateWorkspaceParams): Promise<Workspace> {
		return api.put<Workspace>(`/api/workspaces/${workspaceId}`, data);
	},

	// Delete a workspace
	async deleteWorkspace(workspaceId: string): Promise<{ description: string }> {
		return api.delete<{ description: string }>(`/api/workspaces/${workspaceId}`);
	},
	//#endregion

	//#region Project
	// Create new project
	async createProject(data: CreateProjectParams): Promise<{
		status: string;
		data: Project;
	}> {
		return api.post(`/api/projects`, data);
	},

	// Get workspace projects
	async getWorkspaceProjects(workspaceId: string): Promise<{
		status: string;
		data: Project[];
	}> {
		return api.get(`/api/projects?workspaceId=${workspaceId}`);
	},

	// Update project
	async updateProject(projectId: string, data: UpdateProjectParams): Promise<Project> {
		return api.put<Project>(`/api/projects/${projectId}`, data);
	},

	// Delete project
	async deleteProject(projectId: string): Promise<Project> {
		return api.delete<Project>(`/api/projects/${projectId}`);
	},

	// Retrieve project by id
	async retrieveProjectById(projectId: string): Promise<Project> {
		return api.get<Project>(`/api/projects/${projectId}`);
	},
	//#endregion
};
