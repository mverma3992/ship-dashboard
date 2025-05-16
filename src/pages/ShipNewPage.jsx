import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ShipForm from '../components/ships/ShipForm';
import Card from '../components/ui/Card';
import { useShips } from '../contexts/ShipContext';

const ShipNewPage = () => {
  const navigate = useNavigate();
  const { addShip } = useShips();
  
  const handleSubmit = async (shipData) => {
    const newShip = addShip(shipData);
    navigate(`/ships/${newShip.id}`);
  };
  
  return (
    <PageLayout title="Add New Ship">
      <Card>
        <div className="p-6">
          <ShipForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/ships')}
          />
        </div>
      </Card>
    </PageLayout>
  );
};

export default ShipNewPage; 