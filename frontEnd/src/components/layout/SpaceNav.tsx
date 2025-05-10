import { ChevronRight, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import CreateListDialog from '../CreateListDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '../ui/sidebar';
import SpaceTree from './SpaceTree';
import { Workspace } from '@/common/types';
import { useActiveItemStore } from '@/store/activeItemStore';
import { useWorkspaceStore } from '@/store/workspaceStore';

/**
 * Generates an abbreviation from a space name
 * Takes the first letter of each word and returns up to 2 characters
 * @param name The space name to abbreviate
 * @returns A 2-character uppercase abbreviation
 */
const getSpaceAbbreviation = (name: string): string => {
	return name
		.split(' ')
		.map((word) => word.charAt(0))
		.join('')
		.substring(0, 2)
		.toUpperCase();
};

type SpaceNavProps = {
	workspace: Workspace;
};

const SpacesNav = ({ workspace }: SpaceNavProps) => {
	const router = useRouter();
	const addProject = useWorkspaceStore((state) => state.addProject);
	const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);
	const [isSpaceExpanding, setIsSpaceExpanding] = useState(false);
	const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);
	const [isDeleteSpaceDialogOpen, setIsDeleteSpaceDialogOpen] = useState(false);
	const activeIds = useActiveItemStore((state) => state.activeIds);

	const itemIndex = activeIds.findIndex((id) => id === workspace.id);
	const isSpaceActive = itemIndex > -1 && itemIndex === activeIds.length - 1;
	const shouldExpandSpace = itemIndex > -1 && itemIndex < activeIds.length - 1;

	const goToSpace = () => {
		router.push(`/dashboard/s/${workspace.id}`);
	};

	const handleCreateListClick = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		setIsCreateListDialogOpen(true);
	};

	const handleCreateListConfirm = async (listName: string) => {
		const newProjectId = await addProject(workspace.id, listName);
		router.push(`/dashboard/l/${newProjectId}`);
		setIsCreateListDialogOpen(false);
	};

	const handleToggleSpace = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
	};

	const handleClickDeleteSpace = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		setIsDeleteSpaceDialogOpen(true);

		setTimeout(() => {
			handleDeleteSpace();
		}, 300);
	};

	const handleDeleteSpace = async () => {
		try {
			await deleteWorkspace(workspace.id);
			setIsDeleteSpaceDialogOpen(false);
			toast.success('Workspace deleted successfully');
		} catch (error) {
			console.error('Error deleting space:', error);
		}
	};

	return (
		<>
			<Collapsible
				defaultOpen={shouldExpandSpace}
				open={isSpaceExpanding || shouldExpandSpace}
				onOpenChange={setIsSpaceExpanding}
				asChild
				className="group/collapsible">
				<DropdownMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip={workspace.name}
							className="[&>svg:first-child]:hidden [&:hover>svg:first-child]:block [&:hover>div.name]:hidden"
							onClick={goToSpace}
							isActive={isSpaceActive}>
							<CollapsibleTrigger asChild onClick={handleToggleSpace}>
								<ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
							<div className="name flex h-5 w-5 items-center justify-center rounded text-xs font-medium bg-sidebar-accent text-sidebar-accent-foreground">
								{getSpaceAbbreviation(workspace.name)}
							</div>
							<span>{workspace.name}</span>
							<DropdownMenuTrigger asChild>
								<MoreHorizontal className="ml-auto" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="min-w-32 rounded-lg">
								<DropdownMenuItem asChild onClick={handleCreateListClick}>
									<div className="flex gap-2">
										<Plus className="h-4 w-4" />
										List
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem asChild onClick={handleClickDeleteSpace}>
									<div className="flex gap-2 text-red-500">
										<Trash className="h-4 w-4" />
										Delete
									</div>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</SidebarMenuButton>
						<CollapsibleContent>
							<SidebarMenuSub className="m-0 pr-0">
								{workspace.projects?.map((project) => (
									<SpaceTree
										key={`space-tree-${workspace.id}-${project.id}`}
										item={project}
									/>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					</SidebarMenuItem>
				</DropdownMenu>
			</Collapsible>

			<CreateListDialog
				open={isCreateListDialogOpen}
				setOpen={setIsCreateListDialogOpen}
				onConfirm={handleCreateListConfirm}
			/>
		</>
	);
};

export default SpacesNav;
