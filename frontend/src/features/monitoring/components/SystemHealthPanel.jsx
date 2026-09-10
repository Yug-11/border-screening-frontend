import Card from '../../../components/ui/Card';
import SystemStatus from '../../../components/layout/SystemStatus';

export default function SystemHealthPanel({ checkpoint }) {
  return (
    <Card title="Checkpoint Status" description={checkpoint.name}>
      <dl className="space-y-3 text-body">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-muted">System</dt>
          <dd>
            <SystemStatus status={checkpoint.status} />
          </dd>
        </div>
        {checkpoint.services.map((service) => (
          <div key={service.id} className="flex flex-wrap items-center justify-between gap-2">
            <dt className="text-muted">{service.label}</dt>
            <dd>
              <SystemStatus status={service.status} />
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-2 border-t border-default pt-3">
          <dt className="text-muted">Queue</dt>
          <dd className="font-semibold tabular-nums text-navy">
            {checkpoint.queueDepth} passengers
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-caption text-muted">
        Illustrative status only. No device or connection checks are running.
      </p>
    </Card>
  );
}
