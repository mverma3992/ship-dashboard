import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
  const { hasRole } = useAuth();

  // Only admin can access this page
  if (!hasRole(['Admin'])) {
    return (
      <PageLayout title="Access Denied">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Access Denied</h2>
            <p>You do not have permission to view this page.</p>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="System Settings">
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Notification Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    className="mr-2 h-4 w-4 text-primary-600 rounded"
                    defaultChecked
                  />
                  <label htmlFor="email-notifications">
                    Enable email notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenance-alerts"
                    className="mr-2 h-4 w-4 text-primary-600 rounded"
                    defaultChecked
                  />
                  <label htmlFor="maintenance-alerts">
                    Maintenance job alerts
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">System Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="date-format" className="block mb-1 font-medium">
                    Date Format
                  </label>
                  <select
                    id="date-format"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue="MM/DD/YYYY"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="time-zone" className="block mb-1 font-medium">
                    Time Zone
                  </label>
                  <select
                    id="time-zone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue="UTC"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Standard Time (EST)</option>
                    <option value="CST">Central Standard Time (CST)</option>
                    <option value="PST">Pacific Standard Time (PST)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="button"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Settings
            </button>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default SettingsPage; 