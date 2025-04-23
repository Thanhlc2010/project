import {
	ActivitySquare,
	ChevronRight,
	List as ListIcon,
	MoreHorizontal,
	Plus,
	Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import CreatePertDialog from '../CreatePertDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Pert, Project } from '@/common/types';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { useActiveItemStore } from '@/store/activeItemStore';
import { useWorkspaceStore } from '@/store/workspaceStore';

interface SpaceTreeProps {
	item: Project | Pert;
	isPert?: boolean;
	index?: number;
}

function SpaceTree({ item, isPert = false }: SpaceTreeProps) {
	const router = useRouter();
	const deleteProject = useWorkspaceStore((state) => state.deleteProject);
	const projectPertMap = useWorkspaceStore((state) => state.projectPertMap);
	const createPert = useWorkspaceStore((state) => state.createPert);
	const activeIds = useActiveItemStore((state) => state.activeIds);
	const shouldExpandItem = activeIds.findIndex((id) => id === item.id) < activeIds.length - 1;
	const [isListExpanding, setIsListExpanding] = useState(shouldExpandItem);
	const [isCreatePertDialogOpen, setIsCreatePertDialogOpen] = useState(false);

	const isActive = activeIds.findIndex((id) => id === item.id) === activeIds.length - 1;

	const goToList = (listId: string) => () => {
		router.push(`/dashboard/l/${listId}`);
	};

	const goToPert = (pertId: string) => () => {
		router.push(`/dashboard/p/${pertId}`);
	};

	const handleClickDelete = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();

		setTimeout(() => {
			handleDeleteProject();
		}, 300);
	};

	const handleDeleteProject = async () => {
		try {
			await deleteProject(item.id);
			toast.success('Project deleted successfully');
		} catch (error) {
			console.error('Error deleting project:', error);
		}
	};

	const handleCreatePertClick = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		setIsCreatePertDialogOpen(true);
	};

	const handleToggleList = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
	};

	const handleCreatePertConfirm = async (pertData: {
		projectId: string;
		pertName: string;
		description: string;
		selectedTasks: {
			taskId: number;
			taskName: string;
			duration: number;
		}[];
	}) => {
		try {
			const pertId = await createPert({
				projectId: pertData.projectId,
				pertName: pertData.pertName,
				description: pertData.description,
			});

			setIsCreatePertDialogOpen(false);
			// Gợi ý: tính toán thời gian dự kiến từ selectedTasks nếu cần
			router.push(`/dashboard/p/${pertId}`);
			toast.success('PERT task created (placeholder)');
		} catch (error) {
			console.error('Error creating pert:', error);
		}
	};

	if (!isPert) {
		const pertList = projectPertMap[item.id] ?? [];

		return (
			<>
				<SidebarMenuItem>
					<Collapsible
						defaultOpen={shouldExpandItem}
						open={isListExpanding || shouldExpandItem}
						onOpenChange={setIsListExpanding}
						className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
						<DropdownMenu>
							<SidebarMenuButton
								isActive={isActive}
								className="[&>svg:first-child]:hidden [&:hover>svg:first-child]:block [&:hover>svg.list-icon]:hidden"
								onClick={goToList(item.id)}>
								<CollapsibleTrigger asChild onClick={handleToggleList}>
									<ChevronRight className="transition-transform" />
								</CollapsibleTrigger>
								<ListIcon className="list-icon transition-opacity duration-200" />
								<span className="text-ellipsis overflow-hidden whitespace-nowrap">
									{(item as Project).name}
								</span>
								<DropdownMenuTrigger asChild>
									<MoreHorizontal className="ml-auto" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="min-w-32 rounded-lg">
									<DropdownMenuItem asChild onClick={handleCreatePertClick}>
										<div className="flex gap-2">
											<Plus className="h-4 w-4" />
											Add PERT Task
										</div>
									</DropdownMenuItem>
									<DropdownMenuItem asChild onClick={handleClickDelete}>
										<div className="flex gap-2 text-red-500">
											<Trash className="h-4 w-4" />
											Delete
										</div>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</SidebarMenuButton>
						</DropdownMenu>
						<CollapsibleContent>
							<SidebarMenuSub className="m-0 pr-0">
								{pertList.map((pert, index) => (
									<SpaceTree
										key={`pert-${pert.id}-${index}`}
										item={pert}
										isPert
									/>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					</Collapsible>
				</SidebarMenuItem>

				<CreatePertDialog
					open={isCreatePertDialogOpen}
					setOpen={setIsCreatePertDialogOpen}
					onConfirm={handleCreatePertConfirm}
					projectId={item.id}
				/>
			</>
		);
	}

	return (
		<SidebarMenuButton isActive={isActive} onClick={goToPert(item.id)}>
			<span className="text-ellipsis overflow-hidden whitespace-nowrap">
				{(item as Pert).id || 'Name'}
			</span>
		</SidebarMenuButton>
	);
}

export default SpaceTree;
