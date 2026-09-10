import cn from '../../utils/cn';

export default function Field({ id, label, required, helperText, error, children, className }) {
  return (
    <div className={cn('min-w-0 space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-body font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {helperText && (
        <p id={id + '-help'} className="text-caption text-muted">
          {helperText}
        </p>
      )}
      {error && (
        <p id={id + '-error'} className="text-caption font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
