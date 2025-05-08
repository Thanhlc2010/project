import { useEffect, useState } from 'react';

import { Pert, Task } from '@/common/types';
import { useWorkspaceStore } from '@/store/workspaceStore';
import PERT from './PERT';
import { convertToPertTasks } from '@/common/utils/convertToPertTask';
import { convertIssueToTask } from '@/common/utils/convertIssueToTask';

type PertDetailsProps = {
	id: string;
};

export default function PertDetails({ id }: PertDetailsProps) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [pert, setPert] = useState<Pert | null>(null);
	const getPertById = useWorkspaceStore((state) => state.getPertById);
	const getPertByProjectId = useWorkspaceStore((state) => state.getPertByProjectId);
	useEffect(() => {
		const fetchPert = async () => {
			try {
				const pertData = await getPertById(id);
				setPert(pertData);
				
				// Extract issues from pertTasks list if available
				if (pertData && pertData.pertTasks && Array.isArray(pertData.pertTasks)) {
					const issuesList: Task[] = [];
					
					// Loop through each pertTask and extract its issue
					for (const pertTask of pertData.pertTasks) {
						if (pertTask.issue) {
							issuesList.push(convertIssueToTask(pertTask.issue));
						}
					}
					
					setTasks(issuesList);
				} else {
					setTasks([]);
				}
			} catch (error) {
				console.error('Failed to fetch PERT:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPert();
	}, [id, getPertById]);

	useEffect(() => {
		const fetchProjectPert = async (projectId: string) => {
			try {
				await getPertByProjectId(projectId);
			} catch (error) {
				console.error('Failed to fetch project:', error);
			}
		};

		if (pert?.projectId) {
			fetchProjectPert(pert.projectId);
		}
	}, [pert, getPertByProjectId]);

	if (!pert) {
		return <div className="p-6">Không tìm thấy PERT</div>;
	}

	if (loading) return <div className="p-6">Đang tải danh sách task...</div>;

	return (
		<div className="container mx-auto p-6">
			<p className="text-xl font-bold mb-4">PERT Details</p>
			<PERT tasks={convertToPertTasks(tasks)}
			// initialEdges={pert.taskEdges}
			// initialNodes={pert.taskNodes} 
			/>
		</div>
	);
}
