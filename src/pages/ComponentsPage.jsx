import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import ComponentList from '../components/components/ComponentList';
import ComponentForm from '../components/components/ComponentForm';
import ComponentDetail from '../components/components/ComponentDetail';

const ComponentsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const isNewPage = location.pathname === '/components/new';
  
  // If we have an ID, show the component detail page
  if (id) {
    return (
      <PageLayout title="Component Details">
        <ComponentDetail />
      </PageLayout>
    );
  }

  // If we're on the new component page, show the form
  if (isNewPage) {
    return (
      <PageLayout title="Add New Component">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create Component</h2>
            <ComponentForm />
          </div>
        </Card>
      </PageLayout>
    );
  }

  // Otherwise show the component list
  return (
    <PageLayout title="Components">
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Component Management</h2>
          <ComponentList />
        </div>
      </Card>
    </PageLayout>
  );
};

export default ComponentsPage; 