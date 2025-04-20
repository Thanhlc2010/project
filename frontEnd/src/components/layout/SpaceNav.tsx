import { ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
import { Space } from '@/common/types';
import { useActiveItem } from '@/hooks/useActiveItem';
import { useSpaceStore } from '@/store/spaceStore';

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
	space: Space;
};

const SpacesNav = ({ space }: SpaceNavProps) => {
	const router = useRouter();
	const { isActive: isSpaceActive, shouldExpandItem: shouldExpandSpace } = useActiveItem(
		space.id,
	);
	const addList = useSpaceStore((state) => state.addList);
	const [isSpaceExpanding, setIsSpaceExpanding] = useState(false);
	const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);

	const goToSpace = () => {
		router.push(`/dashboard/s/${space.id}`);
	};

	const handleCreateListClick = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		setIsCreateListDialogOpen(true);
	};

	const handleCreateListConfirm = (listName: string) => {
		const newListId = addList(space.id, listName);
		router.push(`/dashboard/l/${newListId}`);
		setIsCreateListDialogOpen(false);
	};

	const handleToggleSpace = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
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
							tooltip={space.name}
							className="[&>svg:first-child]:hidden [&:hover>svg:first-child]:block [&:hover>div.name]:hidden"
							onClick={goToSpace}
							isActive={isSpaceActive}>
							<CollapsibleTrigger asChild onClick={handleToggleSpace}>
								<ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
							</CollapsibleTrigger>
							<div className="name flex h-5 w-5 items-center justify-center rounded text-xs font-medium bg-sidebar-accent text-sidebar-accent-foreground">
								{getSpaceAbbreviation(space.name)}
							</div>
							<span>{space.name}</span>
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
							</DropdownMenuContent>
						</SidebarMenuButton>
						<CollapsibleContent>
							<SidebarMenuSub className="m-0 pr-0">
								{space.items.map((item) => (
									<SpaceTree
										key={`space-tree-${space.id}-${item.id}`}
										item={item}
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
