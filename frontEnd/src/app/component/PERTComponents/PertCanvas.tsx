"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  NodeDragHandler
} from 'reactflow';
import 'reactflow/dist/style.css';

interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  priority: 'high' | 'medium' | 'low';
  position?: { x: number; y: number };
}

interface TaskNodeProps {
  data: Task;
}

interface PertCanvasProps {
  tasks: Task[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
}

const TaskNode = ({ data }: TaskNodeProps) => {
  return (
    <div className="bg-white p-4 rounded shadow-lg border-2 border-blue-500 w-48">
      <div className="font-bold">{data.name}</div>
      <div className="text-sm text-gray-600">
        <div>Thời gian: {data.duration} ngày</div>
        <div>ID: {data.id}</div>
      </div>
    </div>
  );
};

const nodeTypes = {
  task: TaskNode,
};

export default function PertCanvas({ tasks, edges: externalEdges, onEdgesChange: handleEdgesChange }: PertCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    tasks.map((task) => ({
      id: task.id,
      type: 'task',
      position: task.position || { x: 0, y: 0 },
      data: { ...task },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(externalEdges || []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(
        {
          ...params,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#2563eb' },
        },
        edges
      );
      setEdges(newEdges);
      if (handleEdgesChange) {
        handleEdgesChange(newEdges);
      }
    },
    [edges, setEdges, handleEdgesChange]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
  );
}