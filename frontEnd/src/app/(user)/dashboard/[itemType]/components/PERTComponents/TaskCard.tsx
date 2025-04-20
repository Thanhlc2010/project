interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  priority: 'high' | 'medium' | 'low';
  position?: { x: number; y: number };
  ES?: number;
  EF?: number;
  LS?: number;
  LF?: number;
}

interface TaskCardProps {
  task?: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  if (!task) return null;

  return (
    <div
      className={`
        bg-white p-4 rounded-lg shadow
        ${isDragging ? 'opacity-50' : ''}
        border-l-4 ${getPriorityColor(task.priority)}
      `}
    >
      <h3 className="font-bold text-lg">{task.name}</h3>
      <div className="flex justify-between mt-2">
        <span className="text-gray-600">Thời gian: {task.duration} ngày</span>
        <span className="text-gray-600">ID: {task.id}</span>
      </div>
      {task.dependencies && task.dependencies.length > 0 && (
        <div className="mt-2">
          <span className="text-gray-600">
            Phụ thuộc: {task.dependencies.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}

function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return 'border-red-500';
    case 'medium':
      return 'border-yellow-500';
    case 'low':
      return 'border-green-500';
    default:
      return 'border-gray-500';
  }
}