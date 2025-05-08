// components/IconButton.jsx
import { useState, useEffect, useRef } from 'react';

export default function IconButton({ onSaveDescription, taskDescription }) {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(taskDescription);
  const popupRef = useRef(null);
  const iconRef = useRef(null);
  const timeoutRef = useRef(null);

  // Function to call when clicking outside
  const handleClickOutside = () => {
    if (isEditing) {
      // Close the popup when clicking outside while editing
      setShowPopup(false);
      setIsEditing(false);
      // Call empty function (placeholder for any additional logic)
      handleOutsideClick();
    }
  };
  
  // Empty function to call when clicking outside
  const handleOutsideClick = () => {
    // This function can be expanded later with additional logic if needed
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle clicks outside the popup
  useEffect(() => {
    function mouseDownListener(event) {
      // If popup is shown and click is outside of popup
      if (showPopup && popupRef.current && !popupRef.current.contains(event.target) && 
          !iconRef.current.contains(event.target)) {
        handleClickOutside();
      }
    }
    
    document.addEventListener('mousedown', mouseDownListener);
    return () => {
      document.removeEventListener('mousedown', mouseDownListener);
    };
  }, [showPopup, isEditing]);

  // Handle mouse interactions with the popup
  const handlePopupMouseDown = () => {
    // Set editing mode when user clicks inside the popup
    setIsEditing(true);
    // Clear any pending hide timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseEnter = () => {
    // Clear any pending hide timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTimeout(() => {
        setShowPopup(true);
      }, 300); // 300ms delay before showing
  };

  const handleMouseLeave = () => {
    // Only set timeout to hide when not editing
    if (!isEditing) {
      // Set a timeout to hide the popup, giving time for user to click inside
      timeoutRef.current = setTimeout(() => {
        setShowPopup(false);
      }, 300); // 300ms delay before hiding
    }
  };

  return (
    <div className="relative">
      <div
        ref={iconRef}
        className="flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup(!showPopup);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      
      {showPopup && (
        <div 
          ref={popupRef}
          className="absolute left-0 top-full mt-2 bg-white rounded shadow-lg border border-gray-200 z-[1000] w-80"
          style={{ 
            position: 'fixed', 
            transform: 'translateY(10px)',
            left: iconRef.current ? iconRef.current.getBoundingClientRect().left : 0,
            top: iconRef.current ? iconRef.current.getBoundingClientRect().bottom : 0 
          }}
          onMouseDown={handlePopupMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-4">
            <h3 className="text-gray-800 font-medium mb-2">Description</h3>
            <textarea
              className="w-full min-h-32 p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
              onClick={() => {
                onSaveDescription(description); 
                setShowPopup(false); 
                setIsEditing(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}