'use client';

import { AvailableTabs } from '../../types';
import TaskManagementUI from './TaskManagement';
import TaskManagementBoard from './TaskManagementBoard';
import PERT from './PERT'

export default function ListDetails({ tab }: { tab: AvailableTabs }) {
	return (
		<div className="container mx-auto p-6">
			{tab === AvailableTabs.BOARD && <TaskManagementBoard />}
			{tab === AvailableTabs.LIST && <TaskManagementUI />}
			{tab === AvailableTabs.PERT && <PERT/>}
		</div>
	);
}
