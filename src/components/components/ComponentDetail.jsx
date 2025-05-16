import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useComponents } from '../../contexts/ComponentContext';
import { useShips } from '../../contexts/ShipContext';
import { useJobs } from '../../contexts/JobContext';
import Button from '../ui/Button';
import ComponentForm from './ComponentForm';
import Card from '../ui/Card';

const ComponentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComponent, deleteComponent } = useComponents();
  const { getShip } = useShips();
  const { getJobsByComponent } = useJobs();
  const [isEditing, setIsEditing] = useState(false);
  
  const component = getComponent(id);
  
  if (!component) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Component Not Found</h2>
        <Button onClick={() => navigate('/components')}>
          Back to Components
        </Button>
      </div>
    );
  }
  
  const ship = getShip(component.shipId);
  const jobs = getJobsByComponent(id);
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteComponent(id);
      navigate('/components');
    }
  };
  
  if (isEditing) {
    return (
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Component</h2>
          <ComponentForm componentId={id} />
          <div className="mt-4">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Component Details</h2>
            <div className="flex space-x-2">
              <Button onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Component Name</p>
              <p className="font-medium">{component.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Serial Number</p>
              <p className="font-medium">{component.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ship</p>
              <p className="font-medium">
                {ship ? (
                  <a href={`/ships/${ship.id}`} className="text-blue-600 hover:underline">
                    {ship.name}
                  </a>
                ) : 'Unknown Ship'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Installation Date</p>
              <p className="font-medium">{component.installDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Maintenance Date</p>
              <p className="font-medium">{component.lastMaintenanceDate}</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Maintenance History</h3>
            <Button to={`/jobs/new?componentId=${id}`}>
              Create Job
            </Button>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No maintenance jobs found for this component.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Priority</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Scheduled Date</th>
                    <th className="py-2 px-4 text-left">Completed Date</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{job.type}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          job.priority === 'High' ? 'bg-red-100 text-red-800' :
                          job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {job.priority}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          job.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">{job.scheduledDate}</td>
                      <td className="py-2 px-4">{job.completedDate || '-'}</td>
                      <td className="py-2 px-4 text-center">
                        <button 
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ComponentDetail; 