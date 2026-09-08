import { useId } from 'react';
import cn from '../../utils/cn';

const states = {
  completed: { color: 'bg-success', label: 'Completed' },
  active: { color: 'bg-primary', label: 'In progress' },
  pending: { color: 'bg-neutral', label: 'Pending' },
  failed: { color: 'bg-danger', label: 'Failed' },
  warning: { color: 'bg-warning', label: 'Needs review' },
};

export default function ProgressBar({
  value = 0,
  max = 100,
  status = 'active',
  label = 'Progress',
  showValue = true,
  compact = false,
  className,
}) {
  const id = useId();
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const amount = Math.min(limit, Math.max(0, Number.isFinite(value) ? value : 0));
  const percent = Math.round((amount / limit) * 100);
  const state = states[status] || states.active;
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-3 text-body">
        <span id={id} className={compact ? 'sr-only' : 'font-medium'}>
          {label}
        </span>
        <span className="text-caption text-muted">
          {!compact && state.label}
          {showValue && (compact ? percent + '%' : ' \u00b7 ' + percent + '%')}
        </span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={amount}
        aria-valuetext={percent + '% \u2014 ' + state.label}
        className="h-2 overflow-hidden rounded-full bg-subtle"
      >
        <div className={cn('h-full rounded-full', state.color)} style={{ width: percent + '%' }} />
      </div>
    </div>
  );
}
