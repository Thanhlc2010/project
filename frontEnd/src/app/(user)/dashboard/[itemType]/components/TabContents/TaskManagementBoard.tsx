'use client';

import IconButton from '@/app/component/descriptionButton';
import { Task, User, useTaskStore, users } from '@/mocks/TaskData';
import { Calendar, MessageSquare, MoreHorizontal, Plus, Search, Trash2, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface TaskCardProps {
	task: Task;
}

interface ColumnProps {
	status: Task['status'];
	tasks: Task[];
}

const Avatar: React.FC<{ user: User; size?: 'sm' | 'md' | 'lg' }> = ({ user, size = 'sm' }) => {
	const sizeClasses = {
		sm: 'w-6 h-6 text-xs',
		md: 'w-8 h-8 text-sm',
		lg: 'w-10 h-10 text-base',
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

const PriorityFlag: React.FC<{ priority: Task['priority']; size?: 'sm' | 'md' | 'lg' }> = ({
	priority,
	size = 'sm',
}) => {
	const priorityColors = {
		Low: 'bg-blue-100 text-blue-800',
		Normal: 'bg-green-100 text-green-800',
		High: 'bg-orange-100 text-orange-800',
		Urgent: 'bg-red-100 text-red-800',
	};

	const prioritySymbols = {
		Low: '▽',
		Normal: '◆',
		High: '▲',
		Urgent: '⚠',
	};

	const sizeClasses = {
		sm: 'text-xs px-1 py-0.5',
		md: 'text-sm px-2 py-1',
		lg: 'text-base px-3 py-1.5',
	};

	return (
		<div
			className={`inline-flex items-center rounded ${sizeClasses[size]} ${priorityColors[priority]} font-medium`}
			title={`Priority: ${priority}`}>
			<span className="mr-1">{prioritySymbols[priority]}</span>
			<span>{priority}</span>
		</div>
	);
};

const PrioritySelector: React.FC<{
	taskId: number;
	priority: Task['priority'];
}> = ({ taskId, priority }) => {
	const { updateTaskPriority } = useTaskStore();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
	const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

	const priorities: Task['priority'][] = ['Low', 'Normal', 'High', 'Urgent'];

	// Calculate dropdown position based on available space
	useEffect(() => {
		if (!isOpen || !buttonRef.current) return;

		const buttonRect = buttonRef.current.getBoundingClientRect();
		const spaceBelow = window.innerHeight - buttonRect.bottom;
		const spaceNeeded = 180; // Approximate height of dropdown

		setDropdownPosition(spaceBelow < spaceNeeded ? 'top' : 'bottom');
	}, [isOpen]);

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

	const handleSelect = (newPriority: Task['priority']) => {
		updateTaskPriority(taskId, newPriority);
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				ref={buttonRef}
				className="cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}>
				<PriorityFlag priority={priority} />
			</div>

			{isOpen && (
				<div
					className={`fixed z-50 min-w-36 bg-white border rounded shadow-lg ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'mt-1'
						}`}
					style={{
						left: buttonRef.current?.getBoundingClientRect().left + 'px',
						top: dropdownPosition === 'top'
							? undefined
							: (buttonRef.current?.getBoundingClientRect().bottom || 0) + 'px',
						bottom: dropdownPosition === 'top'
							? (window.innerHeight - (buttonRef.current?.getBoundingClientRect().top || 0)) + 'px'
							: undefined,
					}}
				>
					<div className="p-2">
						{priorities.map((p) => (
							<div
								key={p}
								className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${p === priority ? 'bg-gray-50' : ''}`}
								onClick={() => handleSelect(p)}
							>
								<PriorityFlag priority={p} />
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const DateSelector: React.FC<{
	taskId: number;
	dueDate: string | null;
}> = ({ taskId, dueDate }) => {
	const { updateDueDate } = useTaskStore();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
	const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

	// Calculate dropdown position based on available space
	useEffect(() => {
		if (!isOpen || !buttonRef.current) return;

		const buttonRect = buttonRef.current.getBoundingClientRect();
		const spaceBelow = window.innerHeight - buttonRect.bottom;
		const spaceNeeded = 300; // Approximate height of dropdown

		setDropdownPosition(spaceBelow < spaceNeeded ? 'top' : 'bottom');
	}, [isOpen]);

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

	// Format date for display
	const formatDate = (dateString: string | null): string => {
		if (!dateString) return 'No date';
		const date = new Date(dateString);
		return date.toLocaleDateString();
	};

	// Handle date change
	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateDueDate(taskId, e.target.value);
	};

	// Handle date removal
	const handleRemoveDate = () => {
		updateDueDate(taskId, '');
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				ref={buttonRef}
				className="cursor-pointer inline-flex items-center text-xs bg-gray-100 text-gray-700 rounded px-1.5 py-0.5 hover:bg-gray-200"
				onClick={() => setIsOpen(!isOpen)}>
				<Calendar className="w-3 h-3 mr-1" />
				{dueDate ? formatDate(dueDate) : 'Add date'}
			</div>

			{isOpen && (
				<div
					className={`fixed z-50 bg-white border rounded shadow-lg p-3 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'mt-1'
						}`}
					style={{
						left: buttonRef.current?.getBoundingClientRect().left + 'px',
						top: dropdownPosition === 'top'
							? undefined
							: (buttonRef.current?.getBoundingClientRect().bottom || 0) + 'px',
						bottom: dropdownPosition === 'top'
							? (window.innerHeight - (buttonRef.current?.getBoundingClientRect().top || 0)) + 'px'
							: undefined,
					}}
				>
					<div className="p-2">
						<h3 className="text-sm font-medium mb-2">Due date</h3>
						<input
							type="date"
							className="w-full border border-gray-300 rounded p-1.5 mb-3"
							value={dueDate || ''}
							onChange={handleDateChange}
						/>
						{dueDate && (
							<button
								className="w-full text-xs text-gray-600 hover:text-red-500 py-1"
								onClick={handleRemoveDate}
							>
								Remove date
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const AssigneeSelector: React.FC<{
	taskId: number;
	assignees: User[];
}> = ({ taskId, assignees }) => {
	const { assignTaskToUsers } = useTaskStore();
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
	const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

	// Calculate dropdown position based on available space
	useEffect(() => {
		if (!isOpen || !buttonRef.current) return;

		const buttonRect = buttonRef.current.getBoundingClientRect();
		const spaceBelow = window.innerHeight - buttonRect.bottom;
		const spaceNeeded = 300; // Approximate height of dropdown

		setDropdownPosition(spaceBelow < spaceNeeded ? 'top' : 'bottom');
	}, [isOpen]);

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

		assignTaskToUsers(taskId, newAssigneeIds);
	};

	// Filter users based on search term
	const filteredUsers = users.filter((user) =>
		user.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				ref={buttonRef}
				className="flex items-center cursor-pointer rounded hover:bg-gray-100 p-1"
				onClick={() => setIsOpen(!isOpen)}>
				{assignees.length > 0 ? (
					<div className="flex -space-x-2 overflow-hidden">
						{assignees.slice(0, 3).map((user) => (
							<div key={user.id} className="inline-block">
								<Avatar user={user} size="sm" />
							</div>
						))}
						{assignees.length > 3 && (
							<div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
								+{assignees.length - 3}
							</div>
						)}
					</div>
				) : (
					<div className="flex items-center text-gray-500 text-xs">
						<UserIcon className="w-4 h-4 mr-1" />
						<span>Assign</span>
					</div>
				)}
			</div>

			{isOpen && (
				<div
					className={`fixed z-50 min-w-64 bg-white border rounded shadow-lg ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'mt-1'
						}`}
					style={{
						left: buttonRef.current?.getBoundingClientRect().left + 'px',
						top: dropdownPosition === 'top'
							? undefined
							: (buttonRef.current?.getBoundingClientRect().bottom || 0) + 'px',
						bottom: dropdownPosition === 'top'
							? (window.innerHeight - (buttonRef.current?.getBoundingClientRect().top || 0)) + 'px'
							: undefined,
					}}
				>
					{/* Search input */}
					<div className="p-2 border-b">
						<div className="relative rounded-md shadow-sm">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-4 w-4 text-gray-400" />
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
									<span className="text-sm">{user.name}</span>
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

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
	const {
		toggleTaskCompletion,
		deleteTask,
		addSubtask,
		updateTaskStatus,
		addCommentToTask,
	} = useTaskStore();

	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState('');
	const [showAddSubtask, setShowAddSubtask] = useState(false);
	const [subtaskName, setSubtaskName] = useState('');

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		e.dataTransfer.setData('taskId', task.id.toString());
		e.currentTarget.classList.add('opacity-50');
	};

	const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove('opacity-50');
	};

	const handleAddSubtask = () => {
		if (subtaskName.trim()) {
			addSubtask(task.id, subtaskName);
			setSubtaskName('');
			setShowAddSubtask(false);
		}
	};

	const handleAddComment = () => {
		if (commentText.trim()) {
			addCommentToTask(task.id, commentText);
			setCommentText('');
		}
	};

	return (
		<div
			className="bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-3 cursor-move"
			draggable
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="flex items-start justify-between mb-2">
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={task.completed}
						onChange={() => toggleTaskCompletion(task.id)}
						className="rounded text-violet-500 focus:ring-violet-500"
					/>
					<h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
						{task.name}
					</h3>
					<div className="pl-2">
						<IconButton onClick={() => { }} />
					</div>
				</div>
				<div className="flex items-center space-x-1.5">
					<button
						className="p-1 rounded hover:bg-gray-100"
						onClick={() => setShowAddSubtask(!showAddSubtask)}
					>
						<Plus className="w-3.5 h-3.5 text-gray-500" />
					</button>
					<button
						className="p-1 rounded hover:bg-gray-100"
						onClick={() => deleteTask(task.id)}
					>
						<Trash2 className="w-3.5 h-3.5 text-gray-500" />
					</button>
					<button className="p-1 rounded hover:bg-gray-100">
						<MoreHorizontal className="w-3.5 h-3.5 text-gray-500" />
					</button>
				</div>
			</div>

			{showAddSubtask && (
				<div className="mb-3 p-2 bg-gray-50 rounded">
					<input
						type="text"
						placeholder="Subtask name"
						value={subtaskName}
						onChange={(e) => setSubtaskName(e.target.value)}
						className="w-full text-sm border border-gray-300 rounded p-1.5 mb-2"
					/>
					<div className="flex justify-end space-x-2">
						<button
							className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-200"
							onClick={() => {
								setShowAddSubtask(false);
								setSubtaskName('');
							}}
						>
							Cancel
						</button>
						<button
							className="px-2 py-1 text-xs bg-violet-600 text-white rounded hover:bg-violet-700"
							onClick={handleAddSubtask}
						>
							Add
						</button>
					</div>
				</div>
			)}

			{task.subtasks.length > 0 && (
				<div className="mb-3 ml-5 space-y-1.5">
					{task.subtasks.map((subtask) => (
						<div key={subtask.id} className="flex items-center text-sm">
							<input
								type="checkbox"
								checked={subtask.completed}
								onChange={() => toggleTaskCompletion(subtask.id)}
								className="mr-2 rounded text-violet-500 focus:ring-violet-500"
							/>
							<span className={subtask.completed ? 'line-through text-gray-500' : ''}>
								{subtask.name}
							</span>
							<span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
								{subtask.status}
							</span>
						</div>
					))}
				</div>
			)}

			<div className="flex flex-wrap gap-2 mb-3">
				<PrioritySelector taskId={task.id} priority={task.priority} />

				<DateSelector taskId={task.id} dueDate={task.dueDate} />

				<button
					className={`inline-flex items-center text-xs rounded px-1.5 py-0.5 ${task.comments.length > 0 ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-700'}`}
					onClick={() => setShowComments(!showComments)}
				>
					<MessageSquare className="w-3 h-3 mr-1" />
					{task.comments.length > 0 ? task.comments.length : 'Add'}
				</button>
			</div>

			{showComments && (
				<div className="mb-3 p-2 bg-gray-50 rounded space-y-2">
					{task.comments.length > 0 ? (
						<div className="space-y-1.5 max-h-24 overflow-y-auto">
							{task.comments.map((comment, idx) => (
								<div key={idx} className="text-xs p-1.5 bg-white border rounded">
									{comment}
								</div>
							))}
						</div>
					) : (
						<p className="text-xs text-gray-500">No comments yet</p>
					)}
					<div className="flex mt-2">
						<input
							type="text"
							placeholder="Add comment..."
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							className="flex-grow text-xs border border-gray-300 rounded-l p-1.5"
							onKeyDown={(e) => {
								if (e.key === 'Enter' && commentText.trim() !== '') {
									handleAddComment();
								}
							}}
						/>
						<button
							className="px-2 text-xs bg-violet-600 text-white rounded-r"
							onClick={handleAddComment}
						>
							Add
						</button>
					</div>
				</div>
			)}

			<div className="flex items-center justify-between mt-3">
				<AssigneeSelector taskId={task.id} assignees={task.assignees} />
			</div>
		</div>
	);
};

const Column: React.FC<ColumnProps> = ({ status, tasks }) => {
	const { addTask, updateTaskStatus } = useTaskStore();
	const [newTaskName, setNewTaskName] = useState('');
	const [isAddingTask, setIsAddingTask] = useState(false);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.currentTarget.classList.add('bg-gray-50');
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove('bg-gray-50');
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.currentTarget.classList.remove('bg-gray-50');

		const taskId = parseInt(e.dataTransfer.getData('taskId'));
		if (taskId) {
			updateTaskStatus(taskId, status);
		}
	};

	const handleAddTask = () => {
		if (newTaskName.trim()) {
			addTask(status, newTaskName);
			setNewTaskName('');
		}
	};

	const columnHeaderStyles = {
		'TO DO': {
			icon: 'bg-gray-300',
			header: 'border-gray-300',
		},
		'IN PROGRESS': {
			icon: 'bg-blue-500',
			header: 'border-blue-300',
		},
		'COMPLETE': {
			icon: 'bg-green-500',
			header: 'border-green-300',
		},
	};

	const statusDisplayNames = {
		'TO DO': 'To Do',
		'IN PROGRESS': 'In Progress',
		'COMPLETE': 'Complete',
	};

	return (
		<div className="w-full h-full flex flex-col bg-gray-100 rounded-md overflow-hidden">
			<div className={`px-3 py-2 border-b ${columnHeaderStyles[status].header} bg-white flex items-center justify-between`}>
				<div className="flex items-center">
					<div className={`w-3 h-3 rounded-full ${columnHeaderStyles[status].icon} mr-2`}></div>
					<span className="font-medium text-sm">{statusDisplayNames[status]}</span>
					<span className="ml-2 text-xs bg-gray-100 px-1.5 rounded-full">{tasks.length}</span>
				</div>
				<button
					className="p-1 rounded hover:bg-gray-100"
					onClick={() => setIsAddingTask(true)}
				>
					<Plus className="w-4 h-4 text-gray-500" />
				</button>
			</div>

			<div
				className="flex-grow p-2 overflow-y-auto"
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}

				{isAddingTask && (
					<div className="bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-3">
						<input
							type="text"
							placeholder="Task name"
							value={newTaskName}
							onChange={(e) => setNewTaskName(e.target.value)}
							autoFocus
							className="w-full border border-gray-300 rounded p-1.5 mb-2"
							onKeyDown={(e) => {
								if (e.key === 'Enter' && newTaskName.trim() !== '') {
									handleAddTask();
								} else if (e.key === 'Escape') {
									setIsAddingTask(false);
								}
							}}
						/>
						<div className="flex justify-end space-x-2">
							<button
								className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-200"
								onClick={() => {
									setIsAddingTask(false);
									setNewTaskName('');
								}}
							>
								Cancel
							</button>
							<button
								className="px-2 py-1 text-xs bg-violet-600 text-white rounded hover:bg-violet-700"
								onClick={handleAddTask}
							>
								Add Task
							</button>
						</div>
					</div>
				)}

				{!isAddingTask && tasks.length === 0 && (
					<div className="flex flex-col items-center justify-center h-32 text-center text-gray-500">
						<p className="text-sm mb-2">No tasks</p>
						<button
							className="text-xs px-2 py-1 text-violet-600 border border-violet-300 rounded hover:bg-violet-50"
							onClick={() => setIsAddingTask(true)}
						>
							+ Add task
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

const TaskManagementBoard = () => {
	const { tasks } = useTaskStore();
	const route = useRouter();

	useEffect(() => {
		const authenticated = localStorage.getItem('authenticated');
		if (!authenticated || authenticated === 'false') {
			route.push('/login');
		}
	}, [route]);

	const logoutHandler = () => {
		localStorage.removeItem('authenticated');
		route.push('/login');
	};

	const mainTasks = tasks.filter(task => !task.parentId);

	const tasksByStatus = {
		'TO DO': mainTasks.filter(task => task.status === 'TO DO'),
		'IN PROGRESS': mainTasks.filter(task => task.status === 'IN PROGRESS'),
		'COMPLETE': mainTasks.filter(task => task.status === 'COMPLETE'),
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center p-3 border-b border-gray-200 gap-3">
				<div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
					<svg
						className="w-4 h-4"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" />
					</svg>
					Filter
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
					Hide Completed
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

				<div>
					<button
						onClick={logoutHandler}
						className="text-xs text-white px-4 py-2 rounded-full bg-red-500 hover:bg-red-600">
						Logout
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow p-4">
				<Column status="TO DO" tasks={tasksByStatus['TO DO']} />
				<Column status="IN PROGRESS" tasks={tasksByStatus['IN PROGRESS']} />
				<Column status="COMPLETE" tasks={tasksByStatus['COMPLETE']} />
			</div>
		</div >
	);
};

export default TaskManagementBoard;