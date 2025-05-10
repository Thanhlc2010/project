'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/common/types';

type AddUserDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	availableUsers: User[];
	workspaceId: string;
	onConfirm?: () => void; // Optional callback after adding
	addMembersToWorkspace: (workspaceId: string, memberIds: string[]) => Promise<void>;
};

export default function AddUserDialog({
	open,
	setOpen,
	availableUsers,
	workspaceId,
	addMembersToWorkspace,
	onConfirm,
}: AddUserDialogProps) {
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

	const toggleUser = (userId: string) => {
		setSelectedUserIds((prev) =>
			prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
		);
	};

	const handleAddUsers = async () => {
		if (selectedUserIds.length > 0) {
			await addMembersToWorkspace(workspaceId, selectedUserIds);
			setOpen(false);
			setSelectedUserIds([]);
			onConfirm?.();
		}
	};

	useEffect(() => {
		if (!open) setSelectedUserIds([]);
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Add Users</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Select users to invite to this workspace
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-60 pr-2">
					<div className="space-y-3 py-4">
						{availableUsers.map((user) => (
							<div key={user.id} className="flex items-center gap-3">
								<Checkbox
									id={user.id}
									checked={selectedUserIds.includes(user.id)}
									onCheckedChange={() => toggleUser(user.id)}
								/>
								<Label htmlFor={user.id} className="flex items-center gap-2 cursor-pointer">
									<img
										src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
										alt={user.name}
										className="w-6 h-6 rounded-full object-cover"
									/>
									<span>{user.name}</span>
								</Label>
							</div>
						))}
					</div>
				</ScrollArea>

				<div className="flex justify-end mt-4">
					<Button onClick={handleAddUsers} disabled={selectedUserIds.length === 0}>
						Add Selected
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
