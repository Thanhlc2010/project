export enum SpaceItemType {
	LIST = 'list',
	FOLDER = 'folder',
	PERT = 'pert',
}

export type User = {
	id: string;
	name: string;
	email: string;
	avatar?: string; // Optional avatar URL
};

export type Task = {
	id: string;
	name: string;
	duration?: number; // Optional because second version doesn't use it
	dependencies?: string[]; // Optional because only first version has it
	subtasks?: Task[]; // Optional for tasks that don't have subtasks
	status: 'TO DO' | 'IN PROGRESS' | 'COMPLETE';
	completed?: boolean;
	assignees?: User[];
	dueDate?: string;
	priority: 'high' | 'medium' | 'low' | 'Low' | 'Normal' | 'High' | 'Urgent';
	comments?: string[];
	parentId?: number;
	position?: { x: number; y: number };
	type?: 'start' | 'end' | 'task';
	ES?: number;
	EF?: number;
	LS?: number;
	LF?: number;
};

export type pertTask = {
	id: string;
	name: string;
	duration: number;
	dependencies: string[];
	priority: 'high' | 'medium' | 'low';
	position?: { x: number; y: number };
	ES?: number;
	EF?: number;
	LS?: number;
	LF?: number;
};

export enum WorkspaceStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export interface Workspace {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	status: WorkspaceStatus;
	ownerId: string;
	owner?: {
		id: string;
		email: string;
		name: string;
	};
	members: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
			avatar?: string;
		};
	}[];
	projects: Project[];
}

export enum ProjectStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export interface Project {
	id: string;
	name: string;
	key: string;
	description?: string;
	status: ProjectStatus;
	ownerId: string;
	workspaceId: string;
	createdAt: string;
	updatedAt: string;
}

export interface TaskNode {
	id: string;
	pertId: string;
	pert: Pert;
	type: string;
	position_x: number;
	position_y: number;
	name: string;
	duration: number;
	priority: string;
	ES: number;
	EF: number;
	LS: number;
	LF: number;
	data_position_x: number;
	data_position_y: number;
	dependencies: string;
	createdAt: string;
	updatedAt: string;
}

export interface TaskEdge {
	id: string;
	source: string;
	target: string;
	pertId: string;
	pert: Pert;
	createdAt?: string;
	updatedAt?: string;
}

export interface Pert {
	id: string;
	name: string;
	projectId: string;
	createdAt: string;
	updatedAt: string;
	pertTasks: PertTask[];
}

export interface PertTask {
	id: string;
	issueId: string;
	parentIssueId: string | null;
	pertId: string;
	createdAt: string;
	updatedAt: string;
	position_x: number;
	position_y: number;
	ES: number;
	EF: number;
	LS: number;
	LF: number;
	data_position_x: number;
	data_position_y: number;
	dependencies: string;
	issue: Issue;
	parentIssue: Issue | null;
}

export interface Issue {
	id: string;
	title: string;
	description: string;
	issueStatus: 'TODO' | 'IN_PROGRESS' | 'DONE';
	priority: 'LOW' | 'MEDIUM' | 'HIGH';
	duration: number | null;
	createdAt: string;
	updatedAt: string;
	dueDate: string | null;
	projectId: string;
	creatorId: string;
	assigneeId: string;
	parentId: string | null;
}

