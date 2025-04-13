import { create } from 'zustand';

import { Space, SpaceItem, SpaceItemType } from '@/common/types';

export type Path = {
	id: string;
	name: string;
	type: SpaceItemType;
};

export type ItemPath = {
	spaceId: string;
	spaceName: string;
	path: Path[];
};

const initialSpaces: Space[] = [
	{
		id: 'team-space',
		name: 'Team Space',
		items: [
			{
				id: 'projects',
				name: 'Projects',
				type: SpaceItemType.FOLDER,
				children: [
					{ id: 'project-1', name: 'Project 1', type: SpaceItemType.LIST, children: [] },
					{ id: 'project-2', name: 'Project 2', type: SpaceItemType.LIST, children: [] },
					{ id: 'project-3', name: 'Project 3', type: SpaceItemType.LIST, children: [] },
				],
			},
			{
				id: 'tasks',
				name: 'Tasks',
				type: SpaceItemType.FOLDER,
				children: [
					{ id: 'task-1', name: 'Task 1', type: SpaceItemType.LIST, children: [] },
					{ id: 'task-2', name: 'Task 2', type: SpaceItemType.LIST, children: [] },
				],
			},
			{ id: 'reports', name: 'Reports', type: SpaceItemType.LIST, children: [] },
			{ id: 'settings', name: 'Settings', type: SpaceItemType.LIST, children: [] },
		],
	},
	{
		id: 'personal-space',
		name: 'Personal Space',
		items: [
			{
				id: 'my-projects',
				name: 'My Projects',
				type: SpaceItemType.FOLDER,
				children: [
					{
						id: 'personal-project-1',
						name: 'Personal Project 1',
						type: SpaceItemType.LIST,
						children: [],
					},
					{
						id: 'personal-project-2',
						name: 'Personal Projectsdohskdljsjjxzkcjvnzxkjvnzkjv 2',
						type: SpaceItemType.LIST,
						children: [],
					},
				],
			},
			{ id: 'my-tasks', name: 'My Tasks', type: SpaceItemType.LIST, children: [] },
			{ id: 'my-notes', name: 'My Notes', type: SpaceItemType.LIST, children: [] },
		],
	},
];

