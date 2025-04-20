"use client";

import { useState, useEffect } from "react";
import TaskList from "../component/PERTComponents/TaskList";
import PertDiagram from "../component/PERTComponents/PertDiagram";
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import TaskCard from "../component/PERTComponents/TaskCard";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  priority: "high" | "medium" | "low";
  position?: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: any;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pertTasks, setPertTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const route = useRouter();
  // Use dynamic import to load the tasks JSON
  useEffect(() => {
    const loadTasks = async () => {
      const module = await import("../../mocks/PERTData.json");
      const loadedTasks = module.default.map((task: any) => ({
        ...task,
        priority: task.priority as "high" | "medium" | "low", // Cast priority to the valid type
      }));
      setTasks(loadedTasks);
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    if (!authenticated || authenticated === "false") {
      route.push("/login");
    }
  }, [route]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    // debugger;
    if (over && over.id === "pert-drop-area") {
      const draggedTask = tasks.find((task) => task.id === active.id);
      if (
        draggedTask &&
        !pertTasks.some((pertTask) => pertTask.id === draggedTask.id)
      ) {
        const random = Math.random();
        setPertTasks([
          ...pertTasks,
          {
            ...draggedTask,
            position: {
              x: (pertTasks.length + random) * 100,
              y: (pertTasks.length - random) * 100,
            },
          },
        ]);
        const updatedTasks = tasks.filter((task) => task.id !== draggedTask.id);
        setTasks(updatedTasks);
      }
    }
  };

  const onEdgesChange = (newEdges: Edge[]) => {
    setEdges(newEdges);
  };

  return (
    <div className="flex h-screen">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Danh sách Task</h2>
          <TaskList tasks={tasks} />
        </div>
        <div className="w-2/3 p-4">
          <h2 className="text-xl font-bold mb-4">Sơ đồ PERT</h2>
          <PertDiagram
            tasks={pertTasks}
            edges={edges}
            onEdgesChange={onEdgesChange}
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
