'use client';

import {
	Calendar,
	ChevronDown,
	ChevronRight,
	MessageSquare,
	MoreHorizontal,
	Plus,
	Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import IconButton from '../../../../../component/descriptionButton.jsx';

// Define interfaces for our data
interface User {
	id: string;
	name: string;
	avatar?: string; // Optional avatar URL
}

// Modify the Task interface to support nested subtasks
interface Task {
	id: number;
	name: string;
	subtasks: Task[]; // Changed from number to array of Task objects
	status: 'TO DO' | 'IN PROGRESS' | 'COMPLETE';
	completed: boolean;
	assignees: User[];
	dueDate: string | null;
	priority: 'Low' | 'Normal' | 'High' | 'Urgent';
	comments: string[];
	parentId?: number; // Optional parent ID for tracking hierarchy
	ES?: number;
	EF?: number;
	LS?: number;
	LF?: number;
}

interface TaskRowProps {
	task: Task;
}

interface NewTaskRowProps {
	status: Task['status'];
}

interface StatusDropZoneProps {
	status: Task['status'];
	children: React.ReactNode;
}

// Sample users
const users: User[] = [
	{ id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
	{ id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
	{ id: '3', name: 'Alex Johnson' },
	{ id: '4', name: 'Maria Garcia' },
	{ id: '5', name: 'David Kim' },
	{ id: '6', name: 'Sarah Brown' },
];

const TaskManagementUI = () => {
	const route = useRouter();

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

	const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

	const addTask = (status: Task['status'], taskName: string): void => {
		if (!taskName || taskName.trim() === '') return;

		const newTask: Task = {
			id: tasks.length + 1,
			name: taskName,
			subtasks: [],
			status: status,
			completed: false,
			assignees: [],
			dueDate: null,
			priority: 'Normal',
			comments: [],
		};

		setTasks([...tasks, newTask]);
	};

	const addSubtask = (parentTaskId: number, subtaskName: string): void => {
		if (!subtaskName.trim()) return;

		const newId = Math.max(...tasks.flatMap((t) => [t.id, ...t.subtasks.map((s) => s.id)])) + 1;

		const newSubtask: Task = {
			id: newId,
			name: subtaskName,
			subtasks: [],
			status: 'TO DO',
			completed: false,
			assignees: [],
			dueDate: null,
			priority: 'Normal',
			comments: [],
			parentId: parentTaskId,
		};

		setTasks(
			tasks.map((task) =>
				task.id === parentTaskId
					? { ...task, subtasks: [...task.subtasks, newSubtask] }
					: task,
			),
		);
	};

	const updateSubtask = (
		parentTaskId: number,
		subtaskId: number,
		updates: Partial<Task>,
	): void => {
		setTasks(
			tasks.map((task) =>
				task.id === parentTaskId
					? {
						...task,
						subtasks: task.subtasks.map((subtask) =>
							subtask.id === subtaskId ? { ...subtask, ...updates } : subtask,
						),
					}
					: task,
			),
		);
	};

	const deleteSubtask = (parentTaskId: number, subtaskId: number): void => {
		setTasks(
			tasks.map((task) =>
				task.id === parentTaskId
					? {
						...task,
						subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
					}
					: task,
			),
		);
	};

	const updateTaskStatus = (taskId: number, newStatus: Task['status']): void => {
		setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
	};

	const updateTaskPriority = (taskId: number, newPriority: Task['priority']): void => {
		setTasks(
			tasks.map((task) => (task.id === taskId ? { ...task, priority: newPriority } : task)),
		);
	};

	const assignTaskToUsers = (taskId: number, userIds: string[]): void => {
		setTasks(
			tasks.map((task) =>
				task.id === taskId
					? {
						...task,
						assignees:
							userIds.length > 0
								? users.filter((user) => userIds.includes(user.id))
								: [],
					}
					: task,
			),
		);
	};

	const addCommentToTask = (taskId: number, comment: string): void => {
		if (!comment.trim()) return;

		setTasks(
			tasks.map((task) =>
				task.id === taskId ? { ...task, comments: [...task.comments, comment] } : task,
			),
		);
	};

	const updateDueDate = (taskId: number, date: string): void => {
		setTasks(tasks.map((task) => (task.id === taskId ? { ...task, dueDate: date } : task)));
	};

	const countByStatus = (status: Task['status']): number => {
		return tasks.filter((task) => task.status === status && !task.parentId).length;
	};

	const Avatar: React.FC<{ user: User; size?: 'sm' | 'md' | 'lg' }> = ({ user, size = 'sm' }) => {
		const sizeClasses = {
			sm: 'w-8 h-8 text-xs',
			md: 'w-10 h-10 text-sm',
			lg: 'w-12 h-12 text-base',
		};

		const getInitials = (name: string): string => {
			const parts = name.split(' ');
			if (parts.length >= 2) {
				return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
			}
			return name.substring(0, 2).toUpperCase();
		};

		return (
			<div
				className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden`}
				title={user.name}>
				{user.avatar ? (
					<img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
				) : (
					<div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-semibold">
						{getInitials(user.name)}
					</div>
				)}
			</div>
		);
	};

	const AssigneeSelector: React.FC<{
		taskId: number;
		assignees: User[];
		parentTaskId?: number; // Add optional parentTaskId prop to identify subtasks
	}> = ({ taskId, assignees, parentTaskId }) => {
		const [isOpen, setIsOpen] = useState(false);
		const [searchTerm, setSearchTerm] = useState('');
		const dropdownRef = useRef<HTMLDivElement>(null);

		// Handle clicking outside to close dropdown
		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
					setIsOpen(false);
				}
			};

			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [dropdownRef]);

		const toggleUser = (userId: string): void => {
			const isAssigned = assignees.some((user) => user.id === userId);
			const newAssigneeIds = isAssigned
				? assignees.filter((user) => user.id !== userId).map((user) => user.id)
				: [...assignees.map((user) => user.id), userId];

			// Use different updating method based on whether it's a subtask or main task
			if (parentTaskId) {
				// It's a subtask
				updateSubtask(parentTaskId, taskId, {
					assignees: newAssigneeIds.length > 0
						? users.filter((user) => newAssigneeIds.includes(user.id))
						: []
				});
			} else {
				// It's a main task
				assignTaskToUsers(taskId, newAssigneeIds);
			}
		};

		// Filter users based on search term
		const filteredUsers = users.filter((user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);

		return (
			<div className="relative" ref={dropdownRef}>
				<div
					className="border rounded p-1 bg-white flex items-center cursor-pointer min-w-[120px]"
					onClick={() => setIsOpen(!isOpen)}>
					{assignees.length > 0 ? (
						<div className="flex -space-x-2 overflow-hidden">
							{assignees.slice(0, 3).map((user) => (
								<div key={user.id} className="inline-block">
									<Avatar user={user} size="sm" />
								</div>
							))}
							{assignees.length > 3 && (
								<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
									+{assignees.length - 3}
								</div>
							)}
						</div>
					) : (
						<span className="text-gray-500">Unassigned</span>
					)}
					<svg className="w-4 h-4 ml-auto" viewBox="0 0 20 20" fill="currentColor">
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</div>

				{isOpen && (
					<div className="absolute z-10 mt-1 w-72 bg-white border rounded shadow-lg">
						{/* Search input */}
						<div className="p-2 border-b">
							<div className="relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										className="h-4 w-4 text-gray-400"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fillRule="evenodd"
											d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<input
									type="text"
									className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
									placeholder="Search users..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									onClick={(e) => e.stopPropagation()}
								/>
								{searchTerm && (
									<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
										<button
											className="text-gray-400 hover:text-gray-500"
											onClick={(e) => {
												e.stopPropagation();
												setSearchTerm('');
											}}>
											<svg
												className="h-4 w-4"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor">
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
								)}
							</div>
						</div>

						{/* User list */}
						<div className="p-2 max-h-60 overflow-y-auto">
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<div
										key={user.id}
										className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											toggleUser(user.id);
										}}>
										<input
											type="checkbox"
											checked={assignees.some((a) => a.id === user.id)}
											readOnly
											onClick={(e) => e.stopPropagation()}
										/>
										<Avatar user={user} size="sm" />
										<span>{user.name}</span>
									</div>
								))
							) : (
								<div className="text-center py-4 text-gray-500">No users found</div>
							)}
						</div>
					</div>
				)}
			</div>
		);
	};

	const PriorityFlag: React.FC<{ priority: Task['priority']; size?: 'sm' | 'md' | 'lg' }> = ({
		priority,
		size = 'md',
	}) => {
		const priorityColors = {
			Low: 'bg-blue-200 text-blue-800',
			Normal: 'bg-green-200 text-green-800',
			High: 'bg-orange-200 text-orange-800',
			Urgent: 'bg-red-200 text-red-800',
		};

		const prioritySymbols = {
			Low: '▽',
			Normal: '◆',
			High: '▲',
			Urgent: '⚠',
		};

		const sizeClasses = {
			sm: 'text-xs px-1.5 py-0.5',
			md: 'text-sm px-2 py-1',
			lg: 'text-base px-3 py-1.5',
		};

		return (
			<div
				className={`flex items-center rounded ${sizeClasses[size]} ${priorityColors[priority]} font-medium`}
				title={`Priority: ${priority}`}>
				<span className="mr-1">{prioritySymbols[priority]}</span>
				<span>{priority}</span>
			</div>
		);
	};
	const PrioritySelector: React.FC<{
		taskId: number;
		priority: Task['priority'];
		updatePriority: (taskId: number, priority: Task['priority']) => void;
	}> = ({ taskId, priority, updatePriority }) => {
		const [isOpen, setIsOpen] = useState(false);

		const priorities: Task['priority'][] = ['Low', 'Normal', 'High', 'Urgent'];

		return (
			<div className="relative">
				<div
					className="border rounded-md p-1.5   flex items-center w-full cursor-pointer hover:bg-gray-50 transition-colors"
					onClick={() => setIsOpen(!isOpen)}>
					<PriorityFlag priority={priority} />
					<ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
				</div>

				{isOpen && (
					<div className="absolute z-10 mt-1 w-40 bg-white border rounded-md shadow-lg">
						<div className="p-1">
							{priorities.map((p) => (
								<div
									key={p}
									className="cursor-pointer hover:bg-gray-100 rounded-md p-1.5 flex items-center"
									onClick={() => {
										updatePriority(taskId, p);
										setIsOpen(false);
									}}>
									<PriorityFlag priority={p} />
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	const TaskRow: React.FC<TaskRowProps> = ({ task }) => {
		const [isEditing, setIsEditing] = useState<boolean>(false);
		const [editedName, setEditedName] = useState<string>(task.name);
		const [showComments, setShowComments] = useState<boolean>(false);
		const [taskCommentText, setTaskCommentText] = useState<string>('');
		const [showSubtasks, setShowSubtasks] = useState<boolean>(false);
		const [newSubtaskName, setNewSubtaskName] = useState<string>('');
		const [addingSubtask, setAddingSubtask] = useState<boolean>(false);

		const handleNameSave = (): void => {
			if (editedName.trim() !== '') {
				setTasks(tasks.map((t) => (t.id === task.id ? { ...t, name: editedName } : t)));
			} else {
				setEditedName(task.name);
			}
			setIsEditing(false);
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
			if (e.key === 'Enter') {
				handleNameSave();
			} else if (e.key === 'Escape') {
				setEditedName(task.name);
				setIsEditing(false);
			}
		};

		const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>): void => {
			e.dataTransfer.setData('taskId', task.id.toString());
			e.dataTransfer.effectAllowed = 'move';
			setTimeout(() => {
				setDraggedTaskId(task.id);
			}, 10);
		};

		const handleDragEnd = (): void => {
			setDraggedTaskId(null);
		};

		const handleAddSubtask = (): void => {
			if (newSubtaskName.trim() === '') return;

			addSubtask(task.id, newSubtaskName);
			setNewSubtaskName('');
			setAddingSubtask(false);
			setShowSubtasks(true);
		};

		// Status color mapping
		const statusColors = {
			'TO DO': 'bg-gray-100 text-gray-700',
			'IN PROGRESS': 'bg-blue-100 text-blue-700',
			COMPLETE: 'bg-green-100 text-green-700',
		};

		return (
			<>
				<tr
					className={`border-b border-gray-200 hover:bg-gray-50 ${draggedTaskId === task.id ? 'opacity-50' : ''} transition-colors`}
					draggable="true"
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}>
					<td className="px-4 py-3">
						<div className="flex items-center justify-center">
							<input
								type="checkbox"
								checked={task.completed}
								onChange={() => {
									setTasks(
										tasks.map((t) =>
											t.id === task.id
												? { ...t, completed: !t.completed }
												: t,
										),
									);
								}}
								className="rounded text-violet-500 focus:ring-violet-500"
							/>
						</div>
					</td>
					<td className="px-4 py-3">
						{isEditing ? (
							<input
								type="text"
								value={editedName}
								className="border rounded-md p-1.5 w-full focus:ring-violet-500 focus:border-violet-500"
								onChange={(e) => setEditedName(e.target.value)}
								onBlur={handleNameSave}
								onKeyDown={handleKeyDown}
								onClick={(e) => e.stopPropagation()}
								autoFocus
							/>
						) : (
							<div className="flex items-center">
								<div
									className="flex items-center cursor-pointer "
									onClick={() => {
										setIsEditing(true);
										setEditedName(task.name);
									}}>
									{task.subtasks.length > 0 && (
										<button
											className="mr-2 w-5 h-5 rounded-md hover:bg-gray-200 flex items-center justify-center transition-colors"
											onClick={(e) => {
												e.stopPropagation();
												setShowSubtasks(!showSubtasks);
											}}>
											{showSubtasks ? (
												<ChevronDown className="w-4 h-4 text-gray-500" />
											) : (
												<ChevronRight className="w-4 h-4 text-gray-500" />
											)}
										</button>
									)}

									<span
										className={
											task.completed ? 'line-through text-gray-500' : ''
										}>
										{task.name}
									</span>

								</div>
								<div className="pl-2">
									<IconButton onClick={() => { }} />
								</div>

								<div className="ml-auto flex items-center">
									{task.subtasks.length > 0 && (
										<span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
											{task.subtasks.length}
										</span>
									)}

									<button
										className="ml-2 p-1 text-xs text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
										onClick={(e) => {
											e.stopPropagation();
											setAddingSubtask(!addingSubtask);
											if (!addingSubtask) {
												setTimeout(() => {
													const input = document.getElementById(
														`new-subtask-${task.id}`,
													);
													if (input) input.focus();
												}, 100);
											}
										}}
										title="Add subtask">
										<Plus className="w-3.5 h-3.5" />
									</button>
								</div>
							</div>
						)}
					</td>
					<td className="px-4 py-3">
						<AssigneeSelector taskId={task.id} assignees={task.assignees} />
					</td>
					<td className="px-4 py-3">
						<div className="relative flex items-center">
							<input
								type="date"
								className="border rounded-md p-1.5 pl-8 focus:ring-violet-500 focus:border-violet-500"
								value={task.dueDate || ''}
								onChange={(e) => updateDueDate(task.id, e.target.value)}
							/>
							<Calendar className="w-4 h-4 text-gray-400 absolute left-2" />
						</div>
					</td>
					<td className="px-4 py-3">
						<PrioritySelector
							taskId={task.id}
							priority={task.priority}
							updatePriority={updateTaskPriority}
						/>
					</td>
					<td className="px-4 py-3">
						<select
							className="border rounded-md p-1.5 bg-white focus:ring-violet-500 focus:border-violet-500"
							value={task.status}
							onChange={(e) =>
								updateTaskStatus(task.id, e.target.value as Task['status'])
							}>
							<option value="TO DO">To Do</option>
							<option value="IN PROGRESS">In Progress</option>
							<option value="COMPLETE">Complete</option>
						</select>
					</td>
					<td className="px-4 py-3">
						<button
							className={`px-2.5 py-1.5 text-xs rounded-md flex items-center gap-1.5 ${task.comments.length > 0 ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-700'} hover:bg-opacity-80 transition-colors`}
							onClick={(e) => {
								e.stopPropagation();
								setShowComments(!showComments);
							}}>
							<MessageSquare className="w-3.5 h-3.5" />
							{task.comments.length > 0 ? task.comments.length : 'Add'}
						</button>
					</td>
					<td className="px-4 py-3">
						<div className="flex justify-center">
							<MoreHorizontal className="w-4 h-4 text-gray-500 cursor-pointer" />
						</div>
					</td>
					<td className="px-4 py-3">
						<div className="flex justify-center">
							<button
								className="p-1 rounded-md hover:bg-red-100 hover:text-red-500 transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									setTasks(tasks.filter((t) => t.id !== task.id));
								}}>
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
					</td>
				</tr>

				{addingSubtask && (
					<tr className="bg-gray-50">
						<td></td>
						<td colSpan={8} className="px-4 py-2">
							<div className="flex items-center pl-8 gap-2">
								<input
									id={`new-subtask-${task.id}`}
									type="text"
									placeholder="Enter subtask name..."
									className="border rounded-md p-1.5 flex-grow focus:ring-violet-500 focus:border-violet-500"
									value={newSubtaskName}
									onChange={(e) => setNewSubtaskName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											handleAddSubtask();
										} else if (e.key === 'Escape') {
											setAddingSubtask(false);
											setNewSubtaskName('');
										}
									}}
								/>
								<button
									className="px-3 py-1.5 text-xs bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
									onClick={handleAddSubtask}>
									Add
								</button>
								<button
									className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
									onClick={() => {
										setAddingSubtask(false);
										setNewSubtaskName('');
									}}>
									Cancel
								</button>
							</div>
						</td>
					</tr>
				)}

				{showSubtasks &&
					task.subtasks.map((subtask) => (
						<SubtaskRow
							key={subtask.id}
							parentTaskId={task.id}
							subtask={subtask}
							updateSubtask={updateSubtask}
							deleteSubtask={deleteSubtask}
						/>
					))}

				{showComments && (
					<tr className="bg-gray-50">
						<td colSpan={9} className="px-12 py-3">
							<div className="mb-3">
								{task.comments.length > 0 ? (
									<div className="space-y-2">
										{task.comments.map((comment, idx) => (
											<div
												key={idx}
												className="p-2.5 bg-white rounded-md border shadow-sm">
												{comment}
											</div>
										))}
									</div>
								) : (
									<div className="text-sm text-gray-500">No comments yet</div>
								)}
							</div>
							<div className="flex">
								<input
									type="text"
									className="border rounded-l-md p-2 flex-grow focus:ring-violet-500 focus:border-violet-500"
									placeholder="Add a comment..."
									value={taskCommentText}
									onChange={(e) => setTaskCommentText(e.target.value)}
									onClick={(e) => e.stopPropagation()}
									onKeyDown={(e) => {
										e.stopPropagation();
										if (e.key === 'Enter' && taskCommentText.trim() !== '') {
											addCommentToTask(task.id, taskCommentText);
											setTaskCommentText('');
										}
									}}
								/>
								<button
									className="bg-violet-600 text-white rounded-r-md px-3 hover:bg-violet-700 transition-colors"
									onClick={(e) => {
										e.stopPropagation();
										if (taskCommentText.trim() !== '') {
											addCommentToTask(task.id, taskCommentText);
											setTaskCommentText('');
										}
									}}>
									Add
								</button>
							</div>
						</td>
					</tr>
				)}
			</>
		);
	};
	const SubtaskRow: React.FC<{
		parentTaskId: number;
		subtask: Task;
		updateSubtask: (parentId: number, subtaskId: number, updates: Partial<Task>) => void;
		deleteSubtask: (parentId: number, subtaskId: number) => void;
	}> = ({ parentTaskId, subtask, updateSubtask, deleteSubtask }) => {
		const [isEditing, setIsEditing] = useState<boolean>(false);
		const [editedName, setEditedName] = useState<string>(subtask.name);

		const handleNameSave = (): void => {
			if (editedName.trim() !== '') {
				updateSubtask(parentTaskId, subtask.id, { name: editedName });
			} else {
				setEditedName(subtask.name);
			}
			setIsEditing(false);
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
			if (e.key === 'Enter') {
				handleNameSave();
			} else if (e.key === 'Escape') {
				setEditedName(subtask.name);
				setIsEditing(false);
			}
		};

		// Add drag and drop functionality
		const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>): void => {
			e.dataTransfer.setData('subtaskId', subtask.id.toString());
			e.dataTransfer.setData('parentTaskId', parentTaskId.toString());
			e.dataTransfer.effectAllowed = 'move';
			setTimeout(() => {
				setDraggedTaskId(subtask.id);
			}, 10);
		};

		const handleDragEnd = (): void => {
			setDraggedTaskId(null);
		};

		return (
			<tr
				className={`border-b border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors ${draggedTaskId === subtask.id ? 'opacity-50' : ''}`}
				draggable="true"
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}>
				<td className="px-4 py-3">
					<div className="flex items-center justify-center">
						<input
							type="checkbox"
							checked={subtask.completed}
							onChange={() => {
								updateSubtask(parentTaskId, subtask.id, {
									completed: !subtask.completed,
								});
							}}
							className="rounded text-violet-500 focus:ring-violet-500"
						/>
					</div>
				</td>
				<td className="px-4 py-3">
					{isEditing ? (
						<input
							type="text"
							value={editedName}
							className="border rounded-md p-1.5 w-full focus:ring-violet-500 focus:border-violet-500"
							onChange={(e) => setEditedName(e.target.value)}
							onBlur={handleNameSave}
							onKeyDown={handleKeyDown}
							onClick={(e) => e.stopPropagation()}
							autoFocus
						/>
					) : (
						<div
							className="flex items-center cursor-pointer ml-8"
							onClick={() => {
								setIsEditing(true);
								setEditedName(subtask.name);
							}}>
							<span className="text-gray-400 mr-2">↳</span>
							<span className={subtask.completed ? 'line-through text-gray-500' : ''}>
								{subtask.name}
							</span>
						</div>
					)}
				</td>
				<td className="px-4 py-3">
					<AssigneeSelector taskId={subtask.id} assignees={subtask.assignees} parentTaskId={parentTaskId} />
				</td>
				<td className="px-4 py-3">
					<div className="relative flex items-center">
						<input
							type="date"
							className="border rounded-md p-1.5 pl-8 focus:ring-violet-500 focus:border-violet-500"
							value={subtask.dueDate || ''}
							onChange={(e) =>
								updateSubtask(parentTaskId, subtask.id, { dueDate: e.target.value })
							}
						/>
						<Calendar className="w-4 h-4 text-gray-400 absolute left-2" />
					</div>
				</td>
				<td className="px-4 py-3">
					<PrioritySelector
						taskId={subtask.id}
						priority={subtask.priority}
						updatePriority={(id, priority) =>
							updateSubtask(parentTaskId, subtask.id, { priority })
						}
					/>
				</td>
				<td className="px-4 py-3">
					<select
						className="border rounded-md p-1.5 bg-white focus:ring-violet-500 focus:border-violet-500"
						value={subtask.status}
						onChange={(e) =>
							updateSubtask(parentTaskId, subtask.id, {
								status: e.target.value as Task['status'],
							})
						}>
						<option value="TO DO">To Do</option>
						<option value="IN PROGRESS">In Progress</option>
						<option value="COMPLETE">Complete</option>
					</select>
				</td>
				<td className="px-4 py-3">
					<span className="text-xs px-2.5 py-1.5 rounded-md bg-gray-200 text-gray-700 flex items-center gap-1.5 w-fit">
						<MessageSquare className="w-3.5 h-3.5" />
						{subtask.comments.length > 0 ? subtask.comments.length : '0'}
					</span>
				</td>
				<td className="px-4 py-3"></td>
				<td className="px-4 py-3">
					<div className="flex justify-center">
						<button
							className="p-1 rounded-md hover:bg-red-100 hover:text-red-500 transition-colors"
							onClick={() => deleteSubtask(parentTaskId, subtask.id)}>
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				</td>
			</tr>
		);
	};
	const NewTaskRow: React.FC<NewTaskRowProps> = ({ status }) => {
		const [localTaskName, setLocalTaskName] = useState<string>('');

		const handleAddTask = (): void => {
			if (localTaskName.trim() === '') return;

			addTask(status, localTaskName);
			setLocalTaskName('');
		};

		return (
			<tr className="border-b border-gray-200 hover:bg-gray-50 text-gray-500">
				<td colSpan={9} className="px-4 py-3">
					<div className="flex items-center pl-10 gap-2">
						<svg
							className="w-4 h-4"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
						</svg>
						<input
							type="text"
							placeholder="Add new task..."
							className="border-none outline-none bg-transparent flex-grow"
							value={localTaskName}
							onChange={(e) => setLocalTaskName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleAddTask();
								}
							}}
						/>
						<button
							className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleAddTask();
							}}>
							Add
						</button>
					</div>
				</td>
			</tr>
		);
	};

	const StatusDropZone: React.FC<StatusDropZoneProps> = ({ status, children }) => {
		const dropZoneRef = useRef<HTMLDivElement>(null);
		const [isOver, setIsOver] = useState<boolean>(false);

		const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
			e.preventDefault();
			if (!isOver) setIsOver(true);
		};

		const handleDragLeave = (): void => {
			setIsOver(false);
		};

		const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
			e.preventDefault();
			setIsOver(false);

			const taskId = parseInt(e.dataTransfer.getData('taskId'));
			const subtaskId = e.dataTransfer.getData('subtaskId');
			const parentTaskId = e.dataTransfer.getData('parentTaskId');

			if (subtaskId && parentTaskId) {
				// Handle subtask drop
				updateSubtask(parseInt(parentTaskId), parseInt(subtaskId), { status });
				setDraggedTaskId(null);
			} else if (taskId) {
				// Handle main task drop
				updateTaskStatus(taskId, status);
				setDraggedTaskId(null);
			}
		};

		return (
			<div
				ref={dropZoneRef}
				className={`mt-6 ${isOver ? 'bg-blue-50' : ''}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}>
				{children}
			</div>
		);
	};

	return (
		<div className="flex flex-col w-full min-h-screen bg-white text-gray-800">
			<div className="flex items-center p-3 border-b border-gray-200 gap-3">
				<div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
					<svg
						className="w-4 h-4"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<rect
							x="2"
							y="2"
							width="5"
							height="5"
							rx="1"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<rect
							x="2"
							y="9"
							width="5"
							height="5"
							rx="1"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<rect
							x="9"
							y="2"
							width="5"
							height="5"
							rx="1"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<rect
							x="9"
							y="9"
							width="5"
							height="5"
							rx="1"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
					</svg>
					Group: Status
				</div>

				<div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
					<svg
						className="w-4 h-4"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" />
					</svg>
					Subtasks
				</div>

				<div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
					<svg
						className="w-4 h-4"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M2 3H14M2 8H14M2 13H14" stroke="currentColor" strokeWidth="1.5" />
					</svg>
					Columns
				</div>

				<div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
					<svg
						className="w-4 h-4"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M2 4H14M6 8H14M10 12H14" stroke="currentColor" strokeWidth="1.5" />
					</svg>
					Filter
				</div>

				<div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
					<svg
						className="w-4 h-4"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
						<circle cx="8" cy="8" r="2" fill="currentColor" />
					</svg>
					Me mode
				</div>

				<div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
					<svg
						className="w-4 h-4"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
						<path
							d="M13 14C13 11.2386 10.7614 9 8 9C5.23858 9 3 11.2386 3 14"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
					</svg>
					Assignee
				</div>

				<div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
					<svg
						className="w-4 h-4"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
						<path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" />
					</svg>
					Closed
				</div>

				<div className="flex items-center ml-auto border border-gray-200 rounded px-3 py-1.5">
					<svg
						className="w-4 h-4 text-gray-400 mr-2"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
						<path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" />
					</svg>
					<input
						type="text"
						placeholder="Search..."
						className="border-none outline-none text-sm w-48"
					/>
				</div>

				<div className="flex items-center justify-center p-1.5 rounded hover:bg-gray-100 cursor-pointer">
					<svg
						className="w-4 h-4 text-gray-500"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<circle cx="8" cy="8" r="1" fill="currentColor" />
						<circle cx="12" cy="8" r="1" fill="currentColor" />
						<circle cx="4" cy="8" r="1" fill="currentColor" />
					</svg>
				</div>
			</div>

			<StatusDropZone status="COMPLETE">
				<div className="flex items-center px-4 py-2 border-b border-gray-200">
					<div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 mr-2">
						<svg
							className="w-3 h-3 text-white"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M3 8L7 12L13 4"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<div className="text-xs font-bold uppercase">Complete</div>
					<div className="ml-2 text-xs text-gray-500">{countByStatus('COMPLETE')}</div>
					<div className="ml-auto cursor-pointer">
						<svg
							className="w-4 h-4 text-gray-500"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
						</svg>
					</div>
				</div>

				<table className="w-full border-collapse">
					<thead>
						<tr className="text-left text-sm text-gray-500">
							<th className="w-10 px-4 py-3"></th>
							<th className="px-4 py-3">Name</th>
							<th className="px-4 py-3">Assignee</th>
							<th className="px-4 py-3">Due date</th>
							<th className="px-4 py-3">Priority</th>
							<th className="px-4 py-3">Status</th>
							<th className="px-4 py-3">Comments</th>
							<th className="w-10 px-4 py-3"></th>
							<th className="w-10 px-4 py-3"></th>
						</tr>
					</thead>
					<tbody>
						{tasks
							.filter((task) => task.status === 'COMPLETE' && !task.parentId)
							.map((task) => (
								<TaskRow key={task.id} task={task} />
							))}
						<NewTaskRow status="COMPLETE" />
					</tbody>
				</table>
			</StatusDropZone>

			<StatusDropZone status="IN PROGRESS">
				<div className="flex items-center px-4 py-2 border-b border-gray-200">
					<div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 mr-2">
						<svg
							className="w-3 h-3 text-white"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<circle
								cx="8"
								cy="8"
								r="5"
								fill="none"
								stroke="white"
								strokeWidth="2"
							/>
							<path
								d="M5 8L7 10L11 6"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<div className="text-xs font-bold uppercase">In Progress</div>
					<div className="ml-2 text-xs text-gray-500">{countByStatus('IN PROGRESS')}</div>
					<div className="ml-auto cursor-pointer">
						<svg
							className="w-4 h-4 text-gray-500"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
						</svg>
					</div>
				</div>

				<table className="w-full border-collapse">
					<thead>
						<tr className="text-left text-sm text-gray-500">
							<th className="w-10 px-4 py-3"></th>
							<th className="px-4 py-3">Name</th>
							<th className="px-4 py-3">Assignee</th>
							<th className="px-4 py-3">Due date</th>
							<th className="px-4 py-3">Priority</th>
							<th className="px-4 py-3">Status</th>
							<th className="px-4 py-3">Comments</th>
							<th className="w-10 px-4 py-3"></th>
							<th className="w-10 px-4 py-3"></th>
						</tr>
					</thead>
					<tbody>
						{tasks
							.filter((task) => task.status === 'IN PROGRESS' && !task.parentId)
							.map((task) => (
								<TaskRow key={task.id} task={task} />
							))}
						<NewTaskRow status="IN PROGRESS" />
					</tbody>
				</table>
			</StatusDropZone>

			<StatusDropZone status="TO DO">
				<div className="flex items-center px-4 py-2 border-b border-gray-200">
					<div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 mr-2">
						<svg
							className="w-3 h-3 text-white"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<circle cx="8" cy="8" r="5" stroke="white" strokeWidth="2" />
						</svg>
					</div>
					<div className="text-xs font-bold uppercase">To Do</div>
					<div className="ml-2 text-xs text-gray-500">{countByStatus('TO DO')}</div>
					<div className="ml-auto cursor-pointer">
						<svg
							className="w-4 h-4 text-gray-500"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
						</svg>
					</div>
				</div>

				<table className="w-full border-collapse">
					<thead>
						<tr className="text-left text-sm text-gray-500">
							<th className="w-10 px-4 py-3"></th>
							<th className="px-4 py-3">Name</th>
							<th className="px-4 py-3">Assignee</th>
							<th className="px-4 py-3">Due date</th>
							<th className="px-4 py-3">Priority</th>
							<th className="px-4 py-3">Status</th>
							<th className="px-4 py-3">Comments</th>
							<th className="w-10 px-4 py-3"></th>
							<th className="w-10 px-4 py-3"></th>
						</tr>
					</thead>
					<tbody>
						{tasks
							.filter((task) => task.status === 'TO DO' && !task.parentId)
							.map((task) => (
								<TaskRow key={task.id} task={task} />
							))}
						<NewTaskRow status="TO DO" />
					</tbody>
				</table>
			</StatusDropZone>
		</div>
	);
};

export default TaskManagementUI;
