import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { getFromStorage, saveToStorage } from '../utils/localStorage';

const UsersPage = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = getFromStorage('users', []);
    // Remove sensitive information like passwords
    const sanitizedUsers = storedUsers.map(({ password, ...rest }) => rest);
    setUsers(sanitizedUsers);
    setLoading(false);
  }, []);

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
    <PageLayout title="User Management">
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">ID</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Name</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Email</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="py-3 px-4">{user.id}</td>
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'Inspector' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  );
};

export default UsersPage; 