import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import Field from './Field';
import cn from '../../utils/cn';

export default function Select({
  id,
  label,
  helperText,
  error,
  required,
  options = [],
  children,
  placeholder,
  className,
  wrapperClassName,
  'aria-describedby': describedBy,
  ...props
}) {
  const generatedId = useId();
  const controlId = id || generatedId;
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
        <select
          {...props}
          id={controlId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            cn(describedBy, helperText && controlId + '-help', error && controlId + '-error') ||
            undefined
          }
          className={cn('field-control appearance-none pr-10', className)}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="icon-sm pointer-events-none absolute top-3 right-3 text-muted"
        />
      </div>
    </Field>
  );
}
