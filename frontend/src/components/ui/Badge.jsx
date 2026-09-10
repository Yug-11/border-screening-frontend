import cn from '../../utils/cn';

const tones = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-neutral-soft text-neutral',
};

export default function Badge({ children, variant = 'neutral', dot = false, className, ...props }) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-control px-2 py-0.5 text-caption font-semibold whitespace-nowrap',
        tones[variant] || tones.neutral,
        className,
      )}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
