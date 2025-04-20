export enum SpaceItemType {
	LIST = 'list',
	FOLDER = 'folder',
	PERT = 'pert',
}

export type User = {
	id: string;
	name: string;
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
  priority: "high" | "medium" | "low";
  position?: { x: number; y: number };
  ES?: number;
  EF?: number;
  LS?: number;
  LF?: number;
}

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
	members: [];
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
