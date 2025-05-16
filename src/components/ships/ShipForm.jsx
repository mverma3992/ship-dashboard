import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useShips } from '../../contexts/ShipContext';

const ShipForm = ({ ship, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with ship data if editing
  useEffect(() => {
    if (ship) {
      setFormState({
        name: ship.name || '',
        imo: ship.imo || '',
        flag: ship.flag || '',
        status: ship.status || 'Active'
      });
    }
  }, [ship]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Ship name is required';
    }
    
    if (!formState.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^IMO\d{7}$/.test(formState.imo)) {
      newErrors.imo = 'IMO must be in format IMO followed by 7 digits';
    }
    
    if (!formState.flag.trim()) {
      newErrors.flag = 'Flag is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formState);
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ship Name *
        </label>
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          IMO Number *
        </label>
        <input
          type="text"
          name="imo"
          value={formState.imo}
          onChange={handleChange}
          placeholder="IMO1234567"
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.imo ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.imo && (
          <p className="mt-1 text-sm text-red-600">{errors.imo}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Flag *
        </label>
        <input
          type="text"
          name="flag"
          value={formState.flag}
          onChange={handleChange}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.flag ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.flag && (
          <p className="mt-1 text-sm text-red-600">{errors.flag}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formState.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Out of Service">Out of Service</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (ship ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

export default ShipForm; 