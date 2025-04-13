export enum SpaceItemType {
	LIST = 'list',
	FOLDER = 'folder',
}

export type SpaceItem = {
	id: string;
	name: string;
	type: SpaceItemType;
	children: SpaceItem[];
};

export type Space = {
	id: string;
	name: string;
	items: SpaceItem[];
};
