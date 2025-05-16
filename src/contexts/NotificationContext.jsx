import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFromStorage, saveToStorage } from '../utils/localStorage';

// Initial notification data
export const initialNotifications = [
  {
    id: '1',
    type: 'Job Created',
    message: 'New Inspection job scheduled for BrahMos Missile System on INS Vikrant',
    date: '2024-05-01T08:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'Job Updated',
    message: 'Repair job for Main Propulsion System on INS Kolkata has been updated to In Progress',
    date: '2024-04-28T14:15:00Z',
    read: true
  },
  {
    id: '3',
    type: 'Job Completed',
    message: 'Inspection job for Diesel Engine MTU 12V1163 on INS Tarkash has been completed',
    date: '2024-04-25T16:45:00Z',
    read: false
  },
  {
    id: '4',
    type: 'Job Created',
    message: 'New Overhaul job scheduled for AK-630 Gun System on INS Kamorta',
    date: '2024-04-22T09:10:00Z',
    read: false
  },
  {
    id: '5',
    type: 'Job Updated',
    message: 'Upgrade job for HUMSA-NG Sonar System on INS Chennai priority changed to High',
    date: '2024-04-18T11:30:00Z',
    read: true
  }
];

// Create context
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Get notifications from localStorage or use initial data
  const [notifications, setNotifications] = useState(() => {
    return getFromStorage('notifications', initialNotifications);
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize notifications in localStorage if they don't exist
  useEffect(() => {
    if (!getFromStorage('notifications')) {
      saveToStorage('notifications', initialNotifications);
    }
    
    // Calculate unread count
    updateUnreadCount();
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    saveToStorage('notifications', notifications);
    updateUnreadCount();
  }, [notifications]);

  // Update unread count
  const updateUnreadCount = () => {
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };

  // Add a new notification
  const addNotification = ({ type, message }) => {
    const newNotification = {
      id: uuidv4(),
      type,
      message,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications([newNotification, ...notifications]);
    return newNotification;
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Delete all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Notification handlers for specific events
  const notifyJobCreated = (job, component, ship) => {
    return addNotification({
      type: 'Job Created',
      message: `New ${job.type} job scheduled for ${component.name} on ${ship.name}`
    });
  };

  const notifyJobUpdated = (job, component, ship) => {
    return addNotification({
      type: 'Job Updated',
      message: `${job.type} job for ${component.name} on ${ship.name} has been updated`
    });
  };

  const notifyJobCompleted = (job, component, ship) => {
    return addNotification({
      type: 'Job Completed',
      message: `${job.type} job for ${component.name} on ${ship.name} has been completed`
    });
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    notifyJobCreated,
    notifyJobUpdated,
    notifyJobCompleted
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};