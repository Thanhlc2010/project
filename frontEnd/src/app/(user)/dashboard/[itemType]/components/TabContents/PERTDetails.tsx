import { useEffect, useState } from 'react';

import { Pert, Task } from '@/common/types';
import { useWorkspaceStore } from '@/store/workspaceStore';

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
			const pert = await getPertById(id);
			setPert(pert);
		};

		const fetchTasks = async () => {
			try {
				const res = await fetch(`/api/tasks/${id}`);
				const data = await res.json();
				setTasks(data);
			} catch (error) {
				console.error('Failed to fetch tasks:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPert();
		fetchTasks();
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
			{tasks.length === 0 ? (
				<p>Không có task nào.</p>
			) : (
				<div className="space-y-2">
					{tasks.map((task, index) => (
						<div key={index} className="p-4 border rounded shadow">
							<p>
								<strong>Tên:</strong> {task.name}
							</p>
							<p>
								<strong>Thời gian:</strong> {task.duration}
							</p>
							{/* Thêm các field khác nếu cần */}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
