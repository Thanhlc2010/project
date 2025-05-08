'use client';

import { useEffect, useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import type { Task } from '@/common/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type Assignee = {
	id: string;
	name: string;
	avatar?: string;
};

type UserStatusData = {
	name: string;
	todo: number;
	inProgress: number;
	complete: number;
	userId: string;
};

export default function WorkloadUserStatusChart({ tasks }: { tasks: Task[] }) {
	const [chartData, setChartData] = useState<UserStatusData[]>([]);
	const [allUsers, setAllUsers] = useState<Assignee[]>([]);
	const [selectedUser, setSelectedUser] = useState<string>('all');

	// Status colors
	const statusColors = {
		todo: '#94979B',
		inProgress: '#2196F3',
		complete: '#4CAF50',
	};

	useEffect(() => {
		// Extract all unique users from tasks
		const usersMap = new Map<string, Assignee>();

		// Count tasks by user and status
		const userStatusCounts: Record<
			string,
			{ todo: number; inProgress: number; complete: number; name: string }
		> = {};

		// Add an entry for unassigned tasks
		userStatusCounts['unassigned'] = {
			todo: 0,
			inProgress: 0,
			complete: 0,
			name: 'Unassigned',
		};

		const processTask = (task: Task) => {
			const status = task.status.toUpperCase();
			const statusKey =
				status === 'TO DO' ? 'todo' : status === 'IN PROGRESS' ? 'inProgress' : 'complete';

			if (task.assignees && task.assignees.length > 0) {
				// Add each assignee to the users map
				task.assignees.forEach((assignee: Assignee) => {
					usersMap.set(assignee.id, assignee);

					// Initialize user in counts if not exists
					if (!userStatusCounts[assignee.id]) {
						userStatusCounts[assignee.id] = {
							todo: 0,
							inProgress: 0,
							complete: 0,
							name: assignee.name,
						};
					}

					// Increment the appropriate status count
					userStatusCounts[assignee.id][statusKey]++;
				});
			} else {
				// Count unassigned tasks
				userStatusCounts['unassigned'][statusKey]++;
			}

			// Process subtasks
			if (task.subtasks && task.subtasks.length > 0) {
				task.subtasks.forEach(processTask);
			}
		};

		// Process all tasks
		tasks.forEach(processTask);

		// Convert to array format for chart
		const data = Object.keys(userStatusCounts).map((userId) => ({
			userId,
			name: userStatusCounts[userId].name,
			todo: userStatusCounts[userId].todo,
			inProgress: userStatusCounts[userId].inProgress,
			complete: userStatusCounts[userId].complete,
		}));

		// Extract users for dropdown
		const users = Array.from(usersMap.values());

		setAllUsers(users);
		setChartData(data);
	}, [tasks]);

	// Filter data based on selected user
	const filteredData =
		selectedUser === 'all'
			? chartData
			: selectedUser === 'unassigned'
				? chartData.filter((item) => item.userId === 'unassigned')
				: chartData.filter((item) => item.userId === selectedUser);

	return (
		<Card className="bg-white rounded-lg shadow-sm">
			<CardHeader className="pb-2">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
					<CardTitle className="text-lg font-medium">Workload by User & Status</CardTitle>
					<Select value={selectedUser} onValueChange={setSelectedUser}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a user" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Users</SelectLabel>
								<SelectItem value="all">All Users</SelectItem>
								{allUsers.map((user) => (
									<SelectItem key={user.id} value={user.id}>
										{user.name}
									</SelectItem>
								))}
								<SelectItem value="unassigned">Unassigned</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<div className="w-full h-64">
					{filteredData.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={filteredData}
								margin={{
									top: 20,
									right: 30,
									left: 20,
									bottom: 5,
								}}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip
									formatter={(value, name) => {
										const formattedName =
											name === 'todo'
												? 'TO DO'
												: name === 'inProgress'
													? 'IN PROGRESS'
													: 'COMPLETE';
										return [`${value} tasks`, formattedName];
									}}
								/>
								<Legend
									formatter={(value) => {
										return value === 'todo'
											? 'TO DO'
											: value === 'inProgress'
												? 'IN PROGRESS'
												: 'COMPLETE';
									}}
								/>
								<Bar dataKey="todo" fill={statusColors.todo} name="todo" />
								<Bar
									dataKey="inProgress"
									fill={statusColors.inProgress}
									name="inProgress"
								/>
								<Bar
									dataKey="complete"
									fill={statusColors.complete}
									name="complete"
								/>
							</BarChart>
						</ResponsiveContainer>
					) : (
						<div className="flex items-center justify-center h-full">
							<p className="text-gray-500">No data available</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
