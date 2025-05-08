import { Task, pertTask } from '@/common/types';

export function convertToPertTask(task: Task): pertTask {
  return {
    id: task.id,
    name: task.name,
    duration: task.duration ?? 0,
    dependencies: task.dependencies ?? [],
    priority: (task.priority.toLowerCase() as 'high' | 'medium' | 'low'),
    position: task.position,
    ES: task.ES,
    EF: task.EF,
    LS: task.LS,
    LF: task.LF,
  };
}

export function convertToPertTasks(tasks: Task[]): pertTask[] {
  return tasks.map(convertToPertTask);
}
