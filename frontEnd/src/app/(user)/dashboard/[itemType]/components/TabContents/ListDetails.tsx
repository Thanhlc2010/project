'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { AvailableTabs } from '../../types';
import PERT from './PERT';
import TaskManagementUI from './TaskManagement';
import TaskManagementBoard from './TaskManagementBoard';
import { useWorkspaceStore } from '@/store/workspaceStore';

export default function ListDetails({ tab }: { tab: AvailableTabs }) {
	const getPertByProjectId = useWorkspaceStore((state) => state.getPertByProjectId);
	const projectId = useParams().itemId as string;

	useEffect(() => {
		const fetchPert = async () => {
			if (!projectId) {
				return;
			}

			try {
				await getPertByProjectId(projectId as string);
			} catch (error) {
				toast.error('Error getting pert by project id');
			}
		};

		fetchPert();
	}, [projectId, getPertByProjectId]);

	return (
		<div className="container mx-auto p-6">
			{tab === AvailableTabs.BOARD && <TaskManagementBoard />}
			{tab === AvailableTabs.LIST && <TaskManagementUI />}
			{tab === AvailableTabs.PERT && <PERT />}
		</div>
	);
}
