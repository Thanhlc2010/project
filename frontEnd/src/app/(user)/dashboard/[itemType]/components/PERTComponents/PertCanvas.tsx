"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  applyNodeChanges,
  Position,
  MarkerType,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import TaskNode from "./TaskNode";
import { useDroppable } from "@dnd-kit/core";

interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  priority: "high" | "medium" | "low";
  position?: { x: number; y: number };
  type?: "start" | "end" | "task";
}
function DroppableCanvas({
  children,
  setNodes,
  nodes,
  reactFlowInstance,
}: {
  children: React.ReactNode;
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  nodes: Node[];
  reactFlowInstance: ReactFlowInstance | null;
}) {
  const { setNodeRef } = useDroppable({
    id: "reactflow-canvas",
  });

  return (
    <div ref={setNodeRef} style={{ flex: 1 }}>
      {children}
    </div>
  );
}
interface PertCanvasProps {
  tasks: Task[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
  onInit?: (instance: ReactFlowInstance) => void;
}

const nodeTypes = {
  task: TaskNode,
};

export default function PertCanvas({
  tasks,
  edges: externalEdges,
  onEdgesChange: handleEdgesChange,
  onInit,
}: PertCanvasProps) {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(externalEdges || []);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const hasInitialized = useRef(false);
  const createConnectionRef = useRef<(sourceId: string, targetId: string) => void>(() => { });

  const handleNodesChange = useCallback(
    (changes: any) => {
      console.log("Nodes changes:", changes);
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const generateUniqueEdgeId = useCallback(
    (sourceId: string, targetId: string) => {
      const baseId = `e${sourceId}-${targetId}`;
      let counter = 0;
      let uniqueId = baseId;
      while (edges.some((edge) => edge.id === uniqueId)) {
        counter++;
        uniqueId = `${baseId}-${counter}`;
      }
      return uniqueId;
    },
    [edges]
  );

  const createConnection = useCallback(
    (sourceId: string, targetId: string) => {
      const sourceNode = nodes.find((node) => node.id === sourceId);
      const targetNode = nodes.find((node) => node.id === targetId);

      if (
        sourceNode?.data.type === "end" ||
        targetNode?.data.type === "start"
      ) {
        console.log("Invalid connection");
        return;
      }

      const edgeId = generateUniqueEdgeId(sourceId, targetId);
      const connectionExists = edges.some(
        (edge) => edge.source === sourceId && edge.target === targetId
      );
      const connectionExistsReverse = edges.some(
        (edge) => edge.source === targetId && edge.target === sourceId
      )
      if (connectionExistsReverse) {
        console.log("Connection already exists");
        return;
      }
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
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#2563eb',
        },
        style: {
          strokeWidth: 2,
          stroke: '#2563eb',
        },       
      };
      const newEdges = [...edges, newEdge];
      setEdges(newEdges);
      if (handleEdgesChange) {
        handleEdgesChange(newEdges);
      }
    },
    [edges, nodes, setEdges, handleEdgesChange, generateUniqueEdgeId]
  );

  useEffect(() => {
    createConnectionRef.current = createConnection;
  }, [createConnection]);

  useEffect(() => {
    console.log("Tasks props:", tasks);

    const defaultTasks: Task[] = [
      {
        id: "start",
        name: "Start",
        duration: 0,
        dependencies: [],
        priority: "high",
        type: "start",
      },
      {
        id: "end",
        name: "End",
        duration: 0,
        dependencies: [],
        priority: "high",
        type: "end",
      },
    ];
    const allTasks = [...defaultTasks, ...tasks]; // Kết hợp default tasks với tasks props
    console.log("All tasks:", allTasks); // Debug allTasks

    if (!hasInitialized.current) {
      const defaultNodes: Node[] = [
        {
          id: "start",
          type: "task",
          position: { x: 50, y: 300 },
          data: {
            id: "start",
            name: "Start",
            duration: 0,
            dependencies: [],
            priority: "high",
            type: "start",
            allTasks,
            onCreateConnection: (sourceId: string, targetId: string) =>
              createConnectionRef.current(sourceId, targetId),
          },
          sourcePosition: Position.Right,
        },
        {
          id: "end",
          type: "task",
          position: { x: 800, y: 300 },
          data: {
            id: "end",
            name: "End",
            duration: 0,
            dependencies: [],
            priority: "high",
            type: "end",
            allTasks,
            onCreateConnection: (sourceId: string, targetId: string) =>
              createConnectionRef.current(sourceId, targetId),
          },
          sourcePosition: Position.Right,
        },
      ];

      setNodes((currentNodes) => {
        const newNodesMap = new Map(currentNodes.map((node) => [node.id, node]));

        tasks.forEach((task) => {
          if (!newNodesMap.has(task.id)) {
            newNodesMap.set(task.id, {
              id: task.id,
              type: "task",
              position: task.position || { x: Math.random() * 500 + 200, y: Math.random() * 500 },
              data: {
                ...task,
                type: "task",
                allTasks,
                onCreateConnection: (sourceId: string, targetId: string) =>
                  createConnectionRef.current(sourceId, targetId),
              },
            });
          } else {
            const existingNode = newNodesMap.get(task.id)!;
            newNodesMap.set(task.id, {
              ...existingNode,
              data: {
                ...task,
                type: "task",
                allTasks,
                onCreateConnection: (sourceId: string, targetId: string) =>
                  createConnectionRef.current(sourceId, targetId),
              },
            });
          }
        });

        defaultNodes.forEach((defaultNode) => {
          if (!newNodesMap.has(defaultNode.id)) {
            newNodesMap.set(defaultNode.id, defaultNode);
          }
        });

        return Array.from(newNodesMap.values());
      });

      hasInitialized.current = true;
    } else {
      setNodes((currentNodes) => {
        const newNodesMap = new Map(currentNodes.map((node) => [node.id, node]));

        // Cập nhật các node từ tasks
        tasks.forEach((task) => {
          if (!newNodesMap.has(task.id)) {
            newNodesMap.set(task.id, {
              id: task.id,
              type: "task",
              position: task.position || { x: Math.random() * 500 + 200, y: Math.random() * 500 },
              data: {
                ...task,
                type: "task",
                allTasks,
                onCreateConnection: (sourceId: string, targetId: string) =>
                  createConnectionRef.current(sourceId, targetId),
              },
            });
          } else {
            const existingNode = newNodesMap.get(task.id)!;
            newNodesMap.set(task.id, {
              ...existingNode,
              data: {
                ...task,
                type: "task",
                allTasks, // Cập nhật allTasks cho node hiện có
                onCreateConnection: (sourceId: string, targetId: string) =>
                  createConnectionRef.current(sourceId, targetId),
              },
            });
          }
        });

        // Tạo lại defaultNodes với allTasks mới
        const updatedDefaultNodes: Node[] = [
          {
            id: "start",
            type: "task",
            position: { x: 50, y: 300 },
            data: {
              id: "start",
              name: "Start",
              duration: 0,
              dependencies: [],
              priority: "high",
              type: "start",
              allTasks, // Cập nhật allTasks
              onCreateConnection: (sourceId: string, targetId: string) =>
                createConnectionRef.current(sourceId, targetId),
            },
            sourcePosition: Position.Right,
          },
          {
            id: "end",
            type: "task",
            position: { x: 800, y: 300 },
            data: {
              id: "end",
              name: "End",
              duration: 0,
              dependencies: [],
              priority: "high",
              type: "end",
              allTasks, // Cập nhật allTasks
              onCreateConnection: (sourceId: string, targetId: string) =>
                createConnectionRef.current(sourceId, targetId),
            },
            sourcePosition: Position.Left,
          },
        ];

        // Cập nhật default nodes trong newNodesMap
        updatedDefaultNodes.forEach((defaultNode) => {
          if (newNodesMap.has(defaultNode.id)) {
            const existingNode = newNodesMap.get(defaultNode.id)!;
            newNodesMap.set(defaultNode.id, {
              ...existingNode,
              data: {
                ...existingNode.data,
                allTasks, // Cập nhật allTasks cho Start và End
              },
            });
          }
        });

        return Array.from(newNodesMap.values());
      });
    }

    console.log("Nodes after update:", nodes);
  }, [tasks, setNodes]);

  useEffect(() => {
    if (externalEdges && externalEdges.length > 0 && edges.length === 0) {
      setEdges(externalEdges);
    }
  }, [externalEdges, edges.length, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (
        sourceNode?.data.type === "end" ||
        targetNode?.data.type === "start"
      ) {
        console.log("Invalid connection");
        return;
      }
      const connectionExists = edges.some(
        (edge) => edge.source === sourceNode?.id && edge.target === targetNode?.id
      );
      const connectionExistsReverse = edges.some(
        (edge) => edge.source === targetNode?.id && edge.target === sourceNode?.id
      )
      if (connectionExistsReverse) {
        console.log("Connection already exists");
        return;
      }
      if (connectionExists) {
        console.log("Connection already exists");
        return;
      }
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
    [edges, nodes, setEdges, handleEdgesChange, generateUniqueEdgeId]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onInit={onInit}
      fitView
    >
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}