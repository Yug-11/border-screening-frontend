import { Link } from 'react-router';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import { riskVariant } from './adminHelpers';

export function DemoNotice() {
  return (
    <p className="rounded-panel border border-default bg-subtle px-4 py-2 text-caption font-medium text-muted">
      DEMO data only. This frontend uses fictional records and local session state; no backend,
      identity database, OCR, face recognition, or government integration is connected.
    </p>
  );
}

export function RiskBadge({ risk }) {
  return <Badge variant={riskVariant[risk] || 'neutral'}>{risk}</Badge>;
}

export function SeverityBadge({ severity }) {
  return <Badge variant={riskVariant[severity] || 'neutral'}>{severity}</Badge>;
}

export function DemoStatusBadge({ status, children }) {
  return <StatusBadge status={status} variant={riskVariant[status]}>{children}</StatusBadge>;
}

export function KpiGrid({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{children}</div>;
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
  const width = Math.max(3, Math.min(100, Math.round((value / Math.max(max, 1)) * 100)));
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
        <span className="text-muted">{value.toLocaleString('en-US')}</span>
      </div>
      <div className="h-2 rounded-full bg-subtle" role="img" aria-label={`${label}: ${value}`}>
        <div className={`h-2 rounded-full ${colors[variant]}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function RouteLink({ to, children }) {
  return (
    <Link className="font-semibold text-primary underline-offset-2 hover:underline" to={to}>
      {children}
    </Link>
  );
}
