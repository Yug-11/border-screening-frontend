import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import EmptyState from '../../../components/ui/EmptyState';
import StatusBadge from '../../../components/ui/StatusBadge';

const columns = [
  {
    key: 'queueNumber',
    header: 'Queue',
    render: (value, row) => (
      <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-navy">
        {row.requiresAttention && (
          <TriangleAlert aria-label="Attention required" className="icon-sm text-warning" />
        )}
        #{value}
      </span>
    ),
  },
  {
    key: 'name',
    header: 'Passenger',
    render: (value) => <span className="whitespace-nowrap">{value}</span>,
  },
  { key: 'documentType', header: 'Document' },
  {
    key: 'nationality',
    header: 'Nationality',
    render: (value) => <span className="whitespace-nowrap text-muted">{value}</span>,
  },
  {
    key: 'stage',
    header: 'Screening',
    render: (value) => <span className="text-caption">{value}</span>,
  },
  { key: 'risk', header: 'Risk', render: (value) => <StatusBadge status={value} /> },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
  },
];

export default function ScreeningQueue({ passengers = [] }) {
  const [attentionOnly, setAttentionOnly] = useState(false);
  const attentionCount = passengers.filter((passenger) => passenger.requiresAttention).length;
  const visible = attentionOnly
    ? passengers.filter((passenger) => passenger.requiresAttention)
    : passengers;
  return (
    <Card
      title="Live Passenger Queue"
      description="Recent queue entries at this checkpoint."
      padding={false}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="inline-flex items-center gap-2 text-caption text-muted">
          <TriangleAlert aria-hidden="true" className="icon-sm text-warning" />
          {attentionCount} entries need officer attention
        </p>
        <div role="group" aria-label="Queue display filters" className="flex flex-wrap gap-1">
          <Button
            size="small"
            variant={attentionOnly ? 'ghost' : 'secondary'}
            aria-pressed={!attentionOnly}
            onClick={() => setAttentionOnly(false)}
          >
            All entries
          </Button>
          <Button
            size="small"
            variant={attentionOnly ? 'secondary' : 'ghost'}
            aria-pressed={attentionOnly}
            onClick={() => setAttentionOnly(true)}
          >
            Needs attention ({attentionCount})
          </Button>
        </div>
      </div>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={visible}
          caption="Live passenger queue, fictional snapshot"
          emptyTitle="No entries need attention"
          emptyDescription="There are no entries in this view."
        />
      </div>
      <div className="md:hidden">
        {visible.length ? (
          <ul
            aria-label="Live passenger queue"
            className="divide-y divide-default border-t border-default"
          >
            {visible.map((passenger) => (
              <li key={passenger.id} className="space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-caption font-semibold tabular-nums text-muted">
                      Queue #{passenger.queueNumber}
                    </p>
                    <p className="text-body font-semibold text-navy">{passenger.name}</p>
                  </div>
                  <StatusBadge status={passenger.risk} />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-caption">
                  <div>
                    <dt className="text-muted">Document</dt>
                    <dd className="mt-0.5 text-ink">{passenger.documentType}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Nationality</dt>
                    <dd className="mt-0.5 text-ink">{passenger.nationality}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted">Screening</dt>
                    <dd className="mt-0.5 text-ink">{passenger.stage}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <StatusBadge status={passenger.status}>{passenger.status}</StatusBadge>
                  {passenger.requiresAttention && (
                    <span className="text-caption font-semibold text-warning">
                      Officer attention
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No entries need attention"
            description="There are no entries in this view."
          />
        )}
      </div>
      <div className="space-y-1 border-t border-default px-4 py-3 text-caption text-muted">
        <p role="status">
          Showing {visible.length} of {passengers.length} recent entries.
        </p>
        <p>
          Static demo snapshot, not the full checkpoint workload. Risk labels are illustrative, not
          final decisions.
        </p>
      </div>
    </Card>
  );
}
