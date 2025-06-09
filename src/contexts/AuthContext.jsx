import { createContext, useContext, useEffect, useState } from 'react';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/localStorage';

// Initial user data
const initialUsers = [
  {
    id: '1',
    email: 'admin@test.in',
    password: 'admin123',
    role: 'Admin',
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'inspector@test.in',
    password: 'inspect123',
    role: 'Inspector',
    name: 'Inspector User'
  },
  {
    id: '3',
    email: 'engineer@test.in',
    password: 'engine123',
    role: 'Engineer',
    name: 'Engineer User'
  }
];

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get user from localStorage or set to null if not found
  const [currentUser, setCurrentUser] = useState(() => {
    return getFromStorage('currentUser', null);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(() => {
    return getFromStorage('users', initialUsers);
  });

  // Initialize users in localStorage if they don't exist
  useEffect(() => {
    // Clear existing user data to force using the updated email addresses
    removeFromStorage('users');
    removeFromStorage('currentUser');
    
    if (!getFromStorage('users')) {
      saveToStorage('users', initialUsers);
      setUsers(initialUsers);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    const currentUsers = getFromStorage('users', initialUsers);
    const user = currentUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Create a version of the user without the password for storage
      const { password, ...userWithoutPassword } = user;
      saveToStorage('currentUser', userWithoutPassword);
      setCurrentUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  // Logout function
  const logout = () => {
    removeFromStorage('currentUser');
    setCurrentUser(null);
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!currentUser) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    
    return currentUser.role === roles;
  };

  // Get user by id
  const getUserById = (id) => {
    return users.find(user => user.id === id);
  };

  const value = {
    currentUser,
    users,
    isLoading,
    login,
    logout,
    hasRole,
    getUserById
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
