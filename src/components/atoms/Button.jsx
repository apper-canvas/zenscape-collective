import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed zen-ripple';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-zen hover:shadow-zen-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-zen hover:shadow-zen-lg',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 shadow-zen hover:shadow-zen-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/50',
    surface: 'bg-surface-200 text-primary hover:bg-surface-300 focus:ring-primary/50'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`${iconSizes[size]} animate-spin ${children ? 'mr-2' : ''}`} 
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} 
        />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} 
        />
      )}
    </motion.button>
  );
}

export default Button;