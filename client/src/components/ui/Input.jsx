import React from 'react';

const Input = ({ 
  label, 
  error, 
  helperText,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-2 border rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    ${error ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300'}
    ${className}
  `;
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {(error || helperText) && (
        <p className={`text-sm ${error ? 'text-error-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 