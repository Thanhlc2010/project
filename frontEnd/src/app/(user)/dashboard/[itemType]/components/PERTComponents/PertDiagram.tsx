"use client";

import { useDroppable } from "@dnd-kit/core";
import PertCanvas from "./PertCanvas";
import React, { memo, useRef } from "react";
import { PertCanvasRef } from "@/mocks/PertCanvasRef";
import { pertTask } from "@/common/types";
import { TaskEdge, TaskNode } from '@/common/types'


interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  priority: "high" | "medium" | "low";
  position?: { x: number; y: number };
  ES?: number;
  EF?: number;
  LS?: number;
  LF?: number;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: any;
}

interface CriticalPathNode {
  id: string;
  data: {
    name?: string;
    duration?: number;
    ES?: number;
    EF?: number;
    LS?: number;
    LF?: number;
    [key: string]: any;
  };
  [key: string]: any;
}


interface PertDiagramProps {
  tasks: Task[];
  edges: Edge[];
  onEdgesChange: (edges: Edge[]) => void;
  onTasksChange?: (tasks: Task[]) => void;
  createConnectionRef?: (sourceId: string, targetId: string) => void;
  deleteConnectionRef?: (sourceId: string, targetId: string) => void;
  onInit?: (instance: any) => void;
  onGetCurrentTask: () => pertTask[];
  onSetCurrentTask: (task: pertTask[]) => void;
  initialNodes?: TaskNode[];
  initialEdges?: TaskEdge[]
}

