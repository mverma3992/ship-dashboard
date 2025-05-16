import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import Button from '../ui/Button';

const NotificationList = ({ onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useNotifications();

  const hasUnread = notifications.some(notification => !notification.read);

  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto text-secondary-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <p className="text-secondary-500 font-medium">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-200px)] flex flex-col">
      <div className="p-3 border-b border-secondary-100 flex justify-between items-center bg-secondary-50 sticky top-0 z-10">
        <h3 className="font-medium text-secondary-700">Notifications</h3>
        <div className="flex space-x-2">
          {hasUnread && (
            <Button 
              size="xs" 
              variant="link" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
          <Button 
            size="xs" 
            variant="link" 
            onClick={clearAll}
          >
            Clear all
          </Button>
        </div>
      </div>
      <div className="divide-y divide-secondary-100 overflow-y-auto">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationList; 