import ActivityFeed from '../../../components/data-display/ActivityFeed';
import Card from '../../../components/ui/Card';

export default function PassengerAuditTrail({ events, date }) {
  return (
    <Card aria-labelledby="passenger-audit-title">
      <h2 id="passenger-audit-title" className="text-section font-semibold text-navy">
        Screening Audit Trail
      </h2>
      <p className="mt-2 text-caption text-muted">
        {date} &middot; Chronological fictional lifecycle of the latest screening. This is not a
        persisted audit log.
      </p>
      <ActivityFeed items={events} label="Latest screening audit events" />
    </Card>
  );
}
