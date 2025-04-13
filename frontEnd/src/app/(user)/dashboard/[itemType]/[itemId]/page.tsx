'use client';

import { redirect, useParams } from 'next/navigation';

import FolderDetails from '../components/FolderDetails';
import ListDetails from '../components/ListDetails';
import SpaceDetails from '../components/SpaceDetails';
import { APP_ROUTES } from '@/common/constants';
import { Space, SpaceItem } from '@/common/types';
import { useSpaceStore } from '@/store/spaceStore';

export default function ListPage() {
	const params = useParams();
	const spaces = useSpaceStore((state) => state.spaces);
	const findItem = useSpaceStore((state) => state.findItem);

	const itemType = params.itemType as string;
	const itemId = params.itemId as string;

	let item: SpaceItem | Space | undefined = undefined;

	// Check if the item is a list or folder
	if (itemType === 'l' || itemType === 'f') {
		item = findItem(itemId) as SpaceItem;
	} else if (itemType === 's') {
		// Check if the item is a space
		item = spaces.find((space) => space.id === itemId) as Space;
	}

	if (!item) {
		return redirect(APP_ROUTES.DASHBOARD);
	}

	return (
		<div className="container mx-auto p-6">
			{itemType === 'l' && <ListDetails />}
			{itemType === 'f' && <FolderDetails folderId={itemId} />}
			{itemType === 's' && <SpaceDetails space={item as Space} />}
		</div>
	);
}
