import { CircleCheck, CircleAlert, Info, TriangleAlert, X } from 'lucide-react';
import Button from '../ui/Button';
import cn from '../../utils/cn';

const variants = {
  info: { icon: Info, color: 'border-info bg-info-soft text-info' },
  success: { icon: CircleCheck, color: 'border-success bg-success-soft text-success' },
  warning: { icon: TriangleAlert, color: 'border-warning bg-warning-soft text-warning' },
  danger: { icon: CircleAlert, color: 'border-danger bg-danger-soft text-danger' },
};

export default function AlertBanner({
  variant = 'info',
  title,
  children,
  onDismiss,
  action,
  announce = false,
  className,
}) {
  const state = variants[variant] || variants.info;
  const Icon = state.icon;
  return (
    <div
      role={announce ? (variant === 'danger' ? 'alert' : 'status') : undefined}
      className={cn(
        'flex items-start gap-3 rounded-control border-l-4 p-4',
        state.color,
        className,
      )}
    >
      <Icon aria-hidden="true" className="icon-md mt-0.5" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-body font-semibold">{title}</p>}
        {children && <div className="mt-0.5 text-body text-ink">{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="small"
          className="px-1"
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          <X aria-hidden="true" className="icon-sm" />
        </Button>
      )}
    </div>
  );
}
