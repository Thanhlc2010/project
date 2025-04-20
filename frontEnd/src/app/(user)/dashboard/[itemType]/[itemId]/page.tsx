'use client';

import { redirect, useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import NavHeader from '../components/NavHeader';
import FolderDetails from '../components/TabContents/FolderDetails';
import ListDetails from '../components/TabContents/ListDetails';
import SpaceDetails from '../components/TabContents/SpaceDetails';
import { getAvailableTabs } from '../helpers/getAvailableTabs';
import { AvailableTabs } from '../types';
import { APP_ROUTES } from '@/common/constants';
import { Space, SpaceItem } from '@/common/types';
import { useSpaceStore } from '@/store/spaceStore';

export default function ListPage() {
	const params = useParams();
	const spaces = useSpaceStore((state) => state.spaces);
	const findItem = useSpaceStore((state) => state.findItem);
	const [activeTab, setActiveTab] = useState(AvailableTabs.OVERVIEW);

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

	const availableTabs = useMemo(() => getAvailableTabs(itemType), [itemType]);
	useEffect(() => {
		if (availableTabs.length > 0) {
			setActiveTab(availableTabs[0]);
		}
	}, [availableTabs]);

	if (!item) {
		return redirect(APP_ROUTES.DASHBOARD);
	}

	return (
		<div className=" w-full">
			<NavHeader
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				availableTabs={availableTabs}
			/>
			<div className="  p-6">
				{itemType === 'l' && <ListDetails tab={activeTab} />}
				{itemType === 'f' && <FolderDetails folderId={itemId} tab={activeTab} />}
				{itemType === 's' && <SpaceDetails space={item as Space} tab={activeTab} />}
			</div>
		</div>
	);
}
