'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import NavHeader from '../components/NavHeader';
import ListDetails from '../components/TabContents/ListDetails';
import PertDetails from '../components/TabContents/PERTDetails';
import WorkspaceDetails from '../components/TabContents/WorkspaceDetails';
import { getAvailableTabs } from '../helpers/getAvailableTabs';
import { AvailableTabs } from '../types';
import { Task } from '@/common/types'

export default function ItemPage() {
	const params = useParams();
	const [activeTab, setActiveTab] = useState(AvailableTabs.OVERVIEW);

	const itemType = params.itemType as string;
	const itemId = params.itemId as string;

	const availableTabs = useMemo(() => getAvailableTabs(itemType), [itemType]);
	useEffect(() => {
		if (availableTabs.length > 0) {
			setActiveTab(availableTabs[0]);
		}
	}, [availableTabs]);

	return (
		<div className="w-full">
			<NavHeader
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				availableTabs={availableTabs}
			/>
			<div className="p-6">
				{itemType === 'l' && <ListDetails tab={activeTab} />}
				{itemType === 'p' && <PertDetails id={itemId} />}
				{itemType === 's' && <WorkspaceDetails tab={activeTab} workspaceId={itemId} />}
			</div>
		</div>
	);
}
