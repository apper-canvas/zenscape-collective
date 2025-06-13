import { motion } from 'framer-motion';

function Card({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  ...props 
}) {
  const baseClasses = 'bg-surface-100 rounded-lg shadow-zen overflow-hidden transition-all duration-400';
  const hoverClasses = hover ? 'hover:shadow-zen-lg hover:-translate-y-1 cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 25 }
  } : {};

  return (
    <CardComponent
      className={classes}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
}

export default Card;