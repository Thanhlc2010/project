'use client';

import { Home, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import CreateSpaceDialog from '../CreateSpaceDialog';
import { NavUser } from './NavUser';
import SpacesNav from './SpaceNav';
import { APP_ROUTES } from '@/common/constants';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
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
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [isCreateSpaceDialogOpen, setIsCreateSpaceDialogOpen] = useState(false);
	const addWorkspace = useWorkspaceStore((state) => state.addWorkspace);
	const workspaces = useWorkspaceStore((state) => state.workspaces);
	const getAllWorkspaces = useWorkspaceStore((state) => state.getAllWorkspaces);
	const user = useAuthStore((state) => state.user);

	const handleCreateSpaceClick = () => {
		setIsCreateSpaceDialogOpen(true);
	};

	const handleCreateSpaceConfirm = async (spaceName: string, description?: string) => {
		try {
			const newWorkspaceId = await addWorkspace(spaceName, description);
			router.push(`/dashboard/s/${newWorkspaceId}`);
		} catch (error) {
			console.error('Error creating space:', error);
			toast.error('Error creating space');
		}
	};

	useEffect(() => {
		getAllWorkspaces();
	}, [getAllWorkspaces]);

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
								{workspaces.map((workspace) => (
									<SpacesNav key={workspace.id} workspace={workspace} />
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
				<SidebarFooter>
					<NavUser user={user!} />
				</SidebarFooter>
			</Sidebar>

			<CreateSpaceDialog
				open={isCreateSpaceDialogOpen}
				setOpen={setIsCreateSpaceDialogOpen}
				onConfirm={handleCreateSpaceConfirm}
			/>
		</>
	);
}
