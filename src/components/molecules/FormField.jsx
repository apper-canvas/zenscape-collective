import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

function FormField({ 
  label, 
  error, 
  helpText,
  required = false,
  children,
  className = '',
  ...props 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block">
          <Text variant="body" size="sm" weight="medium" color="primary">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </Text>
        </label>
      )}
      
      {children || <Input error={error} {...props} />}
      
      {helpText && !error && (
        <Text variant="caption" size="sm" color="muted">
          {helpText}
        </Text>
      )}
      
      {error && (
        <Text variant="caption" size="sm" color="error">
          {error}
        </Text>
      )}
    </div>
  );
}

export default FormField;