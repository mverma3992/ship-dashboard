/**
 * Format a date string as YYYY-MM-DD
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format a date with a more readable format (e.g., Jan 15, 2023)
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatReadableDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate days between two dates
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} - Number of days between dates
 */
export const daysBetween = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export const isDatePast = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d < new Date();
};

/**
 * Add days to a date
 * @param {string|Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} - Resulting date
 */
export const addDays = (date, days) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}; 