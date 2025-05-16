// Utility functions for localStorage operations

/**
 * Retrieve data from localStorage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Parsed data from localStorage or defaultValue
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Save data to localStorage
 * @param {string} key - The key to store under
 * @param {any} value - Value to store
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to localStorage:`, error);
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - The key to remove
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

/**
 * Check if a key exists in localStorage
 * @param {string} key - The key to check
 * @returns {boolean} - Whether the key exists
 */
export const hasStorageItem = (key) => {
  return localStorage.getItem(key) !== null;
}; 