import { useEffect, useState } from 'react';
import { Task } from '@/common/types';

type PertDetailsProps = {
	id: string;
};

export default function PertDetails({ id }: PertDetailsProps) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
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

		fetchTasks();
	}, [id]);

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
							<p><strong>Tên:</strong> {task.name}</p>
							<p><strong>Thời gian:</strong> {task.duration}</p>
							{/* Thêm các field khác nếu cần */}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
