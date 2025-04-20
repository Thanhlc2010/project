'use client';

import { BookmarkIcon, FileText, Folder, List, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import { AvailableTabs } from '../../types';
import WorkloadStatusChart from '../WorkloadStatusChart';
import { Task, User } from '@/common/types';
import CreateListDialog from '@/components/CreateListDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useWorkspaceStore } from '@/store/workspaceStore';

const users: User[] = [
	{ id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
	{ id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
	{ id: '3', name: 'Alex Johnson' },
	{ id: '4', name: 'Maria Garcia' },
	{ id: '5', name: 'David Kim' },
	{ id: '6', name: 'Sarah Brown' },
];

interface WorkspaceDetailsProps {
	tab: AvailableTabs;
	workspaceId: string;
}

export default function WorkspaceDetails({ tab, workspaceId }: WorkspaceDetailsProps) {
	const router = useRouter();
	const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);
	const workspaces = useWorkspaceStore((state) => state.workspaces);
	const addProject = useWorkspaceStore((state) => state.addProject);

	const workspace = workspaces.find((workspace) => workspace.id === workspaceId);
	const projects = workspace?.projects || [];
	const hasProjects = projects.length > 0;

	const [tasks, setTasks] = useState<Task[]>([
		{
			id: 1,
			name: 'Task 1',
			subtasks: [
				{
					id: 5,
					name: 'Subtask 1.1',
					subtasks: [],
					status: 'TO DO',
					completed: false,
					assignees: [],
					dueDate: null,
					priority: 'Normal',
					comments: [],
					parentId: 1,
				},
			],
			status: 'TO DO',
			completed: true,
			assignees: [],
			dueDate: null,
			priority: 'Normal',
			comments: [],
		},
		{
			id: 2,
			name: 'Task 2',
			subtasks: [
				{
					id: 6,
					name: 'Subtask 2.1',
					subtasks: [],
					status: 'COMPLETE',
					completed: true,
					assignees: [users[0]],
					dueDate: null,
					priority: 'Low',
					comments: [],
					parentId: 2,
				},
				{
					id: 7,
					name: 'Subtask 2.2',
					subtasks: [],
					status: 'IN PROGRESS',
					completed: false,
					assignees: [],
					dueDate: null,
					priority: 'Normal',
					comments: [],
					parentId: 2,
				},
			],
			status: 'COMPLETE',
			completed: false,
			assignees: [users[0]],
			dueDate: '2023-12-15',
			priority: 'High',
			comments: ['First iteration complete'],
		},
		{
			id: 3,
			name: 'Task 3',
			subtasks: [],
			status: 'IN PROGRESS',
			completed: true,
			assignees: [users[1]], // Jane Smith
			dueDate: '2023-12-10',
			priority: 'Low',
			comments: [],
		},
		{
			id: 4,
			name: 'Task 4',
			subtasks: [],
			status: 'COMPLETE',
			completed: true,
			assignees: [users[0], users[1], users[2]], // Multiple assignees
			dueDate: '2023-12-05',
			priority: 'Normal',
			comments: ['Needs review', 'Approved'],
		},
	]);

	if (!workspace) {
		return redirect('/dashboard');
	}

	const handleAddListClick = () => {
		setIsCreateListDialogOpen(true);
	};

	const handleConfirmAddList = async (listName: string) => {
		setIsCreateListDialogOpen(false);
		const newProjectId = await addProject(workspace.id, listName);
		router.push(`/dashboard/l/${newProjectId}`);
	};

	return (
		<div className="container mx-auto p-6">
			{tab === AvailableTabs.OVERVIEW && (
				<Card>
					<CardHeader>
						<CardTitle>{workspace.name || 'Workspace Details'}</CardTitle>
						<CardDescription>Viewing workspace with ID: {workspace.id}</CardDescription>
					</CardHeader>
					<CardContent className="bg-gray-50">
						<div className="mt-8 p-6 rounded-lg">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								{/* Recent Section */}
								<Card className="bg-white rounded-lg shadow-sm">
									<CardContent className="p-5">
										<h2 className="text-lg font-medium mb-4">Recent</h2>
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<List size={18} className="text-gray-500" />
												<span>Project 2</span>
												<span className="text-gray-400 text-sm">
													• in Projects
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Folder size={18} className="text-gray-500" />
												<span>Projects</span>
												<span className="text-gray-400 text-sm">
													• in Team Space
												</span>
											</div>
											<div className="flex items-center gap-2">
												<List size={18} className="text-gray-500" />
												<span>Project 1</span>
												<span className="text-gray-400 text-sm">
													• in Projects
												</span>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Docs Section */}
								<Card className="bg-white rounded-lg shadow-sm">
									<CardContent className="p-5">
										<h2 className="text-lg font-medium mb-4">Docs</h2>
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<FileText size={18} className="text-gray-500" />
												<span>Project 1</span>
												<span className="text-gray-400 text-sm">
													• in Projects
												</span>
											</div>
											<div className="flex items-center gap-2">
												<FileText size={18} className="text-gray-500" />
												<span>Project 2</span>
												<span className="text-gray-400 text-sm">
													• in Projects
												</span>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Bookmarks Section */}
								<Card className="bg-white rounded-lg shadow-sm">
									<CardContent className="p-5">
										<h2 className="text-lg font-medium mb-4">Bookmarks</h2>
										<div className="flex flex-col items-center justify-center py-10">
											<div className="bg-gray-100 p-4 rounded-full mb-3 relative">
												<BookmarkIcon
													size={24}
													className="text-indigo-400"
												/>
												<div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1">
													<PlusCircle size={16} />
												</div>
											</div>
											<p className="text-sm text-center text-gray-500 mb-2">
												Bookmarks are the easiest way to save ClickUp items
												or URLs from anywhere on the web
											</p>
											<button className="bg-indigo-500 text-white px-4 py-2 rounded-md text-sm">
												Add Bookmark
											</button>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Folders Section */}
							{/* <div className="mb-6">
								<h2 className="text-lg font-medium mb-3">Folders</h2>
								<Card className="bg-white rounded-lg shadow-sm w-80">
									<CardContent className="p-3">
										<div className="flex items-center gap-2 p-2">
											<Folder size={18} className="text-gray-500" />
											<span>Projects</span>
										</div>
									</CardContent>
								</Card>
							</div> */}

							{/* Empty Tasks Section */}
							<div className="bg-white rounded-lg shadow-sm p-6 mt-8">
								<h2 className="text-lg font-medium mb-6">Lists</h2>

								<div className="flex flex-col items-center justify-center py-10">
									{hasProjects ? (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="w-[100px]">
														Name
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{projects.map((project) => (
													<TableRow key={`project-row-${project.id}`}>
														<TableCell className="font-medium">
															<Link
																href={`/dashboard/l/${project.id}`}>
																{project.name}
															</Link>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									) : (
										<>
											<div className="bg-gray-100 p-4 rounded mb-4">
												<svg
													width="40"
													height="40"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg">
													<rect
														x="4"
														y="5"
														width="16"
														height="16"
														rx="2"
														stroke="#9CA3AF"
														strokeWidth="2"
													/>
													<path
														d="M8 12L11 15L16 9"
														stroke="#9CA3AF"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</div>

											<p className="text-sm text-center text-gray-500 mb-4">
												Add a new List to organize your work
											</p>

											<button
												className="bg-indigo-500 text-white px-4 py-2 rounded-md text-sm"
												onClick={handleAddListClick}>
												Add List
											</button>
										</>
									)}
								</div>
							</div>

							<div className="mt-8">
								<WorkloadStatusChart tasks={tasks} />
							</div>

							{/* Settings button (bottom right) */}
							<div className="fixed bottom-6 right-6">
								<button className="bg-indigo-600 text-white p-3 rounded-full shadow-lg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round">
										<circle cx="12" cy="12" r="3"></circle>
										<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
									</svg>
								</button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
			{tab === AvailableTabs.BOARD && <div>Board</div>}
			{tab === AvailableTabs.LIST && <div>List</div>}

			{/* Dashboard UI added below */}

			<CreateListDialog
				open={isCreateListDialogOpen}
				setOpen={setIsCreateListDialogOpen}
				onConfirm={handleConfirmAddList}
			/>
		</div>
	);
}
