import React, { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import { getFromStorage } from '../utils/localStorage';
import { isDatePast, daysBetween } from '../utils/dateUtils';
import StatusPieChart from '../components/dashboard/StatusPieChart';
import JobsTrendChart from '../components/dashboard/JobsTrendChart';
import { prepareJobStatusData, prepareShipStatusData, prepareJobsTrendData } from '../utils/chartUtils';

// Default maintenance interval in days for different component types
// If no specific type is defined, use the DEFAULT interval
const MAINTENANCE_INTERVALS = {
  DEFAULT: 90 // 90 days default maintenance interval
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalShips: 0,
    totalComponents: 0,
    overdueJobs: 0,
    jobsInProgress: 0,
    completedJobs: 0,
    overdueMaintenanceComponents: 0,
  });
  const [chartData, setChartData] = useState({
    jobStatus: [],
    shipStatus: [],
    jobsTrend: []
  });

  useEffect(() => {
    // Load data from localStorage to calculate stats
    const ships = getFromStorage('ships', []);
    const components = getFromStorage('components', []);
    const jobs = getFromStorage('jobs', []);

    // Calculate statistics
    const overdueJobs = jobs.filter(
      (job) => job.status !== 'Completed' && isDatePast(job.scheduledDate)
    ).length;

    const jobsInProgress = jobs.filter((job) => job.status === 'In Progress').length;
    const completedJobs = jobs.filter((job) => job.status === 'Completed').length;

    // Calculate overdue maintenance components
    const overdueMaintenanceComponents = components.filter(component => {
      if (!component.lastMaintenanceDate) return false;
      
      // Get the maintenance interval for this component (default to 90 days)
      const interval = MAINTENANCE_INTERVALS.DEFAULT;
      
      // Calculate days since last maintenance
      const daysSinceLastMaintenance = daysBetween(component.lastMaintenanceDate, new Date());
      
      // Return true if maintenance is overdue
      return daysSinceLastMaintenance > interval;
    }).length;

    setStats({
      totalShips: ships.length,
      totalComponents: components.length,
      overdueJobs,
      jobsInProgress,
      completedJobs,
      overdueMaintenanceComponents,
    });

    // Prepare chart data
    setChartData({
      jobStatus: prepareJobStatusData(jobs),
      shipStatus: prepareShipStatusData(ships),
      jobsTrend: prepareJobsTrendData(jobs, 14) // Last 14 days
    });
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card className="flex items-center h-full" hover>
      <div className={`flex-shrink-0 p-3 rounded-full ${color} mr-4`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-secondary-600">{title}</p>
        <p className="text-2xl font-semibold text-secondary-900">{value}</p>
      </div>
    </Card>
  );

  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Ships"
          value={stats.totalShips}
          color="bg-primary-100 text-primary-700"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Components"
          value={stats.totalComponents}
          color="bg-success-100 text-success-700"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          }
        />

        <StatCard
          title="Overdue Jobs"
          value={stats.overdueJobs}
          color="bg-danger-100 text-danger-700"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Components with Overdue Maintenance"
          value={stats.overdueMaintenanceComponents}
          color="bg-danger-100 text-danger-700"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Jobs In Progress"
          value={stats.jobsInProgress}
          color="bg-warning-100 text-warning-700"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          }
        />

        <StatCard
          title="Completed Jobs"
          value={stats.completedJobs}
          color="bg-primary-100 text-primary-700"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusPieChart 
          title="Job Status Distribution" 
          data={chartData.jobStatus} 
          colors={['#3b82f6', '#ef4444', '#f59e0b', '#22c55e']} 
        />
        
        <StatusPieChart 
          title="Ship Status Distribution" 
          data={chartData.shipStatus}
          colors={['#8b5cf6', '#ec4899', '#f97316', '#14b8a6']}
        />
      </div>

      <div className="mt-6">
        <JobsTrendChart 
          title="Jobs Trend (Last 14 Days)" 
          data={chartData.jobsTrend} 
        />
      </div>

      <div className="mt-8">
        <Card title="Recent Activity" hover>
          <div className="divide-y divide-secondary-100">
            <div className="py-3 flex items-center justify-center text-secondary-500">
              No recent activity
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DashboardPage; 