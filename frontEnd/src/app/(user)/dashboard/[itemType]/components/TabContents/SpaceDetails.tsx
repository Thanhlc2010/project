'use client';

import { AvailableTabs } from '../../types';
import ListDetails from './ListDetails';
import { Space } from '@/common/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SpaceDetails({ space, tab }: { space: Space; tab: AvailableTabs }) {
	return (
		<div className="container mx-auto p-6">
			{tab === AvailableTabs.OVERVIEW && (
				<Card>
					<CardHeader>
						<CardTitle>{space.name || 'Space Details'}</CardTitle>
						<CardDescription>Viewing space with ID: {space.id}</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Space content will be displayed here</p>
					</CardContent>
				</Card>
			)}
			{tab === AvailableTabs.BOARD && <div>Board</div>}
			{tab === AvailableTabs.LIST && <div>List</div>}
		</div>
	);
}
