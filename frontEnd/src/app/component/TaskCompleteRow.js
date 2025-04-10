import React, { useState, useEffect, useRef } from 'react';

const TaskCompleteRow = ({ task, setTasks }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  // const statuses = ['TO DO', 'IN PROGRESS', 'COMPLETE'];

  const updateStatus = (newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t)
    );
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <tr
      key={task.id}
      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer relative"
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <td className="px-4 py-3">
        <div className="flex items-center justify-center w-5 h-5 rounded bg-green-500">
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </td>
      <td className="px-4 py-3 flex items-center">
        <div className="font-medium">{task.name}</div>
        {task.subtasks > 0 && (
          <div className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">
            {task.subtasks}
          </div>
        )}
      </td>
      <td className="px-4 py-3"></td>
      <td className="px-4 py-3"></td>
      <td className="px-4 py-3"></td>
      <td className="px-4 py-3">
        <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
          {task.status}
        </div>
      </td>
      <td className="px-4 py-3"></td>
      <td className="px-4 py-3">
        <div className="invisible group-hover:visible">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="1" fill="currentColor"/>
            <circle cx="12" cy="8" r="1" fill="currentColor"/>
            <circle cx="4" cy="8" r="1" fill="currentColor"/>
          </svg>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="invisible group-hover:visible">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="1" fill="currentColor"/>
            <circle cx="12" cy="8" r="1" fill="currentColor"/>
            <circle cx="4" cy="8" r="1" fill="currentColor"/>
          </svg>
        </div>
      </td>
      {showDropdown && (
        <td ref={dropdownRef} className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded shadow-md z-10">
          {/* {statuses.map(status => (
            <div
              key={status}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => updateStatus(status)}
            >
              {status}
            </div>
          ))} */}
          
          <div className="w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-2 text-sm">
            {/* Tabs */}
            <div className="flex border-b mb-2">
              <button className="flex-1 px-2 py-1 font-medium border-b-2 border-gray-300">Status</button>
              <button className="flex-1 px-2 py-1 text-gray-500">Task Type</button>
            </div>

            {/* Search Input */}
            <div className="px-2 mb-2">
              <input
                type="text"
                placeholder="🔍 Search..."
                className="w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            {/* Section: Not Started */}
            <div className="px-2 text-xs text-gray-500 mb-1 flex items-center justify-between">
              <span>Not started</span>
              <span>⚙️</span>
            </div>
            <div 
              key="To DO"
              className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => updateStatus('TO DO')}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border border-gray-400 rounded-full"></span>
                <span className="font-medium">TO DO</span>
              </div>
              <span>✔️</span>
            </div>

            {/* Section: Active */}
            <div className="px-2 text-xs text-gray-500 mt-3 mb-1">Active</div>

            <div
              key="In Progress"
              onClick={() => updateStatus('IN PROGRESS')} 
              className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-purple-600 text-lg">⏳</span>
                <span>IN PROGRESS</span>
              </div>
            </div>

            <div 
              key="Complete"
              onClick={() => updateStatus('COMPLETE')}
              className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-lg">✅</span>
                <span>COMPLETE</span>
              </div>
            </div>
          </div>


        </td>
      )}
    </tr>
  );
};

export default TaskCompleteRow;