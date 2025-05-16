import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ShipProvider } from './contexts/ShipContext';
import { ComponentProvider } from './contexts/ComponentContext';
import { JobProvider } from './contexts/JobContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipsPage from './pages/ShipsPage';
import ShipDetailPage from './pages/ShipDetailPage';
import ShipNewPage from './pages/ShipNewPage';
import ComponentsPage from './pages/ComponentsPage';
import JobsPage from './pages/JobsPage';
import CalendarPage from './pages/CalendarPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShipProvider>
          <ComponentProvider>
            <JobProvider>
              <NotificationProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Ships routes */}
                  <Route
                    path="/ships"
                    element={
                      <ProtectedRoute>
                        <ShipsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ships/new"
                    element={
                      <ProtectedRoute allowedRoles={['Admin', 'Inspector']}>
                        <ShipNewPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ships/:id"
                    element={
                      <ProtectedRoute>
                        <ShipDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Components routes */}
                  <Route
                    path="/components"
                    element={
                      <ProtectedRoute>
                        <ComponentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/components/new"
                    element={
                      <ProtectedRoute allowedRoles={['Admin', 'Inspector']}>
                        <ComponentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/components/:id"
                    element={
                      <ProtectedRoute>
                        <ComponentsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Jobs routes */}
                  <Route
                    path="/jobs"
                    element={
                      <ProtectedRoute>
                        <JobsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/new"
                    element={
                      <ProtectedRoute allowedRoles={['Admin', 'Inspector']}>
                        <JobsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/:id"
                    element={
                      <ProtectedRoute>
                        <JobsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Calendar route */}
                  <Route
                    path="/calendar"
                    element={
                      <ProtectedRoute>
                        <CalendarPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Admin routes */}
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <UsersPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Redirect root to dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </NotificationProvider>
            </JobProvider>
          </ComponentProvider>
        </ShipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
