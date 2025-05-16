import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../contexts/JobContext';
import { useShips } from '../../contexts/ShipContext';
import { useComponents } from '../../contexts/ComponentContext';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { exportToCSV } from '../../utils/exportUtils';

const JobList = ({ shipId, componentId }) => {
  const navigate = useNavigate();
  const { jobs, deleteJob } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const { currentUser: user } = useAuth();
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    shipId: shipId || '',
    search: ''
  });
  
  // Apply filters to jobs
  let filteredJobs = jobs;
  
  // Filter by component if specified
  if (componentId) {
    filteredJobs = filteredJobs.filter(job => job.componentId === componentId);
  }
  
  // Filter by ship if specified in props or filters
  if (shipId || filters.shipId) {
    filteredJobs = filteredJobs.filter(job => job.shipId === (shipId || filters.shipId));
  }
  
  // Filter by status
  if (filters.status) {
    filteredJobs = filteredJobs.filter(job => job.status === filters.status);
  }
  
  // Filter by priority
  if (filters.priority) {
    filteredJobs = filteredJobs.filter(job => job.priority === filters.priority);
  }
  
  // Filter by search term (job type)
  if (filters.search) {
    filteredJobs = filteredJobs.filter(job => 
      job.type.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  
  // For engineers, only show jobs assigned to them
  if (user && user.role === 'Engineer') {
    filteredJobs = filteredJobs.filter(job => job.assignedEngineerId === user.id);
  }
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      shipId: shipId || '',
      search: ''
    });
  };
  
  // Get ship name by id
  const getShipName = (id) => {
    const ship = ships.find(ship => ship.id === id);
    return ship ? ship.name : 'Unknown';
  };
  
  // Get component name by id
  const getComponentName = (id) => {
    const component = components.find(component => component.id === id);
    return component ? component.name : 'Unknown';
  };
  
  // Handle job deletion (admin only)
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(id);
    }
  };
  
  // Handle export to CSV
  const handleExportCSV = () => {
    if (filteredJobs.length === 0) {
      alert('No jobs to export');
      return;
    }
    
    // Format the data for CSV export
    const jobsForExport = filteredJobs.map(job => ({
      Type: job.type,
      Ship: getShipName(job.shipId),
      Component: getComponentName(job.componentId),
      Priority: job.priority,
      Status: job.status,
      ScheduledDate: job.scheduledDate,
      Description: job.description || ''
    }));
    
    // Generate a suitable filename
    const today = new Date().toISOString().slice(0, 10);
    const filename = `maintenance_jobs_${today}.csv`;
    
    // Export to CSV
    exportToCSV(jobsForExport, filename);
  };
  
  return (
    <div>
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="mb-2 font-medium">Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {!shipId && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ship</label>
              <select
                name="shipId"
                value={filters.shipId}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Ships</option>
                {ships.map(ship => (
                  <option key={ship.id} value={ship.id}>{ship.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Search by Type</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search job types..."
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
        </h3>
        <div className="flex space-x-3">
          {filteredJobs.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export CSV
            </button>
          )}
          {user && (user.role === 'Admin' || user.role === 'Inspector') && (
            <Button to="/jobs/new">
              Create New Job
            </Button>
          )}
        </div>
      </div>
      
      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No jobs found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Type</th>
                {!shipId && <th className="py-3 px-4 text-left">Ship</th>}
                <th className="py-3 px-4 text-left">Component</th>
                <th className="py-3 px-4 text-left">Priority</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Scheduled Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{job.type}</td>
                  {!shipId && (
                    <td className="py-3 px-4">
                      <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate(`/ships/${job.shipId}`)}
                      >
                        {getShipName(job.shipId)}
                      </span>
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <span
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigate(`/components/${job.componentId}`)}
                    >
                      {getComponentName(job.componentId)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      job.priority === 'High' ? 'bg-red-100 text-red-800' :
                      job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      job.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{job.scheduledDate}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <button 
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View
                    </button>
                    {user && user.role === 'Admin' && (
                      <button 
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDelete(job.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobList; 