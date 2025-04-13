'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type CreateSpaceDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: (spaceName: string, description?: string) => void;
};

export default function CreateSpaceDialog({ open, setOpen, onConfirm }: CreateSpaceDialogProps) {
	const [spaceName, setSpaceName] = useState('');
	const [description, setDescription] = useState('');

	const handleConfirm = () => {
		onConfirm(spaceName, description);
		setOpen(false);
	};

	useEffect(() => {
		return () => {
			setSpaceName('');
			setDescription('');
		};
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Create a Space</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						A Space represents teams, departments, or groups, each with its own Lists,
						workflows, and settings.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<Label htmlFor="spaceName">Name</Label>
						<Input
							id="spaceName"
							placeholder="e.g. Marketing, Engineering, HR"
							value={spaceName}
							onChange={(e) => setSpaceName(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">
							Description{' '}
							<span className="text-sm text-muted-foreground">(optional)</span>
						</Label>
						<Textarea
							id="description"
							placeholder="Add a description for your space"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="min-h-[100px]"
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
