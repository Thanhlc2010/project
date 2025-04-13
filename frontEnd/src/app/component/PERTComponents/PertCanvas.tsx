"use client";

import React, { useCallback, useEffect } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";
import TaskNode from "./TaskNode";

interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  priority: "high" | "medium" | "low";
  position?: { x: number; y: number };
}

interface PertCanvasProps {
  tasks: Task[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
}

const nodeTypes = {
  task: TaskNode,
};

export default function PertCanvas({
  tasks,
  edges: externalEdges,
  onEdgesChange: handleEdgesChange,
}: PertCanvasProps) {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    externalEdges || []
  );
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const generateUniqueEdgeId = useCallback(
    (sourceId: string, targetId: string) => {
      const baseId = `e${sourceId}-${targetId}`;
      let counter = 0;
      let uniqueId = baseId;
      while (edges.some(edge => edge.id === uniqueId)) {
        counter++;
        uniqueId = `${baseId}-${counter}`;
      }
      return uniqueId;
    },
    [edges]
  );

  const createConnection = useCallback(
    (sourceId: string, targetId: string) => {
      const edgeId = generateUniqueEdgeId(sourceId, targetId);
      const connectionExists = edges.some(
        edge => edge.source === sourceId && edge.target === targetId
      );
      if (connectionExists) {
        console.log("Connection already exists");
        return;
      }
      const newEdge: Edge = {
        id: edgeId,
        source: sourceId,
        target: targetId,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#2563eb" },
      };
      const newEdges = [...edges, newEdge];
      setEdges(newEdges);
      if (handleEdgesChange) {
        handleEdgesChange(newEdges);
      }
    },
    [edges, setEdges, handleEdgesChange, generateUniqueEdgeId]
  );

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const initialNodes = tasks.map((task) => ({
        id: task.id,
        type: "task",
        position: task.position || { x: 0, y: 0 },
        data: {
          ...task,
          allTasks: tasks,
          onCreateConnection: createConnection,
        },
      }));
      setNodes(initialNodes);
    }
  }, [tasks, createConnection, setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onCreateConnection: createConnection,
        },
      }))
    );
  }, [createConnection, setNodes]);

  useEffect(() => {
    if (externalEdges && externalEdges.length > 0 && edges.length === 0) {
      setEdges(externalEdges);
    }
  }, [externalEdges, edges.length, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const edgeId = generateUniqueEdgeId(params.source, params.target);
      const newEdges = addEdge(
        {
          ...params,
          id: edgeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#2563eb" },
        },
        edges
      );
      setEdges(newEdges);
      if (handleEdgesChange) {
        handleEdgesChange(newEdges);
      }
    },
    [edges, setEdges, handleEdgesChange, generateUniqueEdgeId]
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
