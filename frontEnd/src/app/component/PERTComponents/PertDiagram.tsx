"use client";

import { useDroppable } from "@dnd-kit/core";
import PertCanvas from "./PertCanvas";
import React, { memo, useEffect } from "react"; // Import memo

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

interface PertDiagramProps {
  tasks: Task[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
  onInit?: (instance: any) => void;
}

const PertDiagram = memo(
  ({ tasks, edges, onEdgesChange , onInit }: PertDiagramProps) => {
    // Use memo
    const { setNodeRef } = useDroppable({
      id: "pert-drop-area",
    });

    return (
      <div
        ref={setNodeRef}
        className="w-full h-[calc(100vh-120px)] bg-gray-50 rounded-lg border border-dashed border-gray-300"
      >
        <PertCanvas tasks={tasks} edges={edges} onEdgesChange={onEdgesChange} onInit={onInit} />
      </div>
    );
  }
);

PertDiagram.displayName = "PertDiagram";

export default PertDiagram;
