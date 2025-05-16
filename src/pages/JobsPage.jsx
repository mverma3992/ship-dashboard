import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import JobList from '../components/jobs/JobList';
import JobForm from '../components/jobs/JobForm';
import JobDetail from '../components/jobs/JobDetail';

const JobsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const isNewPage = location.pathname === '/jobs/new';
  
  // If we have an ID, show the job detail page
  if (id) {
    return (
      <PageLayout title="Job Details">
        <JobDetail />
      </PageLayout>
    );
  }

  // If we're on the new job page, show the form
  if (isNewPage) {
    return (
      <PageLayout title="Create New Job">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create Maintenance Job</h2>
            <JobForm />
          </div>
        </Card>
      </PageLayout>
    );
  }

  // Otherwise show the job list
  return (
    <PageLayout title="Maintenance Jobs">
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Maintenance Jobs Management</h2>
          <JobList />
        </div>
      </Card>
    </PageLayout>
  );
};

export default JobsPage; 