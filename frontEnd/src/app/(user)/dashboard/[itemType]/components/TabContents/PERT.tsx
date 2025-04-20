'use client';

import { DndContext, DragOverlay, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import PertDiagram from '../../components/PERTComponents/PertDiagram';
import TaskCard from '../../components/PERTComponents/TaskCard';
import TaskList from '../../components/PERTComponents/TaskList';
import { pertTask } from '@/common/types'


interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: any;
}

export default function Home() {

  const [tasks, setTasks] = useState<pertTask[]>([]);
  const [pertTasks, setPertTasks] = useState<pertTask[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const pertAreaRef = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  useEffect(() => {
    const loadTasks = async () => {
      const module = await import("../../../../../../mocks/PERTData.json");
      const loadedTasks = module.default.map((task: any) => ({
        ...task,
        priority: task.priority as "high" | "medium" | "low",
      }));
      setTasks(loadedTasks);
    };
    loadTasks();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id === "pert-drop-area" && reactFlowInstance) {
      const draggedTask = tasks.find((task) => task.id === active.id);

      if (
        draggedTask &&
        !pertTasks.some((pertTask) => pertTask.id === draggedTask.id)
      ) {
        const canvasBounds = document.getElementById('pert-drop-area')?.getBoundingClientRect();

        const offsetX = canvasBounds?.left ?? 0;
        const offsetY = canvasBounds?.top ?? 0;

        const position = reactFlowInstance.screenToFlowPosition({
          x: (event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientX : 0) + offsetX,
          y: (event.activatorEvent instanceof MouseEvent ? event.activatorEvent.clientY : 0) + offsetY,
        });
        // console.log("Screen:", event.delta.x, event.delta.y);
        // console.log("Flow:", position.x, position.y);

        console.log("before ",pertTasks);
        setPertTasks([
          ...pertTasks,
          {
            ...draggedTask,
            position: { x: position.x, y: position.y },
          },
        ]);
        console.log("after ",pertTasks);


        const updatedTasks = tasks.filter((task) => task.id !== draggedTask.id);
        setTasks(updatedTasks);
      }
    }
  };

  const onEdgesChange = (newEdges: Edge[]) => {
    setEdges(newEdges);
  };

  const onInit = (instance: any) => {
    setReactFlowInstance(instance);
  };

  return (
    <div className="flex h-screen">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Danh sách Task</h2>
          <TaskList tasks={tasks} />
        </div>

        <div
          id="pert-drop-area"
          ref={pertAreaRef}
          className="w-2/3 p-4 relative"
        >
          <h2 className="text-xl font-bold mb-4">Sơ đồ PERT</h2>
          <PertDiagram
            tasks={pertTasks}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onInit={onInit}
            onTasksChange={setPertTasks}
          />
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={tasks.find((task) => task.id === activeId)}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

