import React from 'react';

const variants = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800',
  success: 'bg-success-100 text-success-800',
  danger: 'bg-danger-100 text-danger-800',
  warning: 'bg-warning-100 text-warning-800',
  info: 'bg-blue-100 text-blue-800',
  gray: 'bg-secondary-100 text-secondary-600',
};

const sizes = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

const Badge = ({
  children,
  variant = 'primary',
  size = 'sm',
  pill = true,
  dot = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.sm;
  const shapeClasses = pill ? 'rounded-full' : 'rounded';
  
  return (
    <span
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${shapeClasses} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`mr-1.5 h-2 w-2 rounded-full ${variantClasses.replace('bg-', 'bg-').replace('text-', 'bg-')}`}></span>
      )}
      {children}
    </span>
  );
};

export default Badge; 