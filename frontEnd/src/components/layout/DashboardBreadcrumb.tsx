'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useRef, useState } from 'react';

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
import { useWorkspaceStore } from '@/store/workspaceStore';

export function DashboardBreadcrumb() {
	const params = useParams();
	const findPathToItem = useWorkspaceStore((state) => state.findPathToItem);
	const itemType = params.itemType as string;
	const itemId = params.itemId as string;
	const pertId = params.pertId as string; // Thêm pertId từ params

	if (!itemType || !itemId) {
		return null;
	}

	const path = findPathToItem(itemId);

	if (path) {
		return (
			<>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href={APP_ROUTES.DASHBOARD}>Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						{path.map((item, index) => (
							<React.Fragment key={`item_${item.type}-${item.id}-${index}`}>
								<BreadcrumbItem>
									<BreadcrumbLink
										href={`${APP_ROUTES.DASHBOARD}/${item.type}/${item.id}`}>
										{item.name}
									</BreadcrumbLink>
								</BreadcrumbItem>
								{index < path.length - 1 && <BreadcrumbSeparator />}
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			</>
		);
	}

	return (
		<>
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
		</>
	);
}
