import { ChevronRight, Folder, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { SpaceItem, SpaceItemType } from '@/common/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { useActiveItem } from '@/hooks/useActiveItem';

interface SpaceTreeProps {
	item: SpaceItem;
}

function SpaceTree({ item }: SpaceTreeProps) {
	const router = useRouter();
	const { isActive, shouldExpandItem } = useActiveItem(item.id);
	const [isFolderExpanding, setIsFolderExpanding] = useState(shouldExpandItem);

	const { name, type, children = [] } = item;
	const isFolder = type === SpaceItemType.FOLDER;

	const goToList = (listId: string) => () => {
		router.push(`/dashboard/l/${listId}`);
	};
	const goToFolder = (folderId: string) => () => {
		router.push(`/dashboard/f/${folderId}`);
	};

	const handleToggleFolder = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
	};

	if (isFolder) {
		return (
			<SidebarMenuItem>
				<Collapsible
					defaultOpen={shouldExpandItem}
					open={isFolderExpanding || shouldExpandItem}
					onOpenChange={setIsFolderExpanding}
					className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
					<SidebarMenuButton
						isActive={isActive}
						className="[&>svg:first-child]:hidden [&:hover>svg:first-child]:block [&:hover>svg:last-child]:hidden"
						onClick={goToFolder(item.id)}>
						<CollapsibleTrigger asChild onClick={handleToggleFolder}>
							<ChevronRight className="transition-transform" />
						</CollapsibleTrigger>
						<Folder className="transition-opacity duration-200" />
						{name}
					</SidebarMenuButton>
					<CollapsibleContent>
						<SidebarMenuSub className="m-0 pr-0">
							{children.map((subItem: SpaceItem, index: number) => (
								<SpaceTree key={index} item={subItem} />
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</Collapsible>
			</SidebarMenuItem>
		);
	}
	return (
		<SidebarMenuButton isActive={isActive} onClick={goToList(item.id)}>
			<List />
			<span className="text-ellipsis overflow-hidden whitespace-nowrap">{name}</span>
		</SidebarMenuButton>
	);
}

export default SpaceTree;
