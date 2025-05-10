import { api } from '../lib/api';
import {
	Pert,
	Project,
	ProjectStatus,
	TaskEdge,
	TaskNode,
	Workspace,
	WorkspaceStatus,
	User
} from '@/common/types';

import { Task } from '@/common/types';

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

interface CreatePertParams {
	name: string;
	projectId: string;
	tasks: { issueId: string; parentIssueId?: string }[];
	taskNodes?: Pick<
		TaskNode,
		'id' | 'name' | 'duration' | 'priority' | 'ES' | 'EF' | 'LS' | 'LF' | 'dependencies'
	>[];
	taskEdges?: Pick<TaskEdge, 'source' | 'target'>[];
}

interface AvailableUsersResponse {
	status: string;
	data: {
	  users: User[]; // Giả sử có type User đã được định nghĩa
	  totalCount: number;
	  page: number;
	  limit: number;
	}
}

interface AddMembersToWorkspaceResponse {
	id: string;
	workspaceId: string;
	userId: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	user: User;
}

interface Comment {
	commentId: string,
	comment: string,
}

interface IssueResponse {
	status: string;
	data: Task | Task[];
}

interface CommentResponse {
	status: string;
	data: Comment | Comment[];
}

interface AddIssueResponse {
	status: string;
	data: Task;
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

	async getMembersByWorkspaceId(workspaceId: string): Promise<{
		status: string,
		data: User[],
	}>{
		return api.get(`/api/workspaces/${workspaceId}/allMembers`);
	},

	async addMemberWorkspaceById(
		workspaceId: string,
		memberIds: string[]
	): Promise<{ status: string; data: AddMembersToWorkspaceResponse[] }> {
		return api.post(`/api/workspaces/${workspaceId}/members`, { memberIds });
	},
	

	async getAvailableUsers(
		workspaceId: string,
		page: number = 1,
		limit: number = 10
	): Promise<AvailableUsersResponse> {
		return api.get<AvailableUsersResponse>(
			`/api/workspaces/${workspaceId}/available-users?page=${page}&limit=${limit}`
		);
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

	// Get project by id 
	async getProjectById(projectId: string): Promise<{
		status: string;
		data: Project;
	}> {
		return api.get(`/api/projects/${projectId}/get`);
	},
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

	// Check user in project
	async checkExistMemberInProject(projectId: string, memberId: string): Promise<{
		status: string;
		data: User;
	}> {
		return api.post(`/api/projects/checkMemberExist/${projectId}`, {memberId: memberId});
	},

	// Add member to project
	async addMemberToProject(projectId: string, memberId: string): Promise<{
		status: string;
		data: User;
	}> {
		return api.post(`/api/projects/${projectId}/members`, {userId: memberId});
	},

	// Create new pert
	async createPert(data: CreatePertParams): Promise<{
		status: string;
		data: Pert;
	}> {
		return api.post(`/api/perts`, data);
	},

	// Get pert by project id
	async retrievePertByProjectId(projectId: string): Promise<{
		status: string;
		data: Pert[];
	}> {
		return api.get(`/api/perts/project/${projectId}`);
	},

	// Get pert by id
	async retrievePertById(pertId: string): Promise<{
		status: string;
		data: Pert;
	}> {
		return api.get(`/api/perts/${pertId}`);
	},

	//#region Issue
	// ✅ GET all issues with optional filters
	async getIssues(filters?: {
		projectId?: string;
		assigneeId?: string;
		status?: string;
		priority?: string;
		parentId?: string;
	}): Promise<IssueResponse> {
		const params = new URLSearchParams();
		if (filters?.projectId) params.append('projectId', filters.projectId);
		if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId);
		if (filters?.parentId) params.append('parentId', filters.parentId);

		const query = params.toString();
		const url = query ? `/api/issues?${query}` : `/api/issues`;

		const response = await api.get<IssueResponse>(url);
		return response;
	},

	// ✅ GET issue by ID
	async getIssueById(id: string): Promise<Comment> {
		const response = await api.get<Comment>(`/api/issues/${id}`);
		return response;
	},

	// ✅ POST: Create new issue
	async createIssue(data: Partial<Task>): Promise<AddIssueResponse> {		
		const response = await api.post<AddIssueResponse>('/api/issues', data);
		return response;
	},

	// ✅ PUT: Update issue by ID
	async updateIssue(id: string, data: Partial<Task>): Promise<IssueResponse> {
		const response = await api.put<IssueResponse>(`/api/issues/${id}`, data);
		return response;
	},

	// ✅ DELETE: Remove issue
	async deleteIssue(id: string): Promise<{ status: string }> {
		const response = await api.delete<{ status: string }>(`/api/issues/${id}`);
		return response;
	},

	async getComments(filters?: {
		commentId?: string;
		issueId?: string;
		userId?: string;
	}): Promise<CommentResponse> {
		const params = new URLSearchParams();
		if (filters?.commentId) params.append('commentId', filters.commentId);
		if (filters?.issueId) params.append('issueId', filters.issueId);
		if (filters?.userId) params.append('userId', filters.userId);


		const query = params.toString();
		const url = query ? `/api/issues/comments/?${query}` : `/api/issues/comments`;

		const response = await api.get<CommentResponse>(`/api/issues/${filters?.issueId}/comments`);
		return response;
	},
	// ✅ POST: Add comment to issue
	async addComment(issueId: string, content: string): Promise<IssueResponse> {
		const response = await api.post<IssueResponse>(`/api/issues/${issueId}/comments`, { content });
		return response;
	},

	// ✅ POST: Add label to issue
	async addLabel(issueId: string, labelId: string): Promise<IssueResponse> {
		const response = await api.post<IssueResponse>(`/api/issues/${issueId}/labels`, { labelId });
		return response;
	}
};
