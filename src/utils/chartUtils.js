import { format, subDays, parseISO, isValid } from 'date-fns';

/**
 * Prepares data for the status pie chart
 * @param {Array} jobs - Array of job objects
 * @returns {Array} - Array of objects with name and value properties
 */
export const prepareJobStatusData = (jobs = []) => {
  if (!jobs || !jobs.length) return [];
  
  // Count jobs by status
  const statusCounts = jobs.reduce((acc, job) => {
    const status = job.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Convert to array of objects with name and value properties
  return Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * Prepares data for the ship status pie chart
 * @param {Array} ships - Array of ship objects
 * @returns {Array} - Array of objects with name and value properties
 */
export const prepareShipStatusData = (ships = []) => {
  if (!ships || !ships.length) return [];
  
  // Count ships by status
  const statusCounts = ships.reduce((acc, ship) => {
    const status = ship.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Convert to array of objects with name and value properties
  return Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * Prepares data for the jobs trend chart
 * @param {Array} jobs - Array of job objects
 * @param {number} days - Number of days to include
 * @returns {Array} - Array of objects with date, created, completed and overdue properties
 */
export const prepareJobsTrendData = (jobs = [], days = 30) => {
  if (!jobs || !jobs.length) return [];
  
  const result = [];
  const today = new Date();
  
  // Create an array of dates for the last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'MMM dd');
    
    result.push({
      date: dateStr,
      created: 0,
      completed: 0,
      overdue: 0
    });
  }

  // Count jobs for each date
  jobs.forEach(job => {
    // Skip jobs without valid dates
    if (!job.createdAt || !isValid(parseISO(job.createdAt))) return;
    
    const createdDate = parseISO(job.createdAt);
    const createdIndex = days - 1 - Math.min(days - 1, Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)));
    
    if (createdIndex >= 0 && createdIndex < days) {
      result[createdIndex].created++;
    }
    
    // Count completed jobs
    if (job.status === 'Completed' && job.completedAt && isValid(parseISO(job.completedAt))) {
      const completedDate = parseISO(job.completedAt);
      const completedIndex = days - 1 - Math.min(days - 1, Math.floor((today - completedDate) / (1000 * 60 * 60 * 24)));
      
      if (completedIndex >= 0 && completedIndex < days) {
        result[completedIndex].completed++;
      }
    }
    
    // Count overdue jobs based on scheduled date being in the past
    if (job.status !== 'Completed' && job.scheduledDate && isValid(parseISO(job.scheduledDate))) {
      const scheduledDate = parseISO(job.scheduledDate);
      
      if (scheduledDate < today) {
        const overdueIndex = days - 1 - Math.min(days - 1, Math.floor((today - scheduledDate) / (1000 * 60 * 60 * 24)));
        
        if (overdueIndex >= 0 && overdueIndex < days) {
          result[overdueIndex].overdue++;
        }
      }
    }
  });
  
  return result;
}; 