const PertDiagram = memo(
  ({ tasks, edges, onEdgesChange, onTasksChange, onGetCurrentTask, onSetCurrentTask, onInit, createConnectionRef, deleteConnectionRef }: PertDiagramProps) => {
    const { setNodeRef } = useDroppable({
      id: "pert-drop-area",
    });

    const reactFlowInstanceRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<PertCanvasRef>(null);

    const handleInit = (instance: any) => {
      reactFlowInstanceRef.current = instance;
      if (onInit) {
        onInit(instance);
      }
    };

    const handleLogTasks = () => {
      if (reactFlowInstanceRef.current) {
        const nodes = reactFlowInstanceRef.current.getNodes();
        console.log("Current Nodes in PERT Diagram:", nodes);
      } else {
        console.log("React Flow instance not available yet");
      }
    };

    const getConnectedNodesFromSource = (taskID: string) => {
      if (!reactFlowInstanceRef.current) return [];

      const allEdges = reactFlowInstanceRef.current.getEdges();
      const allNodes = reactFlowInstanceRef.current.getNodes();

      const outgoingEdges = allEdges.filter((edge: Edge) => edge.source === taskID);
      const connectedNodes = outgoingEdges
        .map((edge: Edge) => allNodes.find((node: any) => node.id === edge.target))
        .filter(Boolean);

      return connectedNodes;
    };

    const getConnectedNodesToTarget = (taskID: string) => {
      if (!reactFlowInstanceRef.current) return [];

      const allEdges = reactFlowInstanceRef.current.getEdges();
      const allNodes = reactFlowInstanceRef.current.getNodes();

      const incomingEdges = allEdges.filter((edge: Edge) => edge.target === taskID);

      const connectedNodes = incomingEdges
        .map((edge: Edge) => allNodes.find((node: any) => node.id === edge.source))
        .filter(Boolean);

      return connectedNodes;
    };



    const handleShowCriticalPaths = () => {
      canvasRef.current?.showCriticalPaths();
    };

    const handleCalculatePERT = () => {
      if (!reactFlowInstanceRef.current) {
        console.log("React Flow instance not available yet");
        return;
      }

      const allNodes = reactFlowInstanceRef.current.getNodes();

      const updatedNodes = [...allNodes];
      const updatedTasks: Task[] = [...tasks];
      let hasChanges = false;

      updatedNodes.forEach((node, index) => {
        updatedNodes[index] = {
          ...node,
          data: {
            ...node.data,
            ES: node.id === "start" ? 0 : undefined,
            EF: node.id === "start" ? 0 : undefined,
            LS: undefined,
            LF: undefined
          }
        };
      });

      console.log("Starting forward pass calculation...");

      calculateForwardPass("start", updatedNodes, new Set());

      const endNodeIndex = updatedNodes.findIndex(n => n.id === "end");
      if (endNodeIndex !== -1) {
        const endPredecessors = getConnectedNodesToTarget("end");
        let maxEF = 0;

        endPredecessors.forEach((pred: any) => {
          const predNode = updatedNodes.find(n => n.id === pred.id);
          if (predNode && predNode.data.EF !== undefined) {
            maxEF = Math.max(maxEF, predNode.data.EF);
          }
        });

        updatedNodes[endNodeIndex] = {
          ...updatedNodes[endNodeIndex],
          data: {
            ...updatedNodes[endNodeIndex].data,
            ES: maxEF,
            EF: maxEF
          }
        };

        console.log(`Updated End node: ES=${maxEF}, EF=${maxEF}`);
      }

      console.log("Starting backward pass calculation...");

      if (endNodeIndex !== -1) {
        const endEF = updatedNodes[endNodeIndex].data.EF;
        updatedNodes[endNodeIndex] = {
          ...updatedNodes[endNodeIndex],
          data: {
            ...updatedNodes[endNodeIndex].data,
            LS: endEF,
            LF: endEF
          }
        };
      }

      calculateBackwardPass("end", updatedNodes, new Set());

      reactFlowInstanceRef.current.setNodes(updatedNodes);

      updatedNodes.forEach(node => {
        if (node.id !== "start" && node.id !== "end") {
          const taskIndex = updatedTasks.findIndex(t => t.id === node.id);
          if (taskIndex !== -1) {
            updatedTasks[taskIndex] = {
              ...updatedTasks[taskIndex],
              ES: node.data.ES,
              EF: node.data.EF,
              LS: node.data.LS,
              LF: node.data.LF
            };
            hasChanges = true;
          }
        }
      });

      if (hasChanges && onTasksChange) {
        onTasksChange(updatedTasks);
      }

      console.log("Phân tích các đường găng (Critical Paths):");
    };

    function calculateForwardPass(nodeId: string, nodes: any[], visited: Set<string>) {
      visited.add(nodeId);

      const successors = getConnectedNodesFromSource(nodeId);

      if (nodeId === "end" || successors.length === 0) {
        return;
      }

      const currentNode = nodes.find(n => n.id === nodeId);
      const currentEF = currentNode?.data.EF ?? 0;

      for (const successor of successors) {
        const successorId = successor.id;

        if (successorId === "end") {
          continue;
        }

        const successorIndex = nodes.findIndex(n => n.id === successorId);
        if (successorIndex === -1) continue;

        const predecessors = getConnectedNodesToTarget(successorId);

        let maxPredecessorEF = 0;
        for (const pred of predecessors) {
          const predNode = nodes.find(n => n.id === pred.id);
          if (predNode?.data.EF !== undefined) {
            maxPredecessorEF = Math.max(maxPredecessorEF, predNode.data.EF);
          }
        }

        const ES = maxPredecessorEF;
        const duration = nodes[successorIndex].data.duration ?? 0;
        const EF = ES + duration;

        nodes[successorIndex] = {
          ...nodes[successorIndex],
          data: {
            ...nodes[successorIndex].data,
            ES: ES,
            EF: EF
          }
        };

        console.log(`Updated node ${nodes[successorIndex].data.name} (ID: ${successorId}): ES=${ES}, Duration=${duration}, EF=${EF}`);

        if (!visited.has(successorId)) {
          calculateForwardPass(successorId, nodes, visited);
        }
      }
    }

    function calculateBackwardPass(nodeId: string, nodes: any[], visited: Set<string>) {
      visited.add(nodeId);

      const predecessors = getConnectedNodesToTarget(nodeId);

      if (nodeId === "start" || predecessors.length === 0) {
        return;
      }

      const currentNode = nodes.find(n => n.id === nodeId);
      const currentLS = currentNode?.data.LS;

      if (currentLS === undefined) {
        console.warn(`Node ${nodeId} has undefined LS, skipping backward calculation`);
        return;
      }

      for (const predecessor of predecessors) {
        const predecessorId = predecessor.id;

        if (predecessorId === "start") {
          continue;
        }

        const predecessorIndex = nodes.findIndex(n => n.id === predecessorId);
        if (predecessorIndex === -1) continue;

        const predDuration = nodes[predecessorIndex].data.duration ?? 0;

        const LF = currentLS;
        const LS = LF - predDuration;

        const existingLS = nodes[predecessorIndex].data.LS;
        const finalLS = existingLS !== undefined ? Math.min(existingLS, LS) : LS;
        const finalLF = finalLS + predDuration;

        nodes[predecessorIndex] = {
          ...nodes[predecessorIndex],
          data: {
            ...nodes[predecessorIndex].data,
            LS: finalLS,
            LF: finalLF
          }
        };

        console.log(`Backward pass updated node ${nodes[predecessorIndex].data.name} (ID: ${predecessorId}): LS=${finalLS}, LF=${finalLF}`);

        if (!visited.has(predecessorId)) {
          calculateBackwardPass(predecessorId, nodes, visited);
        }
      }
    }

    const handleTasksChange = (updatedTasks: Task[]) => {
      if (onTasksChange) {
        onTasksChange(updatedTasks);
      }
    };

    const handleExportJSON = () => {
      if (!canvasRef.current) {
        console.log("Canvas ref not available");
        return;
      }

      const exportData = canvasRef.current.exportToJSON();

      const currentTasks = typeof onGetCurrentTask === 'function'
        ? onGetCurrentTask()
        : [];
      const combinedData = {
        ...exportData,
        listTask: currentTasks,
      };
      const blob = new Blob([JSON.stringify(combinedData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "pert-diagram.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };


    const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          debugger;
          if (canvasRef.current) {
            const tasks = unflattenListTask(importedData.listTask);
            onSetCurrentTask(tasks);
            canvasRef.current.importFromJSON(importedData);
            console.log("Imported JSON successfully");
          } else {
            console.error("Canvas ref not available");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    };

    const importFromData = (
      tasks: Task[],
      initialEdges: Edge[],
      initialNodes: Node[]
    ) => {
      if (!canvasRef.current) {
        console.error("Canvas ref not available");
        return;
      }
    
      try {
        const importedData = {
          tasks,
          nodes: initialNodes,
          edges: initialEdges,
          metadata: {}, // hoặc bỏ nếu không cần
        };
    
        // Set lại danh sách task hiện tại (nếu bạn muốn cập nhật UI/State)
        onSetCurrentTask(tasks);
    
        // Gọi vào canvas như đang import từ file
        canvasRef.current.importFromJSON(importedData);
        console.log("Imported data successfully from variables");
      } catch (error) {
        console.error("Error importing data:", error);
      }
    };
    

    const unflattenListTask = (listTask: pertTask[]) => {
      const unflattenedTasks = listTask.map((task) => ({
        ...task,
        id: task.id.toString(),
      }));
      return unflattenedTasks;
    }

    const handleImportClick = () => {
      fileInputRef.current?.click();
    };



    return (
      <div className="flex flex-col h-full">
        <div className="mb-2 flex justify-end space-x-2">
          <button
            onClick={handleCalculatePERT}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Calculate PERT/CPM
          </button>
          <button
            onClick={handleShowCriticalPaths}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Show Critical Paths
          </button>
          <button
            onClick={handleLogTasks}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Log Tasks
          </button>
          <button
            onClick={handleExportJSON}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v6"></path>
            </svg>
            Export JSON
          </button>
          <button
            onClick={handleImportClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v6"></path>
            </svg>
            Import JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </div>
        <div
          ref={setNodeRef}
          className="w-full h-[calc(100vh-160px)] bg-gray-50 rounded-lg border border-dashed border-gray-300"
        >
          <PertCanvas
            tasks={tasks}
            edges={edges}
            ref={canvasRef}
            onEdgesChange={onEdgesChange}
            onTasksChange={handleTasksChange}
            onInit={handleInit}
          />
        </div>
      </div>
    );
  }
);

PertDiagram.displayName = "PertDiagram";

export default PertDiagram;