import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComponents } from '../../contexts/ComponentContext';
import { useShips } from '../../contexts/ShipContext';
import Button from '../ui/Button';

const ComponentForm = ({ componentId }) => {
  const navigate = useNavigate();
  const { addComponent, updateComponent, getComponent } = useComponents();
  const { ships } = useShips();
  
  const [formData, setFormData] = useState({
    shipId: '',
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // If componentId is provided, load component data for editing
  useEffect(() => {
    if (componentId) {
      const component = getComponent(componentId);
      if (component) {
        setFormData({
          shipId: component.shipId,
          name: component.name,
          serialNumber: component.serialNumber,
          installDate: component.installDate,
          lastMaintenanceDate: component.lastMaintenanceDate
        });
      }
    }
  }, [componentId, getComponent]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.shipId) newErrors.shipId = 'Ship is required';
    if (!formData.name) newErrors.name = 'Component name is required';
    if (!formData.serialNumber) newErrors.serialNumber = 'Serial number is required';
    if (!formData.installDate) newErrors.installDate = 'Installation date is required';
    if (!formData.lastMaintenanceDate) newErrors.lastMaintenanceDate = 'Last maintenance date is required';
    
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
      if (componentId) {
        updateComponent(componentId, formData);
      } else {
        addComponent(formData);
      }
      navigate('/components');
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
          Component Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-danger-500 ring-danger-200' : ''}
        />
        {errors.name && <p className="mt-1 text-sm text-danger-600">{errors.name}</p>}
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Serial Number *
        </label>
        <input
          type="text"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          className={errors.serialNumber ? 'border-danger-500 ring-danger-200' : ''}
        />
        {errors.serialNumber && <p className="mt-1 text-sm text-danger-600">{errors.serialNumber}</p>}
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Installation Date *
        </label>
        <input
          type="date"
          name="installDate"
          value={formData.installDate}
          onChange={handleChange}
          className={errors.installDate ? 'border-danger-500 ring-danger-200' : ''}
        />
        {errors.installDate && <p className="mt-1 text-sm text-danger-600">{errors.installDate}</p>}
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Last Maintenance Date *
        </label>
        <input
          type="date"
          name="lastMaintenanceDate"
          value={formData.lastMaintenanceDate}
          onChange={handleChange}
          className={errors.lastMaintenanceDate ? 'border-danger-500 ring-danger-200' : ''}
        />
        {errors.lastMaintenanceDate && <p className="mt-1 text-sm text-danger-600">{errors.lastMaintenanceDate}</p>}
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button type="submit">
          {componentId ? 'Update Component' : 'Add Component'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/components')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ComponentForm; 