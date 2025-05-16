import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJobs } from '../../contexts/JobContext';
import { useShips } from '../../contexts/ShipContext';
import { useComponents } from '../../contexts/ComponentContext';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const JobForm = ({ jobId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialComponentId = searchParams.get('componentId');
  const initialShipId = searchParams.get('shipId');
  
  const { addJob, updateJob, getJob } = useJobs();
  const { ships } = useShips();
  const { components, getComponentsByShip } = useComponents();
  const { currentUser, users } = useAuth();
  
  // Get engineers only
  const engineers = users ? users.filter(user => user.role === 'Engineer') : [];
  
  const [formData, setFormData] = useState({
    shipId: initialShipId || '',
    componentId: initialComponentId || '',
    type: '',
    priority: 'Medium',
    status: 'Open',
    assignedEngineerId: '',
    scheduledDate: '',
    completedDate: null
  });
  
  const [availableComponents, setAvailableComponents] = useState([]);
  const [errors, setErrors] = useState({});
  
  // If jobId is provided, load job data for editing
  useEffect(() => {
    if (jobId) {
      const job = getJob(jobId);
      if (job) {
        setFormData({
          shipId: job.shipId,
          componentId: job.componentId,
          type: job.type,
          priority: job.priority,
          status: job.status,
          assignedEngineerId: job.assignedEngineerId,
          scheduledDate: job.scheduledDate,
          completedDate: job.completedDate
        });
      }
    }
  }, [jobId, getJob]);
  
  // Update available components when ship changes
  useEffect(() => {
    if (formData.shipId) {
      setAvailableComponents(getComponentsByShip(formData.shipId));
      // If the current componentId is not in the new ship, clear it
      if (formData.componentId && !getComponentsByShip(formData.shipId).some(comp => comp.id === formData.componentId)) {
        setFormData(prev => ({ ...prev, componentId: '' }));
      }
    } else {
      setAvailableComponents([]);
    }
  }, [formData.shipId, getComponentsByShip]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.shipId) newErrors.shipId = 'Ship is required';
    if (!formData.componentId) newErrors.componentId = 'Component is required';
    if (!formData.type) newErrors.type = 'Job type is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.assignedEngineerId) newErrors.assignedEngineerId = 'Assigned engineer is required';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (jobId) {
        updateJob(jobId, formData);
      } else {
        addJob(formData);
      }
      navigate('/jobs');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="input-group">
        <label className="input-label">
          Ship *
        </label>
        <select
          name="shipId"
          value={formData.shipId}
          onChange={handleChange}
          className={errors.shipId ? 'border-danger-500 ring-danger-200' : ''}
          disabled={jobId}
        >
          <option value="">Select a ship</option>
          {ships.map(ship => (
            <option key={ship.id} value={ship.id}>{ship.name}</option>
          ))}
        </select>
        {errors.shipId && <p className="mt-1 text-sm text-danger-600">{errors.shipId}</p>}
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Component *
        </label>
        <select
          name="componentId"
          value={formData.componentId}
          onChange={handleChange}
          className={errors.componentId ? 'border-danger-500 ring-danger-200' : ''}
          disabled={!formData.shipId || jobId}
        >
          <option value="">Select a component</option>
          {availableComponents.map(component => (
            <option key={component.id} value={component.id}>
              {component.name} (SN: {component.serialNumber})
            </option>
          ))}
        </select>
        {errors.componentId && <p className="mt-1 text-sm text-danger-600">{errors.componentId}</p>}
        {formData.shipId && availableComponents.length === 0 && (
          <p className="mt-1 text-sm text-warning-600">No components available for this ship.</p>
        )}
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Job Type *
        </label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g., Inspection, Repair, Maintenance"
          className={errors.type ? 'border-danger-500 ring-danger-200' : ''}
        />
        {errors.type && <p className="mt-1 text-sm text-danger-600">{errors.type}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label className="input-label">
            Priority *
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={errors.priority ? 'border-danger-500 ring-danger-200' : ''}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && <p className="mt-1 text-sm text-danger-600">{errors.priority}</p>}
        </div>
        
        <div className="input-group">
          <label className="input-label">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? 'border-danger-500 ring-danger-200' : ''}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-danger-600">{errors.status}</p>}
        </div>
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Assigned Engineer *
        </label>
        <select
          name="assignedEngineerId"
          value={formData.assignedEngineerId}
          onChange={handleChange}
          className={errors.assignedEngineerId ? 'border-danger-500 ring-danger-200' : ''}
        >
          <option value="">Select an engineer</option>
          {engineers.map(engineer => (
            <option key={engineer.id} value={engineer.id}>{engineer.email}</option>
          ))}
        </select>
        {errors.assignedEngineerId && <p className="mt-1 text-sm text-danger-600">{errors.assignedEngineerId}</p>}
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Scheduled Date *
        </label>
        <input
          type="date"
          name="scheduledDate"
          value={formData.scheduledDate}
          onChange={handleChange}
          className={errors.scheduledDate ? 'border-danger-500 ring-danger-200' : ''}
        />
        {errors.scheduledDate && <p className="mt-1 text-sm text-danger-600">{errors.scheduledDate}</p>}
      </div>
      
      {formData.status === 'Completed' && (
        <div className="input-group">
          <label className="input-label">
            Completed Date
          </label>
          <input
            type="date"
            name="completedDate"
            value={formData.completedDate || ''}
            onChange={handleChange}
          />
        </div>
      )}
      
      <div className="flex space-x-4 pt-4">
        <Button type="submit">
          {jobId ? 'Update Job' : 'Create Job'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/jobs')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JobForm; 