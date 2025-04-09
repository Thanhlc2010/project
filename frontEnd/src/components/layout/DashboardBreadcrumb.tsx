'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import { APP_ROUTES } from '@/common/constants';
import { SpaceItemType } from '@/common/types';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useSpaceStore } from '@/store/spaceStore';

export function DashboardBreadcrumb() {
	const params = useParams();
	const spaces = useSpaceStore((state) => state.spaces);
	const findPathToItem = useSpaceStore((state) => state.findPathToItem);

	const itemType = params.itemType as string;
	const itemId = params.itemId as string;

	if (!itemType || !itemId) {
		return null;
	}

	if (itemType === 's') {
		const space = spaces.find((s) => s.id === itemId);
		if (space) {
			return (
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href={APP_ROUTES.DASHBOARD}>Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{space.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			);
		}
	}

	if (itemType === 'l' || itemType === 'f') {
		const itemPath = findPathToItem(itemId);

		if (itemPath) {
			const breadcrumbItems = [
				{
					id: 'dashboard',
					name: 'Dashboard',
					href: APP_ROUTES.DASHBOARD,
					isLast: false,
				},
				{
					id: itemPath.spaceId,
					name: itemPath.spaceName,
					href: `/dashboard/s/${itemPath.spaceId}`,
					isLast: itemPath.path.length === 0,
				},
				...itemPath.path.map((item, index) => ({
					id: item.id,
					name: item.name,
					href: `/dashboard/${item.type === SpaceItemType.FOLDER ? 'f' : 'l'}/${item.id}`,
					isLast: index === itemPath.path.length - 1,
				})),
			];

			return (
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbItems.map((item, index) => (
							<React.Fragment key={item.id}>
								<BreadcrumbItem>
									{item.isLast ? (
										<BreadcrumbPage>{item.name}</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={item.href}>
											{item.name}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
								{index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			);
		}
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href={APP_ROUTES.DASHBOARD}>Dashboard</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Unknown Route</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
