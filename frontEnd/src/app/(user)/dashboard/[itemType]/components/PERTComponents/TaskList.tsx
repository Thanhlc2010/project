"use client";

import { useDraggable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

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

interface TaskListProps {
  tasks: Task[];
}

interface DraggableTaskCardProps {
  task: Task;
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <DraggableTaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

function DraggableTaskCard({ task }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none ${isDragging ? 'opacity-50' : ''}`}
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}