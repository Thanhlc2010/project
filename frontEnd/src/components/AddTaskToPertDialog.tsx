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
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check } from 'lucide-react';

import { Pert } from '@/common/types';

type AddTaskToPertDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: (pertId: string) => void;
	listPert: Pert[];
};

export default function AddTaskToPertDialog({ 
	open, 
	setOpen, 
	onConfirm, 
	listPert 
}: AddTaskToPertDialogProps) {
	const [selectedPertId, setSelectedPertId] = useState<string>('');

	const handleConfirm = () => {
		if (selectedPertId) {
			onConfirm(selectedPertId);
			setOpen(false);
		}
	};

	useEffect(() => {
		if (open && listPert.length > 0) {
			setSelectedPertId(listPert[0].id);
		}
		
		return () => {
			setSelectedPertId('');
		};
	}, [open, listPert]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">Add Task to PERT</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Select a PERT chart to add this task to.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					{listPert.length > 0 ? (
						<div className="space-y-4">
							<Label>Available PERT Charts</Label>
							<ScrollArea className="h-[300px] pr-4">
								<div className="space-y-3">
									{listPert.map((pert) => (
										<div 
											key={pert.id} 
											className={`flex items-start space-x-3 rounded-md border p-3 hover:bg-muted cursor-pointer ${
												selectedPertId === pert.id ? 'border-primary bg-primary/5' : ''
											}`}
											onClick={() => setSelectedPertId(pert.id)}
										>
											<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary">
												{selectedPertId === pert.id && (
													<Check className="h-3.5 w-3.5 text-primary" />
												)}
											</div>
											<div className="space-y-1">
												<div className="text-base font-medium">
													{pert.name}
												</div>
												{pert.project?.name && (
													<p className="text-sm text-muted-foreground">
														Project: {pert.project.name}
													</p>
												)}
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						</div>
					) : (
						<div className="flex items-center justify-center h-[300px]">
							<p className="text-muted-foreground">No PERT charts available.</p>
						</div>
					)}
				</div>
				<div className="flex justify-end space-x-2">
					<Button 
						type="button" 
						variant="outline" 
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
					<Button 
						type="button" 
						onClick={handleConfirm}
						disabled={!selectedPertId || listPert.length === 0}
					>
						Add to PERT
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}