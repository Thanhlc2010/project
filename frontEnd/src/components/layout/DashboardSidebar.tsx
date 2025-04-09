'use client';

import { Home, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import CreateSpaceDialog from '../CreateSpaceDialog';
import SpacesNav from './SpaceNav';
import { APP_ROUTES } from '@/common/constants';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from '@/components/ui/sidebar';
import { useSpaceStore } from '@/store/spaceStore';

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const addSpace = useSpaceStore((state) => state.addSpace);
	const spaces = useSpaceStore((state) => state.spaces);
	const [isCreateSpaceDialogOpen, setIsCreateSpaceDialogOpen] = useState(false);

	const handleCreateSpaceClick = () => {
		setIsCreateSpaceDialogOpen(true);
	};

	const handleCreateSpaceConfirm = (spaceName: string, description?: string) => {
		try {
			const newSpaceId = addSpace(spaceName);
			router.push(`/dashboard/s/${newSpaceId}`);
		} catch (error) {
			console.error('Error creating space:', error);
		}
	};

	return (
		<>
			<Sidebar className="border-r border-border/40 bg-zinc-950">
				<SidebarHeader className="px-2 py-2">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild>
								<a href="#" className="flex items-center gap-2">
									<Avatar className="h-8 w-8 bg-teal-500">
										<AvatarFallback>G</AvatarFallback>
									</Avatar>
									<span className="font-medium">Gilgamesh P...</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarSeparator />
				<SidebarContent className="[&_[data-active=true]]:bg-blue-500 [&_[data-active=true]]:text-white pb-12">
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={pathname === APP_ROUTES.DASHBOARD}
										onClick={() => router.push(APP_ROUTES.DASHBOARD)}>
										<a href="#">
											<Home className="h-4 w-4" />
											<span>Home</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarSeparator />
					<SidebarGroup>
						<SidebarGroupLabel className="flex items-center justify-between px-3 py-2">
							<span className="text-xs text-zinc-400">Spaces</span>
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									onClick={handleCreateSpaceClick}
									size="icon"
									className="h-5 w-5 text-zinc-400 hover:text-black">
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{spaces.map((space) => (
									<SpacesNav key={space.id} space={space} />
								))}
								<SidebarMenuItem>
									<SidebarMenuButton asChild onClick={handleCreateSpaceClick}>
										<div className="flex items-center gap-2 text-black hover:bg-gray-200 cursor-pointer">
											<Plus className="h-4 w-4" />
											<span>Create Space</span>
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarRail />
			</Sidebar>

			<CreateSpaceDialog
				open={isCreateSpaceDialogOpen}
				setOpen={setIsCreateSpaceDialogOpen}
				onConfirm={handleCreateSpaceConfirm}
			/>
		</>
	);
}
