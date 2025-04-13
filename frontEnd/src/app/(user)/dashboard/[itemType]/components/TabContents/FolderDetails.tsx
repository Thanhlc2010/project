'use client';

import { useMemo } from 'react';

import { getAvailableTabs } from '../../helpers/getAvailableTabs';
import { AvailableTabs } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FolderDetails({ folderId, tab }: { folderId: string; tab: AvailableTabs }) {
	return (
		<div className="container mx-auto p-6">
			{tab === AvailableTabs.OVERVIEW && (
				<Card>
					<CardHeader>
						<CardTitle>Folder Details</CardTitle>
						<CardDescription>Viewing folder with ID: {folderId}</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Folder content will be displayed here</p>
					</CardContent>
				</Card>
			)}
			{tab === AvailableTabs.BOARD && <div>Board</div>}
			{tab === AvailableTabs.LIST && <div>List</div>}
		</div>
	);
}
