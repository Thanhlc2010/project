'use client';

import { Space } from '@/common/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SpaceDetails({ space }: { space: Space }) {
	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle>{space.name || 'Space Details'}</CardTitle>
					<CardDescription>Viewing space with ID: {space.id}</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Space content will be displayed here</p>
				</CardContent>
			</Card>
		</div>
	);
}
