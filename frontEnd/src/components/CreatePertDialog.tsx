'use client';

import { X, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Sample users for assignees
const users = [
	{ id: 1, name: 'John Doe', email: 'john@example.com', avatar: '/avatars/john.png' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: '/avatars/jane.png' },
	{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatar: '/avatars/bob.png' },
];

// Sample tasks list
const tasksList = [
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
];

type SelectedTask = {
	taskId: number;
	taskName: string;
	duration: string;
};

type CreatePertDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: (pertData: {
		projectId: string;
		pertName: string;
		description: string;
		selectedTasks: {
			taskId: number;
			taskName: string;
			duration: number;
		}[];
	}) => void;
	projectId: string;
};

export default function CreatePertDialog({
	open,
	setOpen,
	onConfirm,
	projectId,
}: CreatePertDialogProps) {
	const [pertName, setPertName] = useState('');
	const [description, setDescription] = useState('');
	const [selectedTasks, setSelectedTasks] = useState<SelectedTask[]>([]);
	const [selectedTaskId, setSelectedTaskId] = useState<string>('');
	const [searchTerm, setSearchTerm] = useState('');

	// Add a selected task
	const handleAddTask = () => {
		const taskId = parseInt(selectedTaskId);
		if (!taskId) return;

		// Check if task is already selected
		if (selectedTasks.some((task) => task.taskId === taskId)) {
			return;
		}

		const selectedTask = tasksList.find((task) => task.id === taskId);
		if (selectedTask) {
			setSelectedTasks([
				...selectedTasks,
				{
					taskId,
					taskName: selectedTask.name,
					duration: '',
				},
			]);
			setSelectedTaskId(''); // Reset dropdown
			setSearchTerm(''); // Clear search
		}
	};

	// Remove a task from selection
	const handleRemoveTask = (taskId: number) => {
		setSelectedTasks(selectedTasks.filter((task) => task.taskId !== taskId));
	};

	// Update duration for a specific task
	const handleDurationChange = (taskId: number, duration: string) => {
		setSelectedTasks(
			selectedTasks.map((task) => (task.taskId === taskId ? { ...task, duration } : task)),
		);
	};

	const handleConfirm = () => {
		// Validate that all tasks have durations and PERT has a name
		const allTasksHaveDurations = selectedTasks.every(
			(task) => task.duration !== '' && !isNaN(parseFloat(task.duration)),
		);

		if (!pertName || !allTasksHaveDurations || selectedTasks.length === 0) {
			return;
		}

		onConfirm({
			projectId,
			pertName,
			description,
			selectedTasks: selectedTasks.map((task) => ({
				taskId: task.taskId,
				taskName: task.taskName,
				duration: parseFloat(task.duration),
			})),
		});
		setOpen(false);
	};

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			setPertName('');
			setDescription('');
			setSelectedTasks([]);
			setSelectedTaskId('');
			setSearchTerm('');
		}
	}, [open]);

	// Get tasks that haven't been selected yet and match search term
	const filteredTasks = tasksList.filter((task) => {
		// Not already selected
		const notSelected = !selectedTasks.some((selectedTask) => selectedTask.taskId === task.id);
		// Matches search term
		const matchesSearch =
			searchTerm.trim() === '' || task.name.toLowerCase().includes(searchTerm.toLowerCase());

		return notSelected && matchesSearch;
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Create PERT Diagram</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Add tasks to your PERT diagram with time durations
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<Label htmlFor="pertName">PERT Name</Label>
						<Input
							id="pertName"
							placeholder="Enter PERT diagram name"
							value={pertName}
							onChange={(e) => setPertName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Brief description of the PERT diagram"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={2}
						/>
					</div>

					<div className="space-y-2">
						<Label>Add Tasks</Label>
						<div className="space-y-2">
							<div className="flex space-x-2 items-center">
								<div className="relative flex-1">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										type="text"
										placeholder="Search tasks..."
										className="pl-9"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
								<select
									id="taskSelect"
									className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
									value={selectedTaskId}
									onChange={(e) => setSelectedTaskId(e.target.value)}>
									<option value="">Select</option>
									{filteredTasks.map((task) => (
										<option key={task.id} value={task.id}>
											{task.name}
										</option>
									))}
								</select>
								<Button
									type="button"
									onClick={handleAddTask}
									disabled={!selectedTaskId}>
									Add
								</Button>
							</div>

							{filteredTasks.length === 0 && searchTerm && (
								<p className="text-sm text-muted-foreground">
									No tasks found matching &quot;{searchTerm}&quot;
								</p>
							)}
						</div>
					</div>

					{selectedTasks.length > 0 && (
						<div className="space-y-2">
							<Label>Selected Tasks</Label>
							<div className="border rounded-md divide-y">
								{selectedTasks.map((task) => (
									<div
										key={task.taskId}
										className="flex items-center p-3 justify-between">
										<div className="flex-grow">
											<span className="font-medium">{task.taskName}</span>
										</div>
										<div className="flex items-center space-x-2">
											<Input
												type="number"
												placeholder="Duration (hrs)"
												className="w-32"
												value={task.duration}
												onChange={(e) =>
													handleDurationChange(
														task.taskId,
														e.target.value,
													)
												}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => handleRemoveTask(task.taskId)}>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" type="button" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleConfirm}
						disabled={
							!pertName ||
							selectedTasks.length === 0 ||
							!selectedTasks.every((task) => task.duration !== '')
						}>
						Create
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
