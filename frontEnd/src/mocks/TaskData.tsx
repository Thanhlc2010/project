// filepath: d:\trancongtien\next\quanLyDuAn\frontEnd\src\mocks\TaskData.tsx
'use client';

import { create } from 'zustand';

// Define interfaces for our data
export interface User {
    id: string;
    name: string;
    avatar?: string; // Optional avatar URL
}

// Modify the Task interface to support nested subtasks
export interface Task {
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
}

// Sample users
export const users: User[] = [
    { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: '3', name: 'Alex Johnson' },
    { id: '4', name: 'Maria Garcia' },
    { id: '5', name: 'David Kim' },
    { id: '6', name: 'Sarah Brown' },
];

// Sample initial tasks
export const initialTasks: Task[] = [
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

// Create task store with Zustand
interface TaskStore {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (status: Task['status'], taskName: string) => void;
    updateTaskStatus: (taskId: number, newStatus: Task['status']) => void;
    updateTaskPriority: (taskId: number, newPriority: Task['priority']) => void;
    assignTaskToUsers: (taskId: number, userIds: string[]) => void;
    addCommentToTask: (taskId: number, comment: string) => void;
    updateDueDate: (taskId: number, date: string) => void;
    deleteTask: (taskId: number) => void;
    addSubtask: (parentTaskId: number, subtaskName: string) => void;
    updateSubtask: (parentTaskId: number, subtaskId: number, updates: Partial<Task>) => void;
    deleteSubtask: (parentTaskId: number, subtaskId: number) => void;
    toggleTaskCompletion: (taskId: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: initialTasks,
    setTasks: (tasks) => set({ tasks }),
    addTask: (status, taskName) => {
        if (!taskName || taskName.trim() === '') return;

        set((state) => {
            const newId = Math.max(...state.tasks.flatMap((t) => [t.id, ...t.subtasks.map((s) => s.id)])) + 1;

            const newTask: Task = {
                id: newId,
                name: taskName,
                subtasks: [],
                status: status,
                completed: false,
                assignees: [],
                dueDate: null,
                priority: 'Normal',
                comments: [],
            };

            return { tasks: [...state.tasks, newTask] };
        });
    },
    updateTaskStatus: (taskId, newStatus) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
            ),
        }));
    },
    updateTaskPriority: (taskId, newPriority) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === taskId ? { ...task, priority: newPriority } : task
            ),
        }));
    },
    assignTaskToUsers: (taskId, userIds) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        assignees:
                            userIds.length > 0
                                ? users.filter((user) => userIds.includes(user.id))
                                : [],
                    }
                    : task
            ),
        }));
    },
    addCommentToTask: (taskId, comment) => {
        if (!comment.trim()) return;

        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === taskId ? { ...task, comments: [...task.comments, comment] } : task
            ),
        }));
    },
    updateDueDate: (taskId, date) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === taskId ? { ...task, dueDate: date } : task
            ),
        }));
    },
    deleteTask: (taskId) => {
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
    },
    addSubtask: (parentTaskId, subtaskName) => {
        if (!subtaskName.trim()) return;

        set((state) => {
            const newId = Math.max(...state.tasks.flatMap((t) => [t.id, ...t.subtasks.map((s) => s.id)])) + 1;

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

            return {
                tasks: state.tasks.map((task) =>
                    task.id === parentTaskId
                        ? { ...task, subtasks: [...task.subtasks, newSubtask] }
                        : task
                ),
            };
        });
    },
    updateSubtask: (parentTaskId, subtaskId, updates) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === parentTaskId
                    ? {
                        ...task,
                        subtasks: task.subtasks.map((subtask) =>
                            subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
                        ),
                    }
                    : task
            ),
        }));
    },
    deleteSubtask: (parentTaskId, subtaskId) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === parentTaskId
                    ? {
                        ...task,
                        subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
                    }
                    : task
            ),
        }));
    },
    toggleTaskCompletion: (taskId) => {
        set((state) => {
            // Function to toggle task completion in an array of tasks
            const toggleInArray = (tasks: Task[], id: number): Task[] => {
                return tasks.map((task) => {
                    if (task.id === id) {
                        return { ...task, completed: !task.completed };
                    }
                    if (task.subtasks.length > 0) {
                        return { ...task, subtasks: toggleInArray(task.subtasks, id) };
                    }
                    return task;
                });
            };

            return { tasks: toggleInArray(state.tasks, taskId) };
        });
    },
}));