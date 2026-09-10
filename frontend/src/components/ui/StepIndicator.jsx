import { Check, Circle, TriangleAlert, X } from 'lucide-react';
import cn from '../../utils/cn';

const states = {
  completed: {
    icon: Check,
    color: 'border-success bg-success-soft text-success',
    label: 'Completed',
  },
  active: { icon: Circle, color: 'border-primary bg-primary text-surface', label: 'In progress' },
  pending: { icon: Circle, color: 'border-control bg-surface text-muted', label: 'Pending' },
  failed: { icon: X, color: 'border-danger bg-danger-soft text-danger', label: 'Failed' },
  warning: {
    icon: TriangleAlert,
    color: 'border-warning bg-warning-soft text-warning',
    label: 'Needs review',
  },
};

export default function StepIndicator({
  steps = [],
  label = 'Workflow steps',
  orientation = 'responsive',
}) {
  const responsive = orientation !== 'vertical';
  return (
    <ol
      aria-label={label}
      className={cn('flex flex-col', responsive ? 'gap-4 sm:flex-row' : 'gap-2')}
    >
      {steps.map((step, index) => {
        const state = states[step.status] || states.pending;
        const Icon = state.icon;
        return (
          <li
            key={step.id || index}
            aria-current={step.status === 'active' ? 'step' : undefined}
            className={cn(
              'relative flex min-w-0 flex-1 items-start gap-3',
              responsive && 'sm:flex-col',
            )}
          >
            <div className={cn('flex w-full max-w-8 items-center', responsive && 'sm:max-w-none')}>
              <span
                className={cn(
                  'inline-flex size-8 shrink-0 items-center justify-center rounded-full border',
                  state.color,
                )}
              >
                <Icon aria-hidden="true" className="icon-sm" />
              </span>
              {responsive && index < steps.length - 1 && (
                <span aria-hidden="true" className="ml-3 hidden h-px flex-1 bg-default sm:block" />
              )}
            </div>
            <div>
              <p className="text-body font-semibold text-ink">{step.label}</p>
              <p className="text-caption text-muted">{state.label}</p>
              {step.description && (
                <p className="mt-1 text-caption text-muted">{step.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
