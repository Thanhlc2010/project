import React, { useState } from 'react';
import TaskCompleteRow from '../component/TaskCompleteRow';  // Import the TaskRow component
import TaskProcessRow from '../component/TaskProcessRow';  // Import the TaskRow component
import TaskToDoRow from '../component/TaskToDoRow';  // Import the TaskRow component
import AddTaskButton from '../component/AddTaskButton';  // Import the AddTaskButton component

const TaskManagementUI = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', subtasks: 1, status: 'TO DO', completed: true },
    { id: 2, name: 'Task 2', subtasks: 3, status: 'COMPLETE', completed: true },
    { id: 3, name: 'Task 3', subtasks: 4, status: 'IN PROGRESS', completed: true },
    { id: 4, name: 'Task 4', subtasks: 2, status: 'COMPLETE', completed: true }
  ]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-gray-800">
      {/* ... Toolbar ... */}
      <div className="flex items-center p-3 border-b border-gray-200 gap-3">
        <div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Group: Status
        </div>

        <div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Subtasks
        </div>

        <div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 3H14M2 8H14M2 13H14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Columns
        </div>

        <div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4H14M6 8H14M10 12H14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Filter
        </div>

        <div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
          Me mode
        </div>

        <div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 14C13 11.2386 10.7614 9 8 9C5.23858 9 3 11.2386 3 14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Assignee
        </div>

        <div className="flex items-center gap-2 text-gray-500 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Closed
        </div>

        {/* Search */}
        <div className="flex items-center ml-auto border border-gray-200 rounded px-3 py-1.5">
          <svg className="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="border-none outline-none text-sm w-48"
          />
        </div>

        <div className="flex items-center justify-center p-1.5 rounded hover:bg-gray-100 cursor-pointer">
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
            <circle cx="4" cy="8" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>


      {/* Status Group - Complete*/}
      <div className="mt-2">
        <div className="flex items-center px-4 py-2 border-b border-gray-200">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 mr-2">
            <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-xs font-bold uppercase">Complete</div>
          <div className="ml-2 text-xs text-gray-500">1</div>
          <div className="ml-4 text-sm text-gray-500 cursor-pointer">
            <AddTaskButton 
              setTasks={setTasks}
              tasks={tasks}
            />
          </div>
          <div className="ml-auto cursor-pointer">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Due date</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Comments</th>
              <th className="w-10 px-4 py-3"></th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.filter(task => task.status === 'COMPLETE').map(task => (
              <TaskCompleteRow key={task.id} task={task} />
            ))}
            <tr className="border-b border-gray-200 hover:bg-gray-50 text-gray-500 cursor-pointer">
              <td colSpan={9} className="px-4 py-3">
                <div className="flex items-center pl-10">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <AddTaskButton 
                    setTasks={setTasks}
                    tasks={tasks}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status Group - IN PROGRESS */}
      <div className="mt-6">
        <div className="flex items-center px-4 py-2 border-b border-gray-200">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 mr-2">
            <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="5" fill="none" stroke="white" strokeWidth="2" />
              <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-xs font-bold uppercase">In Progress</div>
          <div className="ml-2 text-xs text-gray-500">1</div>
          <div className="ml-4 text-sm text-gray-500 cursor-pointer">+ Add Task</div>
          <div className="ml-auto cursor-pointer">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* IN PROGRESS Tasks Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Due date</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Comments</th>
              <th className="w-10 px-4 py-3"></th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.filter(task => task.status === 'IN PROGRESS').map(task => (
              <TaskProcessRow key={task.id} task={task} />
            ))}
            <tr className="border-b border-gray-200 hover:bg-gray-50 text-gray-500 cursor-pointer">
              <td colSpan={9} className="px-4 py-3">
                <div className="flex items-center pl-10">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Add Task
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status Group - TO DO */}
      <div className="mt-6">
        <div className="flex items-center px-4 py-2 border-b border-gray-200">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 mr-2">
            <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div className="text-xs font-bold uppercase">To Do</div>
          <div className="ml-2 text-xs text-gray-500">0</div>
          <div className="ml-4 text-sm text-gray-500 cursor-pointer">+ Add Task</div>
          <div className="ml-auto cursor-pointer">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* TO DO Tasks Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Due date</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Comments</th>
              <th className="w-10 px-4 py-3"></th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.filter(task => task.status === 'TO DO').map(task => (
              <TaskToDoRow key={task.id} task={task} />
            ))}
            <tr className="border-b border-gray-200 hover:bg-gray-50 text-gray-500 cursor-pointer">
              <td colSpan={9} className="px-4 py-3">
                <div className="flex items-center pl-10">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Add Task
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default TaskManagementUI;
