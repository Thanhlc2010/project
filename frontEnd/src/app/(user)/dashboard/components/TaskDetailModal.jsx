import React from "react";

const TaskDetailModal = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-6">
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-xl p-6 relative mt-10 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">{task.name}</h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Status:</strong> {task.status}</div>
          <div><strong>Subtasks:</strong> {task.subtasks || 0}</div>
          <div><strong>Priority:</strong> {task.priority || "Empty"}</div>
          <div><strong>Time Estimate:</strong> {task.timeEstimate || "Empty"}</div>
          <div><strong>Tags:</strong> {task.tags?.join(", ") || "Empty"}</div>
          <div><strong>Assignees:</strong> {task.assignees?.join(", ") || "Empty"}</div>
          <div><strong>Track Time:</strong> {task.trackTime || "Not Tracked"}</div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-1">Description</h3>
          <p className="text-gray-600">{task.description || "No description added."}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
