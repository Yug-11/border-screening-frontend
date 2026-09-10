import Button from '../../../components/ui/Button';
import DataTable from '../../../components/ui/DataTable';
import EmptyState from '../../../components/ui/EmptyState';
import StatusBadge from '../../../components/ui/StatusBadge';
import QueueEntryAction from './QueueEntryAction';
import QueueEntryProgress from './QueueEntryProgress';
import ScreeningQueueRow from './ScreeningQueueRow';

export default function PassengerQueueTable({
  passengers,
  onStart,
  onOpen,
  onClear,
  sort,
  onSort,
}) {
  const columns = [
    {
      key: 'queueNumber',
      header: 'Queue',
      sortable: true,
      render: (value) => <span className="font-semibold tabular-nums text-navy">#{value}</span>,
    },
    {
      key: 'name',
      header: 'Passenger',
      render: (value) => <span className="whitespace-nowrap">{value}</span>,
    },
    { key: 'documentType', header: 'Document' },
    { key: 'nationality', header: 'Nationality' },
    {
      key: 'stage',
      header: 'Screening Stage',
      render: (value) => <span className="text-caption">{value}</span>,
    },
    {
      key: 'progress',
      header: 'Progress',
      sortable: true,
      render: (_, passenger) => <QueueEntryProgress passenger={passenger} compact />,
    },
    {
      key: 'risk',
      header: 'Risk',
      sortable: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (_, passenger) => (
        <QueueEntryAction passenger={passenger} onStart={onStart} onOpen={onOpen} />
      ),
    },
  ];
  if (!passengers.length)
    return (
      <EmptyState
        title="No passengers match the selected filters."
        description="Adjust your search or clear filters to see all queue entries."
        action={
          <Button variant="outline" onClick={onClear}>
            Clear Filters
          </Button>
        }
      />
    );
  return (
    <>
      <div className="hidden xl:block">
        <DataTable
          columns={columns}
          data={passengers}
          caption="Live Passenger Queue - fictional demo"
          sort={sort}
          onSort={onSort}
        />
      </div>
      <ul aria-label="Live Passenger Queue" className="divide-y divide-default xl:hidden">
        {passengers.map((passenger) => (
          <ScreeningQueueRow
            key={passenger.id}
            passenger={passenger}
            onStart={onStart}
            onOpen={onOpen}
          />
        ))}
      </ul>
    </>
  );
}
