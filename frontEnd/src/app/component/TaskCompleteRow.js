import React from 'react';
import IconButton from "../component/descriptionButton";

const TaskCompleteRow = ({ task }) => {
  return (
    <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className={`flex items-center justify-center w-5 h-5 rounded bg-green-500`}>
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center">
          <div className="font-medium">{task.name}</div>
          <div className='pl-2'><IconButton /></div>
          {task.subtasks > 0 && (
            <div className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">
              {task.subtasks}
            </div>
          )}
        </div>
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
    </tr>
  );
};

export default TaskCompleteRow;
