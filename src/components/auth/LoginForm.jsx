import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const result = login(email, password);
      if (result.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || 'Failed to log in');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Ship Maintenance Dashboard
      </h2>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@entnt.in"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="mb-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <p className="mt-1">admin@entnt.in / admin123</p>
          <p className="mt-1">inspector@entnt.in / inspect123</p>
          <p className="mt-1">engineer@entnt.in / engine123</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 
