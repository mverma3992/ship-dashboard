import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { useShips } from '../../contexts/ShipContext';
import { useComponents } from '../../contexts/ComponentContext';
import { useJobs } from '../../contexts/JobContext';
import { useAuth } from '../../hooks/useAuth';
import ShipForm from './ShipForm';

const ShipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getShip, updateShip, deleteShip } = useShips();
  const { components, getComponentsByShip } = useComponents();
  const { jobs, getJobsByShip } = useJobs();
  const { hasRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState('info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const ship = getShip(id);
  const shipComponents = getComponentsByShip(id);
  const shipJobs = getJobsByShip(id);
  
  if (!ship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ship Not Found</h2>
        <Button onClick={() => navigate('/ships')}>Back to Ships</Button>
      </div>
    );
  }
  
  const handleEditSubmit = (updatedShip) => {
    updateShip(id, updatedShip);
    setIsEditModalOpen(false);
  };
  
  const handleDelete = () => {
    deleteShip(id);
    navigate('/ships');
  };
  
  const statusColors = {
    'Active': 'green',
    'Under Maintenance': 'yellow',
    'Out of Service': 'red'
  };
  
  const componentColumns = [
    { key: 'name', title: 'Component', width: '30%' },
    { key: 'serialNumber', title: 'Serial Number', width: '20%' },
    { key: 'installDate', title: 'Installation Date', width: '20%' },
    { key: 'lastMaintenanceDate', title: 'Last Maintenance', width: '20%' },
    { 
      key: 'actions', 
      title: 'Actions', 
      width: '10%',
      render: (_, component) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/components/${component.id}`)}
        >
          View
        </Button>
      ),
    },
  ];
  
  const jobColumns = [
    { key: 'type', title: 'Job Type', width: '25%' },
    { 
      key: 'priority', 
      title: 'Priority', 
      width: '15%',
      render: (value) => {
        const colors = {
          'Low': 'gray',
          'Medium': 'yellow',
          'High': 'red'
        };
        return <Badge color={colors[value] || 'gray'}>{value}</Badge>;
      }
    },
    { 
      key: 'status', 
      title: 'Status', 
      width: '15%',
      render: (value) => {
        const colors = {
          'Open': 'gray',
          'In Progress': 'yellow',
          'Completed': 'green'
        };
        return <Badge color={colors[value] || 'gray'}>{value}</Badge>;
      }
    },
    { key: 'scheduledDate', title: 'Scheduled Date', width: '20%' },
    { 
      key: 'actions', 
      title: 'Actions', 
      width: '10%',
      render: (_, job) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          View
        </Button>
      ),
    },
  ];
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{ship.name}</h2>
          <p className="text-sm text-gray-600">IMO: {ship.imo}</p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          {hasRole(['Admin', 'Inspector']) && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Ship
              </Button>
              {hasRole(['Admin']) && (
                <Button 
                  variant="danger" 
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              )}
            </>
          )}
          <Button onClick={() => navigate('/ships')}>
            Back to Ships
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ship Information
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'components'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Components
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'maintenance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Maintenance History
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'info' && (
        <Card>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">General Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Ship Name</span>
                    <span className="text-gray-900">{ship.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">IMO Number</span>
                    <span className="text-gray-900">{ship.imo}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Flag</span>
                    <span className="text-gray-900">{ship.flag}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Status</span>
                    <Badge color={statusColors[ship.status] || 'gray'}>
                      {ship.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Stats</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Total Components</span>
                    <span className="text-gray-900">{shipComponents.length}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Pending Jobs</span>
                    <span className="text-gray-900">
                      {shipJobs.filter(job => job.status !== 'Completed').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Completed Jobs</span>
                    <span className="text-gray-900">
                      {shipJobs.filter(job => job.status === 'Completed').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {activeTab === 'components' && (
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Components</h3>
            {hasRole(['Admin', 'Inspector']) && (
              <Button 
                size="sm" 
                onClick={() => navigate(`/components/new?shipId=${id}`)}
              >
                Add Component
              </Button>
            )}
          </div>
          
          <Table
            columns={componentColumns}
            data={shipComponents}
            emptyMessage="No components found for this ship"
            onRowClick={(component) => navigate(`/components/${component.id}`)}
          />
        </div>
      )}
      
      {activeTab === 'maintenance' && (
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Maintenance Jobs</h3>
            {hasRole(['Admin', 'Inspector']) && (
              <Button 
                size="sm" 
                onClick={() => navigate(`/jobs/new?shipId=${id}`)}
              >
                Create Job
              </Button>
            )}
          </div>
          
          <Table
            columns={jobColumns}
            data={shipJobs}
            emptyMessage="No maintenance jobs found for this ship"
            onRowClick={(job) => navigate(`/jobs/${job.id}`)}
          />
        </div>
      )}
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Ship"
      >
        <ShipForm
          ship={ship}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="p-6">
          <p className="mb-6">
            Are you sure you want to delete {ship.name}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShipDetail; 