import StatusBadge from '../../../components/ui/StatusBadge';

export default function AlertCard({ alert }) {
  return (
    <article className="flex items-start gap-3">
      <StatusBadge status={alert.severity} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <h4 className="text-body font-semibold text-navy">{alert.title}</h4>
        <p className="mt-1 text-caption text-muted">
          {alert.queueNumber ? 'Queue #' + alert.queueNumber : 'Checkpoint status'}
          <span aria-hidden="true"> / </span>
          {alert.ageLabel}
        </p>
      </div>
    </article>
  );
}
