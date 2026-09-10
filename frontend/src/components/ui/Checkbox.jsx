import { useEffect, useId, useRef } from 'react';
import cn from '../../utils/cn';

export default function Checkbox({
  id,
  label,
  helperText,
  error,
  indeterminate = false,
  className,
  disabled,
  'aria-describedby': describedBy,
  ...props
}) {
  const generatedId = useId();
  const controlId = id || generatedId;
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-start gap-2.5">
        <input
          {...props}
          ref={inputRef}
          id={controlId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            cn(describedBy, helperText && controlId + '-help', error && controlId + '-error') ||
            undefined
          }
          className="mt-1 size-4 shrink-0 accent-primary disabled:opacity-50"
        />
        {label && (
          <label htmlFor={controlId} className={cn('text-body', disabled && 'text-muted')}>
            {label}
          </label>
        )}
      </div>
      {helperText && (
        <p id={controlId + '-help'} className="pl-6.5 text-caption text-muted">
          {helperText}
        </p>
      )}
      {error && (
        <p id={controlId + '-error'} className="pl-6.5 text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
