import { List as ListIcon, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import CreatePertDialog from '../CreatePertDialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Project } from '@/common/types';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useActiveItem } from '@/hooks/useActiveItem';
import { useWorkspaceStore } from '@/store/workspaceStore';

interface SpaceTreeProps {
	item: Project;
}

function SpaceTree({ item }: SpaceTreeProps) {
	const router = useRouter();
	const deleteProject = useWorkspaceStore((state) => state.deleteProject);
	const { isActive, shouldExpandItem } = useActiveItem(item.id);
	const [isCreatePertDialogOpen, setIsCreatePertDialogOpen] = useState(false);

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
		console.log('Received data from dialog:', pertData);
	  
		// Gợi ý: tính toán thời gian dự kiến từ selectedTasks nếu cần
	  
		setIsCreatePertDialogOpen(false);
		toast.success('PERT task created (placeholder)');
	  };

	return (
		<>
			<DropdownMenu>
				<SidebarMenuButton
					isActive={isActive}
					onClick={goToList(item.id)}
					className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<ListIcon />
						<span className="text-ellipsis overflow-hidden whitespace-nowrap">
							{item.name}
						</span>
					</div>
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

			<CreatePertDialog
				open={isCreatePertDialogOpen}
				setOpen={setIsCreatePertDialogOpen}
				onConfirm={handleCreatePertConfirm}
				projectId={item.id}
			/>
		</>
	);
}

export default SpaceTree;