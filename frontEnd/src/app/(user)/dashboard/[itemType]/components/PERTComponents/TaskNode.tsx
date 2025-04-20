"use client";

import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";

interface Task {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  priority: "high" | "medium" | "low";
  position?: { x: number; y: number };
  type?: "start" | "end" | "task";
}

interface TaskNodeProps {
  data: Task & {
    allTasks: Task[];
    onCreateConnection: (sourceId: string, targetId: string) => void;
  };
}

const TaskNode = ({ data }: TaskNodeProps) => {
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  const handleNodeClick = useCallback(() => {
    // Chỉ hiển thị modal nếu không phải node "end"
    if (data.type !== "end") {
      setShowConnectionModal(!showConnectionModal);
    }
  }, [showConnectionModal, data.type]);

  const handleConnectionSelect = useCallback(
    (targetId: string) => {
      // Không cho phép kết nối đến "start"
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
      <div className={getNodeStyle()} onClick={handleNodeClick}>
        <div className="font-bold text-gray-800">{data.name}</div>
        <div className="text-sm text-gray-600">
          <div>Thời gian: {data.duration} ngày</div>
          <div>ID: {data.id}</div>
        </div>
      </div>

      {showConnectionModal && (
        <div className="absolute left-full top-0 ml-2 bg-white text-black p-3 rounded shadow-lg border border-gray-200 z-10 w-48">
          <div className="font-bold mb-2 text-sm">Kết nối đến:</div>
          {data.allTasks
            .filter((task) => task.id !== data.id && task.type !== "start") // Loại bỏ chính nó và "start"
            .map((task) => (
              <div
                key={task.id}
                className="px-2 py-1 text-black hover:bg-blue-100 cursor-pointer rounded text-sm my-1"
                onClick={() => handleConnectionSelect(task.id)}
              >
                {task.name} (ID: {task.id})
              </div>
            ))}
        </div>
      )}

      {/* Handle dựa trên type */}
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