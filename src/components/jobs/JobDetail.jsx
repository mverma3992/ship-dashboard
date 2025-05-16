import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../../contexts/JobContext';
import { useShips } from '../../contexts/ShipContext';
import { useComponents } from '../../contexts/ComponentContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../contexts/NotificationContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import JobForm from './JobForm';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJob, updateJob, deleteJob, completeJob } = useJobs();
  const { getShip } = useShips();
  const { getComponent } = useComponents();
  const { currentUser: user, getUserById } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  
  const job = getJob(id);
  
  if (!job) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Job Not Found</h2>
        <Button onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }
  
  const ship = getShip(job.shipId);
  const component = getComponent(job.componentId);
  const assignedEngineer = getUserById(job.assignedEngineerId);
  
  // Check if user has permission to edit/delete
  const canEdit = user && (user.role === 'Admin' || user.role === 'Inspector');
  const canDelete = user && user.role === 'Admin';
  
  // Check if user has permission to update status
  const canUpdateStatus = 
    user && (
      user.role === 'Admin' || 
      user.role === 'Inspector' || 
      (user.role === 'Engineer' && user.id === job.assignedEngineerId)
    );
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(id);
      navigate('/jobs');
    }
  };
  
  const handleStatusChange = (newStatus) => {
    if (newStatus === job.status) return;
    
    let updatedJob;
    if (newStatus === 'Completed') {
      updatedJob = completeJob(id);
      addNotification({
        type: 'Job Completed',
        message: `Job "${job.type}" for ${component?.name || 'Unknown Component'} has been completed.`
      });
    } else {
      updatedJob = updateJob(id, { status: newStatus, completedDate: null });
      addNotification({
        type: 'Job Updated',
        message: `Job "${job.type}" status has changed to ${newStatus}.`
      });
    }
  };
  
  if (isEditing) {
    return (
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Job</h2>
          <JobForm jobId={id} />
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
            <h2 className="text-xl font-semibold">Job Details</h2>
            <div className="flex space-x-2">
              {canEdit && (
                <Button onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium">{job.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  job.priority === 'High' ? 'bg-red-100 text-red-800' :
                  job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {job.priority}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  job.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                  job.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {job.status}
                </span>
              </p>
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
              <p className="text-sm text-gray-500">Component</p>
              <p className="font-medium">
                {component ? (
                  <a href={`/components/${component.id}`} className="text-blue-600 hover:underline">
                    {component.name} (SN: {component.serialNumber})
                  </a>
                ) : 'Unknown Component'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned Engineer</p>
              <p className="font-medium">
                {assignedEngineer ? assignedEngineer.email : 'Unknown Engineer'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Scheduled Date</p>
              <p className="font-medium">{job.scheduledDate}</p>
            </div>
            {job.completedDate && (
              <div>
                <p className="text-sm text-gray-500">Completed Date</p>
                <p className="font-medium">{job.completedDate}</p>
              </div>
            )}
          </div>
          
          {canUpdateStatus && job.status !== 'Completed' && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Update Status</h3>
              <div className="flex space-x-2">
                {job.status !== 'Open' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange('Open')}
                  >
                    Mark as Open
                  </Button>
                )}
                {job.status !== 'In Progress' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange('In Progress')}
                  >
                    Mark as In Progress
                  </Button>
                )}
                {job.status !== 'Completed' && (
                  <Button
                    onClick={() => handleStatusChange('Completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JobDetail; 