import React, { useState } from 'react';

const AddTaskButton = ({ setTasks, tasks }) => {
  const [taskName, setTaskName] = useState('');
  // const [subtasks, setSubtasks] = useState(0);
  const [status, setStatus] = useState('TO DO');
  const [completed, setCompleted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTask = () => {
    if (!taskName.trim()) return;
    
    const newTask = {
      id: tasks.length + 1,
      name: taskName,
      subtasks: 0,
      status,
      completed,
    };

    setTasks([...tasks, newTask]);
    setTaskName('');
    setSubtasks(0);
    setStatus('TO DO');
    setCompleted(false);
    setIsOpen(false);
  };

  return (
    <div className="pl-10">
      <div 
        className="flex items-center cursor-pointer text-blue-500" 
        onClick={() => setIsOpen(true)}
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Add Task
      </div>

      {/* Popup (modal) */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-3">New Task</h2>
            <input 
              type="text" 
              placeholder="Task Name" 
              value={taskName} 
              onChange={(e) => setTaskName(e.target.value)} 
              className="w-full p-2 border rounded mb-3"
            />
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full p-2 border rounded mb-3"
            >
              <option value="TO DO">TO DO</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="COMPLETE">COMPLETE</option>
            </select>
            <label className="flex items-center mb-3">
              <input 
                type="checkbox" 
                checked={completed} 
                onChange={(e) => setCompleted(e.target.checked)}
              />
              <span className="ml-2">Completed</span>
            </label>
            <div className="flex justify-end space-x-2">
              <button 
                className="px-3 py-1 text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskButton;
