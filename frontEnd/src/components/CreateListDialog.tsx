'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CreateListDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: (listName: string) => void;
};

export default function CreateListDialog({ open, setOpen, onConfirm }: CreateListDialogProps) {
	const [listName, setListName] = useState('');

	const handleConfirm = () => {
		onConfirm(listName);
		setOpen(false);
	};

	useEffect(() => {
		return () => {
			setListName('');
		};
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Create List</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Use a List to track tasks, projects, people, and more
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<Label htmlFor="listName">Name</Label>
						<Input
							id="listName"
							placeholder="e.g. Marketing, Engineering, HR"
							value={listName}
							onChange={(e) => setListName(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex justify-end">
					<Button type="button" onClick={handleConfirm}>
						Create
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
