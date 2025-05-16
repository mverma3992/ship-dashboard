import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import JobCalendar from '../components/jobs/JobCalendar';

const CalendarPage = () => {
  return (
    <PageLayout title="Maintenance Calendar">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Maintenance Calendar</h2>
            <p className="text-sm text-gray-600">Toggle between Month/Week views using the button above the calendar</p>
          </div>
          <JobCalendar />
        </div>
      </Card>
    </PageLayout>
  );
};

export default CalendarPage; 