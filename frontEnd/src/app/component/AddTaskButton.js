"use client";

import React, { useState, useEffect, useRef } from 'react';

const AddTaskButton = ({ setTasks, tasks }) => {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState('TO DO');
  const [completed, setCompleted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Handle ESC key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Focus the input when modal opens
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    setStatus('TO DO');
    setCompleted(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Button trigger */}
      <div 
        className="flex items-center cursor-pointer text-blue-500 hover:text-blue-700" 
        onClick={() => setIsOpen(true)}
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Add Task
      </div>
      
      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"></div>
          
          {/* Modal container - centered vertically and horizontally */}
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            {/* Modal panel */}
            <div 
              ref={modalRef}
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              {/* Modal content */}
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 
                  className="text-lg font-semibold leading-6 text-gray-900 mb-4" 
                  id="modal-title"
                >
                  New Task
                </h3>
                <div className="mt-2">
                  <input 
                    type="text" 
                    ref={inputRef}
                    placeholder="Task Name" 
                    value={taskName} 
                    onChange={(e) => setTaskName(e.target.value)} 
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TO DO">TO DO</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETE">COMPLETE</option>
                  </select>
                  <label className="flex items-center mb-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={completed} 
                      onChange={(e) => setCompleted(e.target.checked)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">Completed</span>
                  </label>
                </div>
              </div>
              
              {/* Modal footer */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button 
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                  onClick={handleAddTask}
                >
                  Add Task
                </button>
                <button 
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskButton;