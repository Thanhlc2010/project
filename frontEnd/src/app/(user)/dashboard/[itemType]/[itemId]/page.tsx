'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import NavHeader from '../components/NavHeader';
import ListDetails from '../components/TabContents/ListDetails';
import PertDetails from '../components/TabContents/PERTDetails';
import WorkspaceDetails from '../components/TabContents/WorkspaceDetails';
import { getAvailableTabs } from '../helpers/getAvailableTabs';
import { AvailableTabs } from '../types';
import { useActiveItemStore } from '@/store/activeItemStore';
import { useWorkspaceStore } from '@/store/workspaceStore';

export default function ItemPage() {
	const params = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState(AvailableTabs.OVERVIEW);
	const setActiveIds = useActiveItemStore((state) => state.setActiveIds);
	const projectPertMap = useWorkspaceStore((state) => state.projectPertMap);
	const findPathToItem = useWorkspaceStore((state) => state.findPathToItem);
	const workspaces = useWorkspaceStore((state) => state.workspaces);
	const isFetchingWorkspaces = useWorkspaceStore((state) => state.isFetchingWorkspaces);
	const getAllWorkspaces = useWorkspaceStore((state) => state.getAllWorkspaces);
	const getPertByProjectId = useWorkspaceStore((state) => state.getPertByProjectId);

	const itemType = params.itemType as string;
	const itemId = params.itemId as string;

	const availableTabs = useMemo(() => getAvailableTabs(itemType), [itemType]);

	useEffect(() => {
		if (availableTabs.length > 0) {
			setActiveTab(availableTabs[0]);
		}
	}, [availableTabs]);

	useEffect(() => {
		if (itemId && itemType) {
			let activeIds: string[] = [];
			if (itemType === 'p') {
				const instance = Object.entries(projectPertMap).find(([_, pertList]) => {
					return pertList.findIndex((pert) => pert.id === itemId) !== -1;
				});

				if (instance) {
					const path = findPathToItem(instance[0]);
					if (path) {
						activeIds = path.map((item) => item.id).concat(itemId);
					}
				}
			} else {
				activeIds = findPathToItem(itemId)?.map((item) => item.id) ?? [];
			}

			setActiveIds(activeIds);
		}

		return () => {
			setActiveIds([]);
		};
	}, [itemId, itemType, setActiveIds, projectPertMap, findPathToItem, workspaces]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				if (itemType === 's') {
					await getAllWorkspaces();
				} else if (itemType === 'l') {
					await getPertByProjectId(itemId);
				}
			} catch (error) {
				console.error('Error fetching workspaces or pert:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [itemType, getAllWorkspaces, getPertByProjectId, itemId]);

	return (
		<div className="w-full">
			{isLoading ? (
				<div>Loading workspaces data...</div>
			) : (
				<>
					<NavHeader
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						availableTabs={availableTabs}
					/>
					<div className="p-6">
						{itemType === 'l' && <ListDetails tab={activeTab} />}
						{itemType === 'p' && <PertDetails id={itemId} />}
						{itemType === 's' && (
							<WorkspaceDetails tab={activeTab} workspaceId={itemId} />
						)}
					</div>
				</>
			)}
		</div>
	);
}
