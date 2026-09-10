import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function ScreeningSystemStatus({ systems }) {
  return (
    <Card aria-labelledby="screening-system-title">
      <h2 id="screening-system-title" className="text-section font-semibold text-navy">
        System Status
      </h2>
      <p className="mt-2 text-caption text-muted">
        Illustrative service states only. No health checks are connected.
      </p>
      <dl className="mt-3 divide-y divide-default text-body">
        {systems.map((system) => (
          <div key={system.id} className="flex flex-wrap justify-between gap-2 py-3">
            <dt>{system.label}</dt>
            <dd>
              <StatusBadge status={system.status} variant={system.variant}>
                {system.status}
              </StatusBadge>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
