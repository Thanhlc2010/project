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
import { cn } from '@/lib/utils';
import { Path, useWorkspaceStore } from '@/store/workspaceStore';

export function DashboardBreadcrumb() {
	const params = useParams();
	const [paths, setPaths] = useState<Path[]>([]);
	const workspaces = useWorkspaceStore((state) => state.workspaces);
	const pertByProjectId = useWorkspaceStore((state) => state.getPertByProjectId);
	const findPathToItem = useWorkspaceStore((state) => state.findPathToItem);
	const projectPertMap = useWorkspaceStore((state) => state.projectPertMap);

	const itemType = params.itemType as string;
	const itemId = params.itemId as string;

	const isPert = itemType === 'p';

	useEffect(() => {
		if (isPert) {
			const instance = Object.entries(projectPertMap).find(([_, pertList]) => {
				return pertList.findIndex((pert) => pert.id === itemId) !== -1;
			});

			if (instance) {
				setPaths(
					[...(findPathToItem(instance[0]) ?? [])].concat({
						id: itemId,
						name: `PERT ${itemId}`,
						type: 'p',
					}),
				);
			}
		} else {
			setPaths(findPathToItem(itemId) ?? []);
		}
	}, [isPert, itemId, projectPertMap, findPathToItem, workspaces, pertByProjectId]);

	if (!itemType || !itemId) {
		return null;
	}

	if (paths) {
		return (
			<>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href={APP_ROUTES.DASHBOARD}>Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						{paths.map((item, index) => {
							const isActive = itemId === item.id;

							return (
								<React.Fragment key={`item_${item.type}-${item.id}-${index}`}>
									<BreadcrumbItem>
										<BreadcrumbLink
											href={`${APP_ROUTES.DASHBOARD}/${item.type}/${item.id}`}
											className={cn(isActive && 'text-primary font-bold')}>
											{item.name}
										</BreadcrumbLink>
									</BreadcrumbItem>
									{index < paths.length - 1 && <BreadcrumbSeparator />}
								</React.Fragment>
							);
						})}
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
