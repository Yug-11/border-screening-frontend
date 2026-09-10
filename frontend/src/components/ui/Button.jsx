import cn from '../../utils/cn';
import LoadingSpinner from './LoadingSpinner';

const variants = {
  primary:
    'border-primary bg-primary text-surface enabled:hover:border-primary-hover enabled:hover:bg-primary-hover',
  secondary: 'border-default bg-subtle text-navy enabled:hover:bg-default',
  outline: 'border-control bg-surface text-primary enabled:hover:bg-primary-soft',
  ghost: 'border-transparent bg-transparent text-primary enabled:hover:bg-primary-soft',
  danger:
    'border-danger bg-danger text-surface enabled:hover:border-danger-hover enabled:hover:bg-danger-hover',
  success:
    'border-success bg-success text-surface enabled:hover:border-success-hover enabled:hover:bg-success-hover',
};
const sizes = {
  small: 'min-h-8 px-3 py-1 text-caption',
  medium: 'min-h-10 px-4 py-2 text-body',
  large: 'min-h-12 px-5 py-3 text-body',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-control border font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant] || variants.primary,
        sizes[size] || sizes.medium,
        className,
      )}
    >
      {loading && <LoadingSpinner size="small" label="Working" decorative />}
      {children}
    </button>
  );
}
