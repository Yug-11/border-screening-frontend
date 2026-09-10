import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import { surveillanceVariant } from './surveillanceHelpers';

export function SurveillanceDemoNotice() {
  return (
    <p className="rounded-panel border border-default bg-subtle px-4 py-2 text-caption font-medium text-muted">
      Demo operational snapshot. All records are fictional and stored in local browser state; no
      live surveillance feed, backend, AI service, biometric processing, or government database is
      connected.
    </p>
  );
}

export function SurveillanceStatusBadge({ status, children }) {
  return (
    <StatusBadge status={status} variant={surveillanceVariant[status]}>
      {children}
    </StatusBadge>
  );
}

export function SurveillanceRiskBadge({ risk }) {
  return <Badge variant={surveillanceVariant[risk] || 'neutral'}>{risk}</Badge>;
}

export function SurveillanceSeverityBadge({ severity }) {
  return <Badge variant={surveillanceVariant[severity] || 'neutral'}>{severity}</Badge>;
}

export function KpiGrid({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">{children}</div>;
}

export function DetailGrid({ items }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-control border border-default bg-canvas p-3">
          <dt className="text-caption font-semibold text-muted">{item.label}</dt>
          <dd className="mt-1 text-body font-semibold text-navy">{item.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MiniBar({ label, value, max, variant = 'info' }) {
  const width = Math.max(3, Math.min(100, Math.round((Number(value) / Math.max(Number(max), 1)) * 100)));
  const colors = {
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    neutral: 'bg-neutral',
  };
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-caption">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-muted">{Number(value).toLocaleString('en-US')}</span>
      </div>
      <div className="h-2 rounded-full bg-subtle" role="img" aria-label={`${label}: ${value}`}>
        <div className={`h-2 rounded-full ${colors[variant]}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function ProgressIndicator({ value }) {
  return (
    <div className="min-w-32">
      <div className="mb-1 flex justify-between text-caption">
        <span className="sr-only">Screening progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-subtle" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}>
        <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
