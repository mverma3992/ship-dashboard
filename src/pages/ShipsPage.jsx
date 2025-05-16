import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import ShipList from '../components/ships/ShipList';

const ShipsPage = () => {
  return (
    <PageLayout title="Ships">
      <ShipList />
    </PageLayout>
  );
};

export default ShipsPage; 