import { useId } from 'react';
import Field from './Field';
import cn from '../../utils/cn';

export default function Input({
  id,
  label,
  helperText,
  error,
  required,
  className,
  wrapperClassName,
  startIcon: Icon,
  endAdornment,
  'aria-describedby': describedBy,
  ...props
}) {
  const generatedId = useId();
  const controlId = id || generatedId;
  const description =
    cn(describedBy, helperText && controlId + '-help', error && controlId + '-error') || undefined;
  return (
    <Field
      id={controlId}
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="icon-md pointer-events-none absolute top-2.5 left-3 text-muted"
          />
        )}
        <input
          {...props}
          id={controlId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={description}
          className={cn('field-control', Icon && 'pl-10', endAdornment && 'pr-12', className)}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1">{endAdornment}</div>
        )}
      </div>
    </Field>
  );
}
