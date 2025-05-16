import React from 'react';

const Card = ({
  children,
  title,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  variant = 'default',
  hover = false,
  ...props
}) => {
  const cardVariants = {
    default: 'bg-white border border-secondary-100',
    primary: 'bg-white border border-primary-200',
    success: 'bg-white border border-success-200',
    warning: 'bg-white border border-warning-200',
    danger: 'bg-white border border-danger-200',
  };

  const selectedVariant = cardVariants[variant] || cardVariants.default;
  const hoverEffect = hover ? 'transition-all duration-300 hover:shadow-elegant transform hover:-translate-y-1' : 'transition-all duration-200';

  return (
    <div
      className={`rounded-xl shadow-soft overflow-hidden ${selectedVariant} ${hoverEffect} ${className}`}
      {...props}
    >
      {title && (
        <div className={`px-5 py-4 border-b border-secondary-100 ${headerClassName}`}>
          {typeof title === 'string' ? (
            <h3 className="font-semibold text-secondary-900 text-lg">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className={`px-5 py-4 bg-secondary-50 border-t border-secondary-100 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 