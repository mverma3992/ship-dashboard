import React, { useState } from 'react';
import { useComponents } from '../../contexts/ComponentContext';
import { useShips } from '../../contexts/ShipContext';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { exportToCSV } from '../../utils/exportUtils';

const ComponentList = ({ shipId }) => {
  const { components, deleteComponent } = useComponents();
  const { ships } = useShips();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter components by shipId if provided, otherwise show all
  let filteredComponents = shipId 
    ? components.filter(component => component.shipId === shipId)
    : components;
    
  // Further filter by search term
  if (searchTerm) {
    filteredComponents = filteredComponents.filter(component => 
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Get ship name by id
  const getShipName = (id) => {
    const ship = ships.find(ship => ship.id === id);
    return ship ? ship.name : 'Unknown Ship';
  };
  
  // Confirm deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteComponent(id);
    }
  };
  
  // Handle export to CSV
  const handleExportCSV = () => {
    if (filteredComponents.length === 0) {
      alert('No components to export');
      return;
    }
    
    // Format the data for CSV export
    const componentsForExport = filteredComponents.map(component => ({
      Name: component.name,
      Ship: getShipName(component.shipId),
      SerialNumber: component.serialNumber,
      InstallDate: component.installDate,
      LastMaintenance: component.lastMaintenanceDate,
      Status: component.status || 'Active',
      Description: component.description || ''
    }));
    
    // Generate a suitable filename
    const today = new Date().toISOString().slice(0, 10);
    const filename = `ship_components_${today}.csv`;
    
    // Export to CSV
    exportToCSV(componentsForExport, filename);
  };
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Search components..."
            className="px-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-3">
          {filteredComponents.length > 0 && (
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
          <Button to="/components/new">
            Add New Component
          </Button>
        </div>
      </div>
      
      {filteredComponents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No components found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                {!shipId && <th className="py-3 px-4 text-left">Ship</th>}
                <th className="py-3 px-4 text-left">Serial Number</th>
                <th className="py-3 px-4 text-left">Install Date</th>
                <th className="py-3 px-4 text-left">Last Maintenance</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComponents.map((component) => (
                <tr key={component.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{component.name}</td>
                  {!shipId && (
                    <td className="py-3 px-4">
                      <Link to={`/ships/${component.shipId}`} className="text-blue-600 hover:underline">
                        {getShipName(component.shipId)}
                      </Link>
                    </td>
                  )}
                  <td className="py-3 px-4">{component.serialNumber}</td>
                  <td className="py-3 px-4">{component.installDate}</td>
                  <td className="py-3 px-4">{component.lastMaintenanceDate}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <button 
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => window.location.href = `/components/${component.id}`}
                    >
                      View
                    </button>
                    <button 
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(component.id)}
                    >
                      Delete
                    </button>
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

export default ComponentList; 