interface SpaceState {
	spaces: Space[];
	pathCache: Record<string, ItemPath>;
	addSpace: (name: string) => string;
	addFolder: (spaceId: string, name: string, parentId?: string) => string;
	addList: (spaceId: string, name: string, parentId?: string) => string;
	removeItem: (spaceId: string, itemId: string) => void;
	updateItem: (spaceId: string, itemId: string, updates: Partial<SpaceItem>) => void;
	findPathToItem: (itemId: string) => ItemPath | null;
	findItem: (itemId: string) => SpaceItem | undefined;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const findItemAndParent = (
	items: SpaceItem[],
	itemId: string,
): { item: SpaceItem | null; parent: SpaceItem[] | null } => {
	for (let i = 0; i < items.length; i++) {
		if (items[i].id === itemId) {
			return { item: items[i], parent: items };
		}
		const result = findItemAndParent(items[i].children, itemId);
		if (result.item) {
			return result;
		}
	}
	return { item: null, parent: null };
};

const findPathToItemFormRoot = (
	spaces: Space[],
	itemId: string,
): { found: boolean; path: Path[]; spaceId: string; spaceName: string } | null => {
	// Helper function to find the path to an item
	const findPathToItem = (
		items: SpaceItem[],
		targetId: string,
		currentPath: Path[] = [],
	): { found: boolean; path: Path[] } | null => {
		for (const item of items) {
			// If this is the item we're looking for
			if (item.id === targetId) {
				return {
					found: true,
					path: [...currentPath, { id: item.id, name: item.name, type: item.type }],
				};
			}

			// Search in children
			if (item.children.length > 0) {
				const result = findPathToItem(item.children, targetId, [
					...currentPath,
					{ id: item.id, name: item.name, type: item.type },
				]);

				if (result) {
					return result;
				}
			}
		}

		return null;
	};

	// Search through each space
	for (const space of spaces) {
		const result = findPathToItem(space.items, itemId);

		if (result) {
			return {
				found: true,
				path: result.path,
				spaceId: space.id,
				spaceName: space.name,
			};
		}
	}

	return null;
};

export const useSpaceStore = create<SpaceState>((set, get) => ({
	spaces: initialSpaces,
	pathCache: {},

	addSpace: (name) => {
		const newSpaceId = generateId();
		set((state) => ({
			spaces: [
				...state.spaces,
				{
					id: newSpaceId,
					name,
					items: [],
				},
			],
		}));

		return newSpaceId;
	},

	addFolder: (spaceId, name, parentId) => {
		const newFolderId = generateId();
		set((state) => {
			const space = state.spaces.find((s) => s.id === spaceId);
			if (!space) return state;

			const newFolder: SpaceItem = {
				id: newFolderId,
				name,
				type: SpaceItemType.FOLDER,
				children: [],
			};

			if (parentId) {
				const { parent } = findItemAndParent(space.items, parentId);
				if (parent) {
					const parentItem = parent.find((item) => item.id === parentId);
					if (parentItem && parentItem.type === SpaceItemType.FOLDER) {
						parentItem.children = [...parentItem.children, newFolder];
						return { ...state };
					}
				}
			}

			space.items.push(newFolder);
			return { ...state };
		});

		return newFolderId;
	},

	addList: (spaceId, name, parentId) => {
		const newListId = generateId();
		set((state) => {
			const space = state.spaces.find((s) => s.id === spaceId);
			if (!space) return state;

			const newList: SpaceItem = {
				id: newListId,
				name,
				type: SpaceItemType.LIST,
				children: [],
			};

			if (parentId) {
				const { parent } = findItemAndParent(space.items, parentId);
				if (parent) {
					const parentItem = parent.find((item) => item.id === parentId);
					if (parentItem && parentItem.type === SpaceItemType.FOLDER) {
						parentItem.children = [...parentItem.children, newList];
						return { ...state };
					}
				}
			}

			space.items.push(newList);
			return { ...state };
		});

		return newListId;
	},

	removeItem: (spaceId, itemId) => {
		set((state) => {
			const space = state.spaces.find((s) => s.id === spaceId);
			if (!space) return state;

			const { parent } = findItemAndParent(space.items, itemId);
			if (parent) {
				const index = parent.findIndex((item) => item.id === itemId);
				if (index !== -1) {
					parent.splice(index, 1);
					return { ...state };
				}
			}

			return state;
		});
	},

	updateItem: (spaceId, itemId, updates) => {
		set((state) => {
			const space = state.spaces.find((s) => s.id === spaceId);
			if (!space) return state;

			const { item } = findItemAndParent(space.items, itemId);
			if (item) {
				Object.assign(item, updates);
				return { ...state };
			}

			return state;
		});
	},

	findPathToItem: (itemId: string) => {
		const state = get();
		if (state.pathCache[itemId]) {
			return state.pathCache[itemId];
		}

		const result = findPathToItemFormRoot(state.spaces, itemId);
		if (result) {
			const pathData: ItemPath = {
				spaceId: result.spaceId,
				spaceName: result.spaceName,
				path: result.path,
			};

			set((state) => ({
				pathCache: {
					...state.pathCache,
					[itemId]: pathData,
				},
			}));

			return pathData;
		}

		return null;
	},

	findItem: (itemId: string) => {
		const state = get();

		// Helper function to search recursively
		const searchRecursively = (items: SpaceItem[]): SpaceItem | undefined => {
			for (const item of items) {
				if (item.id === itemId) {
					return item;
				}

				if (item.children.length > 0) {
					const found = searchRecursively(item.children);
					if (found) {
						return found;
					}
				}
			}

			return undefined;
		};

		// Search through all spaces
		for (const space of state.spaces) {
			const found = searchRecursively(space.items);
			if (found) {
				return found;
			}
		}

		return undefined;
	},
}));
