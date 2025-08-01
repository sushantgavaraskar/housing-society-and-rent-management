import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  headerAction,
  footer,
  ...props 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-soft border border-gray-100 ${className}`} {...props}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 