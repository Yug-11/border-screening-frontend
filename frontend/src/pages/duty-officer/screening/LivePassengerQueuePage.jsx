import { useNavigate } from 'react-router';
import { Plus, Workflow } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';
import { mockQueueContext } from '../../../data/mockPassengerQueue';
import PassengerQueueDrawer from '../../../features/screening/components/PassengerQueueDrawer';
import PassengerQueueTable from '../../../features/screening/components/PassengerQueueTable';
import QueueFilters from '../../../features/screening/components/QueueFilters';
import QueueSummary from '../../../features/screening/components/QueueSummary';
import usePassengerQueue from '../../../features/screening/hooks/usePassengerQueue';

export default function LivePassengerQueuePage() {
  const navigate = useNavigate();
  const queue = usePassengerQueue();
  return (
    <>
      <PageHeader
        title="Live Passenger Screening"
        eyebrow={mockQueueContext.checkpoint}
        description="Monitor active passenger screening and review exceptions requiring officer attention."
        actions={
          <Button onClick={() => navigate('/duty-officer/documents')}>
            <Plus aria-hidden="true" className="icon-sm" />
            Start New Screening
          </Button>
        }
      />
      <QueueSummary summary={queue.summary} />
      <div className="flex flex-wrap items-center gap-3 text-caption text-muted">
        <Workflow aria-hidden="true" className="icon-md text-primary" />
        <p>
          <span className="font-semibold text-ink">Automated Screening.</span> Captured document
          &rarr; automated checks &rarr; risk assessment. Low risk is automatically cleared;
          medium/high risk requires officer review.
        </p>
      </div>
      <section aria-labelledby="live-queue-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 id="live-queue-heading" className="text-section font-semibold text-navy">
            Live Passenger Queue
          </h2>
          <Badge>Fictional demo</Badge>
        </div>
        <Card padding={false}>
          <QueueFilters
            filters={queue.filters}
            onChange={queue.updateFilter}
            onClear={queue.clearFilters}
          />
          <div className="space-y-1 border-b border-default px-4 py-3 text-caption text-muted">
            <p role="status">
              Showing {queue.visiblePassengers.length} of {queue.total} entries.{' '}
              {queue.summary.review} require attention across the queue.
            </p>
            <p>
              Demo snapshot &middot; Start Screening updates local state only. Progress does not
              advance automatically.
            </p>
          </div>
          <PassengerQueueTable
            passengers={queue.visiblePassengers}
            onStart={queue.startScreening}
            onOpen={queue.openPassenger}
            onClear={queue.clearFilters}
            sort={queue.sort}
            onSort={queue.changeSort}
          />
        </Card>
      </section>
      <p role="status" className="text-body text-info">
        {queue.announcement}
      </p>
      <PassengerQueueDrawer
        passenger={queue.selectedPassenger}
        mode={queue.drawerMode}
        onClose={queue.closePassenger}
      />
    </>
  );
}
