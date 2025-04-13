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
    setShowConnectionModal(!showConnectionModal);
  }, [showConnectionModal]);

  const handleConnectionSelect = useCallback(
    (targetId: string) => {
      data.onCreateConnection(data.id, targetId);
      setShowConnectionModal(false);
    },
    [data]
  );

  return (
    <div className="relative">
      <div 
        className="bg-white p-4 rounded shadow-lg border-2 border-blue-500 w-48 cursor-pointer"
        onClick={handleNodeClick}
      >
        <div className="font-bold">{data.name}</div>
        <div className="text-sm text-gray-600">
          <div>Thời gian: {data.duration} ngày</div>
          <div>ID: {data.id}</div>
        </div>
      </div>
      
      {showConnectionModal && (
        <div className="absolute left-full top-0 ml-2 bg-white p-3 rounded shadow-lg border border-gray-200 z-10 w-48">
          <div className="font-bold mb-2 text-sm">Kết nối đến:</div>
          {data.allTasks
            .filter(task => task.id !== data.id)
            .map(task => (
              <div 
                key={task.id}
                className="px-2 py-1 hover:bg-blue-100 cursor-pointer rounded text-sm my-1"
                onClick={() => handleConnectionSelect(task.id)}
              >
                {task.name} (ID: {task.id})
              </div>
            ))}
        </div>
      )}
      
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default TaskNode;