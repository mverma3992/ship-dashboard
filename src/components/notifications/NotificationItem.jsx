import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Badge from '../ui/Badge';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const { id, type, message, date, read } = notification;
  
  // Get appropriate badge color based on notification type
  const getBadgeVariant = (type) => {
    const typeMap = {
      'Job Created': 'success',
      'Job Updated': 'primary', 
      'Job Completed': 'success',
      'System': 'secondary',
      'Error': 'danger',
      'Warning': 'warning'
    };
    return typeMap[type] || 'primary';
  };
  
  // Format the notification date as relative time
  const getRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <div 
      className={`px-4 py-3 border-b border-secondary-100 transition-colors duration-150 ${
        read ? 'bg-white' : 'bg-primary-50'
      } hover:bg-secondary-50`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={getBadgeVariant(type)} size="xs">
              {type}
            </Badge>
            <span className="text-xs text-secondary-500">
              {getRelativeTime(date)}
            </span>
          </div>
          <p className="text-sm text-secondary-700">{message}</p>
        </div>
        <div className="flex space-x-1 ml-4">
          {!read && (
            <button
              onClick={() => onMarkAsRead(id)}
              className="text-primary-600 hover:text-primary-800 p-1 rounded-full hover:bg-primary-50 transition-colors"
              aria-label="Mark as read"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(id)}
            className="text-secondary-400 hover:text-danger-600 p-1 rounded-full hover:bg-secondary-50 transition-colors"
            aria-label="Delete notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem; 