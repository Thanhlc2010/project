"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  outgoing: string[];
  priority: "high" | "medium" | "low";
  position?: { x: number; y: number };
  type?: "start" | "end" | "task";
  ES?: number;
  EF?: number;
  LS?: number;
  LF?: number;
}

interface TaskNodeProps {
  data: Task & {
    allTasks: Task[];
    onCreateConnection: (sourceId: string, targetId: string) => void;
    onDeleteConnection: (sourceId: string, targetId: string) => void;
  };
}

const TaskNode = ({ data }: TaskNodeProps) => {
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the modal and the node that triggered it
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        nodeRef.current &&
        !nodeRef.current.contains(event.target as Node)
      ) {
        setShowConnectionModal(false);
      }
    };

    if (showConnectionModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showConnectionModal]);

  const handleNodeClick = useCallback(() => {
    // Only show modal if not end node
    if (data.type !== "end") {
      setShowConnectionModal(!showConnectionModal);
    }
  }, [showConnectionModal, data.type]);

  const handleConnectionSelect = useCallback(
    (targetId: string) => {
      // Don't allow connections to start node
      const targetTask = data.allTasks.find((task) => task.id === targetId);
      if (targetTask?.type === "start") {
        console.log("Cannot connect to Start node");
        return;
      }
      data.onCreateConnection(data.id, targetId);
      setShowConnectionModal(false);
    },
    [data]
  );

  const handleDeleteConnectionSelect = useCallback(
    (targetId: string) => {
      data.onDeleteConnection(data.id, targetId);
      setShowConnectionModal(false);
    },
    [data]
  );

  const getNodeStyle = () => {
    const baseStyle = "p-4 rounded shadow-lg border-2 w-48 cursor-pointer";
    if (data.type === "start") {
      return `${baseStyle} bg-green-100 border-green-500`;
    } else if (data.type === "end") {
      return `${baseStyle} bg-red-100 border-red-500`;
    } else {
      return `${baseStyle} bg-gray-100 border-blue-500`;
    }
  };

  return (
    <div className="relative">
      <div ref={nodeRef} onClick={handleNodeClick}>
        {data.type == "task" && (
          <div className={getNodeStyle()}>
            <table className="table-fixed border-collapse border border-black text-sm font-semibold">
              <tbody>
                <tr className="border border-black">
                  <td className="border border-black px-2 py-1 w-10">{data.name}</td>
                  <td className="border border-black px-2 py-1 w-10">{data.ES ?? 0}</td>
                  <td className="border border-black px-2 py-1 w-10">{data.EF ?? 0}</td>
                </tr>
                <tr className="border border-black">
                  <td className="border border-black px-2 py-1">{data.duration}</td>
                  <td className="border border-black px-2 py-1">{data.LS ?? 0}</td>
                  <td className="border border-black px-2 py-1">{data.LF ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {(data.type === "end" || data.type === "start") && (
          <div className="border border-black bg-white text-black px-4 py-2 rounded text-sm font-semibold text-center min-w-[60px]">
            {(data.type === "start" ? "Start" : "End")}
          </div>
        )}
      </div>

      {showConnectionModal && (
        <div
          ref={modalRef}
          className="absolute left-full top-0 ml-2 bg-white text-black p-3 rounded shadow-lg border border-gray-200 z-10 w-48"
        >
          <div className="font-bold mb-2 text-sm">Kết nối đến:</div>
          {data.allTasks
            .filter((task) => task.id !== data.id && task.type !== "start")
            .map((task) => (
              <div
                key={task.id}
                className="px-2 py-1 text-black hover:bg-blue-100 cursor-pointer rounded text-sm my-1"
                onClick={() => handleConnectionSelect(task.id)}
              >
                {task.name} (ID: {task.id})
              </div>
            ))}

          {data.dependencies && data.dependencies.length > 0 && (
            <>
              <div className="font-bold mb-2 mt-4 text-sm border-t pt-2">Xóa kết nối:</div>
              {data.dependencies.map((depId) => {
                const depTask = data.allTasks.find(task => task.id === depId);
                return depTask ? (
                  <div
                    key={`delete-${depId}`}
                    className="px-2 py-1 text-red-600 hover:bg-red-100 cursor-pointer rounded text-sm my-1 flex items-center"
                    onClick={() => handleDeleteConnectionSelect(depId)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    {depTask.name} (ID: {depId})
                  </div>
                ) : null;
              })}
            </>
          )}
        </div>
      )}

      {data.type !== "start" && (
        <Handle type="target" position={Position.Left} />
      )}
      {data.type !== "end" && (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  );
};

export default TaskNode;