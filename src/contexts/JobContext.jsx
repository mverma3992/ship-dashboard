import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import { formatDate, addDays } from '../utils/dateUtils';

// Initial job data
export const initialJobs = [
  {
    id: '1',
    componentId: '1',
    shipId: '1',
    type: 'Inspection',
    priority: 'High',
    status: 'Completed',
    assignedEngineerId: '3',
    scheduledDate: '2023-11-15',
    completedDate: '2023-11-15'
  },
  {
    id: '2',
    componentId: '2',
    shipId: '1',
    type: 'Maintenance',
    priority: 'High',
    status: 'Open',
    assignedEngineerId: '3',
    scheduledDate: '2024-05-20',
    completedDate: null
  },
  {
    id: '3',
    componentId: '3',
    shipId: '1',
    type: 'Calibration',
    priority: 'Medium',
    status: 'In Progress',
    assignedEngineerId: '3',
    scheduledDate: '2024-05-05',
    completedDate: null
  },
  {
    id: '4',
    componentId: '4',
    shipId: '2',
    type: 'Repair',
    priority: 'High',
    status: 'In Progress',
    assignedEngineerId: '3',
    scheduledDate: '2024-04-25',
    completedDate: null
  },
  {
    id: '5',
    componentId: '5',
    shipId: '2',
    type: 'Inspection',
    priority: 'Medium',
    status: 'Completed',
    assignedEngineerId: '3',
    scheduledDate: '2024-03-10',
    completedDate: '2024-03-15'
  },
  {
    id: '6',
    componentId: '6',
    shipId: '2',
    type: 'Overhaul',
    priority: 'High',
    status: 'Open',
    assignedEngineerId: '3',
    scheduledDate: '2024-06-15',
    completedDate: null
  },
  {
    id: '7',
    componentId: '7',
    shipId: '3',
    type: 'Upgrade',
    priority: 'High',
    status: 'In Progress',
    assignedEngineerId: '3',
    scheduledDate: '2024-04-20',
    completedDate: null
  },
  {
    id: '8',
    componentId: '8',
    shipId: '3',
    type: 'Repair',
    priority: 'High',
    status: 'Open',
    assignedEngineerId: '3',
    scheduledDate: '2024-05-25',
    completedDate: null
  },
  {
    id: '9',
    componentId: '9',
    shipId: '4',
    type: 'Inspection',
    priority: 'Medium',
    status: 'Completed',
    assignedEngineerId: '3',
    scheduledDate: '2024-01-15',
    completedDate: '2024-01-18'
  },
  {
    id: '10',
    componentId: '10',
    shipId: '4',
    type: 'Maintenance',
    priority: 'Low',
    status: 'Completed',
    assignedEngineerId: '3',
    scheduledDate: '2024-02-10',
    completedDate: '2024-02-12'
  },
  {
    id: '11',
    componentId: '11',
    shipId: '5',
    type: 'Repair',
    priority: 'High',
    status: 'In Progress',
    assignedEngineerId: '3',
    scheduledDate: '2024-04-15',
    completedDate: null
  },
  {
    id: '12',
    componentId: '12',
    shipId: '5',
    type: 'Upgrade',
    priority: 'Medium',
    status: 'Open',
    assignedEngineerId: '3',
    scheduledDate: '2024-06-01',
    completedDate: null
  },
  {
    id: '13',
    componentId: '13',
    shipId: '6',
    type: 'Overhaul',
    priority: 'High',
    status: 'Open',
    assignedEngineerId: '3',
    scheduledDate: '2024-07-10',
    completedDate: null
  },
  {
    id: '14',
    componentId: '14',
    shipId: '6',
    type: 'Maintenance',
    priority: 'Medium',
    status: 'Open',
    assignedEngineerId: '3',
    scheduledDate: '2024-06-25',
    completedDate: null
  }
];

// Create context
const JobContext = createContext();

export const JobProvider = ({ children }) => {
  // Get jobs from localStorage or use initial data
  const [jobs, setJobs] = useState(() => {
    return getFromStorage('jobs', initialJobs);
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize jobs in localStorage if they don't exist
  useEffect(() => {
    if (!getFromStorage('jobs')) {
      saveToStorage('jobs', initialJobs);
    }
    setIsLoading(false);
  }, []);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    saveToStorage('jobs', jobs);
  }, [jobs]);

  // Add a new job
  const addJob = (jobData) => {
    const newJob = {
      id: uuidv4(),
      ...jobData,
      status: jobData.status || 'Open',
      scheduledDate: formatDate(jobData.scheduledDate || new Date()),
      completedDate: jobData.completedDate ? formatDate(jobData.completedDate) : null
    };
    setJobs([...jobs, newJob]);
    return newJob;
  };

  // Update a job
  const updateJob = (id, jobData) => {
    // Ensure dates are properly formatted
    const formattedData = { ...jobData };
    if (formattedData.scheduledDate) {
      formattedData.scheduledDate = formatDate(formattedData.scheduledDate);
    }
    if (formattedData.completedDate) {
      formattedData.completedDate = formatDate(formattedData.completedDate);
    }

    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, ...formattedData } : job
    );
    setJobs(updatedJobs);
    return updatedJobs.find(job => job.id === id);
  };

  // Delete a job
  const deleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  // Get a job by ID
  const getJob = (id) => {
    return jobs.find(job => job.id === id);
  };

  // Get jobs by component ID
  const getJobsByComponent = (componentId) => {
    return jobs.filter(job => job.componentId === componentId);
  };

  // Get jobs by ship ID
  const getJobsByShip = (shipId) => {
    return jobs.filter(job => job.shipId === shipId);
  };

  // Get jobs by assigned engineer ID
  const getJobsByEngineer = (engineerId) => {
    return jobs.filter(job => job.assignedEngineerId === engineerId);
  };

  // Get jobs by date range
  const getJobsByDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return jobs.filter(job => {
      const scheduledDate = new Date(job.scheduledDate);
      return scheduledDate >= start && scheduledDate <= end;
    });
  };

  // Complete a job
  const completeJob = (id) => {
    const completedDate = formatDate(new Date());
    return updateJob(id, { 
      status: 'Completed', 
      completedDate 
    });
  };

  const value = {
    jobs,
    isLoading,
    addJob,
    updateJob,
    deleteJob,
    getJob,
    getJobsByComponent,
    getJobsByShip,
    getJobsByEngineer,
    getJobsByDateRange,
    completeJob
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

// Custom hook to use job context
export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}; 
 