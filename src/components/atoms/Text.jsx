function Text({ 
  children, 
  variant = 'body', 
  size = 'base',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  className = '',
  as: Component = 'p',
  ...props 
}) {
  const variants = {
    display: 'font-serif',
    heading: 'font-serif',
    body: 'font-sans',
    caption: 'font-sans'
  };

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  };

  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
    white: 'text-white',
    muted: 'text-secondary/60'
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const classes = `${variants[variant]} ${sizes[size]} ${colors[color]} ${weights[weight]} ${alignments[align]} ${className}`;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

export default Text;