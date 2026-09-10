import Card from '../ui/Card';
import cn from '../../utils/cn';

const tones = {
  neutral: 'text-muted',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export default function MetricCard({
  label,
  value,
  unit,
  description,
  icon: Icon,
  tone = 'neutral',
}) {
  return (
    <Card padding={false} className="h-full">
      <div className="p-4">
        <dl>
          <dt className="flex min-h-9 items-start justify-between gap-2 text-caption font-semibold text-muted">
            {label}
            {Icon && (
              <Icon
                aria-hidden="true"
                className={cn('icon-sm mt-0.5', tones[tone] || tones.neutral)}
              />
            )}
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums text-navy">
            {typeof value === 'number' ? value.toLocaleString('en-US') : value}
            {unit && <span className="ml-1.5 text-body font-medium text-muted">{unit}</span>}
          </dd>
        </dl>
        {description && <p className="mt-1 text-caption text-muted">{description}</p>}
      </div>
    </Card>
  );
}
