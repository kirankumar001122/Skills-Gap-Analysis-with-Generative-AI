import { useEffect, useRef } from 'react';

/**
 * useClickOutside Hook
 * Detects clicks outside a referenced element
 * Useful for closing modals, dropdowns, etc.
 * 
 * @param {Function} handler - Callback function when click outside occurs
 * @returns {React.RefObject} - Ref to attach to the element
 */
export const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler]);

  return ref;
};

