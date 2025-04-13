'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FolderDetails({ folderId }: { folderId: string }) {
	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle>Folder Details</CardTitle>
					<CardDescription>Viewing folder with ID: {folderId}</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Folder content will be displayed here</p>
				</CardContent>
			</Card>
		</div>
	);
}
