import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 text-white',
  success: 'bg-success-600 hover:bg-success-700 focus:ring-success-500 text-white',
  danger: 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 text-white',
  warning: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500 text-white',
  outline: 'bg-transparent border border-secondary-300 hover:bg-secondary-50 text-secondary-700 focus:ring-primary-500',
  ghost: 'bg-transparent hover:bg-secondary-50 text-secondary-700 focus:ring-primary-500',
  link: 'bg-transparent p-0 hover:underline text-primary-600 hover:text-primary-700 shadow-none focus:ring-0',
};

const sizes = {
  xs: 'py-1 px-2 text-xs',
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-sm',
  lg: 'py-2.5 px-5 text-base',
  xl: 'py-3 px-6 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  iconLeft,
  iconRight,
  fullWidth = false,
  onClick,
  to,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Remove shadow and ring styles for link and ghost variants
  const finalBaseClasses = variant === 'link' || variant === 'ghost' 
    ? baseClasses.replace('shadow-sm focus:ring-2 focus:ring-offset-2', '') 
    : baseClasses;
  
  const buttonClasses = `${finalBaseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${widthClass} ${className}`;
  
  // If 'to' prop is provided, render as Link component from react-router
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        {...props}
      >
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </Link>
    );
  }
  
  // Otherwise render as a regular button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default Button; 