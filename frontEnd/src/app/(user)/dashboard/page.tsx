'use client';

import { useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkspaceStore } from '@/store/workspaceStore';

export default function DashboardPage() {
	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle>Welcome to Your Dashboard</CardTitle>
					<CardDescription>Manage your spaces, folders and lists</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<p className="text-sm text-muted-foreground">
							Select a space, folder or list from the sidebar to get started.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
