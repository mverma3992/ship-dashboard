import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useShips } from '../../contexts/ShipContext';
import { useAuth } from '../../hooks/useAuth';

const ShipList = () => {
  const navigate = useNavigate();
  const { ships, isLoading } = useShips();
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter and sort ships
  const filteredShips = useMemo(() => {
    let result = [...ships];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ship => 
        ship.name.toLowerCase().includes(term) || 
        ship.imo.toLowerCase().includes(term) ||
        ship.flag.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(ship => ship.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase() || '';
      const bValue = b[sortField]?.toLowerCase() || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    return result;
  }, [ships, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const statusColors = {
    'Active': 'green',
    'Under Maintenance': 'yellow',
    'Out of Service': 'red'
  };

  const columns = [
    {
      key: 'name',
      title: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('name')}
        >
          Ship Name
          {sortField === 'name' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      width: '30%',
    },
    {
      key: 'imo',
      title: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('imo')}
        >
          IMO Number
          {sortField === 'imo' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      width: '20%',
    },
    {
      key: 'flag',
      title: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('flag')}
        >
          Flag
          {sortField === 'flag' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      width: '20%',
    },
    {
      key: 'status',
      title: (
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => handleSort('status')}
        >
          Status
          {sortField === 'status' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ),
      width: '20%',
      render: (value) => (
        <Badge color={statusColors[value] || 'gray'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '10%',
      render: (_, ship) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/ships/${ship.id}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search ships..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <select
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
          
          {hasRole(['Admin', 'Inspector']) && (
            <Button onClick={() => navigate('/ships/new')}>
              Add Ship
            </Button>
          )}
        </div>
      </div>
      
      <Table
        columns={columns}
        data={filteredShips}
        loading={isLoading}
        onRowClick={(ship) => navigate(`/ships/${ship.id}`)}
        emptyMessage="No ships found"
      />
    </div>
  );
};

export default ShipList; 