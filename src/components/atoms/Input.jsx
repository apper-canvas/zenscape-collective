import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 text-base border-0 border-b-2 border-surface-300 bg-transparent focus:border-primary focus:outline-none transition-colors duration-400 placeholder-secondary/60';
  
  const classes = `${baseClasses} ${error ? 'border-error' : ''} ${className}`;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-secondary">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`${classes} ${icon && iconPosition === 'left' ? 'pl-8' : ''} ${icon && iconPosition === 'right' ? 'pr-8' : ''}`}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-secondary">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;