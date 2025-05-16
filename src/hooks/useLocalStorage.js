import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';

/**
 * Custom hook for using localStorage with React state
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if key doesn't exist
 * @returns {[any, function]} - State value and setter function
 */
const useLocalStorage = (key, initialValue) => {
  // Get stored value or use initialValue if key doesn't exist
  const [storedValue, setStoredValue] = useState(() => {
    return getFromStorage(key, initialValue);
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    // Allow value to be a function 
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    
    // Save state
    setStoredValue(valueToStore);
    
    // Save to localStorage
    saveToStorage(key, valueToStore);
  };

  // Update the state if localStorage is changed in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(JSON.parse(e.newValue) || initialValue);
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
};

export default useLocalStorage; 